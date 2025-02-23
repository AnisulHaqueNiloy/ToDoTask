import React, { useContext, useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { AuthContext } from "./AuthProvider/AuthProvider";

const ParentLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const hlogout = () => {
    logout();
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Apply dark or light mode to the document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar for larger screens */}
      <div
        className={`fixed bg-white  md:relative top-0 left-0 h-full w-64 shadow-lg transform transition-transform duration-300 p-4
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-2xl text-black">To-Do App</h1>
          <button
            className="md:hidden text-xl"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <div className="flex items-center bg-white gap-2 my-4">
          <img
            className="rounded-full w-12 h-12 object-cover"
            src={user.photoURL}
            alt="User"
          />
          <p className="font-light text- text-black">{user.email}</p>
        </div>

        <ul className="space-y-2">
          {[
            { path: "/", label: "All Task" },
            { path: "todo", label: "To-do Task" },
            { path: "progress", label: "Inprogress Task" },
            { path: "done", label: "Completed Task" },
          ].map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block py-2 px-3 rounded-lg text-lg ${
                    isActive
                      ? "bg-gray-500 text-white"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          onClick={hlogout}
          className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 w-full md:w-5/6">
        <button
          className="md:hidden p-2 text-xl"
          onClick={() => setSidebarOpen(true)}
        >
          <FiMenu />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 p-2 bg-gray-300 rounded-full"
        >
          {darkMode ? "🌙" : "🌞"}
        </button>

        <Outlet />
      </div>
    </div>
  );
};

export default ParentLayout;
