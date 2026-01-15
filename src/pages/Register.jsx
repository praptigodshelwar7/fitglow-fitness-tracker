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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-10 rounded-xl shadow-xl w-full max-w-md border border-gray-700">
            
        <form
            onSubmit={handleRegister}
            className="bg-white p-8 rounded-2xl shadow-lg w-96">
            <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
                Create Account 
            </h2>
            <input
            name="name"
            placeholder='Name'
            className='w-full border p-2 rounded mb-3'
            onChange={handleChange}
            />
            <input
            name="email"
            type="email"
            placeholder='Email'
            className='w-full border p-2 rounded mb-3'
            onChange={handleChange}
            />
            <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded mb-4"
            onChange={handleChange}
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-800">
                Register
            </button>

        </form>
        
        <p className="text-gray-400 text-sm mt-5 text-center">
            Already have an account?{" "}
            <Link to="/" className="text-blue-400 hover:underline">
            Login
            </Link>
        </p>
        </div>
        </div>
    )
}

export default Register
