export const studentValidation = (vals) => {
  const errors = {};

  if (!vals.name) errors.name = "Name is required";
  if (!vals.email) errors.email = "Email is required";
  if (!vals.birthdate) errors.birthdate = "Birthdate is required";
  if (!vals.address) errors.address = "Address is required";

  return errors;
};

export const courseValidation = (vals) => {
  const errors = {};

  if (!vals.code) errors.code = "Code is required";
  if (!vals.name) errors.name = "Name is required";
  if (!vals.description) errors.description = "Description is required";
  if (!vals.units) errors.units = "Units is required";

  return errors;
};
