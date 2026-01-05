export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  createdAt: Date;
}

export interface JourneyTemplate {
  id: string;
  name: string;
  slug: string;
  type: "ACTIVE" | "SERENE" | "EXPLORER";
  duration: number;
  basePrice: number;
  description: string | null;
  highlights: string[];
  status: "published" | "draft";
  createdAt: Date;
}

export interface ItineraryDay {
  id: string;
  journeyTemplateId: string;
  dayNumber: number;
  title: string | null;
  description: string | null;
  accommodationId: string | null;
  accommodation?: Accommodation;
}

export interface Accommodation {
  id: string;
  name: string;
  location: string | null;
  pricePerNight: number | null;
  description: string | null;
  imageUrl: string | null;
  partnerId: string | null;
}

export interface AddOn {
  id: string;
  name: string;
  category: string | null;
  price: number;
  description: string | null;
  applicableTo: string[];
}

export interface BookingRequest {
  id: string;
  userId: string;
  journeyTemplateId: string;
  startDate: Date;
  travelers: number;
  selectedAddOns: string[];
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  specialRequests: string | null;
  createdAt: Date;
  user?: User;
  journeyTemplate?: JourneyTemplate;
}

export interface Booking {
  id: string;
  bookingRequestId: string;
  stripePaymentIntentId: string | null;
  paymentStatus: "pending" | "paid" | "refunded";
  depositAmount: number;
  balanceAmount: number;
  balanceDueDate: Date | null;
  itineraryPdfUrl: string | null;
  createdAt: Date;
}

export interface Partner {
  id: string;
  name: string;
  type: string | null;
  email: string | null;
  phone: string | null;
  status: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface BookingRequestInput {
  name: string;
  email: string;
  phone?: string;
  journeyTemplateId: string;
  startDate: string;
  travelers: number;
  selectedAddOns: string[];
  specialRequests?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  bookingId: string;
  depositAmount: number;
  balanceAmount: number;
}

// Extended Next-Auth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
