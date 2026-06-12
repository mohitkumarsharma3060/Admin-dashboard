import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        DATE_FORMAT(bill_date, '%b') AS month,
        COUNT(*) AS totalBills,
        SUM(status = 'Paid') AS paid,
        SUM(status = 'Pending') AS pending,
        SUM(status = 'Rejected') AS rejected,
        SUM(CASE WHEN status = 'Paid' THEN final_total ELSE 0 END) AS revenue
      FROM bills
      GROUP BY YEAR(bill_date), MONTH(bill_date)
      ORDER BY YEAR(bill_date), MONTH(bill_date)
    `);

    return NextResponse.json(rows || []);
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}