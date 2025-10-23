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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

import useForm from "../hooks/useForm";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";
import { courseValidation } from "../validations/Validations";
import { courseService } from "../services/CourseService";

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
  const queryClient = useQueryClient();

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

  /* -------------------------------- Fetch Data ------------------------------- */
  const { data, isFetching } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await courseService.getAll();
      return data.data;
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error fetching courses",
        text: err?.message || "Something went wrong.",
      });
    },
    refetchOnMount: false, // prevent fetch if cached
  });

  /* ------------------------------- Add Course -------------------------------- */
  const { mutate: addCourse } = useMutation({
    mutationFn: async (newCourse) => {
      const { data } = await courseService.create(newCourse);
      return data;
    },
    onMutate: () => {
      Swal.fire({
        title: "Saving...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
    },
    onSuccess: (res) => {
      Swal.fire({
        icon: "success",
        title: res.message || "Course added successfully",
      });
      resetForm();
      handleCloseModal();
      queryClient.invalidateQueries(["courses"]);
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed to add course",
        text: error.response?.data?.message || error.message,
      });
    },
  });

  /* ------------------------------ Update Course ------------------------------ */
  const { mutate: updateCourse } = useMutation({
    mutationFn: async (course) => {
      const { id, ...payload } = course;
      const { data } = await courseService.update(id, payload);
      return data;
    },
    onMutate: () => {
      Swal.fire({
        title: "Updating...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
    },
    onSuccess: (res) => {
      Swal.fire({
        icon: "success",
        title: res.message || "Course updated successfully",
        timer: 1500,
        showConfirmButton: true,
      });
      resetForm();
      handleCloseModal();
      queryClient.invalidateQueries(["courses"]);
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed to update course",
        text: error.response?.data?.message || error.message,
      });
    },
  });

  /* ------------------------------ Delete Course ------------------------------ */
  const { mutate: deleteCourse } = useMutation({
    mutationFn: async (id) => {
      const { data } = await courseService.remove(id);
      return data;
    },
    onMutate: () => {
      Swal.fire({
        title: "Deleting...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
    },
    onSuccess: (res) => {
      Swal.fire({
        icon: "success",
        title: res.message || "Course deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });
      resetForm();
      handleCloseModal();
      queryClient.invalidateQueries(["courses"]);
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed to delete course",
        text: error.response?.data?.message || error.message,
      });
    },
  });

  /* --------------------------- Sync fetched data ----------------------------- */
  useEffect(() => {
    if (data) setPaginatedData(data);
  }, [data, setPaginatedData]);

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

  const onDelete = useCallback((id) => deleteCourse(id), [deleteCourse]);

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
