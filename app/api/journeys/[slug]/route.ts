import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const journey = await db.journeyTemplate.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        itineraryDays: {
          include: {
            accommodation: true,
          },
          orderBy: {
            dayNumber: "asc",
          },
        },
      },
    });

    if (!journey) {
      return NextResponse.json(
        { error: "Journey not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(journey);
  } catch (error) {
    console.error("Error fetching journey:", error);
    return NextResponse.json(
      { error: "Failed to fetch journey" },
      { status: 500 }
    );
  }
}
