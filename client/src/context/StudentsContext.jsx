import { createContext, useCallback, useContext, useState } from "react";
import useForm from "../hooks/useForm";
import { studentValidation } from "../validations/Validations";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../utilities/axiosInstance";
const StudentsContext = createContext();

const initialValues = {
  name: "",
  email: "",
  birthdate: "",
  address: "",
};

export const StudentsContextProvider = ({ children }) => {
  // Declare states
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Use the custom hook for forms
  const {
    values,
    handleChange,
    isError,
    handleSubmit,
    dispatchForm,
    mergeForm,
    resetForm,
  } = useForm(initialValues, studentValidation);

  const { data } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/");
      return data;
    },
  });

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

  const onEdit = useCallback(
    (item) => {
      setIsEditing(true);
      setTitle("Update Item");
      dispatchForm(item);
      setIsOpenModal(true);
    },
    [dispatchForm]
  );

  const handleAddSales = (vals) => {};

  const handleUpdateSales = (vals) => {};

  const handleSubmitForm = (formValues) => {
    isEditing ? handleUpdateSales(formValues) : handleAddSales(formValues);
  };

  const value = {
    values,
    isError,
    isOpenModal,
    title,
    handleOpenModal,
    handleCloseModal,
    handleChange,
    handleSubmit,
    handleSubmitForm,
  };
  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = () => useContext(StudentsContext);
