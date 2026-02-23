import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import { FaWpforms } from "react-icons/fa6";
import { IoShieldOutline } from "react-icons/io5";
import { LuCar } from "react-icons/lu";
import { GoGlobe } from "react-icons/go";
import { RiBankLine } from "react-icons/ri";
import { useLanguage } from "../../context/LanguageContext";

function Home() {
  const Navigate = useNavigate();
  const { t } = useLanguage();

  const hoverEffect =
    "cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200";

  return (
    <>
      <div className="bg-[#1b5aa7] text-white py-10 text-center">
        <div className="max-w-[1100px] mx-auto px-4 flex flex-col items-center gap-4">
          <h1 className="text-[2.25rem] max-w-[800px] md:text-[3.25rem] lg:text-[4rem] font-bold m-0">
            {t.heroTitle}
          </h1>
          <p className="text-white/90 max-w-[720px] mt-2">{t.heroSubtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 items-center justify-center">
            <button
              onClick={() => Navigate("/services")}
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg font-semibold text-[0.95rem] bg-white text-[#1b5aa7] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>{t.exploreServices}</span>
              <FaArrowRight className="inline-flex items-center" />
            </button>

            <NavLink
              to="/track-application"
              className={`inline-flex items-center gap-2 py-2.5 px-5 rounded-lg font-semibold text-[0.95rem] bg-white/10 text-white border border-white/15 hover:bg-white/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${hoverEffect}`}
            >
              <IoMdSearch className="inline-flex items-center" />
              <span>{t.trackApplication}</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-gray-50 py-12">
        <div className="Container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div
              onClick={() => Navigate("/services")}
              className={`bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8 ${hoverEffect}`}
            >
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <IoMdSearch className="text-blue-600 text-3xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                {t.findServices}
              </h3>
              <p className="text-gray-500 text-sm text-center">
                {t.findServicesDesc}
              </p>
            </div>

            <div
              onClick={() => Navigate("/template")}
              className={`bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8 ${hoverEffect}`}
            >
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <FaWpforms className="text-blue-600 text-3xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
               {t.templates}
              </h3>
              <p className="text-gray-500 text-sm text-center">
                {t.templatesDesc}
              </p>
            </div>

            <div
              onClick={() => Navigate("/track-application")}
              className={`bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8 ${hoverEffect}`}
            >
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <IoShieldOutline className="text-blue-600 text-3xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                {t.trackStatus}
              </h3>
              <p className="text-gray-500 text-sm text-center">
                {t.trackStatusDesc}
              </p>
            </div>
          </div>

          {/* Popular Services */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              {t.popularServices}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Citizenship */}
              <div
                className={`bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8 ${hoverEffect}`}
              >
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <FaWpforms className="text-blue-600 text-3xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  {t.citizenship}
                </h3>
                <p className="text-gray-500 text-sm text-center">
                  {t.citizenshipDesc}
                </p>
                <button
                  onClick={() => Navigate("/services")}
                  className={`mt-4 px-4 py-2 rounded-md bg-white text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-200 ${hoverEffect}`}
                >
                  {t.viewDetails}
                </button>
              </div>

              {/* License */}
              <div
                className={`bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8 ${hoverEffect}`}
              >
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <LuCar className="text-blue-600 text-3xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  {t.license}
                </h3>
                <p className="text-gray-500 text-sm text-center">
                  {t.licenseDesc}
                </p>
                <button
                  onClick={() => Navigate("/services")}
                  className={`mt-4 px-4 py-2 rounded-md bg-white text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-200 ${hoverEffect}`}
                >
                  {t.viewDetails}
                </button>
              </div>

              {/* Passport */}
              <div
                className={`bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8 ${hoverEffect}`}
              >
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <GoGlobe className="text-blue-600 text-3xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  {t.passport}
                </h3>
                <p className="text-gray-500 text-sm text-center">
                  {t.passportDesc}
                </p>
                <button
                  onClick={() => Navigate("/services")}
                  className={`mt-4 px-4 py-2 rounded-md bg-white text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-200 ${hoverEffect}`}
                >
                  {t.viewDetails}
                </button>
              </div>

              {/* Tax & Revenue */}
              <div
                className={`bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8 ${hoverEffect}`}
              >
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <RiBankLine className="text-blue-600 text-3xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  {t.taxRevenue}
                </h3>
                <p className="text-gray-500 text-sm text-center">
                  {t.taxRevenueDesc}
                </p>
                <button
                  className={`mt-4 px-4 py-2 rounded-md bg-white text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-200 ${hoverEffect}`}
                >
                  {t.viewDetails}
                </button>
              </div>
            </div>

            {/* View All Services */}
            <div className="flex justify-center mt-8">
              <button
                onClick={() => Navigate("/services")}
                className={`px-6 py-2 rounded-md bg-white text-gray-700 font-medium border border-gray-200 inline-flex items-center gap-2 hover:bg-gray-50 hover:shadow-md transition-all duration-200 ${hoverEffect}`}
              >
                {t.viewAllServices}{" "}
                <FaArrowRight className="text-gray-500 text-lg ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
