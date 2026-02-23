import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { complaintsAPI } from "../../services/api";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import "../../Styles/ComplaintForm.css";

export default function ComplaintForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    office_type: "",
    subject: "",
    description: ""
  });
  const [file, setFile] = useState(null);

  const offices = [
    "District Administration Office",
    "Land Revenue Office",
    "Municipality Office",
    "Transport Management Office",
    "Passport Office",
    "Tax Office",
    "Ward Office"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check authentication
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Please login to submit a complaint");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    // Validate
    if (!form.office_type || !form.subject || !form.description) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await complaintsAPI.create(form);
      
      // Upload file if provided
      if (file && response.id) {
        await complaintsAPI.uploadAttachment(response.id, file);
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white shadow-lg rounded-xl p-8 text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Complaint Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Your complaint has been registered. We will review it and get back to you soon.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">File a Complaint</h1>
        <p className="text-gray-600 mb-8">Report issues with government services</p>

        <div className="bg-white shadow-lg rounded-xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Office */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Select Office <span className="text-red-500">*</span>
              </label>
              <select
                name="office_type"
                value={form.office_type}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">Choose office</option>
                {offices.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Brief subject of your complaint"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Complaint Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your complaint in detail..."
                rows={5}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Upload Evidence (Optional)
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Attach any supporting documents or images</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Complaint"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}