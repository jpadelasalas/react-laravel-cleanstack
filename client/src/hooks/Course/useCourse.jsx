import { courseService } from "../../services/CourseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alert } from "../../utilities/alert";

const useCourse = (resetForm, handleCloseModal, search, currentPage) => {
  const queryClient = useQueryClient();

  /* -------------------------------- Fetch Data ------------------------------- */
  const { data: courseData, isFetching } = useQuery({
    queryKey: ["courses", search, currentPage],
    queryFn: async () => {
      const { data } = await courseService.getAll();
      return data.data;
    },
    onError: (err) => {
      alert.error(
        "Error fetching courses",
        err?.message || "Something went wrong."
      );
    },
    refetchOnMount: false, // prevent fetch if cached
  });

  /* ------------------------------- Add Course -------------------------------- */
  const { mutate: addCourse } = useMutation({
    mutationFn: async (newCourse) => {
      const { data } = await courseService.create(newCourse);
      return data;
    },
    onMutate: async (newCourse) => {
      alert.loading("Saving...");

      await queryClient.cancelQueries(["courses", search, currentPage]);

      const previousData = queryClient.getQueryData([
        "courses",
        search,
        currentPage,
      ]);

      queryClient.setQueryData(["courses", search, currentPage], (old) => [
        ...(old || []),
        { ...newCourse, id: Date.now(), optimistic: true },
      ]);

      return { previousData };
    },
    onSuccess: (res) => {
      alert.success(res.message || "Course added successfully");
      resetForm();
      handleCloseModal();
      queryClient.setQueryData(["courses", search, currentPage], (old) =>
        old ? [...old, res.data] : [res.data]
      );
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        ["courses", search, currentPage],
        context.previousData
      );
      alert.error(
        "Failed to add course",
        error.response?.data?.message || "Error adding course."
      );
    },
  });

  /* ------------------------------ Update Course ------------------------------ */
  const { mutate: updateCourse } = useMutation({
    mutationFn: async (course) => {
      const { id, ...payload } = course;
      const { data } = await courseService.update(id, payload);
      return data;
    },
    onMutate: async (newCourse) => {
      alert.loading("Saving...");
      await queryClient.cancelQueries(["courses", search, currentPage]);

      const previousData = queryClient.getQueryData([
        "courses",
        search,
        currentPage,
      ]);

      queryClient.setQueryData(["courses", search, currentPage], (old) =>
        old.map((item) =>
          item.id === newCourse.id ? { ...item, ...newCourse } : item
        )
      );

      return { previousData };
    },
    onSuccess: (res) => {
      alert.success(res.message || "Course updated successfully");
      resetForm();
      handleCloseModal();
      queryClient.setQueryData(["courses", search, currentPage], (old) =>
        old.map((item) =>
          item.id === res.data.id ? { ...item, ...res.data } : item
        )
      );
    },
    onError: (error, _, context) => {
      alert.error("Failed to update course", error.response?.data?.message);
      queryClient.setQueryData(
        ["courses", search, currentPage],
        context.previousData
      );
    },
  });

  /* ------------------------------ Delete Course ------------------------------ */
  const { mutate: deleteCourse } = useMutation({
    mutationFn: async (id) => {
      const { data } = await courseService.remove(id);
      return data;
    },
    onMutate: async (deleteCourse) => {
      alert.loading("Deleting...");
      await queryClient.cancelQueries(["courses", search, currentPage]);

      const previousData = queryClient.getQueryData([
        "courses",
        search,
        currentPage,
      ]);

      queryClient.setQueryData(["courses", search, currentPage], (old) =>
        old.filter((item) => item.id !== deleteCourse.id)
      );

      return { previousData };
    },
    onSuccess: (res) => {
      alert.success(res.message || "Course deleted successfully");
      resetForm();
      handleCloseModal();
      queryClient.setQueryData(["courses", search, currentPage], (old) =>
        old.filter((item) => item.id !== res.data.id)
      );
    },
    onError: (error, _, context) => {
      alert.error("Failed to delete course", error.response?.data?.message);
      queryClient.setQueryData(
        ["courses", search, currentPage],
        context.previousData
      );
    },
  });

  return {
    courseData,
    isFetching,
    addCourse,
    updateCourse,
    deleteCourse,
  };
};

export default useCourse;
