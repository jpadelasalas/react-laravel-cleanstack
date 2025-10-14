import { CoursesContextProvider } from "../../context/CoursesContext";
import CoursesPage from "./CoursesPage";

const Courses = () => {
  return (
    <CoursesContextProvider>
      <CoursesPage />
    </CoursesContextProvider>
  );
};

export default Courses;
