// File: src/app/api/bills/[bill_no]/route.js
import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function GET(request, { params }) {
  const { bill_no } = params;

  try {
    const [rows] = await db.query(
      `SELECT 
        bill_no,
        party_name,
        gstin,
        bill_date,
        status,
        description,
        size_13, size_19, size_25, size_38, size_50,
        size_63, size_75, size_100, size_125,
        total_mm,
        rate_per_25mm,
        amount,
        subtotal,
        gst_percent,
        gst_amount,
        wat_charge,
        final_total,
        created_at
      FROM bills 
      WHERE bill_no = ?`,
      [bill_no]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Bill not found" },
        { status: 404 }
      );
    }

    const row = rows[0];

    // Convert size columns into items array (only sizes with qty > 0)
    const items = [
      { id: 1,  size_mm: 13,  quantity: row.size_13  },
      { id: 2,  size_mm: 19,  quantity: row.size_19  },
      { id: 3,  size_mm: 25,  quantity: row.size_25  },
      { id: 4,  size_mm: 38,  quantity: row.size_38  },
      { id: 5,  size_mm: 50,  quantity: row.size_50  },
      { id: 6,  size_mm: 63,  quantity: row.size_63  },
      { id: 7,  size_mm: 75,  quantity: row.size_75  },
      { id: 8,  size_mm: 100, quantity: row.size_100 },
      { id: 9,  size_mm: 125, quantity: row.size_125 },
    ]
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        ...item,
        description: row.description || "Brush",
        rate: Number(row.rate_per_25mm) || 0,
      }));

    const bill = {
      bill_no:      row.bill_no,
      party_name:   row.party_name,
      gstin:        row.gstin,
      bill_date:    row.bill_date,
      status:       row.status,
      total_amount: Number(row.final_total),
      subtotal:     Number(row.subtotal),
      gst_percent:  Number(row.gst_percent),
      gst_amount:   Number(row.gst_amount),
      wat_charge:   Number(row.wat_charge),
      total_mm:     Number(row.total_mm),
      rate_per_25mm: Number(row.rate_per_25mm),
      items,
    };

    return NextResponse.json({ success: true, bill });

  } catch (error) {
    console.error("GET /api/bills/[bill_no] error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

