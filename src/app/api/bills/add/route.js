import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function POST(req) {
  try {
    const data = await req.json();

    const {
      bill_no,
      party_name,
      gstin,
      bill_date,
      items,
      gst_percent,
      gst_amount,
      wat_charge,
      final_total,
    } = data;

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    // Insert each item as separate row
    for (let item of items) {
      await db.query(
        `INSERT INTO bills (
          bill_no,
          party_name,
          gstin,
          bill_date,
          description,
          size_13,
          size_19,
          size_25,
          size_38,
          size_50,
          size_63,
          size_75,
          size_100,
          size_125,
          total_mm,
          rate_per_25mm,
          amount,
          subtotal,
          gst_percent,
          gst_amount,
          wat_charge,
          final_total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bill_no,
          party_name,
          gstin,
          bill_date,
          item.description,
          item.size_13,
          item.size_19,
          item.size_25,
          item.size_38,
          item.size_50,
          item.size_63,
          item.size_75,
          item.size_100,
          item.size_125,
          item.total_mm,
          item.rate_per_25mm,
          item.amount,
          subtotal,
          gst_percent,
          gst_amount,
          wat_charge,
          final_total,
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bill Saved Successfully ✅",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong ❌" },
      { status: 500 }
    );
  }
}