import React, { useState, useEffect } from "react";
import { LuCar } from "react-icons/lu";
import { GoGlobe } from "react-icons/go";
import { RiBankLine } from "react-icons/ri";
import { FaIdCard, FaLandmark, FaMapMarkerAlt, FaRegBuilding, FaSpinner } from "react-icons/fa";
import { PiGraduationCap } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { servicesAPI } from "../../services/api";
import { useLanguage } from "../../context/LanguageContext";

export default function AllServices() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default services with icons (uses translations)
  const getDefaultServices = () => [
    {
      title: t.citizenship,
      description: t.citizenshipDesc,
      icon: <FaIdCard className="text-blue-600 text-3xl" />,
    },
    {
      title: t.license,
      description: t.licenseDesc,
      icon: <LuCar className="text-blue-600 text-3xl" />,
    },
    {
      title: t.passport,
      description: t.passportDesc,
      icon: <GoGlobe className="text-blue-600 text-3xl" />,
    },
    {
      title: t.taxRevenue,
      description: t.taxRevenueDesc,
      icon: <RiBankLine className="text-blue-600 text-3xl" />,
    },
    {
      title: t.propertyLand,
      description: t.propertyLandDesc,
      icon: <FaMapMarkerAlt className="text-blue-600 text-3xl" />,
    },
    {
      title: t.wardServices,
      description: t.wardServicesDesc,
      icon: <FaRegBuilding className="text-blue-600 text-3xl" />,
    },
    {
      title: t.municipalityServices,
      description: t.municipalityServicesDesc,
      icon: <FaLandmark className="text-blue-600 text-3xl" />,
    },
    {
      title: t.scholarships,
      description: t.scholarshipsDesc,
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
        setServices(getDefaultServices());
      }
    } catch (err) {
      // Use default services if API fails
      console.error("Failed to fetch services:", err);
      setServices(getDefaultServices());
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (service) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert(t.loginToApply);
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
        <h1 className="text-3xl font-semibold">{t.allServices}</h1>
        <p className="text-gray-600 mt-2">
          {t.allServicesSubtitle}
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
                <p className="text-xs text-gray-500 mt-1">{t.fee}: Rs. {service.fee}</p>
              )}
              {service.estimated_days && (
                <p className="text-xs text-gray-500">{t.estimatedDays}: {service.estimated_days}</p>
              )}
              <button
                onClick={() => handleApply(service)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {t.applyNow}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}