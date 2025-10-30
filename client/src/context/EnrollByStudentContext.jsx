import { useCallback, useEffect, useMemo, useState } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";
import useEnrollByStudent from "../hooks/Enrollment/useEnrollByStudent";

const EnrollByStudentContext = createContext();

export const EnrollByStudentContextProvider = ({ children }) => {
  const [isOpenModalData, setIsOpenModalData] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState([]);

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

  const { students, studentFetching, getCourse, enroll, unenroll } =
    useEnrollByStudent(
      selectedStudentId,
      isOpenModalData,
      setSelectedCourse,
      search,
      currentPage
    );

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
