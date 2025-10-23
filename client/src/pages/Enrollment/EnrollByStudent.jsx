import TablePagination from "@mui/material/TablePagination";
import {
  useEnrollByStudentData,
  useEnrollByStudentModal,
} from "../../context/EnrollByStudentContext";
import InputField from "../../utilities/InputField";
import Table from "../../utilities/Table";
import { LoadingTable } from "../../components/Loading";
import EnrollByStudentModal from "../../components/Enrollment/EnrollByStudentModal";

const EnrollByStudent = () => {
  const {
    search,
    paginatedData,
    currentPage,
    dataPerPage,
    totalData,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    studentFetching,
  } = useEnrollByStudentData();
  const { isOpenModalData, onView, handleCloseModal } =
    useEnrollByStudentModal();

  return (
    <>
      <header className="mt-2 mb-4">
        <InputField
          type="text"
          className="border-1 p-2 mx-4 rounded-md w-[90%] md:w-3/4 text-black dark:text-white focus:ring-black focus:border-black"
          placeholder="Search Student"
          value={search}
          onChange={handleSearch}
        />
      </header>

      <div className="my-5 mx-4 relative overflow-x-auto shadow-md sm:rounded-lg">
        <Table tHead={["ID", "Name", "Email", "Birthdate", "Address"]}>
          {studentFetching ? (
            <LoadingTable />
          ) : paginatedData.length ? (
            paginatedData.map((item, index) => (
              <tr
                key={`${index}-${item.id}`}
                className="odd:bg-white even:bg-blue-50 dark:even:bg-gray-600 odd:text-black dark:even:text-white  text-black border-b cursor-pointer odd:hover:bg-gray-50 even:hover:bg-blue-100 dark:even:hover:bg-gray-700"
                onDoubleClick={() => onView(item.id)}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium whitespace-nowrap"
                >
                  {index + 1}
                </th>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.email}</td>
                <td className="px-6 py-4">{item.birthdate}</td>
                <td className="px-6 py-4">{item.address}</td>
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
      <EnrollByStudentModal
        isOpen={isOpenModalData}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
};

export default EnrollByStudent;
