import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface JourneyCardProps {
  journey: {
    id: string;
    name: string;
    slug: string;
    type: string;
    duration: number;
    basePrice: number;
    description: string | null;
  };
}

const journeyTypeIcons: Record<string, string> = {
  ACTIVE: "🏔️",
  SERENE: "🧘",
  EXPLORER: "🗺️",
};

export function JourneyCard({ journey }: JourneyCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="text-4xl mb-2">{journeyTypeIcons[journey.type] || "✈️"}</div>
        <CardTitle>{journey.name}</CardTitle>
        <div className="text-sm text-slate-500">{journey.duration} days</div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-slate-600 line-clamp-3">{journey.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div>
          <div className="text-sm text-slate-500">From</div>
          <div className="text-2xl font-bold">{formatCurrency(journey.basePrice)}</div>
        </div>
        <Link href={`/journeys/${journey.slug}`} className="w-full">
          <Button className="w-full">View Journey</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
