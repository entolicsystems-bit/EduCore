import DocumentTable from "../components/DocumentTable";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

const DocumentsPage = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f2f6ff] p-8">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Documents – Admission #ADM-2025-0012
          </h2>
          <p className="text-sm text-gray-500">
            Manage and verify all required admission documents
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <DocumentTable />

          {/* FOOTER ACTIONS */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => navigate("/admissions")}
              className="border px-6 py-2 rounded-md text-gray-600"
            >
              Back
            </button>

            <button
              onClick={() => navigate("/student-page")}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DocumentsPage;
