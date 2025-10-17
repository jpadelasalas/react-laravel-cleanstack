import { CoursesContextProvider } from "../../context/CoursesContext";
import CoursesPage from "./CoursesPage";

const Courses = () => {
  // Scope Context
  return (
    <CoursesContextProvider>
      <CoursesPage />
    </CoursesContextProvider>
  );
};

export default Courses;
