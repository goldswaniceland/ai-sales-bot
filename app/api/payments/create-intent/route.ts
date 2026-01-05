import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { addDays } from "date-fns";

export async function POST(request: Request) {
  try {
    const { bookingRequestId } = await request.json();

    if (!bookingRequestId) {
      return NextResponse.json(
        { error: "Missing bookingRequestId" },
        { status: 400 }
      );
    }

    // Get booking request
    const bookingRequest = await db.bookingRequest.findUnique({
      where: { id: bookingRequestId },
      include: {
        user: true,
        journeyTemplate: true,
      },
    });

    if (!bookingRequest) {
      return NextResponse.json(
        { error: "Booking request not found" },
        { status: 404 }
      );
    }

    // Check if booking already exists
    const existingBooking = await db.booking.findUnique({
      where: { bookingRequestId },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Booking already exists for this request" },
        { status: 400 }
      );
    }

    // Calculate deposit (50% of total)
    const depositAmount = Math.floor(bookingRequest.totalPrice / 2);
    const balanceAmount = bookingRequest.totalPrice - depositAmount;
    const balanceDueDate = addDays(new Date(bookingRequest.startDate), -30);

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: depositAmount,
      currency: "usd",
      metadata: {
        bookingRequestId,
        userId: bookingRequest.userId,
        journeyName: bookingRequest.journeyTemplate.name,
      },
      description: `Deposit for ${bookingRequest.journeyTemplate.name} - ${bookingRequest.user.email}`,
    });

    // Create booking record
    const booking = await db.booking.create({
      data: {
        bookingRequestId,
        stripePaymentIntentId: paymentIntent.id,
        depositAmount,
        balanceAmount,
        balanceDueDate,
        paymentStatus: "pending",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      bookingId: booking.id,
      depositAmount,
      balanceAmount,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
