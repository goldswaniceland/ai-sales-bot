import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendEmail, paymentConfirmationEmail } from "@/lib/email";
import { formatDate } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle payment_intent.succeeded event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      // Find booking by payment intent ID
      const booking = await db.booking.findFirst({
        where: {
          stripePaymentIntentId: paymentIntent.id,
        },
        include: {
          bookingRequest: {
            include: {
              user: true,
              journeyTemplate: true,
            },
          },
        },
      });

      if (!booking) {
        console.error("Booking not found for payment intent:", paymentIntent.id);
        return NextResponse.json({ received: true });
      }

      // Update booking payment status
      await db.booking.update({
        where: { id: booking.id },
        data: { paymentStatus: "paid" },
      });

      // Update booking request status
      await db.bookingRequest.update({
        where: { id: booking.bookingRequestId },
        data: { status: "confirmed" },
      });

      // Send confirmation email
      const emailData = paymentConfirmationEmail({
        userName: booking.bookingRequest.user.name || "Traveler",
        journeyName: booking.bookingRequest.journeyTemplate.name,
        startDate: formatDate(booking.bookingRequest.startDate),
        depositAmount: booking.depositAmount,
        balanceAmount: booking.balanceAmount,
        balanceDueDate: booking.balanceDueDate
          ? formatDate(booking.balanceDueDate)
          : "TBD",
      });

      await sendEmail({
        to: booking.bookingRequest.user.email,
        subject: emailData.subject,
        html: emailData.html,
      });

      console.log("✅ Payment confirmed for booking:", booking.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}
