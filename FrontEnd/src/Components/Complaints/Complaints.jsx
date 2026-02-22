import { useState } from "react";
import "../../Styles/ComplaintForm.css";

export default function ComplaintForm() {
  const [office, setOffice] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState(null);

  const offices = [
    "District Administration Office",
    "Land Revenue Office",
    "Municipality Office",
    "Transport Management Office"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      office,
      description,
      files
    };

    console.log(formData);
  };

  return (
    <div className="form-container">
        <div className="header-line">
      <h2>File a Complaint</h2>
        </div>

      <form className="complaint-card" onSubmit={handleSubmit}>
        
        {/* Select Office */}
        <div className="form-group">
          <label>Select Office</label>
          <select
            value={office}
            onChange={(e) => setOffice(e.target.value)}
            required
          >
            <option value="">Choose office</option>
            {offices.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Complaint Description</label>
          <textarea
            placeholder="Describe your complaint in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        {/* File Upload */}
        <div className="form-group">
          <label>Upload Evidence</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit Complaint
        </button>
      </form>
    </div>
  );
}