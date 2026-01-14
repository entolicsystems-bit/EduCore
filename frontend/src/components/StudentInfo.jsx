import React from "react";

const StudentInfo = () => {
  return (
    <div className="rounded-lg h-[calc(82vh-120px)] no-scrollbar overflow-y-auto pr-2 flex flex-col gap-4">
      {/* ------------Personal Information---------------- */}
      <div className=" rounded-lg bg-white  border border-gray-300">
        <div className="bg-gray-100 text-sm px-3 py-3 rounded-t-lg flex justify-between">
          <h2 className="font-bold">Personal Information</h2>
          <button className="text-[#0D99FF]">Edit</button>
        </div>
        <div className="py-4 px-4 border-t border-gray-300">
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xs text-gray-500">Full Name</h2>
                <h1>Student Name</h1>
              </div>
              <div>
                <h2 className="text-xs text-gray-500">Gender</h2>
                <h1>Male</h1>
              </div>
              <div>
                <h2 className="text-xs text-gray-500">Nationalty</h2>
                <h1>
                  <span className="fi fi-in text-sm"></span> India
                </h1>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xs text-gray-500">Date of Birth</h2>
                <h1>2 October 2004</h1>
              </div>
              <div>
                <h2 className="text-xs text-gray-500">Blood Group</h2>
                <h1>
                  O Negative (O<sup>-</sup>)
                </h1>
              </div>
              <div>
                <h2 className="text-xs text-gray-500">Primary Language</h2>
                <h1>Kannada</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --------Guardian Information------------ */}
      <div className="rounded-lg bg-white  border border-gray-300">
        <div className="bg-gray-100 text-sm px-3 py-3 rounded-t-lg flex justify-between">
          <h2 className="font-bold">Guardian Information</h2>
          <button className="text-[#0D99FF]">Edit</button>
        </div>
        <div className="py-4 px-4 border-t border-gray-300">
          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xs text-gray-500">Guardian Name</h2>
                <h1>Guardian Name</h1>
              </div>
              <div>
                <h2 className="text-xs text-gray-500">Phone Number</h2>
                <h1>
                  <i className="ri-phone-fill text-gray-600"></i> +91 9526418426
                </h1>
              </div>
              <div>
                <h2 className="text-xs text-gray-500">Occupation</h2>
                <h1>Farmer</h1>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xs text-gray-500">Relation</h2>
                <h1>Father</h1>
              </div>
              <div>
                <h2 className="text-xs text-gray-500">Email</h2>
                <h1>
                  <i className="ri-mail-fill text-gray-500"></i> demo@gmail.com
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*-------------Academic History-------------- */}
      <div className="rounded-lg bg-white  border border-gray-300">
        <div className="bg-gray-100 text-sm px-3 py-3 rounded-t-lg flex justify-between">
          <h2 className="font-bold">Academic History</h2>
        </div>
        <div className="border-t border-gray-300">
          <table>
            <tr className="bg-gray-50 text-gray-500">
              <th className="text-left">Year</th>
              <th className="text-left">School Name</th>
              <th>Board</th>
              <th className="text-right">Grade/%</th>
            </tr>
            <tr>
              <td>2022-2023</td>
              <td>Zp School Pune</td>
              <td className="text-center text-gray-500">State Board</td>
              <td className="text-right font-bold">94.5%</td>
            </tr>
            <tr>
              <td>2021-2022</td>
              <td>Zp Scholl Pune</td>
              <td className="text-center text-gray-500">State Board</td>
              <td className="text-right font-bold">92.0%</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;
