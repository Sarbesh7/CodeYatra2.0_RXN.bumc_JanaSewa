import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import { FaWpforms } from "react-icons/fa6";
import { IoShieldOutline } from "react-icons/io5";
import { LuCar } from "react-icons/lu";
import { GoGlobe } from "react-icons/go";
import { RiBankLine } from "react-icons/ri";

function Home() {
    const Navigate = useNavigate();
  return (
    <>
      {/* Hero */}
      <div className="bg-[#1b5aa7] text-white py-10 text-center">
        <div className="max-w-[1100px] mx-auto px-4 flex flex-col items-center gap-4">
          <h1 className="text-[2.25rem] max-w-[800px] md:text-[3.25rem] lg:text-[4rem]  font-bold m-0">
            All Government Services in One Place
          </h1>
          <p className="text-white/90 max-w-[720px] mt-2">
            Know where to go, what documents to bring, and apply online.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 items-center justify-center">
            <button onClick={()=>Navigate('/services')} className="cursor-pointer inline-flex items-center gap-2 py-2.5 px-5 rounded-lg font-semibold text-[0.95rem] bg-white text-[#1b5aa7] shadow-md hover:-translate-y-0.5 transition-transform">
              <span>Explore Services</span>
              <FaArrowRight className="inline-flex items-center" />
            </button>

            <NavLink
              to="/track-application"
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg font-semibold text-[0.95rem] bg-white/10 text-white border border-white/15 hover:bg-white/20 transition-colors"
            >
              <IoMdSearch className="inline-flex items-center" />
              <span>Track Application</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Content sada*/}
      <div className="bg-gray-50 py-12">
        <div className="Container">
          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <IoMdSearch className="text-blue-600 text-3xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                Find Services
              </h3>
              <p className="text-gray-500 text-sm text-center">
                Search and browse all government services easily.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <FaWpforms className="text-blue-600 text-3xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                Apply Online
              </h3>
              <p className="text-gray-500 text-sm text-center">
                Submit your applications from anywhere, anytime.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <IoShieldOutline className="text-blue-600 text-3xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                Track Status
              </h3>
              <p className="text-gray-500 text-sm text-center">
                Get real-time updates on your application status.
              </p>
            </div>
          </div>

          {/* Popular Services Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Popular Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <FaWpforms className="text-blue-600 text-3xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  Citizenship
                </h3>
                <p className="text-gray-500 text-sm text-center">
                  Apply for new citizenship certificate or renewal.
                </p>
                <button className="mt-4 px-4 py-2 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 border border-gray-200">
                  View Details
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <LuCar className="text-blue-600 text-3xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  License (Yatayat)
                </h3>
                <p className="text-gray-500 text-sm text-center">
                  Apply for driving license or renewal.
                </p>
                <button className="mt-4 px-4 py-2 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 border border-gray-200">
                  View Details
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <GoGlobe className="text-blue-600 text-3xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  Passport
                </h3>
                <p className="text-gray-500 text-sm text-center">
                  Apply for a new passport or renew your existing one.
                </p>
                <button className="mt-4 px-4 py-2 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 border border-gray-200">
                  View Details
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center p-8">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <RiBankLine className="text-blue-600 text-3xl" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-800">
                  Tax & Revenue
                </h3>
                <p className="text-gray-500 text-sm text-center">
                  File taxes, pay revenue, and get tax clearance.
                </p>
                <button className="mt-4 px-4 py-2 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 border border-gray-200">
                  View Details
                </button>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button onClick={() => Navigate('/services')} className="px-6 py-2 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 inline-flex items-center gap-2 border border-gray-200">
                View All Services{" "}
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
