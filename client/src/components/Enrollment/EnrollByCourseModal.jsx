import ModalComponent from "../ModalComponent";
import { useEnrollByCourseForm } from "../../context/EnrollByCourseContext";
import React from "react";
import InputField from "../../utilities/InputField";
import Table from "../../utilities/Table";
import Button from "../../utilities/Button";

const EnrollByCourseModal = React.memo(
  ({ isOpen, handleCloseModal, courseInfo }) => {
    if (!isOpen) return null;

    const {
      getStudents,
      onDelete,
      handleCheckboxChange,
      selectedStudent,
      handleEnrollStudent,
    } = useEnrollByCourseForm();

    const children = (
      <div className="p-4 mb-2 font-mono">
        {getStudents && (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col space-y-2">
              <div className="grid grid-cols-2 text-lg">
                <p className="px-2 py-1">Course: {courseInfo.name}</p>
              </div>
              <div className="flex flex-col space-y-3">
                <h3 className="font-bold text-lg">Enrolled Student/s</h3>
                <div className="mb-5 mx-4 relative overflow-x-auto shadow-md sm:rounded-lg max-h-75 h-75 overflow-auto">
                  <Table tHead={["ID", "Name", "Email", "Action"]}>
                    {getStudents.enrolled ? (
                      getStudents.enrolled.map((item, index) => (
                        <tr
                          key={`${index}-${item.id}`}
                          className="odd:bg-white even:bg-blue-50 dark:even:bg-gray-600 odd:text-black dark:even:text-white  text-black border-b"
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium whitespace-nowrap"
                          >
                            {index + 1}
                          </th>
                          <td className="px-6 py-4">{item.name}</td>
                          <td className="px-6 py-4">{item.email}</td>
                          <td
                            className="px-6 py-4 cursor-pointer text-red-400 hover:text-red-600"
                            onClick={() => onDelete(item.id)}
                          >
                            Drop
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="odd:bg-white even:bg-blue-50 dark:even:bg-gray-600 odd:text-black dark:even:text-white  text-black border-b">
                        <td className="px-6 py-4 text-center" colSpan={5}>
                          No data available.
                        </td>
                      </tr>
                    )}
                  </Table>
                </div>
              </div>
            </div>
            <div className="flex flex-col mx-4 space-y-2">
              <h3 className="font-bold text-lg">Available Course/s</h3>

              <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-103 h-103 overflow-auto">
                <Table tHead={["", "Name", "Email"]}>
                  {getStudents.unenrolled ? (
                    getStudents.unenrolled.map((item, index) => (
                      <tr
                        key={`${index}-${item.id}`}
                        className="odd:bg-white even:bg-blue-50 dark:even:bg-gray-600 odd:text-black dark:even:text-white  text-black border-b"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium whitespace-nowrap"
                        >
                          <InputField
                            type="checkbox"
                            checked={(selectedStudent || []).includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                          />
                        </th>
                        <td className="px-6 py-4">{item.name}</td>
                        <td className="px-6 py-4">{item.email}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="odd:bg-white even:bg-blue-50 dark:even:bg-gray-600 odd:text-black dark:even:text-white  text-black border-b">
                      <td className="px-6 py-4 text-center" colSpan={5}>
                        No data available.
                      </td>
                    </tr>
                  )}
                </Table>
              </div>
              <div className="flex justify-end items-end mt-2">
                <Button
                  buttonName={"Enroll"}
                  className={
                    "p-2 w-1/2 rounded-md shadow-sm text-black dark:text-white bg-[#B2CAFF] active:border-1 hover:bg-[#86aaf9] active:bg-[#2c6cf5] dark:bg-gray-700 dark:hover:bg-gray-500 dark:active:bg-gray-600 cursor-pointer"
                  }
                  onClick={handleEnrollStudent}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
    return (
      <div>
        <ModalComponent
          modalSize={"6xl"}
          title={"Enroll by Course"}
          // footer={footer}
          handleCloseModal={handleCloseModal}
        >
          {children}
        </ModalComponent>
      </div>
    );
  }
);

export default EnrollByCourseModal;
