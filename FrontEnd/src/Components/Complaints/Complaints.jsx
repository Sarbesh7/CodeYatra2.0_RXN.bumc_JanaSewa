import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { complaintsAPI } from "../../services/api";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import "../../Styles/ComplaintForm.css";

export default function ComplaintForm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    office_type: "",
    subject: "",
    description: ""
  });
  const [file, setFile] = useState(null);

  // Office names with translations
  const offices = [
    { value: "District Administration Office", label: t.districtAdminOffice },
    { value: "Land Revenue Office", label: t.landRevenueOffice },
    { value: "Municipality Office", label: t.municipalityOffice },
    { value: "Transport Management Office", label: t.transportOffice },
    { value: "Passport Office", label: t.passportOffice },
    { value: "Tax Office", label: t.taxOffice },
    { value: "Ward Office", label: t.wardOffice },
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
      setError(t.loginToComplain);
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    // Validate
    if (!form.office_type || !form.subject || !form.description) {
      setError(t.fillAllFields);
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.complaintSubmitted}</h1>
            <p className="text-gray-600 mb-6">
              {t.complaintSuccess}
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t.backToHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.fileComplaint}</h1>
        <p className="text-gray-600 mb-8">{t.reportIssues}</p>

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
                {t.selectOffice} <span className="text-red-500">*</span>
              </label>
              <select
                name="office_type"
                value={form.office_type}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">{t.chooseOffice}</option>
                {offices.map((item, index) => (
                  <option key={index} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                {t.subject} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder={t.subjectPlaceholder}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                {t.complaintDescription} <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder={t.descriptionPlaceholder}
                rows={5}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                {t.uploadEvidence}
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">{t.attachSupport}</p>
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
                  {t.submitting}
                </span>
              ) : (
                t.submitComplaint
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}