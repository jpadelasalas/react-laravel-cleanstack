import { EnrollmentContextProvider } from "../../context/EnrollmentContext";
import EnrollmentPage from "./EnrollmentPage";

const Enrollments = () => {
  return (
    <EnrollmentContextProvider>
      <EnrollmentPage />
    </EnrollmentContextProvider>
  );
};

export default Enrollments;
