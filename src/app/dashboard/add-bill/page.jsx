"use client";
import { useState } from "react";

export default function AddBill() {
  const emptyItem = {
    description: "",
    size_13: 0,
    size_19: 0,
    size_25: 0,
    size_38: 0,
    size_50: 0,
    size_63: 0,
    size_75: 0,
    size_100: 0,
    size_125: 0,
    total_mm: 0,
    rate_per_25mm: 0,
    amount: 0,
  };

  const [bill, setBill] = useState({
    bill_no: "",
    party_name: "",
    gstin: "",
    bill_date: "",
  });

  const [gstPercent, setGstPercent] = useState(18);
  const watCharge = 25;
  const [items, setItems] = useState([emptyItem]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    if (field === "description") {
      updatedItems[index][field] = value;
    } else {
      updatedItems[index][field] = Number(value);
    }

    updatedItems[index].amount =
      updatedItems[index].total_mm *
      updatedItems[index].rate_per_25mm;

    setItems(updatedItems);
  };

  const addRow = () => {
    setItems([...items, { ...emptyItem }]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const gstAmount = (subtotal * gstPercent) / 100;
  const finalTotal = subtotal + gstAmount + watCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/bills/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...bill,
        items,
        gst_percent: gstPercent,
        gst_amount: gstAmount,
        wat_charge: watCharge,
        final_total: finalTotal,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Bill Saved Successfully ✅");

      setBill({
        bill_no: "",
        party_name: "",
        gstin: "",
        bill_date: "",
      });

      setGstPercent(18);
      setItems([{ ...emptyItem }]);
    } else {
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen text-black">
      
   <div className="text-center mb-8">
  <h1 className="inline-block text-2xl md:text-3xl font-semibold px-6 py-2 
                 rounded-xl bg-white shadow-md text-gray-800">
    Entry Bill Data - Telco Brush Ware
  </h1>
</div>

      {/* Bill Header */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Bill No"
          value={bill.bill_no}
          className="border p-2 rounded w-full"
          onChange={(e) =>
            setBill({ ...bill, bill_no: e.target.value })
          }
        />

        <input
          type="date"
          value={bill.bill_date}
          className="border p-2 rounded w-full"
          onChange={(e) =>
            setBill({ ...bill, bill_date: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Party Name (M/s)"
          value={bill.party_name}
          className="border p-2 rounded w-full"
          onChange={(e) =>
            setBill({ ...bill, party_name: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="GSTIN"
          value={bill.gstin}
          className="border p-2 rounded w-full"
          onChange={(e) =>
            setBill({ ...bill, gstin: e.target.value })
          }
        />
      </div>

      {/* Items Table */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow">
        <div className="overflow-x-auto">
          <table className="w-full border text-xs md:text-sm min-w-[1000px]">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-2">Description</th>
                {[13,19,25,38,50,63,75,100,125].map((size) => (
                  <th key={size} className="p-2">{size}MM</th>
                ))}
                <th className="p-2">Total MM</th>
                <th className="p-2">Rate/25MM</th>
                <th className="p-2">Amount</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border">
                  <td className="p-1">
                    <input
                      type="text"
                      value={item.description}
                      className="border p-1 w-40"
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                    />
                  </td>

                  {[13,19,25,38,50,63,75,100,125].map((size) => (
                    <td key={size} className="p-1">
                      <input
                        type="number"
                        value={item[`size_${size}`]}
                        className="border w-14 md:w-16 p-1"
                        onChange={(e) =>
                          handleItemChange(index, `size_${size}`, e.target.value)
                        }
                      />
                    </td>
                  ))}

                  <td className="p-1">
                    <input
                      type="number"
                      value={item.total_mm}
                      className="border w-16 md:w-20 p-1"
                      onChange={(e) =>
                        handleItemChange(index, "total_mm", e.target.value)
                      }
                    />
                  </td>

                  <td className="p-1">
                    <input
                      type="number"
                      value={item.rate_per_25mm}
                      className="border w-16 md:w-20 p-1"
                      onChange={(e) =>
                        handleItemChange(index, "rate_per_25mm", e.target.value)
                      }
                    />
                  </td>

                  <td className="text-center font-bold p-2">
                    ₹{item.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addRow}
          className="mt-4 w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Row
        </button>

        {/* Summary */}
        <div className="mt-6 flex justify-center md:justify-end">
          <div className="w-full md:w-80 bg-gray-50 p-4 rounded-lg shadow">

            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span>GST %:</span>
              <input
                type="number"
                value={gstPercent}
                onChange={(e) => setGstPercent(Number(e.target.value))}
                className="border w-20 p-1 rounded text-right"
              />
            </div>

            <div className="flex justify-between mb-2">
              <span>GST Amount:</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>WAT Charge:</span>
              <span>₹{watCharge.toFixed(2)}</span>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between text-lg font-bold">
              <span>Final Total:</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full md:w-auto bg-indigo-600 text-white px-6 py-2 rounded"
        >
          Save Bill
        </button>
      </div>
    </div>
  );
}