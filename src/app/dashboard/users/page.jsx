"use client";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function UsersPage() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const billsPerPage = 5;

  // ===============================
  // FETCH DATA
  // ===============================
  useEffect(() => {
    fetch("/api/bills/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBills(data.bills);
      });
  }, []);

  // ===============================
  // FILTER + SEARCH
  // ===============================
  const filteredBills = bills.filter((bill) => {
    const matchSearch = bill.party_name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" ||
      bill.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // ===============================
  // PAGINATION
  // ===============================
  const indexOfLast = currentPage * billsPerPage;
  const indexOfFirst = indexOfLast - billsPerPage;
  const currentBills = filteredBills.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(
    filteredBills.length / billsPerPage
  );

  // ===============================
  // PDF DOWNLOAD
  // ===============================
  const downloadPDF = (bill) => {
    const doc = new jsPDF();

    doc.text(`Bill No: ${bill.bill_no}`, 20, 20);
    doc.text(`Party: ${bill.party_name}`, 20, 30);
    doc.text(`GSTIN: ${bill.gstin || "-"}`, 20, 40);
    doc.text(
      `Date: ${bill.bill_date?.split("T")[0]}`,
      20,
      50
    );
    doc.text(
      `Amount: ₹${Number(bill.final_total).toFixed(2)}`,
      20,
      60
    );
    doc.text(`Status: ${bill.status}`, 20, 70);

    doc.save(`Bill_${bill.bill_no}.pdf`);
  };

  return (
    <div className="min-h-screen text-black bg-gray-100 p-4 md:p-8">
      <div className="bg-white rounded-xl shadow p-4 md:p-6">

   <div className="text-center mb-8">
  <h1 className="inline-block text-2xl md:text-3xl font-semibold px-6 py-2 
                 rounded-xl bg-white shadow-md text-gray-800">
    User Data
  </h1>
</div>
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">

          <input
            type="text"
            placeholder="Search by Party Name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded w-full"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded w-full md:w-52"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Paid</option>
            <option>Rejected</option>
          </select>

        </div>

        {/* ===================== */}
        {/* Desktop Table View */}
        {/* ===================== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border text-sm">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Bill No</th>
                <th className="p-2 border">Party</th>
                <th className="p-2 border">GSTIN</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">PDF</th>
              </tr>
            </thead>

            <tbody>
              {currentBills.map((bill) => (
                <tr key={bill.bill_no} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">
                    {bill.bill_no}
                  </td>
                  <td className="p-2 border">
                    {bill.party_name}
                  </td>
                  <td className="p-2 border">
                    {bill.gstin || "-"}
                  </td>
                  <td className="p-2 border text-center">
                    {bill.bill_date?.split("T")[0]}
                  </td>
                  <td className="p-2 border text-center font-semibold">
                    ₹{Number(bill.final_total).toFixed(2)}
                  </td>
                  <td className="p-2 border text-center">
                    {bill.status}
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => downloadPDF(bill)}
                      className="border px-3 py-1 rounded"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* ===================== */}
        {/* Mobile Card View */}
        {/* ===================== */}
        <div className="md:hidden space-y-4">
          {currentBills.map((bill) => (
            <div
              key={bill.bill_no}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="font-semibold">
                Bill No: {bill.bill_no}
              </div>
              <div>Party: {bill.party_name}</div>
              <div>GSTIN: {bill.gstin || "-"}</div>
              <div>
                Date: {bill.bill_date?.split("T")[0]}
              </div>
              <div className="font-semibold">
                ₹{Number(bill.final_total).toFixed(2)}
              </div>
              <div>Status: {bill.status}</div>

              <button
                onClick={() => downloadPDF(bill)}
                className="mt-3 border px-3 py-1 rounded w-full"
              >
                Download PDF
              </button>
            </div>
          ))}
        </div>

        {/* ===================== */}
        {/* Pagination */}
        {/* ===================== */}
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}