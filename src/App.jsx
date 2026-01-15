import { useState } from 'react'
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Workouts from './pages/Workouts'
import AddWorkout from './pages/AddWorkout'
import Diet from './pages/Diet'
import AddMeal from './pages/AddMeal'
import Planner from "./pages/Planner";


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/workouts" element={<Workouts/>}/>
        <Route path="/add-workout" element={<AddWorkout/>}/>
        <Route path="/diet" element={<Diet/>}/>
        <Route path="/add-meal" element={<AddMeal/>}/>
        <Route path="/planner" element={<Planner />} />


      </Routes>
    </BrowserRouter>



  )
}

export default App
