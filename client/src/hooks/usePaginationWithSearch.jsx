/**
 * usePaginationWithSearch.js
 *
 * A custom React hook for handling both pagination and search in tabular data.
 *
 * Features:
 * - Built-in search with debounce
 * - Pagination control (page, rows per page)
 * - Filtered and paginated results
 *
 * @returns {object} Pagination and search utilities
 */

import { useCallback, useMemo, useState } from "react";
import useDebounce from "../hooks/useDebounce";

const usePaginationWithSearch = () => {
  // 🔍 Search state
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 700); // delay search updates

  // 📋 Data state
  const [data, setData] = useState([]);

  // 📄 Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [dataPerPage, setDataPerPage] = useState(10);

  /**
   * Handles changing to a different page.
   * @param {Event} event - The pagination event.
   * @param {number} page - The new page number.
   */
  const handlePageChange = useCallback((event, page) => {
    setCurrentPage(page);
  }, []);

  /**
   * Handles changing number of rows per page.
   * @param {Event} event - The event from dropdown/select.
   */
  const handleRowsPerPageChange = useCallback((event) => {
    setDataPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  }, []);

  /**
   * Filters the data based on search input (debounced for performance).
   */
  const filteredData = useMemo(() => {
    if (debouncedSearch.trim() === "") return data;
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    );
  }, [data, debouncedSearch]);

  /**
   * Returns only the paginated slice of filtered data.
   */
  const paginatedData = useMemo(() => {
    const start = currentPage * dataPerPage;
    return filteredData.slice(start, start + dataPerPage);
  }, [filteredData, currentPage, dataPerPage]);

  /**
   * Total filtered items count.
   */
  const totalData = filteredData.length;

  /**
   * Calculates the total number of pages.
   */
  const totalPages = useMemo(() => {
    return Math.ceil(totalData / dataPerPage);
  }, [totalData, dataPerPage]);

  /**
   * Updates search value and resets page to 0.
   */
  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  }, []);

  return {
    search, // Current search query
    data, // Raw data
    paginatedData, // Filtered and paginated data
    currentPage, // Current page number
    dataPerPage, // Rows per page
    totalPages, // Total pages
    totalData, // Total filtered records
    handlePageChange, // Go to another page
    handleRowsPerPageChange, // Change number of rows per page
    setData, // Set entire data array
    handleSearch, // Search input handler
  };
};

export default usePaginationWithSearch;
