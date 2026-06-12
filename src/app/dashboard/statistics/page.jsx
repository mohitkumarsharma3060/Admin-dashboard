"use client";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function StatisticsDashboard() {
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({
    totalBills: 0,
    paid: 0,
    pending: 0,
    rejected: 0,
    revenue: 0,
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((rows) => {
        if (!Array.isArray(rows)) return;

        setChartData(rows);

        let totalBills = 0;
        let paid = 0;
        let pending = 0;
        let rejected = 0;
        let revenue = 0;

        rows.forEach((row) => {
          totalBills += Number(row.totalBills || 0);
          paid += Number(row.paid || 0);
          pending += Number(row.pending || 0);
          rejected += Number(row.rejected || 0);
          revenue += Number(row.revenue || 0);
        });

        setSummary({ totalBills, paid, pending, rejected, revenue });
      })
      .catch(() => setChartData([]));

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const statusData = [
    { name: "Paid", value: summary.paid },
    { name: "Pending", value: summary.pending },
    { name: "Rejected", value: summary.rejected },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <div className="w-full px-4 text-black sm:px-6 lg:px-10 py-8 bg-gray-100 min-h-screen">
      
      {/* HEADER */}
      <div className="flex justify-center mb-8">
  <h1 className="inline-block text-2xl md:text-3xl font-semibold px-6 py-2 
                 rounded-xl bg-white shadow-md text-gray-800">
    Dashboard Analytics
  </h1>
</div>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <Card title="Total Revenue" value={`₹${summary.revenue.toLocaleString()}`} />
        <Card title="Total Bills" value={summary.totalBills} />
        <Card title="Paid Bills" value={summary.paid} highlight />
      </div>

      {/* ===== COMBINED CHART ===== */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 mb-10 overflow-x-auto">
        <h2 className="text-base sm:text-lg font-semibold mb-4">
          Monthly Revenue & Bills
        </h2>

        <div className="min-w-[350px]">
          <ResponsiveContainer width="100%" aspect={isMobile ? 1.2 : 2.5}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />

              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Line
                type="monotone"
                dataKey="totalBills"
                stroke="#111827"
                strokeWidth={2}
                name="Total Bills"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== DONUT CHART ===== */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-base text-center sm:text-lg font-semibold mb-1">
          Bill Status Distribution
        </h2>

        <ResponsiveContainer width="100%" aspect={isMobile ? 1 : 2}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              innerRadius={isMobile ? 50 : 80}
              outerRadius={isMobile ? 80 : 120}
              paddingAngle={3}
              label={!isMobile}
            >
              {statusData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* STATUS TAGS */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {statusData.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 border rounded-full text-xs sm:text-sm"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              ></span>
              {item.name} ({item.value})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Reusable Card Component */
function Card({ title, value, highlight }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2
        className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
          highlight ? "text-green-600" : ""
        }`}
      >
        {value}
      </h2>
    </div>
  );
}