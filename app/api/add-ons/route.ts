import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const addOns = await db.addOn.findMany({
      where: type
        ? {
            OR: [
              { applicableTo: { has: type } },
              { applicableTo: { has: "all" } },
            ],
          }
        : undefined,
    });

    return NextResponse.json(addOns);
  } catch (error) {
    console.error("Error fetching add-ons:", error);
    return NextResponse.json(
      { error: "Failed to fetch add-ons" },
      { status: 500 }
    );
  }
}
