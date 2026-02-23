import React, { useState, useEffect } from "react";
import { LuCar } from "react-icons/lu";
import { GoGlobe } from "react-icons/go";
import { RiBankLine } from "react-icons/ri";
import { FaIdCard, FaLandmark, FaMapMarkerAlt, FaRegBuilding, FaSpinner } from "react-icons/fa";
import { PiGraduationCap } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { servicesAPI } from "../../services/api";

export default function AllServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default services with icons
  const defaultServices = [
    {
      title: "Citizenship",
      description: "Apply for new citizenship certificate or renewal.",
      icon: <FaIdCard className="text-blue-600 text-3xl" />,
    },
    {
      title: "License (Yatayat)",
      description: "Apply for driving license or renewal.",
      icon: <LuCar className="text-blue-600 text-3xl" />,
    },
    {
      title: "Passport",
      description: "Apply for a new passport or renew your existing one.",
      icon: <GoGlobe className="text-blue-600 text-3xl" />,
    },
    {
      title: "Tax & Revenue",
      description: "File taxes, pay revenue, and get tax clearance.",
      icon: <RiBankLine className="text-blue-600 text-3xl" />,
    },
    {
      title: "Property & Land",
      description: "Land registration, ownership transfer, and records.",
      icon: <FaMapMarkerAlt className="text-blue-600 text-3xl" />,
    },
    {
      title: "Ward Services",
      description: "Local ward-level services and recommendations.",
      icon: <FaRegBuilding className="text-blue-600 text-3xl" />,
    },
    {
      title: "Municipality Services",
      description: "Municipal-level services and permits.",
      icon: <FaLandmark className="text-blue-600 text-3xl" />,
    },
    {
      title: "Scholarships Programs",
      description: "Government scholarships and support programs.",
      icon: <PiGraduationCap className="text-blue-600 text-3xl" />,
    },
  ];

  // Icon mapping by title keyword
  const getIcon = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("citizenship")) return <FaIdCard className="text-blue-600 text-3xl" />;
    if (titleLower.includes("license") || titleLower.includes("yatayat")) return <LuCar className="text-blue-600 text-3xl" />;
    if (titleLower.includes("passport")) return <GoGlobe className="text-blue-600 text-3xl" />;
    if (titleLower.includes("tax") || titleLower.includes("revenue")) return <RiBankLine className="text-blue-600 text-3xl" />;
    if (titleLower.includes("land") || titleLower.includes("property")) return <FaMapMarkerAlt className="text-blue-600 text-3xl" />;
    if (titleLower.includes("ward")) return <FaRegBuilding className="text-blue-600 text-3xl" />;
    if (titleLower.includes("municipality")) return <FaLandmark className="text-blue-600 text-3xl" />;
    if (titleLower.includes("scholarship")) return <PiGraduationCap className="text-blue-600 text-3xl" />;
    return <FaRegBuilding className="text-blue-600 text-3xl" />;
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await servicesAPI.getAll();
      if (data && data.length > 0) {
        setServices(data.map(s => ({ ...s, icon: getIcon(s.title) })));
      } else {
        // Use default services if API returns empty
        setServices(defaultServices);
      }
    } catch (err) {
      // Use default services if API fails
      console.error("Failed to fetch services:", err);
      setServices(defaultServices);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (service) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please login to apply for services");
      navigate("/login");
      return;
    }
    
    if (service.id) {
      navigate(`/apply/${service.id}`);
    } else {
      // For default services without IDs, go to citizenship form
      navigate("/form");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold">All Services</h1>
        <p className="text-gray-600 mt-2">
          Browse available government services and find what you need.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {services.map((service, idx) => (
            <div
              key={service.id || idx}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="mx-auto h-16 w-16 bg-blue-100 flex items-center justify-center rounded-full">
                {service.icon}
              </div>
              <h2 className="mt-4 text-lg font-semibold">{service.title}</h2>
              <p className="text-gray-600 text-sm mt-2">{service.description || service.desc}</p>
              {service.fee && (
                <p className="text-xs text-gray-500 mt-1">Fee: Rs. {service.fee}</p>
              )}
              {service.estimated_days && (
                <p className="text-xs text-gray-500">Est. {service.estimated_days} days</p>
              )}
              <button
                onClick={() => handleApply(service)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}