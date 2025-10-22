/**
 * StudentsContext.jsx
 *
 * Provides a scope context for managing student data (CRUD operations),
 * pagination, search, and form handling across the app.
 *
 * Features:
 * - Fetch students from API
 * - Add, update, delete students
 * - Manage form input and validation
 * - Handle pagination with search
 * - Manage modal open/close state
 * - Semi hard-coded. CoursesContext is more simplified
 */

import { useCallback, useEffect, useState, useMemo } from "react";
import { createContext, useContextSelector } from "use-context-selector";
import useForm from "../hooks/useForm";
import { studentValidation } from "../validations/Validations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utilities/axiosInstance";
import usePaginationWithSearch from "../hooks/usePaginationWithSearch";
import Swal from "sweetalert2";

// Create React Context for Students
const StudentsContext = createContext();

// Default form values
const initialValues = {
  name: "",
  email: "",
  birthdate: "",
  address: "",
};

export const StudentsContextProvider = ({ children }) => {
  const queryClient = useQueryClient(); // React Query cache manager
  const [isOpenModal, setIsOpenModal] = useState(false); // modal visibility
  const [title, setTitle] = useState(""); // modal title (Add/Edit)
  const [isEditing, setIsEditing] = useState(false); // track edit mode

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
  } = useForm(initialValues, studentValidation);

  /**
   * Custom pagination + search hook
   */
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

  /**
   * 🟢 Fetch students (GET /api/v1/students)
   */
  const { data, isFetching } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/v1/students");
      return data.data; // backend returns { message, data }
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Error Fetching Students",
        text: err?.message || "Something went wrong.",
      });
    },
  });

  /**
   * 🟢 Add new student (POST /api/v1/students)
   */
  const { mutate: addStudent } = useMutation({
    mutationFn: async (newStudent) => {
      const { data } = await axiosInstance.post("/api/v1/students", newStudent);
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
        title: res.message || "Student added successfully",
      });
      resetForm();
      handleCloseModal();
      queryClient.invalidateQueries(["students"]); // refresh list
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed to add student",
        text: error.response?.data?.message || error.message,
      });
    },
  });

  /**
   * 🟡 Update existing student (PUT /api/v1/students/{id})
   */
  const { mutate: updateStudent } = useMutation({
    mutationFn: async (student) => {
      const { id, ...payload } = student;
      const { data } = await axiosInstance.put(
        `/api/v1/students/${id}`,
        payload
      );
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
        title: res.message || "Student updated successfully",
        timer: 1500,
        showConfirmButton: true,
      });
      resetForm();
      handleCloseModal();
      queryClient.invalidateQueries(["students"]);
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed to update student",
        text: error.response?.data?.message || error.message,
      });
    },
  });

  /**
   * 🔴 Delete student (DELETE /api/v1/students/{id})
   */
  const { mutate: deleteStudent } = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/api/v1/students/${id}`);
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
        title: res.message || "Student deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });
      resetForm();
      handleCloseModal();
      queryClient.invalidateQueries(["students"]);
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed to delete student",
        text: error.response?.data?.message || error.message,
      });
    },
  });

  /**
   * ✅ Update the paginated data when students are fetched
   */
  useEffect(() => {
    if (data) setPaginatedData(data);
  }, [data, setPaginatedData]);

  /**
   * 🪟 Modal Handlers
   */
  const handleOpenModal = useCallback(() => {
    setIsOpenModal(true);
    setTitle("Add New Student");
    setIsEditing(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false);
    setTitle("");
    setIsEditing(false);
    resetForm();
  }, [resetForm]);

  /**
   * ✏️ Edit mode handler
   */
  const onEdit = useCallback(
    (item) => {
      setIsEditing(true);
      setTitle("Update Student");
      dispatchForm(item); // populate form with existing data
      setIsOpenModal(true);
    },
    [dispatchForm]
  );

  /**
   * 🗑️ Delete handler
   */
  const onDelete = useCallback(
    (id) => {
      deleteStudent(id);
    },
    [deleteStudent]
  );

  /**
   * 📤 Add/Update form submission logic
   */
  const handleAddStudent = useCallback(
    (vals) => addStudent(vals),
    [addStudent]
  );
  const handleUpdateStudent = useCallback(
    (vals) => {
      updateStudent(vals);
    },
    [updateStudent]
  );

  const handleSubmitForm = useCallback(
    (formValues) => {
      isEditing
        ? handleUpdateStudent(formValues)
        : handleAddStudent(formValues);
    },
    [isEditing, handleUpdateStudent, handleAddStudent]
  );

  /**
   * Memoized context value for optimization
   */

  // Modal
  const modal = useMemo(
    () => ({
      isOpenModal,
      title,
      handleOpenModal,
      handleCloseModal,
    }),
    [isOpenModal, title, handleOpenModal, handleCloseModal]
  );

  // Form
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

  // Data
  const parentData = useMemo(
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
    () => ({
      modal,
      form,
      parentData,
    }),
    [modal, form, parentData]
  );

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  );
};

/**
 * Custom hook to access student context values
 */
export const useStudentModal = () =>
  useContextSelector(StudentsContext, (ctx) => ctx.modal);

export const useStudentForm = () =>
  useContextSelector(StudentsContext, (ctx) => ctx.form);

export const useStudentParentData = () =>
  useContextSelector(StudentsContext, (ctx) => ctx.parentData);
