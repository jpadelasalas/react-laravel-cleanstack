import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../utilities/axiosInstance";
import { alert } from "../../utilities/alert";

const useEnrollByCourse = (
  isOpenModalData,
  selectedCourseId,
  setSelectedStudent
) => {
  const queryClient = useQueryClient();

  const { data: courses, isFetching: courseFetching } = useQuery({
    queryKey: ["course-with-student"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/v1/course-with-student");
      return data.data;
    },
    onError: (err) => {
      alert.error(
        "Error Fetching Course",
        err?.message || "Something went wrong."
      );
    },
    refetchOnMount: false, // prevent fetch if cached
  });

  const { data: getStudents } = useQuery({
    queryKey: ["course-with-student", selectedCourseId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/api/v1/course-with-student/${selectedCourseId}`
      );
      return data.data;
    },
    enabled: !!isOpenModalData && !!selectedCourseId, // Proceed if and only if these conditions are true
  });

  const { mutate: unenroll } = useMutation({
    mutationFn: async (studentId) => {
      const { data } = await axiosInstance.delete(
        `/api/v1/course-with-student/${selectedCourseId}/${studentId}`
      );
      return data;
    },
    onMutate: async (newStudent) => {
      alert.loading("Unenrolling...");
      await queryClient.cancelQueries([
        "course-with-student",
        selectedCourseId,
      ]);

      const previousData = queryClient.getQueryData([
        "course-with-student",
        selectedCourseId,
      ]);

      queryClient.setQueryData(
        ["course-with-student", selectedCourseId],
        (old) => ({
          ...old,
          unenrolled: old.unenrolled.filter(
            (student) => student.id !== newStudent.id
          ),
        })
      );

      return { previousData };
    },
    onSuccess: (res) => {
      alert.success(res.message || "Student Unenrolled Successfully!");
      queryClient.invalidateQueries(["course-with-student", selectedCourseId]);
    },
    onError: (error, _, context) => {
      alert.error(
        error.message || "Failed to unenroll the student",
        error.response?.data?.message || error.message
      );
      queryClient.setQueryData(
        ["course-with-student", selectedCourseId],
        context.previousData
      );
    },
  });

  const { mutate: enroll } = useMutation({
    mutationFn: async (student) => {
      const { data } = await axiosInstance.post(`/api/v1/course-with-student`, {
        selectedCourseId,
        student,
      });
      return data;
    },
    onMutate: async (enrollees) => {
      alert.loading("Enrolling...");
      await queryClient.cancelQueries([
        "course-with-student",
        selectedCourseId,
      ]);

      const previousData = queryClient.getQueryData([
        "course-with-student",
        selectedCourseId,
      ]);

      queryClient.setQueryData(
        ["student-with-course", selectedCourseId],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            course: [...(old.course || []), { ...enrollees, optimistic: true }],
          };
        }
      );
      return { previousData };
    },
    onSuccess: (res) => {
      alert.success(res.message || "Student Enrolled Successfully!");
      setSelectedStudent([]);
      queryClient.invalidateQueries(["course-with-student", selectedCourseId]);
    },
    onError: (err, _, context) => {
      alert.error(
        err.message || "Failed to enroll the student.",
        err.response?.data?.message || err.message
      );
      queryClient.setQueryData(
        ["course-with-student", selectedCourseId],
        context.previousData
      );
    },
  });

  return {
    courses,
    courseFetching,
    getStudents,
    unenroll,
    enroll,
  };
};

export default useEnrollByCourse;
