import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Partners
  const partner1 = await prisma.partner.create({
    data: {
      name: "Blue Lagoon Retreat",
      type: "accommodation",
      email: "info@bluelagoon.is",
      status: "active",
    },
  });

  const partner2 = await prisma.partner.create({
    data: {
      name: "Vik Luxury Lodge",
      type: "accommodation",
      email: "stay@viklodge.is",
      status: "active",
    },
  });

  // Create Accommodations
  const accommodation1 = await prisma.accommodation.create({
    data: {
      name: "Blue Lagoon Retreat & Spa",
      location: "Grindavík",
      pricePerNight: 45000, // $450
      description: "Luxury spa resort with private Blue Lagoon access",
      partnerId: partner1.id,
    },
  });

  const accommodation2 = await prisma.accommodation.create({
    data: {
      name: "Vik Luxury Lodge",
      location: "Vík í Mýrdal",
      pricePerNight: 35000, // $350
      description: "Boutique hotel with stunning black beach views",
      partnerId: partner2.id,
    },
  });

  const accommodation3 = await prisma.accommodation.create({
    data: {
      name: "Reykjavik Grand Hotel",
      location: "Reykjavík",
      pricePerNight: 40000, // $400
      description: "Premium city center accommodation",
    },
  });

  // Create Add-ons
  await prisma.addOn.createMany({
    data: [
      {
        name: "Glacier Hiking Experience",
        category: "activities",
        price: 25000, // $250
        description: "Full-day guided glacier hiking with expert guides",
        applicableTo: ["ACTIVE", "EXPLORER"],
      },
      {
        name: "Private Hot Spring Tour",
        category: "activities",
        price: 15000, // $150
        description: "Visit hidden hot springs away from tourist crowds",
        applicableTo: ["SERENE", "EXPLORER"],
      },
      {
        name: "Northern Lights Photography Tour",
        category: "activities",
        price: 30000, // $300
        description: "Professional photography guide for Northern Lights",
        applicableTo: ["all"],
      },
      {
        name: "Michelin Star Dinner",
        category: "dining",
        price: 20000, // $200
        description: "3-course tasting menu at Reykjavik's finest restaurant",
        applicableTo: ["all"],
      },
      {
        name: "Helicopter Volcano Tour",
        category: "special",
        price: 50000, // $500
        description: "Private helicopter tour over active volcanic areas",
        applicableTo: ["ACTIVE", "EXPLORER"],
      },
      {
        name: "Spa & Wellness Package",
        category: "special",
        price: 18000, // $180
        description: "Full-day spa treatments and thermal bath access",
        applicableTo: ["SERENE"],
      },
    ],
  });

  // Create ACTIVE Journey Template
  const activeJourney = await prisma.journeyTemplate.create({
    data: {
      name: "Iceland Active Adventure",
      slug: "iceland-active-adventure",
      type: "ACTIVE",
      duration: 7,
      basePrice: 450000, // $4,500
      description:
        "Experience Iceland's raw power through thrilling adventures. From glacier hiking to ice cave exploration, this journey is designed for those who seek adrenaline and unforgettable moments in nature.",
      highlights: [
        "Glacier hiking on Vatnajökull",
        "Ice cave exploration",
        "Black beach hiking",
        "Waterfall rappelling",
        "Snowmobiling on glacier",
        "Hot spring relaxation",
      ],
      status: "published",
      itineraryDays: {
        create: [
          {
            dayNumber: 1,
            title: "Arrival & Reykjavik Exploration",
            description:
              "Meet your guide and explore Reykjavik. Evening welcome dinner.",
            accommodationId: accommodation3.id,
          },
          {
            dayNumber: 2,
            title: "Golden Circle & Glacier Prep",
            description:
              "Visit Þingvellir, Geysir, and Gullfoss. Glacier equipment fitting.",
            accommodationId: accommodation3.id,
          },
          {
            dayNumber: 3,
            title: "Glacier Hiking Day",
            description:
              "Full-day glacier hiking experience on Vatnajökull glacier.",
            accommodationId: accommodation2.id,
          },
          {
            dayNumber: 4,
            title: "Ice Caves & Black Beaches",
            description:
              "Explore crystal ice caves and hike along black sand beaches.",
            accommodationId: accommodation2.id,
          },
          {
            dayNumber: 5,
            title: "Snowmobile Adventure",
            description: "Snowmobile across glacier landscapes. Evening Northern Lights hunt.",
            accommodationId: accommodation2.id,
          },
          {
            dayNumber: 6,
            title: "South Coast Waterfalls",
            description:
              "Visit Seljalandsfoss and Skógafoss. Optional waterfall rappelling.",
            accommodationId: accommodation1.id,
          },
          {
            dayNumber: 7,
            title: "Blue Lagoon & Departure",
            description: "Relax at Blue Lagoon before airport transfer.",
            accommodationId: accommodation1.id,
          },
        ],
      },
    },
  });

  // Create SERENE Journey Template
  const sereneJourney = await prisma.journeyTemplate.create({
    data: {
      name: "Iceland Serene Retreat",
      slug: "iceland-serene-retreat",
      type: "SERENE",
      duration: 7,
      basePrice: 420000, // $4,200
      description:
        "Find peace in Iceland's tranquil landscapes. This journey focuses on wellness, relaxation, and connecting with nature at a gentle pace. Perfect for those seeking rejuvenation and mindfulness.",
      highlights: [
        "Private hot spring experiences",
        "Spa treatments",
        "Gentle nature walks",
        "Yoga sessions with glacier views",
        "Farm-to-table dining",
        "Northern Lights viewing",
      ],
      status: "published",
      itineraryDays: {
        create: [
          {
            dayNumber: 1,
            title: "Arrival & Welcome Spa",
            description:
              "Airport transfer to Blue Lagoon. Welcome spa treatment and dinner.",
            accommodationId: accommodation1.id,
          },
          {
            dayNumber: 2,
            title: "Coastal Serenity",
            description:
              "Morning yoga. Gentle coastal walk. Afternoon spa time.",
            accommodationId: accommodation1.id,
          },
          {
            dayNumber: 3,
            title: "Hidden Hot Springs",
            description:
              "Private tour to secret hot springs. Meditation session. Farm visit.",
            accommodationId: accommodation2.id,
          },
          {
            dayNumber: 4,
            title: "Wellness Day",
            description:
              "Full-day wellness program: massage, thermal baths, healthy cooking class.",
            accommodationId: accommodation2.id,
          },
          {
            dayNumber: 5,
            title: "Nature Immersion",
            description: "Gentle forest walk. Waterfall meditation. Evening sauna.",
            accommodationId: accommodation2.id,
          },
          {
            dayNumber: 6,
            title: "Mindfulness & Scenery",
            description:
              "Scenic drive with stops at peaceful locations. Sunset hot spring bath.",
            accommodationId: accommodation1.id,
          },
          {
            dayNumber: 7,
            title: "Farewell & Reflection",
            description: "Morning meditation. Final spa time. Departure.",
            accommodationId: accommodation1.id,
          },
        ],
      },
    },
  });

  // Create EXPLORER Journey Template
  const explorerJourney = await prisma.journeyTemplate.create({
    data: {
      name: "Iceland Cultural Explorer",
      slug: "iceland-cultural-explorer",
      type: "EXPLORER",
      duration: 7,
      basePrice: 400000, // $4,000
      description:
        "Discover the authentic Iceland beyond tourist trails. This journey combines cultural immersion with natural wonders, featuring local guides, traditional experiences, and hidden gems.",
      highlights: [
        "Local family visits",
        "Traditional Icelandic cooking",
        "Fishing village tours",
        "Viking history sites",
        "Meet local artisans",
        "Folk music evening",
      ],
      status: "published",
      itineraryDays: {
        create: [
          {
            dayNumber: 1,
            title: "Reykjavik Cultural Introduction",
            description:
              "City walking tour with local historian. Visit museums. Traditional dinner.",
            accommodationId: accommodation3.id,
          },
          {
            dayNumber: 2,
            title: "Viking Heritage",
            description:
              "Þingvellir historical site. Viking settlement visit. Saga storytelling.",
            accommodationId: accommodation3.id,
          },
          {
            dayNumber: 3,
            title: "Fishing Village Life",
            description:
              "Visit traditional fishing village. Meet local fishermen. Seafood cooking class.",
            accommodationId: accommodation2.id,
          },
          {
            dayNumber: 4,
            title: "Farm Experience",
            description:
              "Day at working farm. Learn about Icelandic agriculture. Horse riding.",
            accommodationId: accommodation2.id,
          },
          {
            dayNumber: 5,
            title: "Artisan Workshops",
            description:
              "Visit wool workshop, pottery studio, and local brewery. Meet craftspeople.",
            accommodationId: accommodation2.id,
          },
          {
            dayNumber: 6,
            title: "Natural Wonders Tour",
            description:
              "Guided tour of waterfalls and black beaches with geological explanations.",
            accommodationId: accommodation1.id,
          },
          {
            dayNumber: 7,
            title: "Farewell & Blue Lagoon",
            description: "Relaxing morning. Blue Lagoon visit. Departure.",
            accommodationId: accommodation1.id,
          },
        ],
      },
    },
  });

  // Create demo admin user
  await prisma.user.create({
    data: {
      email: "admin@legacypaths.guide",
      name: "Admin User",
      role: "admin",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log(`Created ${3} journey templates`);
  console.log(`Created ${6} add-ons`);
  console.log(`Created ${3} accommodations`);
  console.log(`Created ${2} partners`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
