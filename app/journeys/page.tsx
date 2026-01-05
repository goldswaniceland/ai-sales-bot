import { db } from "@/lib/db";
import { JourneyCard } from "@/components/JourneyCard";

export default async function JourneysPage() {
  const journeys = await db.journeyTemplate.findMany({
    where: {
      status: "published",
    },
    orderBy: {
      type: "asc",
    },
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Journey
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Curated luxury experiences in Iceland. Each journey is designed to create
            meaningful moments that become part of your legacy.
          </p>
        </div>
      </header>

      {/* Journeys Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {journeys.map((journey) => (
            <JourneyCard key={journey.id} journey={journey} />
          ))}
        </div>

        {journeys.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">
              No journeys available at the moment. Check back soon!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
