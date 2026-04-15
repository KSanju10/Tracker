import { useState, useEffect } from "react";

const habitsList = [
  "Wake Up ⏰",
  "Gym 💪",
  "No Porn 🚫",
  "Reading 📚",
  "Budget 💰",
  "Project 🎯",
  "No Alcohol ❌",
  "Social Detox 🌿",
  "Journaling 📒",
  "Cold Shower 🚿",
];

const months = [
  "January","February","March","April",
  "May","June","July","August",
  "September","October","November","December"
];

export default function App() {
  const [page, setPage] = useState("year");
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [data, setData] = useState({});

  // Load data
  useEffect(() => {
    if (year && month) {
      const saved = localStorage.getItem(`${year}-${month}`);
      if (saved) setData(JSON.parse(saved));
      else setData({});
    }
  }, [year, month]);

  // Save data
  useEffect(() => {
    if (year && month) {
      localStorage.setItem(`${year}-${month}`, JSON.stringify(data));
    }
  }, [data, year, month]);

  const toggle = (habit, day) => {
    setData((prev) => ({
      ...prev,
      [habit]: {
        ...prev[habit],
        [day]: !prev[habit]?.[day],
      },
    }));
  };

  const days = Array.from({ length: 28 }, (_, i) => i + 1);

  const getTotal = (habit) =>
    Object.values(data[habit] || {}).filter(Boolean).length;

  // ================= YEAR PAGE =================
  if (page === "year") {
    const years = Array.from({ length: 97 }, (_, i) => 2004 + i);

    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">Select Year</h1>

        <div className="grid grid-cols-5 border border-black">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => {
                setYear(y);
                setPage("month");
              }}
              className="border border-black p-4 hover:bg-blue-200"
            >
              {y}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ================= MONTH PAGE =================
  if (page === "month") {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">{year}</h1>

        <div className="grid grid-cols-4 border border-black">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => {
                setMonth(m);
                setPage("tracker");
              }}
              className="border border-black p-4 hover:bg-green-200"
            >
              {m}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage("year")}
          className="mt-6 px-4 py-2 bg-gray-600 text-white rounded"
        >
          ⬅ Back
        </button>
      </div>
    );
  }

  // ================= TRACKER PAGE =================
  return (
    <div className="p-4 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-4 text-center">
        📊 {month} {year}
      </h1>

      <button
        onClick={() => setPage("month")}
        className="mb-3 px-3 py-1 bg-gray-600 text-white rounded"
      >
        ⬅ Back
      </button>

      <div className="overflow-x-auto">
        <table className="border border-black w-full text-center text-sm">
          
          {/* HEADER */}
          <thead>
            <tr className="bg-gray-300">
              <th className="border p-2">Habits</th>
              <th className="border" colSpan="7">Week 1</th>
              <th className="border" colSpan="7">Week 2</th>
              <th className="border" colSpan="7">Week 3</th>
              <th className="border" colSpan="7">Week 4</th>
              <th className="border">Total</th>
            </tr>

            <tr className="bg-gray-200">
              <th className="border"></th>
              {days.map((d) => (
                <th key={d} className="border p-1">{d}</th>
              ))}
              <th className="border"></th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {habitsList.map((habit) => (
              <tr key={habit}>
                <td className="border p-2 text-left font-semibold">
                  {habit}
                </td>

                {days.map((day) => (
                  <td
                    key={day}
                    onClick={() => toggle(habit, day)}
                    className={`border cursor-pointer ${
                      data[habit]?.[day]
                        ? "bg-green-400"
                        : "bg-white"
                    }`}
                  >
                    {data[habit]?.[day] ? "✔" : ""}
                  </td>
                ))}

                <td className="border font-bold">
                  {getTotal(habit)}
                </td>
              </tr>
            ))}

            {/* DAILY TOTAL */}
            <tr className="bg-gray-300 font-bold">
              <td className="border">Daily Total</td>
              {days.map((day) => {
                let count = 0;
                habitsList.forEach((h) => {
                  if (data[h]?.[day]) count++;
                });
                return <td key={day} className="border">{count}</td>;
              })}
              <td className="border"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}