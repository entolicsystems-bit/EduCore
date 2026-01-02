import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import "./ImportLeads.css";

const ImportLeads = () => {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [summary, setSummary] = useState(null);

  const processFile = (file) => {
    if (!file) return;

    // Validate file type
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file.");
      return;
    }

    // FIX: Set the file name correctly here
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").filter((row) => row.trim() !== "");
      const dataRows = rows.slice(1); // Skip header

      let success = 0;
      let failed = 0;

      dataRows.forEach((row) => {
        const cols = row.split(",");
        // Check if row has data in the first two columns
        if (cols.length >= 2 && cols[0].trim() && cols[1].trim()) {
          success++;
        } else {
          failed++;
        }
      });

      // This triggers the UI to switch to the "Summary Div"
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
<<<<<<< HEAD
      <div className="import-page">
        {/* HEADER */}
        <div className="import-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← 
=======
      {/* import-page */}
      <div className="flex flex-col  items-center h-full w-full bg-[#f3f4f6]">
        {/* HEADER */}
        <div className="w-full px-12 pt-6">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <i class="ri-arrow-left-line text-2xl"></i>
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
          </button>
        </div>

        {/* CARD CONTAINER */}
<<<<<<< HEAD
        <div className="import-card">
          
          {/* STATE 1: UPLOAD DIV */}
          {!summary ? (
            <div className="upload-box">
=======
        {/* import-card */}
        <div className="flex justify-center items-center bg-white w-[90%] h-96 rounded-2xl shadow-md">
          {/* STATE 1: UPLOAD DIV */}
          {!summary ? (
            // upload-box
            <div className="">
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
              <input
                type="file"
                id="csvInput"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
<<<<<<< HEAD
              
              <div className="upload-content">
                <div className="icon"></div>
                <h3>Drag & drop CSV file here</h3>
                <p>or <span className="browse-link" onClick={() => document.getElementById('csvInput').click()}>Browse files</span></p>
              </div>
            </div>
          ) : (
            
=======

              <div
                className="text-center cursor-pointer w-100 py-5 hover:border-2 hover:bg-[#eff6ff] hover:border-[#3b82f6] rounded-lg "
                onClick={() => document.getElementById("csvInput").click()}
              >
                {/* <div className="icon"></div> */}
                <i className="ri-file-upload-line text-8xl text-[#0d99ff]"></i>
                <h3 className="pt-5 text-gray-400 text-lg">
                  Drag & drop CSV file here
                  <br />
                  or Browse files
                </h3>
              </div>
            </div>
          ) : (
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
            /* STATE 2: IMPORT SUMMARY DIV (Separate Box) */
            <div className="import-summary-container">
              <div className="summary-header">
                <h3>Import Summary</h3>
              </div>
<<<<<<< HEAD
              
             <div className="summary-list">
=======

              <div className="summary-list">
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
                <div className="summary-row">
                  <span className="label">Total Records:</span>
                  <span className="value total">{summary.total}</span>
                </div>

                <div className="summary-row">
<<<<<<< HEAD
                  <span className="label">Successfully Imported:</span>
=======
                  <span className="label text-[#10b981]">
                    Successfully Imported:
                  </span>
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
                  <span className="value success">{summary.success}</span>
                </div>

                <div className="summary-row">
<<<<<<< HEAD
                  <span className="label">Failed:</span>
=======
                  <span className="label text-[#ef4444]">Failed:</span>
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
                  <span className="value failed">{summary.failed}</span>
                </div>
              </div>

<<<<<<< HEAD
              <div className="summary-actions">
                <button className="btn-download">
                  Download error report
                </button>
                <button
                  className="btn-done"
                  onClick={() => navigate(-1)}
                >
=======
              <div className="summary-actions flex justify-between pt-6">
                <button className="btn-download bg-gray-300 px-2 rounded-md text-gray-600 font-medium cursor-pointer hover:bg-gray-400">
                  Download error report
                </button>
                <button className="btn-done" onClick={() => navigate(-1)}>
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
                  Done
                </button>
              </div>
            </div>
          )}
<<<<<<< HEAD
          
=======
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
        </div>
      </div>
    </DashboardLayout>
  );
};

<<<<<<< HEAD
export default ImportLeads;
=======
export default ImportLeads;
>>>>>>> 5aac09e3570f67aa3f52c483ad0569c079da4515
