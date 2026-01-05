import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const journeys = await db.journeyTemplate.findMany({
      where: {
        status: "published",
      },
      orderBy: {
        type: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        duration: true,
        basePrice: true,
        description: true,
        highlights: true,
      },
    });

    return NextResponse.json(journeys);
  } catch (error) {
    console.error("Error fetching journeys:", error);
    return NextResponse.json(
      { error: "Failed to fetch journeys" },
      { status: 500 }
    );
  }
}
