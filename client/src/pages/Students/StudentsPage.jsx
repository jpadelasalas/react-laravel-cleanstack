import InputField from "../../utilities/InputField";
import Button from "../../utilities/Button";
import Table from "../../utilities/Table";
import { useStudents } from "../../context/StudentsContext";
import ModalComponent from "../../components/ModalComponent";

const StudentsPage = () => {
  const {
    isOpenModal,
    handleOpenModal,
    handleCloseModal,
    handleChange,
    handleSubmit,
    handleSubmitForm,
    title,
    values,
    isError,
  } = useStudents();

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
          error={isError.name}
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
          error={isError.email}
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
          error={isError.birthdate}
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
          error={isError.address}
        />
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-end px-4 pb-2 mb-3 space-x-4">
      {title !== "Add New Student" && (
        <Button
          buttonName={"Delete"}
          onClick={handleOpenModal}
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
    <>
      <header className="grid grid-cols-1 sm:grid-cols-[8fr_4fr] mt-2 mb-4 max-sm:gap-10">
        <InputField
          type="text"
          className="border-1 p-2 mx-4 rounded-md w-[90%] md:w-3/4 text-black dark:text-white focus:ring-black focus:border-black"
          placeholder="Search Student"
          // value={search}
          // onChange={handleSearch}
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
        <Table tHead={["Name", "Email", "Gender", "Birthdate", "Address"]}>
          {/* {paginatedData.length ? (
              paginatedData.map((item, index) => (
                <tr
                  key={`${index}-${item.itemNum}`}
                  className="odd:bg-white even:bg-violet-200 border-b cursor-pointer hover:odd:bg-gray-100 hover:even:bg-violet-300"
                  onDoubleClick={() => onEdit(item)}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {item.itemNum}
                  </th>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.description}</td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">{item.price}</td>
                  <td className="px-6 py-4">{item.date_created}</td>
                  <td className="px-6 py-4">{item.updated_at}</td>
                </tr>
              ))
            ) : ( */}
          <tr className="odd:bg-white even:bg-gray-300 odd:text-black even:text-white border-b">
            <td className="px-6 py-4 text-center" colSpan={8}>
              No data available.
            </td>
          </tr>
          <tr className="odd:bg-white even:bg-blue-50 dark:even:bg-gray-600 odd:text-black dark:even:text-white  text-black border-b">
            <td className="px-6 py-4 text-center" colSpan={8}>
              No data available.
            </td>
          </tr>
          {/* )} */}
        </Table>

        <div className="flex justify-end mt-5">
          {/* <TablePagination
            component="div"
            count={totalData}
            page={currentPage}
            onPageChange={handlePageChange}
            rowsPerPage={dataPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          /> */}
        </div>
      </div>
      {isOpenModal && (
        <ModalComponent
          title={title}
          children={children}
          footer={footer}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
};

export default StudentsPage;
