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
      <div className="p-6 max-w-lg mx-auto text-green-800">
        <h2 className="text-xl font-bold mb-4">Add Meal </h2>

        <form onSubmit={handleSave} className="bg-gray-800 p-6 rounded-xl">

          <input
            placeholder="Food (e.g. Egg, Paneer, Dal)"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            className="w-full mb-3 p-2 bg-gray-900 text-white rounded"
          />

          <input
            placeholder="Protein (grams)"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
            className="w-full mb-3 p-2 bg-gray-900 text-white rounded"
          />

          <input
            placeholder="Calories (optional)"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full mb-4 p-2 bg-gray-900 text-white rounded"
          />

          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full mb-4 p-2 bg-gray-900 text-white rounded"
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
          </select>

          <button className="w-full bg-green-600 py-2 rounded text-white">
            Save Meal
          </button>
        </form>
      </div>
    </>
  );
}
