import { useState } from "react";
import { lazy, Suspense } from "react";
import { EnrollByStudentContextProvider } from "../../context/EnrollByStudentContext";
import { EnrollByCourseContextProvider } from "../../context/EnrollByCourseContext";

const EnrollByStudent = lazy(() => import("./EnrollByStudent"));
const EnrollByCourse = lazy(() => import("./EnrollByCourse"));
const tabs = ["Student", "Course"];

const Enrollments = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("Student");

  // Scope Context
  const renderedTab = {
    Student: (
      <EnrollByStudentContextProvider>
        <EnrollByStudent />
      </EnrollByStudentContextProvider>
    ),
    Course: (
      <EnrollByCourseContextProvider>
        <EnrollByCourse />
      </EnrollByCourseContextProvider>
    ),
  };
  return (
    <>
      <nav className="flex space-x-0.5 my-1 px-4">
        {tabs.map((tab, index) => (
          <p
            key={index}
            className={`relative px-2 py-1 cursor-pointer rounded-t-sm transition-colors duration-300 group ${
              activeTab === tab
                ? " border-b shadow-sm border-blue-400 dark:border-gray-50"
                : "text-gray-500  hover:text-black dark:hover:text-white"
            } `}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {activeTab !== tab && (
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 dark:bg-white group-hover:w-full transition-all duration-300"></span>
            )}
          </p>
        ))}
      </nav>
      <div className="p-4 mb-2 flex flex-col font-mono max-h-full max-w-full">
        <Suspense fallback={<div>Loading...</div>}>
          {renderedTab[activeTab]}
        </Suspense>
      </div>
    </>
  );
};

export default Enrollments;
