"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Eye,
  FileText,
  DollarSign,
  Users,
  RefreshCcw,
  Menu
} from "lucide-react";

export default function Dashboard() {
  const [billData, setBillData] = useState([]);
  const [stats, setStats] = useState({
    totalBills: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      if (data.success) setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecentBills = async () => {
    try {
      const res = await fetch("/api/dashboard/recent-bills");
      const data = await res.json();
      if (data.success) setBillData(data.bills);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDashboard = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchRecentBills()]);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-black">

      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-700 text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">Telco Brush Ware</h2>
        <button onClick={() => setMobileMenu(!mobileMenu)}>
          <Menu />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`bg-indigo-700 text-white p-6 w-full md:w-64 ${mobileMenu ? "block" : "hidden"} md:block`}>
        <h2 className="text-2xl font-bold mb-8 hidden md:block">Telco Brush Ware </h2>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className="block hover:bg-indigo-600 p-2 rounded">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/dashboard/users" className="block hover:bg-indigo-600 p-2 rounded">
              Users
            </Link>
          </li>
          <li>
            <Link href="/dashboard/view" className="block hover:bg-indigo-600 p-2 rounded">
              Bills
            </Link>
          </li>
          <li>
            <Link href="/dashboard/statistics" className="block hover:bg-indigo-600 p-2 rounded">
              Statistics
            </Link>
          </li>
          <li>
            <Link href="/dashboard/" className="block hover:bg-indigo-600 p-2 rounded">
              Settings
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main */}
      <div className="flex-1 p-4 sm:p-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-700">
            Dashboard Overview
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={loadDashboard}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <RefreshCcw size={16} /> Refresh
            </button>

            <div className="bg-white shadow px-4 py-2 rounded-lg">
              Welcome, Admin 👋
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Total Bills</p>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {stats.totalBills}
                </h2>
              </div>
              <FileText className="text-indigo-600" size={36} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Revenue</p>
                <h2 className="text-xl sm:text-2xl font-bold">
                  ₹{Number(stats.totalRevenue || 0).toLocaleString()}
                </h2>
              </div>
              <DollarSign className="text-green-600" size={36} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Customers</p>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {stats.totalCustomers}
                </h2>
              </div>
              <Users className="text-purple-600" size={36} />
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/dashboard/add-bill">
              <button className="w-full bg-indigo-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition">
                <PlusCircle size={18}/> Add Bill
              </button>
            </Link>

            <Link href="/dashboard/view">
              <button className="w-full bg-blue-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                <Eye size={18}/> View Bills
              </button>
            </Link>

              <Link href="/dashboard/statistics">
              <button className="w-full bg-blue-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                <Eye size={18}/> Statistics
              </button>
            </Link>
          </div>
        </div>
             
        

        {/* Recent Bills Table */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
            Last 10 Bills
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3">Bill No</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : billData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">
                      No bills found
                    </td>
                  </tr>
                ) : (
                  billData.map((bill) => (
                    <tr
                      key={bill.bill_no}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">{bill.bill_no}</td>
                      <td className="p-3">{bill.party_name}</td>
                      <td className="p-3">
                        ₹{Number(bill.final_total || 0).toLocaleString()}
                      </td>
                      <td className="p-3">
                        {bill.status || "Pending"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}