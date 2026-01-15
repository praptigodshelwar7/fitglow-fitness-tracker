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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-10 rounded-xl shadow-xl w-full max-w-md border border-gray-700">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-2xl shadow-lg w-96" >
                <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
                    Welcome Back 
                </h2>
                <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded mb-3"
                onChange={(e) => setEmail(e.target.value)}
                />
                <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded mb-4"
                onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-800">
                    Login
                </button>
                <p className="text-sm mt-3 text-center">
                    No account ? {" "}
                    <Link to="/register" className="text-blue-600 font-semibold">Register</Link>
                    </p>
            </form>
        </div>
        </div>
    )
}

export default Login
