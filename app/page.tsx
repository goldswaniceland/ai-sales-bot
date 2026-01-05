import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-white">
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Legacy Paths
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-200 max-w-2xl mx-auto">
            Curated luxury travel experiences in Iceland.
            Create meaningful journeys that become part of your legacy.
          </p>
          <Link
            href="/journeys"
            className="inline-block bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-colors"
          >
            Explore Journeys
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-4xl mb-4">🏔️</div>
              <h3 className="text-xl font-semibold mb-2">ACTIVE</h3>
              <p className="text-slate-600">
                Adventure-focused journeys for the thrill-seekers
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🧘</div>
              <h3 className="text-xl font-semibold mb-2">SERENE</h3>
              <p className="text-slate-600">
                Peaceful retreats for relaxation and rejuvenation
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold mb-2">EXPLORER</h3>
              <p className="text-slate-600">
                Cultural immersion and authentic experiences
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
