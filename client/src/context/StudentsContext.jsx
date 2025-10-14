import { createContext, useContext } from "react";

const StudentsContext = createContext();

export const StudentsContextProvider = ({ children }) => {
  const value = {};
  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = () => useContext(StudentsContext);
