import React from "react";

const Table = React.memo(({ tHead, children }) => {
  return (
    <table className="w-full text-sm text-left">
      <thead className="text-xs uppercase bg-[#B2CAFF] dark:bg-gray-700 text-black dark:text-white">
        <tr>
          {tHead.map((name, index) => (
            <th scope="col" key={`${index}-${name}`} className="px-6 py-3">
              {name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
});

export default Table;
