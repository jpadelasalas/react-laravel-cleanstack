export const studentValidation = (vals) => {
  const errors = {};

  if (!vals.name) errors.name = "Name is required";
  if (!vals.email) errors.email = "Email is required";
  if (!vals.birthdate) errors.birthdate = "Birthdate is required";
  if (!vals.address) errors.address = "Address is required";

  return errors;
};
