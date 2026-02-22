
import React from 'react';
import { RiMegaphoneLine } from "react-icons/ri";
import { GoChecklist } from "react-icons/go";
import { BiCategory } from "react-icons/bi";
import { FaWpforms } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const linkBase = "flex items-center gap-3 px-4 py-2 rounded-lg text-white transition-colors cursor-pointer";

function SideBar() {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen">
            <div className="w-64 bg-[#1b5aa7] flex flex-col justify-between shadow-lg shrink-0">
                <div>
                    <div className="px-6 py-6 border-b border-white/30">
                        <h3 className="text-white font-bold text-xl tracking-wide">
                            <span className="font-extrabold">JanaSewa Admin</span>
                        </h3>
                    </div>
                    <ul className="mt-4 space-y-1 px-2">
                        <NavLink to="/admin" end className={({ isActive }) => `${linkBase} ${isActive ? 'bg-[#dfe0e47e]' : 'hover:bg-[#dfe0e47e]'}`}>
                            <BiCategory className="text-lg" />
                            <span className="font-medium">Dashboard</span>
                        </NavLink>
                        <NavLink to="/admin/applications" className={({ isActive }) => `${linkBase} ${isActive ? 'bg-[#dfe0e47e]' : 'hover:bg-[#dfe0e47e]'}`}>
                            <FaWpforms className="text-lg" />
                            <span className="font-medium">Applications</span>
                        </NavLink>
                        <NavLink to="/admin/approve" className={({ isActive }) => `${linkBase} ${isActive ? 'bg-[#dfe0e47e]' : 'hover:bg-[#dfe0e47e]'}`}>
                            <GoChecklist className="text-lg" />
                            <span className="font-medium">Approve / Reject</span>
                        </NavLink>
                        <NavLink to="/admin/post-notice" className={({ isActive }) => `${linkBase} ${isActive ? 'bg-[#dfe0e47e]' : 'hover:bg-[#dfe0e47e]'}`}>
                            <RiMegaphoneLine className="text-lg" />
                            <span className="font-medium">Post Notice</span>
                        </NavLink>
                    </ul>
                </div>
                <div className="px-4 py-6">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-800 font-semibold py-2 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                        <RxExit className="text-lg" />
                        Back to Portal
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50">
                <Outlet />
            </div>
        </div>
    );
}

export default SideBar;