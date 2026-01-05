import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import "./ImportLeads.css";
import uploadImage from "./uploadFile.png";

const ImportLeads = () => {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [summary, setSummary] = useState(null);

  const processFile = (file) => {
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file.");
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").filter((row) => row.trim() !== "");
      const dataRows = rows.slice(1);

      let success = 0;
      let failed = 0;

      dataRows.forEach((row) => {
        const cols = row.split(",");
        if (cols.length >= 2 && cols[0].trim() && cols[1].trim()) {
          success++;
        } else {
          failed++;
        }
      });

      setSummary({
        total: dataRows.length,
        success,
        failed,
      });
    };

    reader.readAsText(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  return (
    <DashboardLayout>
      <div className="import-page bg-[#f3f4f6] min-h-screen">

        {/* HEADER */}
        <div className="w-full px-6 py-3">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <i className="ri-arrow-left-line text-2xl"></i>
          </button>
        </div>

        {/* CARD CONTAINER */}
        <div className="flex flex-col items-center gap-6">

          {/* UPLOAD CARD (ALWAYS VISIBLE) */}
          <div className="bg-white w-[90%] max-w-3xl rounded-2xl shadow-md p-8 text-center">
            <input
              type="file"
              id="csvInput"
              accept=".csv"
              onChange={handleFileChange}
              hidden
            />

            <div
              className="cursor-pointer flex flex-col items-center py-6 hover:border-2 hover:bg-[#eff6ff] hover:border-[#3b82f6] rounded-lg"
              onClick={() => document.getElementById("csvInput").click()}
            >
              <img src={uploadImage} alt="Upload" className="w-28 h-28" />

              <h3 className="pt-5 text-gray-400 text-lg">
                Drag & drop CSV file here
                <br />
                or Browse files
              </h3>

              {fileName && (
                <p className="pt-2 text-sm text-gray-500">
                  Selected file: <b>{fileName}</b>
                </p>
              )}
            </div>
          </div>

          {/* SUMMARY CARD (CONDITIONAL) */}
          {summary && (
            <div className="bg-white w-[90%] max-w-3xl rounded-2xl shadow-md p-8">
              <h3 className="text-xl font-semibold mb-4">
                Import Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Records:</span>
                  <span className="font-semibold">{summary.total}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Successfully Imported:</span>
                  <span className="font-semibold">{summary.success}</span>
                </div>

                <div className="flex justify-between text-red-500">
                  <span>Failed:</span>
                  <span className="font-semibold">{summary.failed}</span>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button className="bg-gray-300 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-400">
                  Download error report
                </button>

                <button
                  className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => navigate(-1)}
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ImportLeads;
