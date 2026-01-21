import React from 'react'
import {useState} from'react'
import {account} from "../appwrite/config"
import {useNavigate,Link} from 'react-router-dom'
import { useEffect } from "react";



function Login() {
    const navigate=useNavigate();
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("")

    useEffect(() => {
    account.get()
    .then(() => navigate("/dashboard")) // already logged in
    .catch(() => {}); // not logged in, stay on login page
    }, []);

    const handleLogin=async(e)=>{
        e.preventDefault();
        try{
            await account.createEmailPasswordSession(email,password);
            navigate("/dashboard")
        }catch(err){
            console.log(err);
            alert("Login failed")
        }
    }
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center px-4">

        <div className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 sm:p-8">

        <h2 className="text-xl sm:text-2xl font-bold text-blue-400 mb-6 text-center">
        Welcome Back 💪
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

        <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
        />

        <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
        />

        <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-2.5 rounded-lg text-white font-semibold tracking-wide"
        >
            Login
        </button>

        <p className="text-sm text-center text-gray-400 pt-2">
            No account?{" "}
            <Link to="/register" className="text-blue-400 font-semibold hover:underline">
            Register
            </Link>
        </p>

        </form>
    </div>

    </div>
);

}

export default Login