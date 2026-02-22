import React from "react";
import { FaFileAlt, FaMapMarkerAlt } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdChecklist } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi2";

export default function CitizenshipDetails() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FaFileAlt className="text-blue-600 text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Citizenship</h1>
            <p className="text-gray-600 text-sm">
              Apply for new citizenship certificate or renewal.
            </p>
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-white border rounded-lg p-5 mt-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <IoDocumentTextOutline className="text-blue-600 text-xl" />
            <h2 className="font-semibold text-lg">Required Documents</h2>
          </div>

          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Birth certificate</li>
            <li>Father/Mother’s citizenship copy</li>
            <li>Recommendation from Ward Office</li>
            <li>2 passport-size photos</li>
          </ul>
        </div>

        {/* Where to Apply */}
        <div className="bg-white border rounded-lg p-5 mt-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineDocumentText className="text-blue-600 text-xl" />
            <h2 className="font-semibold text-lg">Where to Apply</h2>
          </div>

          <p className="text-gray-700">District Administration Office</p>
        </div>

        {/* Nearest Office Location */}
        <div className="bg-white border rounded-lg p-5 mt-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-3">Nearest Office Location</h2>

          <div className="border rounded-lg bg-gray-100 h-48 flex flex-col items-center justify-center text-gray-500">
            <FaMapMarkerAlt className="text-xl mb-2" />
            <p>Map will be shown here</p>
          </div>
        </div>

        {/* Form Templates */}
        <div className="bg-white border rounded-lg p-5 mt-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MdChecklist className="text-blue-600 text-xl" />
            <h2 className="font-semibold text-lg">Form Templates</h2>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button className="px-4 py-2 border bg-white rounded-md flex items-center gap-2 hover:bg-gray-100 shadow-sm">
              <IoDocumentTextOutline />
              Application Form
            </button>

            <button className="px-4 py-2 border bg-white rounded-md flex items-center gap-2 hover:bg-gray-100 shadow-sm">
              <MdChecklist />
              Checklist
            </button>
          </div>
        </div>

        {/* Apply Online Button */}
        <div className="mt-6 flex justify-center">
          <button className="w-full sm:w-64 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-md shadow">
            Apply Online
          </button>
        </div>
      </div>
    </div>
  );
}