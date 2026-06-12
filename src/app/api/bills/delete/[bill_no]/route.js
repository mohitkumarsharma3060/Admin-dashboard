import { NextResponse } from "next/server";
import db from "../../../../lib/db";

export async function DELETE(request, context) {
  try {
    const { bill_no } = await context.params;

    if (!bill_no) {
      return NextResponse.json(
        { success: false, message: "Bill number required" },
        { status: 400 }
      );
    }

    await db.query("DELETE FROM bills WHERE bill_no = ?", [bill_no]);

    return NextResponse.json({
      success: true,
      message: "Bill deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}