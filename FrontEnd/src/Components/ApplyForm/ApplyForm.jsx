import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { servicesAPI, applicationsAPI } from "../../services/api";
import { FaFileAlt, FaCheckCircle, FaSpinner, FaInfoCircle, FaClipboardList, FaDownload, FaExternalLinkAlt, FaMapMarkerAlt } from "react-icons/fa";
import { HiDocumentCheck } from "react-icons/hi2";
import { useLanguage } from "../../context/LanguageContext";

export default function ApplyForm() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{t.applicationSubmitted}</h1>
            <p className="text-gray-600 mb-4">{t.applicationSuccess}</p>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">{t.yourSerialNumber}</p>
              <p className="text-2xl font-bold text-blue-700">{serialNumber}</p>
              <p className="text-xs text-gray-500 mt-2">{t.saveSerialNumber}</p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/track-Application")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t.trackApplication}
              </button>
              <button
                onClick={() => navigate("/services")}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t.backToServices}
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
                  <span className="text-gray-500">{t.feeLabel}: Rs. {service.fee}</span>
                  <span className="text-gray-500">{t.processing}: ~{service.estimated_days} {t.days}</span>
                </div>
              </div>
            </div>

            {/* Required Documents - Brand Themed Section */}
            {service.required_documents?.length > 0 && (
              <div className="mt-6 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: '#1b5AA7' }}></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full opacity-10 translate-y-1/2 -translate-x-1/2" style={{ backgroundColor: '#1b5AA7' }}></div>
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #1b5AA7 0%, #2d6fc4 100%)' }}>
                        <FaClipboardList className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{t.requiredDocuments}</h3>
                        <p className="text-sm font-medium" style={{ color: '#1b5AA7' }}>{t.bringDocuments}</p>
                      </div>
                    </div>
                    <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-full shadow" style={{ backgroundColor: '#1b5AA7' }}>
                      {service.required_documents.length} {t.documentsCount}
                    </span>
                  </div>

                  {/* Alert Banner */}
                  <div className="bg-white border border-blue-200 rounded-lg p-3 mb-4 flex items-start gap-2 shadow-sm">
                    <FaInfoCircle className="text-lg shrink-0 mt-0.5" style={{ color: '#1b5AA7' }} />
                    <p className="text-gray-700 text-sm">
                      <span className="font-semibold" style={{ color: '#1b5AA7' }}>{t.importantNote}</span> {t.documentsWarning}
                    </p>
                  </div>

                  {/* Document Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.required_documents.map((doc, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex items-start gap-3 group"
                      >
                        <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 shadow group-hover:scale-110 transition-transform" style={{ backgroundColor: '#1b5AA7' }}>
                          <HiDocumentCheck className="text-white text-lg" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 leading-tight">{doc}</p>
                          <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#e8f0fa', color: '#1b5AA7' }}>
                            {t.required}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer with Template Link */}
                  <div className="mt-4 pt-4 border-t border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle style={{ color: '#1b5AA7' }} />
                      <span>{t.keepDocumentsReady}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link 
                        to="/template-editor" 
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:shadow-lg hover:opacity-90"
                        style={{ backgroundColor: '#1b5AA7' }}
                      >
                        <FaDownload className="text-sm" />
                        {t.downloadTemplates}
                        <FaExternalLinkAlt className="text-xs opacity-70" />
                      </Link>
                      <Link 
                        to="/map" 
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg border-2"
                        style={{ borderColor: '#1b5AA7', color: '#1b5AA7', backgroundColor: 'white' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1b5AA7'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#1b5AA7'; }}
                      >
                        <FaMapMarkerAlt className="text-sm" />
                        {t.nearestOffice}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Application Form */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-6">{t.applicationForm}</h2>

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
                  {t.fullName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="applicant_name"
                  value={form.applicant_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  onFocus={(e) => { e.target.style.borderColor = '#1b5AA7'; e.target.style.boxShadow = '0 0 0 3px rgba(27, 90, 167, 0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">{t.phoneNumber}</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="98XXXXXXXX"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  onFocus={(e) => { e.target.style.borderColor = '#1b5AA7'; e.target.style.boxShadow = '0 0 0 3px rgba(27, 90, 167, 0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  {t.district} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="e.g., Kathmandu"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  onFocus={(e) => { e.target.style.borderColor = '#1b5AA7'; e.target.style.boxShadow = '0 0 0 3px rgba(27, 90, 167, 0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  {t.municipality} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="municipality"
                  value={form.municipality}
                  onChange={handleChange}
                  placeholder="e.g., Kathmandu Metropolitan"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  onFocus={(e) => { e.target.style.borderColor = '#1b5AA7'; e.target.style.boxShadow = '0 0 0 3px rgba(27, 90, 167, 0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">{t.wardNo}</label>
                <input
                  type="number"
                  name="ward_no"
                  value={form.ward_no}
                  onChange={handleChange}
                  placeholder="Ward number"
                  min="1"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  onFocus={(e) => { e.target.style.borderColor = '#1b5AA7'; e.target.style.boxShadow = '0 0 0 3px rgba(27, 90, 167, 0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">{t.address}</label>
                <input
                  type="text"
                  name="applicant_address"
                  value={form.applicant_address}
                  onChange={handleChange}
                  placeholder="Full address"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  onFocus={(e) => { e.target.style.borderColor = '#1b5AA7'; e.target.style.boxShadow = '0 0 0 3px rgba(27, 90, 167, 0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Additional Remarks */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">{t.additionalRemarks}</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                placeholder="Any additional information..."
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none resize-none"
                onFocus={(e) => { e.target.style.borderColor = '#1b5AA7'; e.target.style.boxShadow = '0 0 0 3px rgba(27, 90, 167, 0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-semibold transition-all text-white"
              style={{ backgroundColor: submitting ? '#9ca3af' : '#1b5AA7', cursor: submitting ? 'not-allowed' : 'pointer' }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#154a8a'; }}
              onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#1b5AA7'; }}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  {t.submitting}
                </span>
              ) : (
                t.submitApplication
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
