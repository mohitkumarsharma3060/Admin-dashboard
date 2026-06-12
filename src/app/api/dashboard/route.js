import { NextResponse } from "next/server";
import db from "../../lib/db";

export async function GET() {
  try {

    const [billCountRows] = await db.query(
  "SELECT COUNT(*) AS totalBills FROM bills"
);

const [revenueRows] = await db.query(
  "SELECT SUM(final_total) AS totalRevenue FROM bills WHERE status = ?",
  ["Paid"]
);

const [customerRows] = await db.query(
  "SELECT COUNT(DISTINCT party_name) AS totalCustomers FROM bills"
);
    return NextResponse.json({
      success: true,
      totalBills: billCountRows[0].totalBills || 0,
      totalRevenue: revenueRows[0].totalRevenue || 0,
      totalCustomers: customerRows[0].totalCustomers || 0,
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}