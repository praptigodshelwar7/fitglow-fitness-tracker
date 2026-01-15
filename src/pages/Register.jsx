import React from 'react'
import {useState} from'react'
import {account,ID} from '../appwrite/config.js'
import {useNavigate,Link} from 'react-router-dom'
import {useEffect} from 'react'

function Register() {
    const navigate=useNavigate();
    const [form,setForm]=useState({
        name:"",
        email:"",
        password:"",
    })
    useEffect(() => {
    account.get()
    .then(() => navigate("/dashboard"))
    .catch(() => {});
}, []);

    const handleChange = (e)=>{
        setForm({...form,[e.target.name]:e.target.value})
    }
    const handleRegister = async (e) =>{
        e.preventDefault();
        try{
            await account.create(ID.unique(),form.email,form.password,form.name);
            await account.createEmailPasswordSession(form.email,form.password);
            navigate("/dashboard");
        }catch(err){
            alert(err.message);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center px-4">

        <div className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6 sm:p-8">

        <h2 className="text-xl sm:text-2xl font-bold text-blue-400 mb-6 text-center">
        Create Account 🚀
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">

        <input
            name="name"
            placeholder="Name"
            className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
        />

        <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
        />

        <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
        />

        <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-2.5 rounded-lg text-white font-semibold tracking-wide"
        >
            Register
        </button>

        </form>

        <p className="text-gray-400 text-sm mt-5 text-center">
        Already have an account?{" "}
        <Link to="/" className="text-blue-400 hover:underline font-semibold">
            Login
        </Link>
        </p>

    </div>
    </div>
);

}

export default Register
