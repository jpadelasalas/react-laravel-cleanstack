import { createContext, useContext } from "react";

const CoursesContext = createContext();

export const CoursesContextProvider = ({ children }) => {
  const value = {};
  return (
    <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>
  );
};

export const useCourses = () => useContext(CoursesContext);
