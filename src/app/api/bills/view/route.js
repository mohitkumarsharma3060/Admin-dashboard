import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        bill_no,
        party_name,
        gstin,
        bill_date,
        subtotal,
        gst_percent,
        gst_amount,
        wat_charge,
        final_total
      FROM bills
      GROUP BY bill_no
      ORDER BY bill_no DESC
    `);

    return NextResponse.json({
      success: true,
      bills: rows,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}