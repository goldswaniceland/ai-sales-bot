import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default async function JourneyDetailPage({
  params,
}: {
  params: { slug: string };
}) {
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
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm mb-4">
              {journey.type} • {journey.duration} days
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {journey.name}
            </h1>
            <p className="text-xl text-slate-200 mb-8">{journey.description}</p>
            <div className="flex items-center gap-6 mb-8">
              <div>
                <div className="text-sm text-slate-300">From</div>
                <div className="text-3xl font-bold">
                  {formatCurrency(journey.basePrice)}
                </div>
                <div className="text-sm text-slate-300">per person</div>
              </div>
            </div>
            <Link href={`/journeys/${journey.slug}/book`}>
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                Request Booking
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights */}
      {journey.highlights && journey.highlights.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Journey Highlights</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {journey.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="text-green-600 mt-1">✓</div>
                  <div>{highlight}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Itinerary */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Day-by-Day Itinerary</h2>
          <div className="space-y-6">
            {journey.itineraryDays.map((day) => (
              <div
                key={day.id}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {day.dayNumber}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{day.title}</h3>
                    <p className="text-slate-600 mb-3">{day.description}</p>
                    {day.accommodation && (
                      <div className="text-sm text-slate-500">
                        🏨 {day.accommodation.name}
                        {day.accommodation.location && ` • ${day.accommodation.location}`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Submit a booking request and our team will create a personalized proposal
            tailored to your preferences.
          </p>
          <Link href={`/journeys/${journey.slug}/book`}>
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              Request Booking
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
