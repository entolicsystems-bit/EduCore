import React from "react";
import Dashboard from "../layouts/DashboardLayout";

export const AdmissionPipeline = () => {
  return (
    <Dashboard>
      <div className="w-full h-full ps-12 py-10">
        <div className="pb-8">
          <h1 className="text-xl pb-2 font-bold">Admission Pipeline</h1>
          <p className="text-gray-600">
            Track and manage applications through the admission process
          </p>
        </div>
        <div className="flex gap-5 overflow-x-auto whitespace-nowrap no-scrollbar">
          {/* applied */}
          <div className="bg-[#F7F7F7] min-w-80 shrink-0 rounded-xl px-3 py-2 border border-gray-300 h-[calc(85vh-120px)] no-scrollbar overflow-y-auto pr-2">
            <div className="flex items-center gap-2 mt-4 mb-4 ps-5">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <h1 className="font-bold">Applied 2</h1>
            </div>
            {/* Student Card1 */}
            <div className=" border border-gray-300 bg-white rounded-xl px-4 py-3 mb-3">
              <div className="flex justify-between border-b border-gray-300 py-3 pt-5 px-3">
                <div>
                  <h1 className="text-lg font-bold ">Student1</h1>
                  <p className="text-gray-800">Grade 5</p>
                </div>
                <div>
                  <i className="ri-more-2-fill"></i>
                </div>
              </div>
              <div className="pt-5">
                <p className="">
                  <i className="ri-phone-fill text-blue-500"></i> +91 9876543210
                </p>
                <div className="px-5">
                  <p className="text-gray-500 mb-2">Updated 2 hours ago</p>
                  <span className="text-sm px-4 py-1 bg-blue-100 font-bold rounded-full text-blue-500">
                    New
                  </span>
                </div>
              </div>
            </div>
            {/* Student Card2 */}
            <div className=" border border-gray-300 bg-white rounded-xl px-4 py-3 mb-3">
              <div className="flex justify-between border-b border-gray-300 py-3 pt-5 px-3">
                <div>
                  <h1 className="text-lg font-bold ">Student1</h1>
                  <p className="text-gray-800">Grade 5</p>
                </div>
                <div>
                  <i className="ri-more-2-fill"></i>
                </div>
              </div>
              <div className="pt-5">
                <p className="">
                  <i className="ri-phone-fill text-blue-500"></i> +91 9876543210
                </p>
                <div className="px-5">
                  <p className="text-gray-500 mb-2">Updated 2 hours ago</p>
                  <span className="text-sm px-4 py-1 bg-blue-100 font-bold rounded-full text-blue-500">
                    New
                  </span>
                </div>
              </div>
            </div>
            {/* Student Card3 */}
            <div className=" border border-gray-300 bg-white rounded-xl px-4 py-3 mb-3">
              <div className="flex justify-between border-b border-gray-300 py-3 pt-5 px-3">
                <div>
                  <h1 className="text-lg font-bold ">Student1</h1>
                  <p className="text-gray-800">Grade 5</p>
                </div>
                <div>
                  <i className="ri-more-2-fill"></i>
                </div>
              </div>
              <div className="pt-5">
                <p className="">
                  <i className="ri-phone-fill text-blue-500"></i> +91 9876543210
                </p>
                <div className="px-5">
                  <p className="text-gray-500 mb-2">Updated 2 hours ago</p>
                  <span className="text-sm px-4 py-1 bg-blue-100 font-bold rounded-full text-blue-500">
                    New
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* under review */}
          <div className="bg-[#F7F7F7] min-w-80 shrink-0 rounded-xl px-3 py-2 border border-gray-300 h-[calc(85vh-120px)] no-scrollbar overflow-y-auto pr-2">
            <div className="flex items-center gap-2 mt-4 mb-4 ps-5">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <h1 className="font-bold ">Under Review 5</h1>
            </div>
            {/* Student Card1 */}
            <div className=" border border-gray-300 bg-white rounded-xl px-4 py-3 mb-3">
              <div className="flex justify-between border-b border-gray-300 py-3 pt-5 px-3">
                <div>
                  <h1 className="text-lg font-bold ">Student1</h1>
                  <p className="text-gray-800">Grade 5</p>
                </div>
                <div>
                  <i className="ri-more-2-fill"></i>
                </div>
              </div>
              <div className="pt-5">
                <p className="">
                  <i className="ri-phone-fill text-blue-500"></i> +91 9876543210
                </p>
                <div className="px-5">
                  <p className="text-gray-500 mb-2">Updated 2 hours ago</p>
                  <span className="text-sm px-4 py-1 bg-orange-100 font-bold rounded-full text-orange-400">
                    In Review
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* document verification */}
          <div className="bg-[#F7F7F7] min-w-80 shrink-0 rounded-xl px-3 py-2 border border-gray-300 h-[calc(85vh-120px)] no-scrollbar overflow-y-auto pr-2">
            <div className="flex items-center gap-2 mt-4 mb-4 px-5">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <h1 className="font-bold ">Document Verification 6</h1>
            </div>
            {/* Student Card1 */}
            <div className=" border border-gray-300 bg-white rounded-xl px-4 py-3 mb-3">
              <div className="flex justify-between border-b border-gray-300 py-3 pt-5 px-3">
                <div>
                  <h1 className="text-lg font-bold ">Student1</h1>
                  <p className="text-gray-800">Grade 5</p>
                </div>
                <div>
                  <i className="ri-more-2-fill"></i>
                </div>
              </div>
              <div className="pt-5">
                <p className="">
                  <i className="ri-phone-fill text-blue-500"></i> +91 9876543210
                </p>
                <div className="px-5">
                  <p className="text-gray-500 mb-2">Updated 2 hours ago</p>
                  <span className="text-sm px-4 py-1 bg-purple-200 font-bold rounded-full text-purple-500">
                    verifying
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* interview */}
          <div className="bg-[#F7F7F7] min-w-80 shrink-0 rounded-xl px-3 py-2 border border-gray-300 h-[calc(85vh-120px)] no-scrollbar overflow-y-auto pr-2">
            <div className="flex items-center gap-2 mt-4 mb-4 ps-5">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <h1 className="font-bold ">Interview 4</h1>
            </div>
            {/* Student Card1 */}
            <div className=" border border-gray-300 bg-white rounded-xl px-4 py-3 mb-3">
              <div className="flex justify-between border-b border-gray-300 py-3 pt-5 px-3">
                <div>
                  <h1 className="text-lg font-bold ">Student1</h1>
                  <p className="text-gray-800">Grade 5</p>
                </div>
                <div>
                  <i className="ri-more-2-fill"></i>
                </div>
              </div>
              <div className="pt-5">
                <p className="">
                  <i className="ri-phone-fill text-blue-500"></i> +91 9876543210
                </p>
                <div className="px-5">
                  <p className="text-gray-500 mb-2">Updated 2 hours ago</p>
                  <span className="text-sm px-4 py-1 bg-blue-100 font-bold rounded-full text-blue-500">
                    Scheduled
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* approved */}
          <div className="bg-[#F7F7F7] min-w-80 shrink-0 rounded-xl px-3 py-2 border border-gray-300 h-[calc(85vh-120px)] no-scrollbar overflow-y-auto pr-2">
            <div className="flex items-center gap-2 mt-4 mb-4 ps-5">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <h1 className="font-bold ">Approved 7</h1>
            </div>
            {/* Student Card1 */}
            <div className=" border border-gray-300 bg-white rounded-xl px-4 py-3 mb-3">
              <div className="flex justify-between border-b border-gray-300 py-3 pt-5 px-3">
                <div>
                  <h1 className="text-lg font-bold ">Student1</h1>
                  <p className="text-gray-800">Grade 5</p>
                </div>
                <div>
                  <i className="ri-more-2-fill"></i>
                </div>
              </div>
              <div className="pt-5">
                <p className="">
                  <i className="ri-phone-fill text-blue-500"></i> +91 9876543210
                </p>
                <div className="px-5">
                  <p className="text-gray-500 mb-2">Updated 2 hours ago</p>
                  <span className="text-sm px-4 py-1 bg-green-100 font-bold rounded-full text-green-500">
                    Approved
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* rejected */}
          <div className="bg-[#F7F7F7] min-w-80 shrink-0 rounded-xl px-3 py-2 border border-gray-300 h-[calc(85vh-120px)] no-scrollbar overflow-y-auto pr-2">
            <div className="flex items-center gap-2 mt-4 mb-4 ps-5">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <h1 className="font-bold ">Rejected 2</h1>
            </div>
            {/* Student Card1 */}
            <div className=" border border-gray-300 bg-white rounded-xl px-4 py-3 mb-3">
              <div className="flex justify-between border-b border-gray-300 py-3 pt-5 px-3">
                <div>
                  <h1 className="text-lg font-bold ">Student1</h1>
                  <p className="text-gray-800">Grade 5</p>
                </div>
                <div>
                  <i className="ri-more-2-fill"></i>
                </div>
              </div>
              <div className="pt-5">
                <p className="">
                  <i className="ri-phone-fill text-blue-500"></i> +91 9876543210
                </p>
                <div className="px-5">
                  <p className="text-gray-500 mb-2">Updated 2 hours ago</p>
                  <span className="text-sm px-4 py-1 bg-red-100 font-bold rounded-full text-red-500">
                    Rejected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
};
