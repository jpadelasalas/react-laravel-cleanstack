import * as MUIIcons from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Better if this is from database.
const menuItems = [
  {
    label: "Students",
    route: "/students",
    icon: "AccountCircle",
  },
  {
    label: "Courses",
    route: "/courses",
    icon: "School",
  },
  {
    label: "Enrollments",
    route: "/enrollments",
    icon: "Description",
  },
];

const Sidebar = ({
  titlePage,
  setTitlePage,
  setIsOpenSidebar,
  isOpenSidebar,
}) => {
  const navigate = useNavigate();

  const handleClickNavs = (item) => {
    setTitlePage(item.label);
    navigate(item.route);
    setIsOpenSidebar(false);
  };
  return (
    <>
      {isOpenSidebar && (
        <div
          className="fixed inset-0 bg-black w-screen bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpenSidebar(false)}
        ></div>
      )}

      <aside
        className={`fixed z-50 inset-y-0 left-0 lg:w-64 w-55 bg-[#B2CAFF] shadow-md shadow-black  dark:bg-black dark:shadow-gray-500 px-4 py-2 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block overflow-y-auto h-screen ${
          isOpenSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h3 className="my-2 mb-5 text-3xl font-semibold  font-mono">
          Demo Project
        </h3>

        <nav className="flex flex-col justify-between h-[calc(100vh-5.5rem)]">
          <div className="flex flex-col space-y-3">
            {menuItems.map((item, index) => {
              const Icon = MUIIcons[item.icon];
              return (
                <div
                  key={index}
                  className={`relative group flex items-center gap-2 ml-3 px-3 py-2 rounded-lg cursor-pointer ${
                    titlePage === item.label
                      ? "text-black dark:text-white"
                      : "text-gray-700 dark:text-gray-400"
                  }   hover:text-black dark:hover:text-white transition-colors duration-200`}
                  onClick={() => handleClickNavs(item)}
                >
                  {/* Top-left hover accent */}
                  <div
                    className={`absolute top-0 left-0 bg-black dark:bg-white group-hover:w-3 group-hover:h-3 ${
                      titlePage === item.label ? "w-3 h-3" : "w-0 h-0"
                    } transition-all duration-300 rounded-br-lg`}
                  ></div>

                  {/* Icon + Label */}
                  <Icon className="text-xl" />
                  <span className="font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
