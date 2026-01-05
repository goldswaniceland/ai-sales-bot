"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PriceCalculator } from "@/components/PriceCalculator";
import { formatCurrency } from "@/lib/utils";

interface AddOn {
  id: string;
  name: string;
  price: number;
  category: string | null;
  description: string | null;
}

interface Journey {
  id: string;
  name: string;
  basePrice: number;
  duration: number;
}

interface BookingFormProps {
  journey: Journey;
  addOns: AddOn[];
}

export function BookingForm({ journey, addOns }: BookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    startDate: "",
    travelers: 1,
    specialRequests: "",
  });

  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/booking-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          journeyTemplateId: journey.id,
          selectedAddOns,
          travelers: Number(formData.travelers),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit booking request");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/journeys`);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedAddOns = useMemo(() => {
    return addOns.reduce((acc, addOn) => {
      const category = addOn.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(addOn);
      return acc;
    }, {} as Record<string, AddOn[]>);
  }, [addOns]);

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-green-900 mb-2">
          Request Submitted!
        </h2>
        <p className="text-green-700">
          Thank you for your interest. We'll get back to you within 24 hours with a
          personalized proposal.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>

      {/* Journey Details */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Journey Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="startDate">Preferred Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              required
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <Label htmlFor="travelers">Number of Travelers *</Label>
            <Input
              id="travelers"
              type="number"
              min="1"
              max="10"
              required
              value={formData.travelers}
              onChange={(e) =>
                setFormData({ ...formData, travelers: Number(e.target.value) })
              }
            />
          </div>
        </div>
      </div>

      {/* Add-ons */}
      {addOns.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Optional Add-ons</h2>
          <div className="space-y-6">
            {Object.entries(groupedAddOns).map(([category, categoryAddOns]) => (
              <div key={category}>
                <h3 className="font-semibold text-lg mb-3 capitalize">
                  {category}
                </h3>
                <div className="space-y-3">
                  {categoryAddOns.map((addOn) => (
                    <label
                      key={addOn.id}
                      className="flex items-start gap-3 p-3 rounded border border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedAddOns.includes(addOn.id)}
                        onChange={() => handleAddOnToggle(addOn.id)}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">{addOn.name}</div>
                          <div className="font-semibold">
                            {formatCurrency(addOn.price)}
                          </div>
                        </div>
                        {addOn.description && (
                          <p className="text-sm text-slate-600 mt-1">
                            {addOn.description}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Requests */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Special Requests</h2>
        <div>
          <Label htmlFor="specialRequests">
            Any special requests or dietary requirements?
          </Label>
          <Textarea
            id="specialRequests"
            value={formData.specialRequests}
            onChange={(e) =>
              setFormData({ ...formData, specialRequests: e.target.value })
            }
            placeholder="Let us know if you have any special requests..."
            rows={4}
          />
        </div>
      </div>

      {/* Price Calculator */}
      <PriceCalculator
        basePrice={journey.basePrice}
        addOns={addOns}
        selectedAddOns={selectedAddOns}
        travelers={formData.travelers}
      />

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="min-w-[200px]"
        >
          {isSubmitting ? "Submitting..." : "Submit Booking Request"}
        </Button>
      </div>

      <p className="text-center text-sm text-slate-500">
        This is a booking request, not a confirmed booking. Our team will review your
        request and send you a personalized proposal within 24 hours.
      </p>
    </form>
  );
}
