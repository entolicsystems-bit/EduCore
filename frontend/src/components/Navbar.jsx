import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  //controls profile dropdown
  const [open, setOpen] = useState(false);

  // Reference for detecting outside clicks
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  //close dropdown when user clicks outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    //navbar container
    <div className="flex w-full justify-between items-center border-b border-gray-200 bg-white h-20 px-8">
      <h2 className="text-[#1d6bff] text-3xl font-bold">EntoCrm</h2>

      <div className="flex gap-6 items-center">
        {/* Notification icon*/}
        <div className="relative w-8 h-8 flex justify-center items-center rounded-full bg-[#b8dbf6] cursor-pointer">
          <span className="absolute top-0 right-0 bg-[#1d6bff] rounded-full h-2.5 w-2.5"></span>
          <i className="ri-notification-4-line text-2xl"></i>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 bg-[#0d99ff] rounded-full flex justify-center items-center text-white font-bold">
              AD
            </div>
            <h3 className="font-bold text-lg">Admin User</h3>
            <i
              className={`ri-arrow-down-s-line transition ${
                open ? "rotate-180" : ""
              }`}
            ></i>
          </button>
         
           {/* Dropdown menu */}
          {open && (
            <div className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
              <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-300 cursor-pointer">
                My Account
              </div>

              <ul className="py-2">
                <li
                  className="mx-2 px-3 py-2 text-sm hover:text-white rounded-md hover:bg-blue-500 cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </li>
                <li
                  className="mx-2 px-3 py-2 text-sm hover:text-white rounded-md hover:bg-blue-500 cursor-pointer"
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </li>

                <div className="my-2 border-t border-gray-200"></div>

                <li
                  className="mx-2 px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  Log out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
