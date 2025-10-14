import { StudentsContextProvider } from "../../context/StudentsContext";
import StudentsPage from "./StudentsPage";

const Students = () => {
  return (
    <StudentsContextProvider>
      <StudentsPage />
    </StudentsContextProvider>
  );
};

export default Students;
