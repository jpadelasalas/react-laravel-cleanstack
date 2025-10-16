export const LoadingFullScreen = () => {
  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gray-50">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
      </div>
    </div>
  );
};

export const LoadingTable = ({ colSpan = 5 }) => {
  return (
    <tr className="bg-white border-b text-black">
      <td className="px-6 py-4 text-center" colSpan={colSpan}>
        <div className="flex w-full h-full items-center justify-center bg-gray-50">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          </div>
        </div>
      </td>
    </tr>
  );
};
