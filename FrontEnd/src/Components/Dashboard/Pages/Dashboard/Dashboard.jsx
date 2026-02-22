import React from "react";
import { FaWpforms, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { RiMegaphoneLine } from "react-icons/ri";
import { HiUsers } from "react-icons/hi";

export default function Dashboard() {
    const stats = [
        {
            title: "Total Applications",
            value: "1,245",
            icon: <FaWpforms className="text-2xl" />,
            color: "bg-blue-100 text-blue-600",
        },
        {
            title: "Pending Review",
            value: "87",
            icon: <FaClock className="text-2xl" />,
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            title: "Approved",
            value: "1,102",
            icon: <FaCheckCircle className="text-2xl" />,
            color: "bg-green-100 text-green-600",
        },
        {
            title: "Rejected",
            value: "56",
            icon: <FaTimesCircle className="text-2xl" />,
            color: "bg-red-100 text-red-600",
        },
    ];

    const recentApplications = [
        { id: "APP-2082-001", name: "Ram Bahadur Thapa", service: "Citizenship", status: "Pending", date: "2082-11-08" },
        { id: "APP-2082-002", name: "Sita Kumari Sharma", service: "Passport", status: "Approved", date: "2082-11-07" },
        { id: "APP-2082-003", name: "Hari Prasad Koirala", service: "License", status: "Pending", date: "2082-11-07" },
        { id: "APP-2082-004", name: "Gita Devi Poudel", service: "Tax Clearance", status: "Rejected", date: "2082-11-06" },
        { id: "APP-2082-005", name: "Bikash Gurung", service: "Land Registration", status: "Approved", date: "2082-11-06" },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            Pending: "bg-yellow-100 text-yellow-700",
            Approved: "bg-green-100 text-green-700",
            Rejected: "bg-red-100 text-red-700",
        };
        return styles[status] || "bg-gray-100 text-gray-700";
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-full ${stat.color}`}>{stat.icon}</div>
                        <div>
                            <p className="text-sm text-gray-500">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                            <HiUsers className="text-xl" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Active Users</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#1b5aa7]">3,421</p>
                    <p className="text-sm text-gray-500 mt-1">Registered citizens</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                            <RiMegaphoneLine className="text-xl" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Published Notices</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#1b5aa7]">24</p>
                    <p className="text-sm text-gray-500 mt-1">Active notices</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 text-green-600 rounded-full">
                            <FaCheckCircle className="text-xl" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Today's Approved</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#1b5aa7]">12</p>
                    <p className="text-sm text-gray-500 mt-1">Applications approved today</p>
                </div>
            </div>

            {/* Recent Applications Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Recent Applications</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Application ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Applicant Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Service
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {recentApplications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-[#1b5aa7]">{app.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{app.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{app.service}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{app.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
