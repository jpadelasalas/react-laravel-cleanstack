import { createContext, useContext } from "react";

const EnrollByCourseContext = createContext();

export const EnrollByCourseContextProvider = ({ children }) => {
  const value = {};
  return (
    <EnrollByCourseContext.Provider value={value}>
      {children}
    </EnrollByCourseContext.Provider>
  );
};

export const useEnrollByCourse = () => useContext(EnrollByCourseContext);
