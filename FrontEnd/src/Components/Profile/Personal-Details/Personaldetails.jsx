import { useState } from "react";

const Personaldetails = () => {
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:5000/api/personal-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert("Submitted!");
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-4">

        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Personal Details Form
        </h1>

        <div className="bg-white shadow-lg rounded-xl p-8 space-y-6">

          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Applicant Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Applicant Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter applicant name"
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Person Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Person Name</label>
              <input
                type="text"
                name="person"
                placeholder="Enter person name"
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* District Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">District Name</label>
              <input
                type="text"
                name="districtName"
                placeholder="Enter district name"
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Municipality */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Municipality</label>
              <input
                type="text"
                name="municipality"
                placeholder="Enter municipality"
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Applicant District */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Applicant District</label>
              <input
                type="text"
                name="applicantDistrict"
                placeholder="Enter applicant district"
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Ward Number */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Ward Number</label>
              <input
                type="number"
                name="ward"
                placeholder="Enter ward number"
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Citizenship Number */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Citizenship Number</label>
              <input
                type="text"
                name="citizenship"
                placeholder="Enter citizenship number"
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>


            {/* Purpose (full width) */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-1">Purpose</label>
              <textarea
                name="purpose"
                placeholder="Enter purpose"
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 h-28 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition-all shadow-lg"
          >
            Submit
          </button>

        </div>
      </div>
    </div>
  );
};

export default Personaldetails;