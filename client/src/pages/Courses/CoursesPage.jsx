import InputField from "../../utilities/InputField";
import Button from "../../utilities/Button";
import Table from "../../utilities/Table";
import ModalComponent from "../../components/ModalComponent";
import TablePagination from "@mui/material/TablePagination";
import { LoadingTable } from "../../components/Loading";
import { useCourses } from "../../context/CoursesContext";

const CoursesPage = () => {
  const {
    modal,
    handleOpenModal,
    handleCloseModal,
    handleChange,
    handleSubmit,
    handleSubmitForm,
    values,
    formError,
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
    onDelete,
  } = useCourses();

  // Content of the modal
  const children = (
    <div className="p-4 mb-2 grid grid-cols-1 md:grid-cols-2 md:gap-2 font-mono">
      <div className="flex flex-col m-1">
        <label htmlFor="" className="text-lg">
          {" "}
          <span className="text-red-500">*</span>Code
        </label>
        <InputField
          type={"text"}
          name={"code"}
          placeholder={"Enter Code"}
          value={values.code}
          onChange={handleChange}
          error={formError.code}
        />
      </div>
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
          <span className="text-red-500">*</span>Description
        </label>
        <InputField
          type={"text"}
          name={"description"}
          placeholder={"Enter Description"}
          value={values.description}
          onChange={handleChange}
          error={formError.description}
        />
      </div>
      <div className="flex flex-col m-1">
        <label htmlFor="" className="text-lg">
          {" "}
          <span className="text-red-500">*</span>Units
        </label>
        <InputField
          type={"number"}
          name={"units"}
          value={values.units}
          onChange={handleChange}
          error={formError.units}
        />
      </div>
    </div>
  );

  // Footer of the modal if you have button
  const footer = (
    <div className="flex justify-end px-4 pb-2 mb-3 space-x-4">
      {modal.title !== "Add New Course" && (
        <Button
          buttonName={"Delete"}
          onClick={() => onDelete(values.id)}
          className={
            "border py-2 px-1 bg-red-200 w-1/2 md:w-2/5 rounded-sm hover:bg-red-300 active:bg-red-400 cursor-pointer"
          }
        />
      )}
      <Button
        buttonName={modal.title === "Add New Course" ? "Add" : "Update"}
        onClick={handleSubmit(handleSubmitForm)}
        className={
          "border py-2 px-1 bg-blue-200 w-1/2 md:w-2/5 rounded-sm hover:bg-blue-300 active:bg-blue-400 cursor-pointer"
        }
      />
    </div>
  );
  return (
    <>
      <header className="grid grid-cols-1 sm:grid-cols-[8fr_4fr] mt-2 mb-4 max-sm:gap-10">
        <InputField
          type="text"
          className="border-1 p-2 mx-4 rounded-md w-[90%] md:w-3/4 text-black dark:text-white focus:ring-black focus:border-black"
          placeholder="Search Student"
          value={search}
          onChange={handleSearch}
        />
        <div className="text-end mx-5">
          <Button
            buttonName={"Add New"}
            onClick={handleOpenModal}
            className={
              "p-2 w-1/2 sm:w-3/4 rounded-md shadow-sm bg-[#B2CAFF] active:border-1 hover:bg-[#86aaf9] active:bg-[#2c6cf5] dark:bg-gray-700 dark:hover:bg-gray-500 dark:active:bg-gray-600 cursor-pointer"
            }
          />
        </div>
      </header>

      <div className="my-5 mx-4 relative overflow-x-auto shadow-md sm:rounded-lg">
        <Table tHead={["ID", "Code", "Name", "Description", "Units"]}>
          {isFetching ? (
            <LoadingTable />
          ) : paginatedData.length ? (
            paginatedData.map((item, index) => (
              <tr
                key={`${index}-${item.id}`}
                className="odd:bg-white even:bg-blue-50 dark:even:bg-gray-600 odd:text-black dark:even:text-white  text-black border-b cursor-pointer odd:hover:bg-gray-50 even:hover:bg-blue-100 dark:even:hover:bg-gray-700"
                onDoubleClick={() => onEdit(item)}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap"
                >
                  {index + 1}
                </th>
                <td className="px-6 py-4">{item.code}</td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.description}</td>
                <td className="px-6 py-4">{item.units}</td>
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
      <div className="flex justify-end mt-5 bg-white mx-4">
        <TablePagination
          component="div"
          count={totalData}
          page={currentPage}
          onPageChange={handlePageChange}
          rowsPerPage={dataPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
      {modal.open && (
        <ModalComponent
          modalSize={"md"}
          title={modal.title}
          children={children}
          footer={footer}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
};

export default CoursesPage;
