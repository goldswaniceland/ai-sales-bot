import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail, bookingRequestReceivedEmail, newBookingRequestAdminEmail } from "@/lib/email";
import { formatDate } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.email || !data.journeyTemplateId || !data.startDate || !data.travelers) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get journey template
    const journey = await db.journeyTemplate.findUnique({
      where: { id: data.journeyTemplateId },
    });

    if (!journey) {
      return NextResponse.json(
        { error: "Journey not found" },
        { status: 404 }
      );
    }

    // Get add-ons if any selected
    let addOnsTotal = 0;
    if (data.selectedAddOns && data.selectedAddOns.length > 0) {
      const addOns = await db.addOn.findMany({
        where: { id: { in: data.selectedAddOns } },
      });
      addOnsTotal = addOns.reduce((sum, addOn) => sum + addOn.price, 0);
    }

    // Calculate total price
    const totalPrice = journey.basePrice + addOnsTotal;

    // Create or find user
    let user = await db.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: data.email,
          name: data.name,
          phone: data.phone,
        },
      });
    } else if (data.name || data.phone) {
      // Update user info if provided
      user = await db.user.update({
        where: { id: user.id },
        data: {
          name: data.name || user.name,
          phone: data.phone || user.phone,
        },
      });
    }

    // Create booking request
    const request = await db.bookingRequest.create({
      data: {
        userId: user.id,
        journeyTemplateId: data.journeyTemplateId,
        startDate: new Date(data.startDate),
        travelers: data.travelers,
        selectedAddOns: data.selectedAddOns || [],
        totalPrice,
        specialRequests: data.specialRequests,
        status: "pending",
      },
    });

    // Send confirmation email to user
    const userEmailData = bookingRequestReceivedEmail({
      userName: user.name || "Traveler",
      journeyName: journey.name,
      startDate: formatDate(request.startDate),
      travelers: request.travelers,
    });

    await sendEmail({
      to: user.email,
      subject: userEmailData.subject,
      html: userEmailData.html,
    });

    // Send notification email to admin
    const adminEmailData = newBookingRequestAdminEmail({
      userName: user.name || "N/A",
      userEmail: user.email,
      userPhone: user.phone || undefined,
      journeyName: journey.name,
      startDate: formatDate(request.startDate),
      travelers: request.travelers,
      totalPrice,
      specialRequests: request.specialRequests || undefined,
      requestId: request.id,
    });

    await sendEmail({
      to: "hello@legacypaths.guide",
      subject: adminEmailData.subject,
      html: adminEmailData.html,
    });

    return NextResponse.json({
      requestId: request.id,
      message: "Booking request submitted successfully",
    });
  } catch (error) {
    console.error("Error creating booking request:", error);
    return NextResponse.json(
      { error: "Failed to create booking request" },
      { status: 500 }
    );
  }
}
