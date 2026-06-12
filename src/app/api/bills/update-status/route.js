import { NextResponse } from "next/server";
import db from "../../../lib/db"; // your db connection

export async function PUT(req) {
  try {
    const { bill_no, status } = await req.json();

    await db.query(
      "UPDATE bills SET status = ? WHERE bill_no = ?",
      [status, bill_no]
    );

    return NextResponse.json({
      message: "Status updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Database error" },
      { status: 500 }
    );
  }
}