import React from "react";
import { useStudentForm } from "../../context/StudentsContext";
import InputField from "../../utilities/InputField";
import Button from "../../utilities/Button";
import ModalComponent from "../ModalComponent";

const StudentFormModal = React.memo(
  ({ isOpenModal, title, handleCloseModal }) => {
    if (!isOpenModal) return null;

    const {
      values,
      handleChange,
      handleSubmit,
      handleSubmitForm,
      formError,
      onDelete,
    } = useStudentForm();

    // Content of the modal
    const children = (
      <div className="p-4 mb-2 grid grid-cols-1 md:grid-cols-2 md:gap-2 font-mono">
        <div className="flex flex-col m-1">
          <label htmlFor="" className="text-lg">
            {" "}
            <span className="text-red-500">*</span>Name
          </label>
          <InputField
            type={"text"}
            name={"name"}
            placeholder={"Enter Name"}
            value={values.name}
            onChange={handleChange}
            error={formError.name}
          />
        </div>
        <div className="flex flex-col m-1">
          <label htmlFor="" className="text-lg">
            {" "}
            <span className="text-red-500">*</span>Email
          </label>
          <InputField
            type={"email"}
            name={"email"}
            placeholder={"Enter Email"}
            value={values.email}
            onChange={handleChange}
            error={formError.email}
          />
        </div>
        <div className="flex flex-col m-1">
          <label htmlFor="" className="text-lg">
            {" "}
            <span className="text-red-500">*</span>Birthdate
          </label>
          <InputField
            type={"date"}
            name={"birthdate"}
            value={values.birthdate}
            onChange={handleChange}
            error={formError.birthdate}
          />
        </div>
        <div className="flex flex-col m-1">
          <label htmlFor="" className="text-lg">
            {" "}
            <span className="text-red-500">*</span>Address
          </label>
          <InputField
            type={"text"}
            name={"address"}
            placeholder={"Enter Address"}
            value={values.address}
            onChange={handleChange}
            error={formError.address}
          />
        </div>
      </div>
    );

    // Footer of the modal if you have button
    const footer = (
      <div className="flex justify-end px-4 pb-2 mb-3 space-x-4">
        {title !== "Add New Student" && (
          <Button
            buttonName={"Delete"}
            onClick={() => onDelete(values.id)}
            className={
              "border py-2 px-1 bg-red-200 w-1/2 md:w-2/5 rounded-sm hover:bg-red-300 active:bg-red-400 cursor-pointer"
            }
          />
        )}
        <Button
          buttonName={title === "Add New Student" ? "Add" : "Update"}
          onClick={handleSubmit(handleSubmitForm)}
          className={
            "border py-2 px-1 bg-blue-200 w-1/2 md:w-2/5 rounded-sm hover:bg-blue-300 active:bg-blue-400 cursor-pointer"
          }
        />
      </div>
    );
    return (
      <ModalComponent
        modalSize={"md"}
        title={title}
        footer={footer}
        handleCloseModal={handleCloseModal}
      >
        {children}
      </ModalComponent>
    );
  }
);

export default StudentFormModal;
