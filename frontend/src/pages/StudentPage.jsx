import StudentDocument from "../components/StudentDocument";
import StudentInfo from "../components/StudentInfo";
import DashboardLayout from "../layouts/DashboardLayout";

const StudentPage = () => {
  return (
    <DashboardLayout>
      <div className="w-full py-10 ps-8 pe-20 bg-white ">
        <div className="gap-5 rounded-lg grid grid-cols-3">
          <div className="h-20 col-span-3 bg-white rounded-lg flex items-center gap-4 border border-gray-300 ">
            <div className="h-16 w-16 rounded-full bg-gray-300 ms-8"></div>
            <div>
              <div className="flex gap-10">
                <h1 className="text-lg font-semibold">Student1</h1>
                <span className="text-[#10B981] text-xs bg-green-100 border border-green-200 px-3 py-1 font-bold rounded-full">
                  Enrolled
                </span>
              </div>
              <div className=" flex gap-8 text-sm pt-1 text-gray-500">
                <div>
                  <p>
                    <i class="ri-id-card-line pe-2 text-lg"></i>ID:12345
                  </p>
                </div>
                <div>
                  <p>
                    <i class="ri-user-2-line pe-2 text-lg"></i>Grade 12 -
                    Science A
                  </p>
                </div>
                <div>
                  <p>
                    <i class="ri-bank-card-2-fill pe-2 text-lg"></i>Admitted:
                    Aug 14, 2023
                  </p>
                </div>
              </div>
            </div>
            <div className="items-center ms-auto me-8 flex gap-4">
              <button className="border border-gray-300 rounded-lg flex gap-2 px-4 py-2 items-center">
                <i className="ri-pencil-fill text-lg"></i>Edit Profile
              </button>
            </div>
          </div>
          <div className="col-span-2 gap-2">
            <StudentInfo />
          </div>
          <div className=" gap-2">
            <StudentDocument />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentPage;
