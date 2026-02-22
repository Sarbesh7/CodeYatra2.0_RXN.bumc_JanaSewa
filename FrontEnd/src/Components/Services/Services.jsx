import React from "react";
import { LuCar } from "react-icons/lu";
import { GoGlobe } from "react-icons/go";
import { RiBankLine } from "react-icons/ri";
import { FaIdCard, FaLandmark, FaMapMarkerAlt, FaRegBuilding } from "react-icons/fa";
import { PiGraduationCap } from "react-icons/pi";

export default function AllServices() {
  const services = [
    {
      title: "Citizenship",
      desc: "Apply for new citizenship certificate or renewal.",
      icon: <FaIdCard className="text-blue-600 text-3xl" />,
    },
    {
      title: "License (Yatayat)",
      desc: "Apply for driving license or renewal.",
      icon: <LuCar className="text-blue-600 text-3xl" />,
    },
    {
      title: "Passport",
      desc: "Apply for a new passport or renew your existing one.",
      icon: <GoGlobe className="text-blue-600 text-3xl" />,
    },
    {
      title: "Tax & Revenue",
      desc: "File taxes, pay revenue, and get tax clearance.",
      icon: <RiBankLine className="text-blue-600 text-3xl" />,
    },
    {
      title: "Property & Land",
      desc: "Land registration, ownership transfer, and records.",
      icon: <FaMapMarkerAlt className="text-blue-600 text-3xl" />,
    },
    {
      title: "Ward Services",
      desc: "Local ward-level services and recommendations.",
      icon: <FaRegBuilding className="text-blue-600 text-3xl" />,
    },
    {
      title: "Municipality Services",
      desc: "Municipal-level services and permits.",
      icon: <FaLandmark className="text-blue-600 text-3xl" />,
    },
    {
      title: "Scholarships Programs",
      desc: "Government scholarships and support programs.",
      icon: <PiGraduationCap className="text-blue-600 text-3xl" />,
    },
  ];

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
              key={idx}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-center"
            >
              <div className="mx-auto h-16 w-16 bg-blue-100 flex items-center justify-center rounded-full">
                {service.icon}
              </div>
              <h2 className="mt-4 text-lg font-semibold -py- ">{service.title}</h2>
              <p className="text-gray-600 text-sm mt-2 ">{service.desc}</p>
              <button className="mt-4 px-4 py-2 bg-white border rounded-md hover:bg-gray-100 text-gray-700 shadow-sm">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}