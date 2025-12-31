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
      <div className="import-page">
        {/* HEADER */}
        <div className="import-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← 
          </button>
        </div>

        {/* CARD CONTAINER */}
        <div className="import-card">
          
          {/* STATE 1: UPLOAD DIV */}
          {!summary ? (
            <div className="upload-box">
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
            
            /* STATE 2: IMPORT SUMMARY DIV (Separate Box) */
            <div className="import-summary-container">
              <div className="summary-header">
                <h3>Import Summary</h3>
              </div>
              
             <div className="summary-list">
                <div className="summary-row">
                  <span className="label">Total Records:</span>
                  <span className="value total">{summary.total}</span>
                </div>

                <div className="summary-row">
                  <span className="label">Successfully Imported:</span>
                  <span className="value success">{summary.success}</span>
                </div>

                <div className="summary-row">
                  <span className="label">Failed:</span>
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