import { createContext, useContext } from "react";

const EnrollmentContext = createContext();

export const EnrollmentContextProvider = ({ children }) => {
  const value = {};
  return (
    <EnrollmentContext.Provider value={value}>
      {children}
    </EnrollmentContext.Provider>
  );
};

export const useEnrollment = () => useContext(EnrollmentContext);
