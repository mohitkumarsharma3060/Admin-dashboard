"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditBill() {
  const { bill_no } = useParams();
  const router = useRouter();

  const sizes = [13, 19, 25, 38, 50, 63, 75, 100, 125];

  const [bill, setBill] = useState({
    party_name: "",
    gstin: "",
    gst_percent: 18,
    wat_charge: 0,
  });

  const [items, setItems] = useState([]);

  // ==============================
  // FETCH BILL
  // ==============================
  useEffect(() => {
    if (!bill_no) return;

    const fetchBill = async () => {
      try {
        const res = await fetch(`/api/bills/edit/${bill_no}`);
        const data = await res.json();

        if (data.success) {
          setBill({
            party_name: data.bill.party_name || "",
            gstin: data.bill.gstin || "",
            gst_percent: Number(data.bill.gst_percent || 0),
            wat_charge: Number(data.bill.wat_charge || 0),
          });

          const formattedItems = data.items.map((item) => {
            const newItem = { ...item };

            sizes.forEach((size) => {
              newItem[`size_${size}`] =
                Number(item[`size_${size}`] || 0);
            });

            return newItem;
          });

          setItems(formattedItems);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBill();
  }, [bill_no]);

  // ==============================
  // CALCULATE
  // ==============================
  const calculateItem = (item) => {
    let total_mm = 0;

    sizes.forEach((size) => {
      total_mm += Number(item[`size_${size}`] || 0);
    });

    const amount =
      (total_mm / 25) * Number(item.rate_per_25mm || 0);

    return { ...item, total_mm, amount };
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];

    updated[index][field] =
      field === "description" ? value : Number(value);

    updated[index] = calculateItem(updated[index]);

    setItems(updated);
  };

  // ==============================
  // TOTALS
  // ==============================
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const gst_amount =
    (subtotal * Number(bill.gst_percent || 0)) / 100;

  const final_total =
    subtotal + gst_amount + Number(bill.wat_charge || 0);

  // ==============================
  // UPDATE
  // ==============================
  const handleUpdate = async () => {
    const res = await fetch(`/api/bills/edit/${bill_no}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...bill,
        subtotal,
        gst_amount,
        final_total,
        items,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Bill Updated Successfully ✅");
      router.push("/bills");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 text-black min-h-screen">
      <div className="bg-white p-4 md:p-6 rounded shadow">

       <div className="text-center mb-8">
  <h1 className="inline-block text-2xl md:text-3xl font-semibold px-6 py-2 
                 rounded-xl bg-white shadow-md text-gray-800">
    Edit Bill No :- #{bill_no} - Telco Brush Ware
  </h1>
</div>
        {/* Header Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            className="border p-2 w-full rounded"
            value={bill.party_name}
            onChange={(e) =>
              setBill({ ...bill, party_name: e.target.value })
            }
            placeholder="Party Name"
          />

          <input
            className="border p-2 w-full rounded"
            value={bill.gstin}
            onChange={(e) =>
              setBill({ ...bill, gstin: e.target.value })
            }
            placeholder="GSTIN"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border text-xs md:text-sm min-w-[1000px]">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-2">Description</th>
                {sizes.map((s) => (
                  <th key={s} className="p-2">{s}</th>
                ))}
                <th className="p-2">Total</th>
                <th className="p-2">Rate</th>
                <th className="p-2">Amount</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border">
                  <td className="p-1">
                    <input
                      value={item.description || ""}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      className="border p-1 w-40"
                    />
                  </td>

                  {sizes.map((size) => (
                    <td key={size} className="p-1">
                      <input
                        type="number"
                        value={item[`size_${size}`] || ""}
                        onChange={(e) =>
                          handleItemChange(index, `size_${size}`, e.target.value)
                        }
                        className="border w-14 md:w-16 p-1"
                      />
                    </td>
                  ))}

                  <td className="p-2">
                    {Number(item.total_mm || 0).toFixed(2)}
                  </td>

                  <td className="p-1">
                    <input
                      type="number"
                      value={item.rate_per_25mm || ""}
                      onChange={(e) =>
                        handleItemChange(index, "rate_per_25mm", e.target.value)
                      }
                      className="border w-16 md:w-20 p-1"
                    />
                  </td>

                  <td className="p-2 font-semibold">
                    ₹{Number(item.amount || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 flex justify-center md:justify-end">
          <div className="w-full md:w-80 bg-gray-50 p-4 rounded shadow text-sm">

            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span>GST %:</span>
              <input
                type="number"
                value={bill.gst_percent}
                onChange={(e) =>
                  setBill({
                    ...bill,
                    gst_percent: Number(e.target.value),
                  })
                }
                className="border w-20 p-1 rounded text-right"
              />
            </div>

            <div className="flex justify-between mb-2">
              <span>GST Amount:</span>
              <span>₹{gst_amount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center mb-2">
              <span>WAT:</span>
              <input
                type="number"
                value={bill.wat_charge}
                onChange={(e) =>
                  setBill({
                    ...bill,
                    wat_charge: Number(e.target.value),
                  })
                }
                className="border w-20 p-1 rounded text-right"
              />
            </div>

            <hr className="my-2" />

            <div className="flex justify-between font-bold text-base">
              <span>Final Total:</span>
              <span>₹{final_total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleUpdate}
          className="mt-6 w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded"
        >
          Update Bill
        </button>

      </div>
    </div>
  );
}