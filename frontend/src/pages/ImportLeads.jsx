import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import "./ImportLeads.css";
import uploadImage from "/uploadFile.png";
import { importLeadsCSV } from "../services/leadService";

const ImportLeads = () => {
  const navigate = useNavigate();

  // UI States
  const [fileName, setFileName] = useState("");
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // validate & upload CSV
  const processFile = async (file) => {
    if (!file) return;

    // Allow only CSV files
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file.");
      return;
    }

    setFileName(file.name);
    setLoading(true);

    try {
      const res = await importLeadsCSV(file);

      // Backend sends import summary
      setSummary({
        total: res.data.totalRows || 0,
        success: res.data.imported || 0,
        failed: res.data.failed || 0,
      });

      alert("CSV imported successfully");
    } catch (error) {
      console.error("CSV Upload Error:", error);
      alert("Failed to import CSV file");
    } finally {
      setLoading(false);
    }
  };

  // input browse
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  // drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center w-full h-full bg-[#f3f4f6]">
        {/* HEADER */}
        <div className="w-full px-12 mt-2">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <i className="ri-arrow-left-line text-2xl"></i>
          </button>
        </div>

        {/* CARD */}
        <div className="flex flex-col gap-4 w-full px-4 sm:px-0 items-center">
          {/* UPLOAD CARD */}
          <div className="text-center flex flex-col gap-6 bg-white w-[90%] rounded-2xl shadow-md p-8">
            <input
              type="file"
              id="csvInput"
              accept=".csv"
              hidden
              onChange={handleFileChange}
            />

            <div
              className={`cursor-pointer flex flex-col justify-center items-center py-6 rounded-lg transition-all
                ${
                  isDragging
                    ? "border-2 border-blue-500 bg-blue-50"
                    : "hover:border-2 hover:bg-[#eff6ff] hover:border-[#3b82f6]"
                }`}
              onClick={() => document.getElementById("csvInput").click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <img src={uploadImage} alt="Upload CSV" className="w-28 h-28" />

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

              {loading && <p className="text-blue-500 mt-2">Uploading...</p>}
            </div>
          </div>

          {/* SUMMARY */}
          {summary && (
            <div className="flex flex-col gap-4 bg-white w-[90%] rounded-2xl shadow-md p-8">
              <h3 className="text-xl font-semibold mb-4">Import Summary</h3>

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

              <div className="flex justify-end pt-6">
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
