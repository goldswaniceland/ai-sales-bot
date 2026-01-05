"use client";

import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";

interface AddOn {
  id: string;
  name: string;
  price: number;
  category: string | null;
  description: string | null;
}

interface PriceCalculatorProps {
  basePrice: number;
  addOns: AddOn[];
  selectedAddOns: string[];
  travelers?: number;
}

export function PriceCalculator({
  basePrice,
  addOns,
  selectedAddOns,
  travelers = 1,
}: PriceCalculatorProps) {
  const totalPrice = useMemo(() => {
    const addOnsTotal = addOns
      .filter((addOn) => selectedAddOns.includes(addOn.id))
      .reduce((sum, addOn) => sum + addOn.price, 0);

    return (basePrice + addOnsTotal) * travelers;
  }, [basePrice, addOns, selectedAddOns, travelers]);

  const selectedAddOnsList = useMemo(() => {
    return addOns.filter((addOn) => selectedAddOns.includes(addOn.id));
  }, [addOns, selectedAddOns]);

  return (
    <div className="bg-slate-50 rounded-lg p-6 space-y-4">
      <h3 className="font-semibold text-lg">Price Breakdown</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Base Journey Price</span>
          <span>{formatCurrency(basePrice)}</span>
        </div>

        {selectedAddOnsList.length > 0 && (
          <>
            <div className="border-t pt-2 mt-2">
              <div className="font-medium mb-2">Selected Add-ons:</div>
              {selectedAddOnsList.map((addOn) => (
                <div key={addOn.id} className="flex justify-between pl-4 text-slate-600">
                  <span>{addOn.name}</span>
                  <span>{formatCurrency(addOn.price)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {travelers > 1 && (
          <div className="flex justify-between">
            <span>Number of Travelers</span>
            <span>×{travelers}</span>
          </div>
        )}

        <div className="border-t pt-2 flex justify-between font-bold text-lg">
          <span>Total Price</span>
          <span className="text-slate-900">{formatCurrency(totalPrice)}</span>
        </div>

        <p className="text-xs text-slate-500 pt-2">
          50% deposit due at booking. Remaining balance due 30 days before departure.
        </p>
      </div>
    </div>
  );
}
