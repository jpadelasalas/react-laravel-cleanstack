/**
 * CoursesContext.jsx
 *
 * Context for managing course data — CRUD, pagination, search, and form state.
 *
 * 🧩 Features:
 * - Fetch courses from API
 * - Add / Edit / Delete courses
 * - Form validation and modal control
 * - Pagination + search handling
 *
 * ⚙️ Uses:
 * - React Query for server state
 * - use-context-selector for performance
 * - Custom hooks: useForm, usePaginationWithSearch
 * - SweetAlert2 for alerts
 *
 */

import { useCallback, useEffect, useState, useMemo } from "react";
import { createContext, useContextSelector } from "use-context-selector";

import useForm from "../hooks/useForm";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";
import { courseValidation } from "../validations/Validations";
import useCourse from "../hooks/useCourse";

// Create the context
const CoursesContext = createContext();

// Default form values
const initialValues = {
  code: "",
  name: "",
  description: "",
  units: "0",
};

export const CoursesContextProvider = ({ children }) => {
  // Modal state (open, title, and mode = add/edit)
  const [modal, setModal] = useState({ open: false, title: "", mode: "" });

  // Custom form hook (input + validation)
  const {
    values,
    handleChange,
    handleSubmit,
    dispatchForm,
    resetForm,
    isError: formError,
  } = useForm(initialValues, courseValidation);

  // Pagination + search hook
  const {
    search,
    paginatedData,
    currentPage,
    dataPerPage,
    totalData,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    setData: setPaginatedData,
  } = usePaginationWithSearch();

  /* ------------------------------ Modal Logic -------------------------------- */
  const handleOpenModal = useCallback(() => {
    setModal({
      open: true,
      title: "Add New Course",
      mode: "add",
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModal({
      open: false,
      title: "",
      mode: "",
    });
    resetForm();
  }, [resetForm]);

  const onEdit = useCallback(
    (item) => {
      setModal({
        open: true,
        title: "Update Course",
        mode: "edit",
      });
      dispatchForm(item);
    },
    [dispatchForm]
  );

  /* --------------------------- Custom query hook ----------------------------- */
  const { courseData, isFetching, addCourse, updateCourse, deleteCourse } =
    useCourse(resetForm, handleCloseModal, search, currentPage);

  /* --------------------------- Sync fetched data ----------------------------- */
  useEffect(() => {
    if (courseData) setPaginatedData(courseData);
  }, [courseData, setPaginatedData]);

  /* ----------------------------- Submit Logic -------------------------------- */
  const handleAddCourse = useCallback((vals) => addCourse(vals), [addCourse]);
  const handleUpdateCourse = useCallback(
    (vals) => updateCourse(vals),
    [updateCourse]
  );

  const handleSubmitForm = useCallback(
    (formValues) => {
      modal.mode === "edit"
        ? handleUpdateCourse(formValues)
        : handleAddCourse(formValues);
    },
    [modal.mode, handleUpdateCourse, handleAddCourse]
  );

  const onDelete = useCallback((id) => deleteCourse(id), [deleteCourse]);

  /* ----------------------------- Memoized Values ----------------------------- */
  const modalVal = useMemo(
    () => ({
      modal,
      handleOpenModal,
      handleCloseModal,
    }),
    [modal, handleOpenModal, handleCloseModal]
  );

  const form = useMemo(
    () => ({
      values,
      handleChange,
      handleSubmit,
      handleSubmitForm,
      formError,
      onDelete,
    }),
    [values, handleChange, handleSubmit, handleSubmitForm, formError, onDelete]
  );

  const dataState = useMemo(
    () => ({
      paginatedData,
      search,
      currentPage,
      dataPerPage,
      totalData,
      handlePageChange,
      handleRowsPerPageChange,
      handleSearch,
      isFetching,
      onEdit,
    }),
    [
      paginatedData,
      search,
      currentPage,
      dataPerPage,
      totalData,
      handlePageChange,
      handleRowsPerPageChange,
      handleSearch,
      isFetching,
      onEdit,
    ]
  );

  const value = useMemo(
    () => ({ modalVal, form, dataState }),
    [modalVal, form, dataState]
  );

  return (
    <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>
  );
};

/* ----------------------------- Custom Hooks --------------------------------- */
// keep it short and consistent

export const useCourseModal = () =>
  useContextSelector(CoursesContext, (ctx) => ctx.modalVal);

export const useCourseForm = () =>
  useContextSelector(CoursesContext, (ctx) => ctx.form);

export const useCourseData = () =>
  useContextSelector(CoursesContext, (ctx) => ctx.dataState);
