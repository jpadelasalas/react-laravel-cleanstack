export const studentValidation = (vals) => {
  const errors = {};
  const qtySold = Number(vals.quantity_sold || 0);
  const totalPrice = Number(vals.total_price || 0);

  if (!vals.itemNum) errors.itemNum = "Item is required";
  if (qtySold <= 0)
    errors.quantity_sold = "Quantity Sold must be greater than 0";
  if (totalPrice <= 0)
    errors.total_price = "Total Price must be greater than 0";

  if (!vals.sold_at) errors.sold_at = "Sold At is required";

  return errors;
};
