"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface BillItem {
  id: number;
  description: string;
  size_mm: number;
  quantity: number;
  rate: number;
}

interface Bill {
  bill_no: string;
  party_name: string;
  gstin: string;
  bill_date: string;
  status: string;
  total_amount: number;
  items: BillItem[];
}

export default function ViewBillPage() {
  const { bill_no } = useParams() as { bill_no: string };
  const router = useRouter();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch bill from API
  const fetchBill = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/bills/${bill_no}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch bill: ${res.status}`);
      }

      const data = await res.json();
      setBill(data.bill || null);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBill();
  }, [bill_no]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!bill) return <p className="p-6">Bill not found</p>;

  const items = bill.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.rate || 0),
    0
  );
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  return (
    <div className="p-6 bg-white text-black min-h-screen">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <h1 className="inline-block text-2xl md:text-3xl font-semibold px-6 py-2 
                 rounded-xl bg-white shadow-md text-gray-800">Telco Brush Ware</h1>
        <p className="text-gray-600">Invoice / Bill Details</p>
      </div>

      {/* Bill Info */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <p><strong>Bill No:</strong> {bill.bill_no}</p>
          <p><strong>Party Name:</strong> {bill.party_name}</p>
          <p><strong>GSTIN:</strong> {bill.gstin || "N/A"}</p>
        </div>

        <div>
          <p><strong>Date:</strong> {bill.bill_date}</p>
          <p><strong>Status:</strong> {bill.status}</p>
          <p><strong>Total Amount:</strong> ₹{bill.total_amount}</p>
        </div>
      </div>

      {/* Items Table */}
      <h2 className="text-xl font-semibold mb-3">Items Details</h2>

      {items.length > 0 ? (
        <table className="w-full border border-collapse mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">#</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Size (MM)</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{item.description}</td>
                <td className="border p-2 text-center">{item.size_mm} MM</td>
                <td className="border p-2 text-center">{item.quantity}</td>
                <td className="border p-2 text-center">₹{item.rate}</td>
                <td className="border p-2 text-center">₹{item.quantity * item.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items found for this bill.</p>
      )}

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-full md:w-1/3 border p-4">
          <p className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </p>

          <p className="flex justify-between">
            <span>GST (18%):</span>
            <span>₹{gst.toFixed(2)}</span>
          </p>

          <hr className="my-2" />

          <p className="flex justify-between font-bold text-lg">
            <span>Grand Total:</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Print
        </button>

        <button
          onClick={() => router.back()}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}