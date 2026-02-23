import React, { useState } from "react";
import "../../Styles/TrackApplication.css";
import { FaSearch } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";

export default function TrackApplication() {
  const [serialNumber, setSerialNumber] = useState("");
  const { t } = useLanguage();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tracking:", serialNumber);
    // Add API call here
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

            <button type="submit" className="track-button">
             <FaSearch  className="mr-1 text-sm"/>  {t.track}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}