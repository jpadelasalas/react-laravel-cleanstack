import { StudentsContextProvider } from "../../context/StudentsContext";
import StudentsPage from "./StudentsPage";

const Students = () => {
  // Scope Context
  return (
    <StudentsContextProvider>
      <StudentsPage />
    </StudentsContextProvider>
  );
};

export default Students;
