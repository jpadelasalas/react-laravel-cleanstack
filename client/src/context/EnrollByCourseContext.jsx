import { useCallback, useEffect, useMemo, useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utilities/axiosInstance";
import Swal from "sweetalert2";

const EnrollByCourseContext = createContext();

export const EnrollByCourseContextProvider = ({ children }) => {
  const [isOpenModalData, setIsOpenModalData] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const queryClient = useQueryClient(); // React Query cache manager
  const [courseInfo, setCourseInfo] = useState({ code: "", name: "" });

  const {
    search,
    paginatedData,
    currentPage,
    dataPerPage,
    totalData,
    handlePageChange,
    handleRowsPerPageChange,
    setData: setPaginatedData,
    handleSearch,
  } = usePaginationWithSearch();

  const { data: courses, isFetching: courseFetching } = useQuery({
    queryKey: ["course-with-student"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/v1/course-with-student");
      return data.data;
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error Fetching Course",
        text: err?.message || "Something went wrong.",
      });
    },
    refetchOnMount: false, // prevent fetch if cached
  });

  const { data: getStudents } = useQuery({
    queryKey: ["course-with-student", selectedCourseId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/v1/course-with-student/${selectedCourseId}`
      );
      return data.data;
    },
    enabled: !!isOpenModalData && !!selectedCourseId, // Proceed if and only if these conditions are true
  });

  const { mutate: unenroll } = useMutation({
    mutationFn: async (studentId) => {
      const { data } = await axiosInstance.delete(
        `/api/v1/course-with-student/${selectedCourseId}/${studentId}`
      );
      return data;
    },
    onMutate: () => {
      Swal.fire({
        title: "Unenrolling...",
        text: "Please wait a moment",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
    },
    onSuccess: (res) => {
      Swal.fire({
        icon: "success",
        title: res.message || "Student Unenrolled Successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["course-with-student", selectedCourseId]);
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message || "Failed to unenroll the student",
        text: error.response?.data?.message || error.message,
      });
    },
  });

  const { mutate: enroll } = useMutation({
    mutationFn: async (student) => {
      const { data } = await axiosInstance.post(`/api/v1/course-with-student`, {
        selectedCourseId,
        student,
      });
      return data;
    },
    onMutate: () => {
      Swal.fire({
        title: "Enrolling...",
        text: "Please wait a moment",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
    },
    onSuccess: (res) => {
      Swal.fire({
        icon: "success",
        title: res.message || "Student Enrolled Successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      setSelectedStudent([]);
      queryClient.invalidateQueries(["course-with-student", selectedCourseId]);
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: err.message || "Failed to enroll the student.",
        text: err.response?.data?.message || err.message,
      });
    },
  });

  const onView = useCallback((course) => {
    setSelectedCourseId(course.id);
    setIsOpenModalData(true);
    setCourseInfo({ code: course.code, name: course.name });
    setSelectedStudent([]);
  }, []);

  const onDelete = useCallback(
    (courseId) => {
      unenroll(courseId);
    },
    [unenroll]
  );

  const handleCheckboxChange = useCallback((studentId) => {
    setSelectedStudent((prev) => {
      return prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId];
    });
  }, []);

  const handleEnrollStudent = useCallback(() => {
    enroll(selectedStudent);
  }, [enroll, selectedStudent]);

  const handleCloseModal = useCallback(() => {
    setSelectedCourseId(null);
    setIsOpenModalData(false);
  }, []);

  useEffect(() => {
    // Get the courses
    if (courses) setPaginatedData(courses);

    // Get data with course
  }, [courses, setPaginatedData]);

  const parentData = useMemo(
    () => ({
      search,
      paginatedData,
      currentPage,
      dataPerPage,
      totalData,
      handlePageChange,
      handleRowsPerPageChange,
      handleSearch,
      courseFetching,
    }),
    [
      search,
      paginatedData,
      currentPage,
      dataPerPage,
      totalData,
      handlePageChange,
      handleRowsPerPageChange,
      handleSearch,
      courseFetching,
    ]
  );

  const modal = useMemo(
    () => ({
      isOpenModalData,
      onView,
      handleCloseModal,
      courseInfo,
    }),
    [isOpenModalData, onView, handleCloseModal, courseInfo]
  );

  const form = useMemo(
    () => ({
      getStudents,
      onDelete,
      handleCheckboxChange,
      selectedStudent,
      handleEnrollStudent,
    }),
    [
      getStudents,
      onDelete,
      handleCheckboxChange,
      selectedStudent,
      handleEnrollStudent,
    ]
  );
  const value = useMemo(
    () => ({
      modal,
      parentData,
      form,
    }),
    [modal, parentData, form]
  );
  return (
    <EnrollByCourseContext.Provider value={value}>
      {children}
    </EnrollByCourseContext.Provider>
  );
};

export const useEnrollByCourseModal = () =>
  useContextSelector(EnrollByCourseContext, (ctx) => ctx.modal);
export const useEnrollByCourseData = () =>
  useContextSelector(EnrollByCourseContext, (ctx) => ctx.parentData);
export const useEnrollByCourseForm = () =>
  useContextSelector(EnrollByCourseContext, (ctx) => ctx.form);
