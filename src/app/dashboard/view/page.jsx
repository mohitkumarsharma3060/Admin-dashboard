"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function BillsPage() {
  const [bills, setBills] = useState([]);

  // =============================
  // CHANGE STATUS
  // =============================
  const handleStatusChange = async (billNo, newStatus) => {
    if (!newStatus) return;

    try {
      const res = await fetch("/api/bills/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bill_no: billNo,
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Status updated successfully");

        // Update UI instantly
        setBills((prev) =>
          prev.map((bill) =>
            bill.bill_no === billNo
              ? { ...bill, status: newStatus }
              : bill
          )
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      alert("Error updating status");
    }
  };
  // =============================
  // FETCH BILLS
  // =============================
  useEffect(() => {
    fetch("/api/bills/view")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBills(data.bills);
        }
      });
  }, []);

  // =============================
  // DELETE
  // =============================
  const handleDelete = async (billNo) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this bill?"
    );
    if (!confirmDelete) return;

    const res = await fetch(`/api/bills/delete/${billNo}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Bill deleted successfully");
      setBills((prev) =>
        prev.filter((b) => b.bill_no !== billNo)
      );
    } else {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 text-black min-h-screen">
      <div className="bg-white p-4 md:p-6 rounded-xl shadow">

        <h1 className="text-xl md:text-2xl text-center font-bold mb-6">
          Telco Brush Ware - Bills Dashboard
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full border text-xs md:text-sm min-w-[700px]">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-2">Bill No</th>
                <th className="p-2">Party</th>
                <th className="p-2">Date</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {bills.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center p-4"
                  >
                    No Bills Found
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr
                    key={bill.bill_no}
                    className="border hover:bg-gray-50"
                  >
                    <td className="text-center p-2">
                      {bill.bill_no}
                    </td>

                    <td className="p-2">
                      {bill.party_name}
                    </td>

                    <td className="text-center p-2">
                      {bill.bill_date?.split("T")[0]}
                    </td>

                    <td className="text-center font-semibold p-2">
                      ₹{Number(bill.final_total).toFixed(2)}
                    </td>

                    <td className="text-center p-2">
                      <select
                        value={bill.status ?? ""}
                        onChange={(e) =>
                          handleStatusChange(bill.bill_no, e.target.value)
                        }
                        className="w-full md:w-auto px-3 py-2 border rounded-md text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="" disabled>
                          Select Status
                        </option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="p-2">
                      <div className="flex flex-col md:flex-row gap-2 justify-center">

                        <Link
                          href={`/dashboard/view-bill/${bill.bill_no}`}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs md:text-sm text-center"
                        >
                          View
                        </Link>

                        <Link
                          href={`/dashboard/edit/${bill.bill_no}`}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-xs md:text-sm text-center"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(bill.bill_no)
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs md:text-sm"
                        >
                          Delete
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}