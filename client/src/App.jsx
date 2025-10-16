import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoadingFullScreen } from "./components/Loading.jsx";
import { lazy, Suspense } from "react";
import Layout from "./layout/Layout.jsx";

const Students = lazy(() => import("./pages/Students/Students.jsx"));
const Courses = lazy(() => import("./pages/Courses/Courses.jsx"));
const Enrollments = lazy(() => import("./pages/Enrollment/Enrollments.jsx"));

function App() {
  return (
    <Suspense fallback={<LoadingFullScreen />}>
      <Routes>
        <Route path="*" element={<Navigate to={"/students"} />} />
        <Route path="/" element={<Navigate to={"/students"} />} />
        <Route path="/" element={<Layout />}>
          <Route path="students" element={<Students />} />
          <Route path="courses" element={<Courses />} />
          <Route path="enrollments" element={<Enrollments />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
