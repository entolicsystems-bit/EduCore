import React from "react";
import { Icon } from "@iconify-icon/react";

const StudentDocument = () => {
  return (
    <div className="h-[calc(82vh-120px)] no-scrollbar overflow-y-auto rounded-lg flex flex-col gap-4">
      {/* -----Documents----- */}
      <div className="rounded-lg bg-white border border-gray-300">
        <div className="bg-gray-100 text-sm px-3 py-3 rounded-t-lg flex justify-between">
          <h2 className="font-bold">Documents</h2>
        </div>
        <div className="py-4 px-4 border-y border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex gap-5">
              <div className="icon p-3 flex justify-center items-center bg-red-100 rounded-md">
                <Icon
                  icon="fa6-regular:file-pdf"
                  className="w-5 h-5 text-[#ff1212]"
                />
              </div>
              <div className="">
                <p className="text-md font-bold">Previous Transcripts</p>
                <p className="text-[#10B981] text-sm">
                  <i className="ri-verified-badge-fill"></i>Verified
                </p>
              </div>
            </div>
            <div>
              <button className="text-[#0D99FF]">View</button>
            </div>
          </div>
        </div>

        {/* ------- */}
        <div className="py-4 px-4 border-y border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex gap-5">
              <div className="icon p-3 flex justify-center items-center bg-blue-100 rounded-md">
                <Icon icon="bi:image" className="w-5 h-5 text-[#0D99FF]" />
              </div>
              <div className="">
                <p className="text-md font-bold">Student Photo</p>
                <p className="text-gray-500 text-sm">
                  <i className="ri-time-fill"></i> Uploaded
                </p>
              </div>
            </div>
            <div>
              <button className="text-[#0D99FF]">View</button>
            </div>
          </div>
        </div>
      </div>

      {/*-----Recent Activity-----*/}
      <div className="rounded-lg bg-white border border-gray-300">
        <div className="bg-gray-100 text-sm px-3 py-3 rounded-t-lg flex justify-between">
          <h2 className="font-bold">Recent Activity</h2>
        </div>
        <div className="py-4 px-4">
          {/* ---Offer Accepted---- */}
          <div className="flex gap-4">
            {/* Left timeline */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-[] rounded-full border-2 border-white shadow"></div>
              <div className="w-px flex-1 bg-gray-300"></div>
            </div>

            {/* Right content */}
            <div className="pb-6">
              <h1 className="font-semibold text-sm text-gray-900">
                Offer Accepted
              </h1>
              <p className="text-sm text-gray-500">
                Student accepted the admission offer.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Aug 13, 2023 · 10:42 AM
              </p>
            </div>
          </div>

          {/* ----- Status Change ------ */}
          <div className="flex gap-4">
            {/* Left timeline */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-[#0D99FF] rounded-full border-2 border-white shadow"></div>
              <div className="w-px flex-1 bg-gray-300"></div>
            </div>

            {/* Right content */}
            <div className="pb-6">
              <h1 className="font-semibold text-sm text-gray-900">
                Status Changed
              </h1>
              <p className="text-sm text-gray-500">
                Status update to <span className="font-bold">Enrolled</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Aug 13, 2023 · 10:40 AM
              </p>
            </div>
          </div>

          {/* ------- Document Uploaded */}
          <div className="flex gap-4">
            {/* Left timeline */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-[#F59E0B] rounded-full border-2 border-white shadow"></div>
              <div className="w-px flex-1 bg-gray-300"></div>
            </div>

            {/* Right content */}
            <div className="pb-6">
              <h1 className="font-semibold text-sm text-gray-900">
                Document Uploaded
              </h1>
              <p className="text-sm text-gray-500">
                New transcripts uploaded by Admin
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Aug 11, 2023 · 02:15 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*-----Interview-----*/}
      <div className="rounded-lg bg-white border border-gray-300">
        <div className="bg-gray-100 text-sm px-3 py-3 rounded-t-lg flex justify-between">
          <h2 className="font-bold">Schedule Interview</h2>
        </div>
        <div className="py-4 px-4 flex flex-col gap-3">
          {/* Date */}
          <div className="relative">
            <input
              type="text"
              placeholder="Select Date"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => e.target.value === "" && (e.target.type = "text")}
              className="w-full px-4 py-3 pr-10 text-sm border border-gray-300 rounded-xl"
            />
            <i className="ri-calendar-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>

          {/* Time */}
          <div className="relative">
            <input
              type="text"
              placeholder="Select Time"
              onFocus={(e) => (e.target.type = "time")}
              onBlur={(e) => e.target.value === "" && (e.target.type = "text")}
              className="w-full px-4 py-3 pr-10 text-sm border border-gray-300 rounded-xl"
            />
            <i className="ri-time-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>

          {/* Mode */}
          <div>
            <h1 className="font-bold">Interview Mode</h1>
            <div className="flex gap-2 ps-4 text-gray-400">
              <input type="radio" name="mode" />
              <label htmlFor="online">Online</label>
              <input type="radio" name="mode" />
              <label htmlFor="offline">Offline</label>
            </div>
          </div>

          {/* Note */}
          <div>
            <h1 className="font-bold">Notes</h1>
            <textarea
              name="note"
              className="border border-gray-200 rounded-2xl px-2 py-3 w-full placeholder:"
              rows="4"
              placeholder={`If offline enter the address
If online enter the link`}
              //   placeholder={`If offline enter the address ${(
              //     <br />
              //   )} If online enter the link`}
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button className="px-4 font-bold text-white py-2 rounded-lg bg-[#F59E0B]">
              Cancel
            </button>
            <button className="px-4 font-bold text-white py-2 rounded-lg bg-[#0D99FF]">
              Schedule
            </button>
          </div>
        </div>
      </div>

      {/* -----Offer Latter----- */}
      <div className="rounded-lg bg-white border border-gray-300">
        <div className="bg-gray-100 text-sm px-3 py-3 rounded-t-lg flex justify-between">
          <h2 className="font-bold">Documents</h2>
          <p className="text-[#10B981] bg-green-100 font-bold p-1 text-xs border rounded-md border-green-400">
            ACCEPTED
          </p>
        </div>
        <div className="py-4 px-4 border-y border-gray-300">
          <div className="bg-blue-50 rounded-lg gap-3 flex px-2 py-3 items-center">
            <div className="p-2 rounded-lg text-lg w-10 h-10 flex justify-center items-center bg-white ">
              <Icon icon="tabler:file-filled" className="  text-[#0D99FF]" />
            </div>
            <div>
              <h2 className="font-bold text-sm">Offer_Letter_Final.pdf</h2>
              <p className="text-xs text-gray-400">Generated on Aug 12, 2023</p>
            </div>
          </div>
          <button className="bg-[#0D99FF] w-full rounded-md py-2 mt-5 flex gap-2 justify-center items-center text-white">
            <Icon icon="fa6-solid:download" className="w-3.5 h-3.5" />
            Download Letter
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDocument;
