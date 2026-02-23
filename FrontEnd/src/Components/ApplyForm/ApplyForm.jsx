import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { servicesAPI, applicationsAPI } from "../../services/api";
import { FaFileAlt, FaCheckCircle, FaSpinner } from "react-icons/fa";

export default function ApplyForm() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  
  const [form, setForm] = useState({
    applicant_name: "",
    applicant_address: "",
    district: "",
    municipality: "",
    ward_no: "",
    phone: "",
    form_data: {},
    remarks: ""
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await servicesAPI.getById(serviceId);
        setService(data);
      } catch (err) {
        setError("Failed to load service details");
      } finally {
        setLoading(false);
      }
    };
    
    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Please login to submit an application");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    // Validate required fields
    if (!form.applicant_name || !form.district || !form.municipality) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const applicationData = {
        service_id: parseInt(serviceId),
        applicant_name: form.applicant_name,
        applicant_address: form.applicant_address,
        district: form.district,
        municipality: form.municipality,
        ward_no: form.ward_no ? parseInt(form.ward_no) : null,
        phone: form.phone,
        form_data: form.form_data,
        remarks: form.remarks
      };

      const response = await applicationsAPI.create(applicationData);
      setSerialNumber(response.serial_number);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white shadow-lg rounded-xl p-8 text-center">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h1>
            <p className="text-gray-600 mb-4">Your application has been successfully submitted.</p>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Your Serial Number:</p>
              <p className="text-2xl font-bold text-blue-700">{serialNumber}</p>
              <p className="text-xs text-gray-500 mt-2">Save this number to track your application</p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/track-Application")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Track Application
              </button>
              <button
                onClick={() => navigate("/services")}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back to Services
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Service Info Header */}
        {service && (
          <div className="bg-white shadow rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaFileAlt className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{service.title}</h1>
                <p className="text-gray-600">{service.description}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-gray-500">Fee: Rs. {service.fee}</span>
                  <span className="text-gray-500">Processing: ~{service.estimated_days} days</span>
                </div>
              </div>
            </div>

            {/* Required Documents */}
            {service.required_documents?.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold text-gray-700 mb-2">Required Documents:</h3>
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {service.required_documents.map((doc, idx) => (
                    <li key={idx}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Application Form */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-6">Application Form</h2>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Applicant Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="applicant_name"
                  value={form.applicant_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="98XXXXXXXX"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="e.g., Kathmandu"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Municipality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="municipality"
                  value={form.municipality}
                  onChange={handleChange}
                  placeholder="e.g., Kathmandu Metropolitan"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Ward No.</label>
                <input
                  type="number"
                  name="ward_no"
                  value={form.ward_no}
                  onChange={handleChange}
                  placeholder="Ward number"
                  min="1"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="applicant_address"
                  value={form.applicant_address}
                  onChange={handleChange}
                  placeholder="Full address"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Additional Remarks */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Additional Remarks</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Any additional information..."
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
