import React from "react";

const Button = React.memo(({ buttonName, onClick, className, ...attr }) => {
  return (
    <button className={className} onClick={onClick} {...attr}>
      {buttonName}
    </button>
  );
});

export default Button;
