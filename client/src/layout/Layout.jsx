import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

const Layout = () => {
  const [titlePage, setTitlePage] = useState("");
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  useEffect(() => {
    const title = window.location.pathname.split("/")[1];
    setTitlePage(title.charAt(0).toUpperCase() + title.slice(1));
  }, []);

  return (
    <div className="flex space-x-4 h-screen overflow-auto max-w-screen">
      <Sidebar
        titlePage={titlePage}
        setTitlePage={setTitlePage}
        setIsOpenSidebar={setIsOpenSidebar}
        isOpenSidebar={isOpenSidebar}
      />
      <div className="flex-1 flex flex-col max-w-screen">
        <header className="p-4 border-b shadow md:hidden">
          <button
            onClick={() => setIsOpenSidebar(true)}
            className=" text-xl font-mono font-semibold"
          >
            ☰ {titlePage}
          </button>
        </header>

        <main className="p-6 overflow-y-auto">
          <h3 className="text-3xl font-semibold font-mono hidden md:block">
            {titlePage}
          </h3>
          <div
            className={`my-5 mx-0 md:mx-2 p-2 ${
              titlePage !== "Dashboard"
                ? "border-2 border-gray-900 dark:border-black rounded-lg bg-[#B2CAFF]-50 dark:bg-gray-800"
                : "border-0"
            }  overflow-x-hidden flex-grow-1 `}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
