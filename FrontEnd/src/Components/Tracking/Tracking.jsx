import React, { useState } from "react";
import "../../Styles/TrackApplication.css";
import { FaSearch, FaSpinner, FaCheckCircle, FaClock, FaTimesCircle, FaFileDownload } from "react-icons/fa";
import { applicationsAPI } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";

export default function TrackApplication() {
  const [serialNumber, setSerialNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serialNumber.trim()) return;
    
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      const data = await applicationsAPI.track(serialNumber.trim());
      setResult(data);
    } catch (err) {
      setError(err.message || "Application not found");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <FaCheckCircle className="text-green-500" />;
      case "Rejected":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Under Review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="track-container Container">
      <h1 className="track-title">{t.trackYourApplication}</h1>

      <div className="track-card">
        <form onSubmit={handleSubmit} className="track-form">
          <label className="track-label">{t.applicationSerialNumber}</label>
          <div className="input-group">
            <input
              type="text"
              placeholder={t.serialPlaceholder}
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="track-input"
              required
            />

            <button type="submit" className="track-button" disabled={loading}>
              {loading ? <FaSpinner className="animate-spin mr-1" /> : <FaSearch className="mr-1 text-sm"/>}
              {loading ? t.searching || "Searching..." : t.track}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{result.service_title}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(result.status)}`}>
                {getStatusIcon(result.status)}
                {result.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">{t.serialNumber || "Serial Number"}:</span>
                <p className="font-medium">{result.serial_number}</p>
              </div>
              <div>
                <span className="text-gray-500">{t.applicant || "Applicant"}:</span>
                <p className="font-medium">{result.applicant_name}</p>
              </div>
              <div>
                <span className="text-gray-500">{t.submitted || "Submitted"}:</span>
                <p className="font-medium">{new Date(result.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">{t.lastUpdated || "Last Updated"}:</span>
                <p className="font-medium">{new Date(result.updated_at).toLocaleDateString()}</p>
              </div>
            </div>

            {result.admin_remarks && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-600 text-sm">{t.remarks || "Remarks"}:</span>
                <p className="text-gray-800">{result.admin_remarks}</p>
              </div>
            )}

            {result.official_document_path && result.status === "Approved" && (
              <div className="mt-4">
                <a 
                  href={`http://localhost:5000${result.official_document_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <FaFileDownload />
                  {t.downloadDocument || "Download Official Document"}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
