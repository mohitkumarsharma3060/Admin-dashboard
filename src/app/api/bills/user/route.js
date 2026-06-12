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
        final_total,
        status
      FROM bills
      ORDER BY bill_no DESC
    `);

    return NextResponse.json({
      success: true,
      bills: rows,
    });
  } catch (error) {
    console.error("USER BILL FETCH ERROR:", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}