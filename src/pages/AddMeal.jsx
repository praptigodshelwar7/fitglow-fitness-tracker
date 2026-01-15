import React from 'react'
import { useState } from "react";
import { databases, DB_ID, MEALS_ID, ID, account } from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AddMeal() {
  const navigate = useNavigate();

  const [food, setFood] = useState("");
  const [protein, setProtein] = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState("Breakfast");

  const handleSave = async (e) => {
    e.preventDefault();

    if (!food || !protein) {
      alert("Please enter food and protein");
      return;
    }

    try {
      const user = await account.get();

      await databases.createDocument(DB_ID, MEALS_ID, ID.unique(), {
        userId: user.$id,
        food,
        protein: Number(protein),
        calories: Number(calories || 0),
        mealType,
        date: new Date().toISOString(),
      });

      navigate("/diet");
    } catch (err) {
      console.log(err);
      alert("Failed to save meal");
    }
  };

  return (
  <>
    <Navbar />

    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-5 sm:p-6">

        <h2 className="text-xl sm:text-2xl font-bold text-green-400 mb-6 text-center">
          Add Your Meal 🥗
        </h2>

        <form onSubmit={handleSave} className="space-y-4">

          <input
            placeholder="Food (e.g. Egg, Paneer, Dal)"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="number"
            placeholder="Protein (grams)"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="number"
            placeholder="Calories (optional)"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
          </select>

          <button
            className="w-full bg-green-600 hover:bg-green-700 transition py-2.5 rounded-lg text-white font-semibold tracking-wide"
          >
            Save Meal
          </button>

        </form>

      </div>
    </div>
  </>
);

}
