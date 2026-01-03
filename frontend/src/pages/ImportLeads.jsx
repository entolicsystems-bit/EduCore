import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import "./ImportLeads.css";
import uploadImage from "/uploadFile.png";

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
      <div className="import-page">
        {/* HEADER */}
        <div className="import-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
     
      {/* import-page */}
      <div className="flex flex-col  items-center h-full w-full bg-[#f3f4f6]">
      <div className="flex flex-col items-center w-full h-full bg-[#f3f4f6]">

        {/* HEADER */}
        <div className="w-full px-12 mt-2">
          <button className="back-btn" onClick={() => navigate(-1)}>

            <i class="ri-arrow-left-line text-2xl"></i>
          </button>
        </div>

        {/* CARD CONTAINER */}

        <div className="import-card">
          
          {/* STATE 1: UPLOAD DIV */}
          {!summary ? (
            <div className="upload-box">
        {/* import-card */}
        <div className="flex justify-center items-center bg-white w-[90%] h-96 rounded-2xl shadow-md">
          {/* STATE 1: UPLOAD DIV */}
          {!summary ? (
            // upload-box
            <div className="">
              <input
                type="file"
                id="csvInput"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              
              <div className="upload-content">
                <div className="icon"></div>
                <h3>Drag & drop CSV file here</h3>
                <p>or <span className="browse-link" onClick={() => document.getElementById('csvInput').click()}>Browse files</span></p>
              </div>
            </div>
          ) : (

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

            /* STATE 2: IMPORT SUMMARY DIV (Separate Box) */
            <div className="import-summary-container">
              <div className="summary-header">
                <h3>Import Summary</h3>
              </div>

              
             <div className="summary-list">


              <div className="summary-list">
                <div className="summary-row">
                  <span className="label">Total Records:</span>
                  <span className="value total">{summary.total}</span>
                </div>

                <div className="summary-row">

                  <span className="label">Successfully Imported:</span>

                  <span className="label text-[#10b981]">
                    Successfully Imported:
                  </span>
                  <span className="value success">{summary.success}</span>
                </div>

                <div className="summary-row">

                  <span className="label">Failed:</span>
                  <span className="label text-[#ef4444]">Failed:</span>
                  <span className="value failed">{summary.failed}</span>
                </div>
              </div>


              <div className="summary-actions">
                <button className="btn-download">
                  Download error report
                </button>
                <button
                  className="btn-done"
                  onClick={() => navigate(-1)}
                >

              <div className="summary-actions flex justify-between pt-6">
                <button className="btn-download bg-gray-300 px-2 rounded-md text-gray-600 font-medium cursor-pointer hover:bg-gray-400">
                  Download error report
                </button>
                <button className="btn-done" onClick={() => navigate(-1)}>
            <i className="ri-arrow-left-line text-2xl"></i>
          </button>
        </div>

        {/* CARD */}
        <div className="flex flex-col gap-4 w-full px-4 sm:px-0 items-center">
          {/* UPLOAD STATE (ALWAYS VISIBLE) */}
          <div className="text-center flex flex-col gap-6 bg-white w-[90%] rounded-2xl shadow-md p-8">
            <input
              type="file"
              id="csvInput"
              accept=".csv"
              onChange={handleFileChange}
              hidden
            />

            <div
              className="cursor-pointer flex flex-col justify-center items-center py-6 hover:border-2 hover:bg-[#eff6ff] hover:border-[#3b82f6] rounded-lg"
              onClick={() => document.getElementById("csvInput").click()}
            >
              <img src={uploadImage} alt="" className="w-28 h-28" />
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

          {/* SUMMARY STATE (CONDITIONAL, DOES NOT REMOVE UPLOAD) */}
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

export default ImportLeads;
