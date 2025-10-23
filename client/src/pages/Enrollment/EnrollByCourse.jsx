import TablePagination from "@mui/material/TablePagination";
import {
  useEnrollByCourseData,
  useEnrollByCourseModal,
} from "../../context/EnrollByCourseContext";
import InputField from "../../utilities/InputField";
import Table from "../../utilities/Table";
import { LoadingTable } from "../../components/Loading";
import EnrollByCourseModal from "../../components/Enrollment/EnrollByCourseModal";

const EnrollByCourse = () => {
  const {
    search,
    paginatedData,
    currentPage,
    dataPerPage,
    totalData,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    courseFetching,
  } = useEnrollByCourseData();
  const { isOpenModalData, onView, handleCloseModal, courseInfo } =
    useEnrollByCourseModal();

  return (
    <>
      <header className="mt-2 mb-4">
        <InputField
          type="text"
          className="border-1 p-2 mx-4 rounded-md w-[90%] md:w-3/4 text-black dark:text-white focus:ring-black focus:border-black"
          placeholder="Search Course"
          value={search}
          onChange={handleSearch}
        />
      </header>

      <div className="my-5 mx-4 relative overflow-x-auto shadow-md sm:rounded-lg">
        <Table tHead={["ID", "Code", "Name", "Description", "Units"]}>
          {courseFetching ? (
            <LoadingTable />
          ) : paginatedData.length ? (
            paginatedData.map((item, index) => (
              <tr
                key={`${index}-${item.id}`}
                className="odd:bg-white even:bg-blue-50 dark:even:bg-gray-600 odd:text-black dark:even:text-white  text-black border-b cursor-pointer odd:hover:bg-gray-50 even:hover:bg-blue-100 dark:even:hover:bg-gray-700"
                onDoubleClick={() => onView(item)}
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
      <EnrollByCourseModal
        isOpen={isOpenModalData}
        handleCloseModal={handleCloseModal}
        courseInfo={courseInfo}
      />
    </>
  );
};

export default EnrollByCourse;
