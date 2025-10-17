/**
 * CoursesContext.jsx
 *
 * Provides a scope context for managing course data (CRUD operations),
 * pagination, search, and form handling across the app.
 *
 * Features:
 * - Fetch courses from API
 * - Add, update, delete courses
 * - Manage form input and validation
 * - Handle pagination with search
 * - Manage modal open/close state
 *  - Simplified version of StudentsContext
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import useForm from "../hooks/useForm";
import { courseValidation } from "../validations/Validations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";
import Swal from "sweetalert2";
import { courseService } from "../services/CourseService"; // Compiled all of the axios here

// Create React Context for Courses
const CoursesContext = createContext();

// Default form values
const initialValues = {
  code: "",
  name: "",
  description: "",
  units: "",
};

export const CoursesContextProvider = ({ children }) => {
  const queryClient = useQueryClient(); // React Query cache manager
  const [modal, setModal] = useState({ open: false, title: "", mode: "" }); // Modal visibility, title, and track edit mode

  /**
   * Custom form hook for input management and validation
   */
  const {
    values,
    handleChange,
    handleSubmit,
    dispatchForm,
    resetForm,
    isError: formError,
  } = useForm(initialValues, courseValidation);

  /**
   * Custom pagination + search hook
   */
  const {
    search,
    paginatedData,
    currentPage,
    dataPerPage,
    totalPages,
    totalData,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    setData: setPaginatedData,
  } = usePaginationWithSearch();

  /**
   * 🟢 Fetch courses (GET /api/courses)
   */
  const { data, isFetching } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await courseService.getAll();
      return data.data; // backend returns { message, data }
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error Fetching Courses",
        text: err?.message || "Something went wrong.",
      });
    },
  });

  /**
   * 🟢 Add new course (POST /api/courses)
   */
  const { mutate: addCourse } = useMutation({
    mutationFn: async (newCourse) => {
      const { data } = await courseService.create(newCourse);
      return data;
    },
    onMutate: () => {
      Swal.fire({
        title: "Saving...",
        text: "Please wait a moment",
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
      queryClient.invalidateQueries(["courses"]); // refresh list
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed to add course",
        text: error.response?.data?.message || error.message,
      });
    },
  });

  /**
   * 🟡 Update existing course (PUT /api/courses/{id})
   */
  const { mutate: updateCourse } = useMutation({
    mutationFn: async (course) => {
      const { id, ...payload } = course;
      const { data } = await courseService.update(id, payload);
      return data;
    },
    onMutate: () => {
      Swal.fire({
        title: "Updating...",
        text: "Please wait a moment",
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

  /**
   * 🔴 Delete course (DELETE /api/courses/{id})
   */
  const { mutate: deleteCourse } = useMutation({
    mutationFn: async (id) => {
      const { data } = await courseService.remove(id);
      return data;
    },
    onMutate: () => {
      Swal.fire({
        title: "Deleting...",
        text: "Please wait a moment",
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

  /**
   * ✅ Update the paginated data when courses are fetched
   */
  useEffect(() => {
    if (data) setPaginatedData(data);
  }, [data, setPaginatedData]);

  /**
   * 🪟 Modal Handlers
   */
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

  /**
   * ✏️ Edit mode handler
   */
  const onEdit = useCallback(
    (item) => {
      setModal({
        open: true,
        title: "Update Course",
        mode: "edit",
      });
      dispatchForm(item); // populate form with existing data
    },
    [dispatchForm]
  );

  /**
   * 🗑️ Delete handler
   */
  const onDelete = useCallback(
    (id) => {
      deleteCourse(id);
    },
    [deleteCourse]
  );

  /**
   * 📤 Add/Update form submission logic
   */
  const handleAddCourse = useCallback((vals) => addCourse(vals), [addCourse]);
  const handleUpdateCourse = useCallback(
    (vals) => {
      updateCourse(vals);
    },
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

  /**
   * Memoized context value for optimization
   */
  const value = useMemo(
    () => ({
      values,
      formError,
      modal,
      paginatedData,
      search,
      currentPage,
      dataPerPage,
      totalPages,
      totalData,
      isFetching,
      handlePageChange,
      handleRowsPerPageChange,
      handleSearch,
      handleOpenModal,
      handleCloseModal,
      handleChange,
      handleSubmit,
      handleSubmitForm,
      onEdit,
      onDelete,
    }),
    [
      values,
      formError,
      modal,
      paginatedData,
      search,
      currentPage,
      dataPerPage,
      totalPages,
      totalData,
      isFetching,
      handlePageChange,
      handleRowsPerPageChange,
      handleSearch,
      handleOpenModal,
      handleCloseModal,
      handleChange,
      handleSubmit,
      handleSubmitForm,
      onEdit,
      onDelete,
    ]
  );

  return (
    <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>
  );
};

export const useCourses = () => useContext(CoursesContext);
