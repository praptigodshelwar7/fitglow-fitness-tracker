import React from 'react'
import { Link ,useNavigate} from "react-router-dom";
import {account} from "../appwrite/config"

export default function Navbar() {
    const navigate=useNavigate()
    const handleLogout = async () => {
    try {
        await account.deleteSession("current");
        navigate("/");
    } catch (err) {
        alert("Logout failed");
    }
};
    return (
        <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
            <h1 className="text-xl font-bold tracking-wide align-middle">FitGlow  </h1>
                <div className="flex gap-6 items-center text-gray-300">
                    <Link className="hover:text-blue-400" to="/dashboard">Dashboard</Link>
                    <Link className="hover:text-blue-400" to="/workouts">Workout</Link>
                    <Link className="hover:text-blue-400" to="/diet">Diet</Link>
                    <Link className="hover:text-blue-400" to="/planner" >Planner</Link>

                    <button
                        onClick={handleLogout}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-lg text-white">
                            Logout
                    </button>
                </div>
        </div>
);
}

