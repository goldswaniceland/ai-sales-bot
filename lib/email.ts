import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️  RESEND_API_KEY is not set - emails will not be sent");
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.log("📧 Email would be sent to:", to);
    console.log("Subject:", subject);
    return { success: true, id: "mock-email-id" };
  }

  try {
    const data = await resend.emails.send({
      from: "Legacy Paths <hello@legacypaths.guide>",
      to,
      subject,
      html,
    });

    return { success: true, id: data.id };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error };
  }
}

// Email Templates
export function bookingRequestReceivedEmail(data: {
  userName: string;
  journeyName: string;
  startDate: string;
  travelers: number;
}) {
  return {
    subject: "Booking Request Received - Legacy Paths",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">Thank you for your interest!</h1>
        <p>Hi ${data.userName},</p>
        <p>We've received your booking request for the <strong>${data.journeyName}</strong>.</p>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Journey Details:</h2>
          <p><strong>Journey:</strong> ${data.journeyName}</p>
          <p><strong>Start Date:</strong> ${data.startDate}</p>
          <p><strong>Travelers:</strong> ${data.travelers}</p>
        </div>

        <p>Our team will review your request and get back to you within 24 hours with a personalized proposal.</p>

        <p>In the meantime, feel free to reach out if you have any questions.</p>

        <p style="margin-top: 40px;">
          Warm regards,<br>
          <strong>The Legacy Paths Team</strong><br>
          <a href="mailto:hello@legacypaths.guide">hello@legacypaths.guide</a>
        </p>
      </div>
    `,
  };
}

export function newBookingRequestAdminEmail(data: {
  userName: string;
  userEmail: string;
  userPhone?: string;
  journeyName: string;
  startDate: string;
  travelers: number;
  totalPrice: number;
  specialRequests?: string;
  requestId: string;
}) {
  return {
    subject: `New Booking Request: ${data.journeyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">New Booking Request</h1>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Customer Information:</h2>
          <p><strong>Name:</strong> ${data.userName}</p>
          <p><strong>Email:</strong> ${data.userEmail}</p>
          ${data.userPhone ? `<p><strong>Phone:</strong> ${data.userPhone}</p>` : ""}
        </div>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Journey Details:</h2>
          <p><strong>Journey:</strong> ${data.journeyName}</p>
          <p><strong>Start Date:</strong> ${data.startDate}</p>
          <p><strong>Travelers:</strong> ${data.travelers}</p>
          <p><strong>Total Price:</strong> $${(data.totalPrice / 100).toFixed(2)}</p>
        </div>

        ${
          data.specialRequests
            ? `
          <div style="background-color: #fff9e6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Special Requests:</h2>
            <p>${data.specialRequests}</p>
          </div>
        `
            : ""
        }

        <p>
          <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/requests/${data.requestId}"
             style="background-color: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View in Admin Dashboard
          </a>
        </p>
      </div>
    `,
  };
}

export function paymentConfirmationEmail(data: {
  userName: string;
  journeyName: string;
  startDate: string;
  depositAmount: number;
  balanceAmount: number;
  balanceDueDate: string;
}) {
  return {
    subject: "Payment Confirmed - Legacy Paths",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">Payment Confirmed!</h1>
        <p>Hi ${data.userName},</p>
        <p>Thank you! We've received your deposit payment for <strong>${data.journeyName}</strong>.</p>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Payment Details:</h2>
          <p><strong>Deposit Paid:</strong> $${(data.depositAmount / 100).toFixed(2)}</p>
          <p><strong>Remaining Balance:</strong> $${(data.balanceAmount / 100).toFixed(2)}</p>
          <p><strong>Balance Due Date:</strong> ${data.balanceDueDate}</p>
        </div>

        <p>Your journey is now confirmed! We'll send you a detailed itinerary within 48 hours.</p>

        <p>We can't wait to welcome you to Iceland!</p>

        <p style="margin-top: 40px;">
          Best regards,<br>
          <strong>The Legacy Paths Team</strong>
        </p>
      </div>
    `,
  };
}
