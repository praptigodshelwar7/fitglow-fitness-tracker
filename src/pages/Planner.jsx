import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { account, databases, DB_ID, PLANS_ID } from "../appwrite/config";
import { Query, ID } from "appwrite";

export default function Planner() {
  const [planId, setPlanId] = useState(null);

  const [plan, setPlan] = useState({
    mon: "",
    tue: "",
    wed: "",
    thurs: "",
    fri: "",
    sat: "",
    sun: "",
  });

  const handleChange = (e) => {
    setPlan({ ...plan, [e.target.name]: e.target.value });
  };

  // FETCH EXISTING PLAN
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const user = await account.get();

        const res = await databases.listDocuments(DB_ID, PLANS_ID, [
          Query.equal("userId", user.$id),
        ]);

        if (res.documents.length > 0) {
          const p = res.documents[0];
          setPlanId(p.$id);
          setPlan({
            mon: p.mon || "",
            tue: p.tue || "",
            wed: p.wed || "",
            thurs: p.thurs || "",
            fri: p.fri || "",
            sat: p.sat || "",
            sun: p.sun || "",
          });
        }
      } catch (err) {
        console.log("Fetch plan error:", err);
      }
    };

    fetchPlan();
  }, []);

  // SAVE PLAN
  const handleSave = async () => {
    try {
      const user = await account.get();

      if (planId) {
        await databases.updateDocument(DB_ID, PLANS_ID, planId, plan);
      } else {
        await databases.createDocument(DB_ID, PLANS_ID, ID.unique(), {
          ...plan,
          userId: user.$id,
          createdAt: new Date().toDateString(),
        });
      }

      alert("Workout plan saved 🔥");
    } catch (err) {
      console.log("Save plan error:", err);
    }
  };

  return (
    <>
      <Navbar />

      {/* FULL SCREEN DARK BG */}
      <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black px-4 sm:px-6 py-6">

        {/* CENTER CONTENT */}
        <div className="max-w-3xl mx-auto text-white">

          {/* HEADER */}
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-center sm:text-left
          text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Weekly Workout Planner 🗓️
          </h2>

          {/* PLANNER CARD */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 
          rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">

            {[
              ["mon", "Monday"],
              ["tue", "Tuesday"],
              ["wed", "Wednesday"],
              ["thurs", "Thursday"],
              ["fri", "Friday"],
              ["sat", "Saturday"],
              ["sun", "Sunday"],
            ].map(([key, label]) => (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
              >
                <span className="text-gray-300 text-sm sm:w-28">
                  {label}
                </span>

                <input
                  name={key}
                  value={plan[key]}
                  onChange={handleChange}
                  placeholder="Chest / Back / Legs..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5
                  text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                  focus:ring-cyan-400 transition"
                />
              </div>
            ))}

            {/* SAVE BUTTON */}
            <button
              onClick={handleSave}
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-cyan-500
              hover:from-blue-700 hover:to-cyan-600 py-3 rounded-xl font-semibold
              shadow-lg hover:shadow-cyan-500/40 transition active:scale-95"
            >
              Save Plan 🔥
            </button>

          </div>

        </div>
      </div>
    </>
  );
}
