import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../utilities/axiosInstance";
import { alert } from "../../utilities/alert";

const useEnrollByStudent = (
  selectedStudentId,
  isOpenModalData,
  setSelectedCourse,
  search,
  currentPage
) => {
  const queryClient = useQueryClient();

  const { data: students, isFetching: studentFetching } = useQuery({
    queryKey: ["students-with-course", search, currentPage],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/v1/student-with-course");
      return data.data;
    },
    onError: (err) => {
      alert.error(
        "Error Fetching Students",
        err?.message || "Something went wrong."
      );
    },
    refetchOnMount: false, // prevent fetch if cached
  });

  const { data: getCourse } = useQuery({
    queryKey: ["student-with-course", selectedStudentId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/v1/student-with-course/${selectedStudentId}`
      );

      return data.data;
    },
    enabled: !!isOpenModalData && !!selectedStudentId, // Proceed if and only if these conditions are true
  });

  const { mutate: unenroll } = useMutation({
    mutationFn: async (courseId) => {
      const { data } = await axiosInstance.delete(
        `/api/v1/student-with-course/${selectedStudentId}/${courseId}`
      );
      return data;
    },
    onMutate: async (unenroll) => {
      alert.loading("Unenrolling...", "Please wait a moment");
      await queryClient.cancelQueries([
        "student-with-course",
        selectedStudentId,
      ]);

      const previousData = queryClient.getQueryData([
        "student-with-course",
        selectedStudentId,
      ]);

      queryClient.setQueryData(
        ["student-with-course", selectedStudentId],
        (old) => ({
          ...old,
          course: old.course.filter((course) => course.id !== unenroll.id),
        })
      );

      return { previousData };
    },
    onSuccess: (res) => {
      alert.success(res.message || "Student Unenrolled Successfully!");
      queryClient.invalidateQueries(["student-with-course", selectedStudentId]);
    },
    onError: (error, _, context) => {
      alert.error(
        error.message || "Failed to unenroll the student",
        error.response?.data?.message || error.message
      );
      queryClient.setQueryData(
        ["student-with-course", selectedStudentId],
        context.previousData
      );
    },
  });

  const { mutate: enroll } = useMutation({
    mutationFn: async (course) => {
      const { data } = await axiosInstance.post(`/api/v1/student-with-course`, {
        selectedStudentId,
        course,
      });
      return data;
    },
    onMutate: async (newCourse) => {
      alert.loading("Enrolling...");
      await queryClient.cancelQueries([
        "student-with-course",
        selectedStudentId,
      ]);

      const previousData = queryClient.getQueryData([
        "student-with-course",
        selectedStudentId,
      ]);

      queryClient.setQueryData(
        ["student-with-course", selectedStudentId],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            course: [...(old.course || []), { ...newCourse, optimistic: true }],
          };
        }
      );

      return { previousData };
    },
    onSuccess: (res) => {
      alert.success(res.message || "Student Enrolled Successfully!");
      setSelectedCourse([]);
      queryClient.invalidateQueries(["student-with-course", selectedStudentId]);
    },
    onError: (err, _, context) => {
      alert.error(
        err.message || "Failed to enroll the student.",
        err.response?.data?.message || err.message
      );
      queryClient.setQueryData(
        ["student-with-course", selectedStudentId],
        context.previousData
      );
    },
  });

  return {
    students,
    studentFetching,
    getCourse,
    enroll,
    unenroll,
  };
};

export default useEnrollByStudent;
