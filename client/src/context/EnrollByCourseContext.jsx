import { useCallback, useEffect, useMemo, useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";
import useEnrollByCourse from "../hooks/Enrollment/useEnrollByCourse";

const EnrollByCourseContext = createContext();

export const EnrollByCourseContextProvider = ({ children }) => {
  const [isOpenModalData, setIsOpenModalData] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState([]);
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

  const { courses, courseFetching, getStudents, unenroll, enroll } =
    useEnrollByCourse(isOpenModalData, selectedCourseId, setSelectedStudent);

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
