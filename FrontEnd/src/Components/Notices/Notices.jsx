import React from "react";
import { IoMegaphone } from "react-icons/io5";
export default function GovernmentNotices() {
  return (
    <div className="min-h-screen bg-gray-50 Container py-10" >
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <span className=" text-3xl"><IoMegaphone /></span>
          Government Notices
        </h1>

        <div className="mt-6 space-y-5">
          <div className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold">
                National Scholarship Program 2082
                <span className="bg-[#1b5AA7] ml-3 text-sm rounded-2xl text-white text-[] px-2 py-1 ">
                  Scholarship
                </span>
              </p>
              <p className="text-gray-600 mt-1">
                Applications open for meritorious students from marginalized communities. Apply before Baisakh 15.
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold">
                Farmer Subsidy for Khet Land
                <span className="ml-3 text-sm bg-[#1b5AA7] text-white  rounded-2xl  px-2 py-1 ">
                  Agriculture
                </span>
              </p>
              <p className="text-gray-600 mt-1">
                Government subsidy of up to Rs 50,000 for small-scale farmers for seeds and fertilizers.
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold">
                New Online Passport Application System
                <span className="text-white bg-[#1b5AA7] rounded-2xl ml-3 text-sm px-2 py-1 ">
                  Announcement
                </span>
              </p>
              <p className="text-gray-600 mt-1">
                Department of Passports has launched a new online system effective from Magh 1.
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold">
                Youth Self-Employment Program
                <span className="ml-3 text-sm bg-[#1b5AA7] text-white  rounded-2xl  px-2 py-1 ">
                  Scheme
                </span>
              </p>
              <p className="text-gray-600 mt-1">
                Interest-free loans up to Rs 5 lakhs for youth entrepreneurs under PM Employment Program.
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold">
                Property Tax Deadline Extended
                <span className="ml-3 text-sm text-white rounded-2xl bg-[#1b5AA7] px-2 py-1 ">
                  Announcement
                </span>
              </p>
              <p className="text-gray-600 mt-1">
                Municipal property tax deadline extended to Chaitra 30 without penalty.
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold">
                Property Tax Deadline Extended
                <span className="ml-3 text-sm text-white rounded-2xl bg-[#1b5AA7] px-2 py-1 ">
                  Announcement
                </span>
              </p>
              <p className="text-gray-600 mt-1">
                Municipal property tax deadline extended to Chaitra 30 without penalty.
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold">
                Free Health Camp in Rural Areas
                <span className="ml-3 text-sm bg-[#1b5AA7] text-white rounded-2xl px-2 py-1 ">
                  Health
                </span>
              </p>
              <p className="text-gray-600 mt-1">
                Free medical checkups and medicines will be provided in select rural municipalities from Falgun 10-15.
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold">
                Digital Literacy Training for Women
                <span className="ml-3 text-sm bg-[#1b5AA7] text-white rounded-2xl px-2 py-1 ">
                  Training
                </span>
              </p>
              <p className="text-gray-600 mt-1">
                Registration open for free digital skills training for women above 18 years. Limited seats available.
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-5 flex justify-between items-start">
            <div>
              <p className="text-lg font-semibold">
                National Identity Card Distribution
                <span className="ml-3 text-sm bg-[#1b5AA7] text-white rounded-2xl px-2 py-1 ">
                  Identity
                </span>
              </p>
              <p className="text-gray-600 mt-1">
                Distribution of National ID cards will begin in all wards from Jestha 1. Bring citizenship and old ID for verification.
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}