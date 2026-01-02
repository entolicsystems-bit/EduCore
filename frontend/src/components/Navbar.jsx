import React from "react";

const Navbar = () => {
  return (
    <div className="flex w-full justify-between items-center border-b-2 border-gray-200 bg-white h-20 px-8 py-5">
      <h2 className="text-[#1d6bff] text-3xl font-bold">EntoCrm</h2>

      <div className="flex gap-5 items-center">
        <div className="w-8 h-8 flex justify-center items-center rounded-full bg-[#82c0eb] cursor-pointer">
          <i className="ri-notification-4-line text-2xl"></i>
        </div>

        <div className="flex gap-2 items-center">
          <div className="w-9 h-9 bg-[#0d99ff] rounded-full flex justify-center items-center text-white font-bold">
            A
          </div>
          <h3 className="font-bold text-lg">Admin User</h3>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
