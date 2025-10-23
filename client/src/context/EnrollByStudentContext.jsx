import { useCallback, useEffect, useMemo, useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utilities/axiosInstance";
import Swal from "sweetalert2";

const EnrollByStudentContext = createContext();

export const EnrollByStudentContextProvider = ({ children }) => {
  const [isOpenModalData, setIsOpenModalData] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const queryClient = useQueryClient(); // React Query cache manager

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

  const { data: students, isFetching: studentFetching } = useQuery({
    queryKey: ["students-with-course"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/v1/student-with-course");
      return data.data;
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error Fetching Students",
        text: err?.message || "Something went wrong.",
      });
    },
    refetchOnMount: false, // prevent fetch if cached
  });

  const { data: getCourse } = useQuery({
    queryKey: ["student-with-course", selectedStudentId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/v1/student-with-course/${selectedStudentId}`
      );

      return data.data;
    },
    enabled: !!isOpenModalData && !!selectedStudentId, // Proceed if and only if these conditions are true
  });

  const { mutate: unenroll } = useMutation({
    mutationFn: async (courseId) => {
      const { data } = await axiosInstance.delete(
        `/api/v1/student-with-course/${selectedStudentId}/${courseId}`
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
      queryClient.invalidateQueries(["student-with-course", selectedStudentId]);
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
    mutationFn: async (course) => {
      const { data } = await axiosInstance.post(`/api/v1/student-with-course`, {
        selectedStudentId,
        course,
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
      setSelectedCourse([]);
      queryClient.invalidateQueries(["student-with-course", selectedStudentId]);
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: err.message || "Failed to enroll the student.",
        text: err.response?.data?.message || err.message,
      });
    },
  });

  const onView = useCallback((id) => {
    setSelectedStudentId(id);
    setIsOpenModalData(true);
    setSelectedCourse([]);
  }, []);

  const onDelete = useCallback(
    (courseId) => {
      unenroll(courseId);
    },
    [unenroll]
  );

  const handleCheckboxChange = useCallback((courseId) => {
    setSelectedCourse((prev) => {
      return prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId];
    });
  }, []);

  const handleEnrollStudent = useCallback(() => {
    enroll(selectedCourse);
  }, [enroll, selectedCourse]);

  const handleCloseModal = useCallback(() => {
    setSelectedStudentId(null);
    setIsOpenModalData(false);
  }, []);

  useEffect(() => {
    // Get the Students
    if (students) setPaginatedData(students);

    // Get data with course
  }, [students, setPaginatedData]);

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
      studentFetching,
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
      studentFetching,
    ]
  );

  const modal = useMemo(
    () => ({
      isOpenModalData,
      onView,
      handleCloseModal,
    }),
    [isOpenModalData, onView, handleCloseModal]
  );

  const form = useMemo(
    () => ({
      getCourse,
      onDelete,
      handleCheckboxChange,
      selectedCourse,
      handleEnrollStudent,
    }),
    [
      getCourse,
      onDelete,
      handleCheckboxChange,
      selectedCourse,
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
    <EnrollByStudentContext.Provider value={value}>
      {children}
    </EnrollByStudentContext.Provider>
  );
};

export const useEnrollByStudentModal = () =>
  useContextSelector(EnrollByStudentContext, (ctx) => ctx.modal);
export const useEnrollByStudentData = () =>
  useContextSelector(EnrollByStudentContext, (ctx) => ctx.parentData);
export const useEnrollByStudentForm = () =>
  useContextSelector(EnrollByStudentContext, (ctx) => ctx.form);
