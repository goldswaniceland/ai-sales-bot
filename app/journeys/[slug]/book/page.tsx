import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { BookingForm } from "@/components/BookingForm";

export default async function BookingPage({
  params,
}: {
  params: { slug: string };
}) {
  const journey = await db.journeyTemplate.findUnique({
    where: {
      slug: params.slug,
    },
  });

  if (!journey) {
    notFound();
  }

  // Get applicable add-ons for this journey type
  const addOns = await db.addOn.findMany({
    where: {
      OR: [
        { applicableTo: { has: journey.type } },
        { applicableTo: { has: "all" } },
      ],
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Request Your Journey</h1>
          <p className="text-xl text-slate-600">{journey.name}</p>
          <p className="text-slate-500 mt-2">
            {journey.duration} days • {journey.type}
          </p>
        </div>

        {/* Booking Form */}
        <BookingForm journey={journey} addOns={addOns} />
      </div>
    </div>
  );
}
