import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function GET() {
  try {

   const [rows] = await db.query(
  `SELECT bill_no, party_name, final_total, status 
   FROM bills 
   ORDER BY bill_no DESC
   LIMIT 10`
);

    return NextResponse.json({
      success: true,
      bills: rows,
    });

  } catch (error) {
    console.error("RECENT BILL ERROR:", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}