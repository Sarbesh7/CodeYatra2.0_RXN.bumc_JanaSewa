import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import {
  FaSpinner,
  FaArrowLeft,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaFileUpload
} from "react-icons/fa";

export default function AdminApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role !== "admin") {
      navigate("/");
      return;
    }
    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      const data = await adminAPI.getApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, newStatus, file = null) => {
    setUpdating(true);
    try {
      await adminAPI.updateApplicationStatus(appId, newStatus, file);
      await fetchApplications();
      setSelectedApp(null);
    } catch (err) {
      setError(err.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <FaCheckCircle className="text-green-500" />;
      case "Rejected":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-orange-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Under Review":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.service_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Applications</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by serial number, name, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Serial No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                        {app.serial_number}
                      </td>
                      <td className="px-6 py-4">{app.service_title || "N/A"}</td>
                      <td className="px-6 py-4">{app.user_name || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {getStatusIcon(app.status)}
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <FaEye /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Application Details Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Application Details</h2>
                    <p className="text-gray-500 font-mono">{selectedApp.serial_number}</p>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Service</p>
                      <p className="font-medium">{selectedApp.service_title || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Applicant</p>
                      <p className="font-medium">{selectedApp.user_name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="font-medium">
                        {new Date(selectedApp.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Status</p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedApp.status
                        )}`}
                      >
                        {getStatusIcon(selectedApp.status)}
                        {selectedApp.status}
                      </span>
                    </div>
                  </div>

                  {/* Form Data */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Form Data</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {selectedApp.form_data ? (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {Object.entries(selectedApp.form_data).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-gray-500 capitalize">
                                {key.replace(/_/g, " ")}:
                              </span>{" "}
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No form data available</p>
                      )}
                    </div>
                  </div>

                  {/* Update Status */}
                  {selectedApp.status !== "Approved" && selectedApp.status !== "Rejected" && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-500 mb-3">Update Status</p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => updateStatus(selectedApp.id, "Under Review")}
                          disabled={updating}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          Mark Under Review
                        </button>
                        <button
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.onchange = (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                updateStatus(selectedApp.id, "Approved", file);
                              }
                            };
                            input.click();
                          }}
                          disabled={updating}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          <FaFileUpload /> Approve with Document
                        </button>
                        <button
                          onClick={() => updateStatus(selectedApp.id, "Rejected")}
                          disabled={updating}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                      {updating && (
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                          <FaSpinner className="animate-spin" /> Updating...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
