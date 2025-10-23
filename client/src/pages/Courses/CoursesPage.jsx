import InputField from "../../utilities/InputField";
import Button from "../../utilities/Button";
import Table from "../../utilities/Table";
import TablePagination from "@mui/material/TablePagination";
import { LoadingTable } from "../../components/Loading";
import { useCourseData, useCourseModal } from "../../context/CoursesContext";
import CourseFormModal from "../../components/Course/CourseFormModal";

const CoursesPage = () => {
  const {
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
  } = useCourseData();
  const { modal, handleOpenModal, handleCloseModal } = useCourseModal();

  return (
    <>
      <header className="grid grid-cols-1 sm:grid-cols-[8fr_4fr] mt-2 mb-4 max-sm:gap-10">
        <InputField
          type="text"
          className="border-1 p-2 mx-4 rounded-md w-[90%] md:w-3/4 text-black dark:text-white focus:ring-black focus:border-black"
          placeholder="Search Course"
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
          ) : paginatedData?.length ? (
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
      <CourseFormModal
        isOpenModal={modal.open}
        title={modal.title}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
};

export default CoursesPage;
