import React, { useState } from "react";
import "../../Styles/TrackApplication.css";
import { FaSearch } from "react-icons/fa";

export default function TrackApplication() {
  const [serialNumber, setSerialNumber] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tracking:", serialNumber);
    // Add API call here
  };

  return (
    <div className="track-container Container">
      <h1 className="track-title">Track Your Application</h1>

      <div className="track-card">
        <form onSubmit={handleSubmit} className="track-form">
          <label className="track-label">Application Serial Number</label>
          <div className="input-group">
            <input
              type="text"
              placeholder="e.g. JS-12345678"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="track-input"
              required
            />

            <button type="submit" className="track-button">
             <FaSearch  className="mr-1 text-sm"/>  Track
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}