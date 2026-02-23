import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";

// Government offices data - filtered for citizenship offices
const CITIZENSHIP_OFFICES = [
  {
    id: 1,
    name: "Central Civil Registration Office",
    lat: 27.7172,
    lng: 85.324,
    type: "citizenship",
    phone: "+977-1-4200000",
    address: "Kathmandu",
    services: ["Citizenship", "Birth Certificate"],
  },
  {
    id: 2,
    name: "District Civil Registration Office",
    lat: 27.71,
    lng: 85.325,
    type: "citizenship",
    phone: "+977-1-4210000",
    address: "Kathmandu",
    services: ["Citizenship", "Registration"],
  },
];

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

export default function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const [nearestCitizenshipOffice, setNearestCitizenshipOffice] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user's GPS location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          // Find nearest citizenship office
          const officesWithDistance = CITIZENSHIP_OFFICES.map((office) => ({
            ...office,
            distance: calculateDistance(
              latitude,
              longitude,
              office.lat,
              office.lng,
            ),
          })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

          setNearestCitizenshipOffice(officesWithDistance[0]);
          setLoading(false);
        },
        (err) => {
          setError("Unable to access your location. Using default location.");
          setUserLocation({ lat: 27.7172, lng: 85.324 });

          // Find nearest citizenship office from default location
          const officesWithDistance = CITIZENSHIP_OFFICES.map((office) => ({
            ...office,
            distance: calculateDistance(
              27.7172,
              85.324,
              office.lat,
              office.lng,
            ),
          })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

          setNearestCitizenshipOffice(officesWithDistance[0]);
          setLoading(false);
        },
      );
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading location...</p>
        </div>
      </div>
    );
  }

  const handleOpenMap = () => {
    if (nearestCitizenshipOffice) {
      const mapsUrl = `https://www.google.com/maps/search/${nearestCitizenshipOffice.name}/@${nearestCitizenshipOffice.lat},${nearestCitizenshipOffice.lng},15z`;
      window.open(mapsUrl, "_blank");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-3">
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded z-10 max-w-md text-sm">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <div className="w-full max-w-lg">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          {/* Nearest Citizenship Office */}
          {nearestCitizenshipOffice && (
            <div className="bg-gradient-to-br from-blue-50 to-[#1B5AA7]/20 border-2 border-[#1B5AA7] rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-2xl">🏛️</div>
                <h2 className="text-sm font-semibold text-gray-800">
                  Nearest Citizenship Office
                </h2>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-gray-600">Office Name</p>
                  <p className="font-bold text-gray-800">
                    {nearestCitizenshipOffice.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600">Address</p>
                  <p className="font-semibold text-gray-800">
                    {nearestCitizenshipOffice.address}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600">Distance From You</p>
                  <p className="text-xl font-bold text-[#1b5AA7]">
                    {nearestCitizenshipOffice.distance}{" "}
                    <span className="text-sm">km</span>
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-600">Services</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {nearestCitizenshipOffice.services.map((service) => (
                      <span
                        key={service}
                        className="bg-green-200 text-[#1B5AA7] px-2 py-0.5 rounded-full text-xs font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600">Phone</p>
                  <a
                    href={`tel:${nearestCitizenshipOffice.phone}`}
                    className="font-semibold text-[#1b5AA7] hover:text-blue-700 text-sm"
                  >
                    {nearestCitizenshipOffice.phone}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Open in Google Maps Button */}
          <button
            onClick={handleOpenMap}
            className="w-full bg-[#1b5AA7] text-white py-2 px-3 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>📍 Open in Google Maps</span>
          </button>
        </div>
      </div>
    </div>
  );
}
