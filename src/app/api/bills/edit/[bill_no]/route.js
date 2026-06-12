import { NextResponse } from "next/server";
import db from "../../../../lib/db"

const sizes = [13, 19, 25, 38, 50, 63, 75, 100, 125];

// ================= GET =================
export async function GET(req, { params }) {
  const bill_no = params.bill_no;

  const [bill] = await db.query(
    "SELECT * FROM bills WHERE bill_no=? AND description IS NULL",
    [bill_no]
  );

  const [items] = await db.query(
    "SELECT * FROM bills WHERE bill_no=? AND description IS NOT NULL",
    [bill_no]
  );

  return NextResponse.json({
    success: true,
    bill: bill[0],
    items,
  });
}

// ================= PUT =================
export async function PUT(req, { params }) {
  const bill_no = params.bill_no;
  const body = await req.json();

  // UPDATE BILL
  await db.query(
    `UPDATE bills SET 
      party_name=?, gstin=?, gst_percent=?, 
      wat_charge=?, subtotal=?, gst_amount=?, final_total=? 
     WHERE bill_no=? AND description IS NULL`,
    [
      body.party_name,
      body.gstin,
      body.gst_percent,
      body.wat_charge,
      body.subtotal,
      body.gst_amount,
      body.final_total,
      bill_no,
    ]
  );

  // UPDATE ITEMS
  for (const item of body.items) {
    let total_mm = 0;

    sizes.forEach((size) => {
      total_mm += Number(item[`size_${size}`] || 0);
    });

    const total = total_mm * 12;
    const amount = Number(item.rate_per_25mm || 0) * total;

    await db.query(
      `UPDATE bills SET 
        description=?, rate_per_25mm=?, total_mm=?, amount=?,
        size_13=?, size_19=?, size_25=?, size_38=?,
        size_50=?, size_63=?, size_75=?, size_100=?, size_125=?
      WHERE id=?`,
      [
        item.description,
        item.rate_per_25mm,
        total_mm,
        amount,
        item.size_13 || 0,
        item.size_19 || 0,
        item.size_25 || 0,
        item.size_38 || 0,
        item.size_50 || 0,
        item.size_63 || 0,
        item.size_75 || 0,
        item.size_100 || 0,
        item.size_125 || 0,
        item.id,
      ]
    );
  }

  return NextResponse.json({ success: true });
}