import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { account } from "../appwrite/config";

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
    try {
        await account.deleteSession("current");
        navigate("/");
    } catch (err) {
        alert("Logout failed");
    }
};

    return (
    <div className="bg-gray-900 text-white shadow-lg px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* LOGO */}
        <h1 className="text-xl font-bold tracking-wide text-center sm:text-left">
            FitGlow
        </h1>

        {/* NAV LINKS */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 items-center text-gray-300 text-sm sm:text-base">

            <Link className="hover:text-blue-400" to="/dashboard">Dashboard</Link>
            <Link className="hover:text-blue-400" to="/workouts">Workout</Link>
            <Link className="hover:text-blue-400" to="/diet">Diet</Link>
            <Link className="hover:text-blue-400" to="/planner">Planner</Link>

            <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-1.5 rounded-lg text-white text-sm sm:text-base"
            >
            Logout
            </button>
        </div>

    </div>
    </div>
);
}
