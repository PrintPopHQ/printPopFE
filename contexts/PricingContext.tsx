"use client";

import React, { createContext, useContext } from "react";
import { PricingItem } from "@/lib/pricing";

interface PricingContextType {
  pricing: PricingItem[];
  getPriceForConfig: (groupSize: number, isMagnetic: boolean) => { price: number; originalPrice: number };
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({
  children,
  initialPricing,
}: {
  children: React.ReactNode;
  initialPricing: PricingItem[];
}) {
  const getPriceForConfig = (groupSize: number, isMagnetic: boolean) => {
    let plan: "single" | "pair_of_2" | "pair_of_3" | "family_plan" = "single";
    if (groupSize === 2) plan = "pair_of_2";
    if (groupSize === 3) plan = "pair_of_3";
    if (groupSize >= 4) plan = "family_plan";

    const caseType = isMagnetic ? "magnetic" : "non_magnetic";

    const matchedItem = initialPricing.find(
      (item) => item.plan_type === plan && item.case_type.toLowerCase() === caseType.toLowerCase()
    );

    console.log("DEBUG getPriceForConfig:", { groupSize, isMagnetic, plan, caseType, initialPricingLen: initialPricing?.length, matchedItem });

    // Fallback if not found (using the original hardcoded logic temporarily to avoid crashing)
    if (!matchedItem) {
      console.warn("Pricing not found for config:", { groupSize, isMagnetic });
      const basePrice = groupSize > 1 ? 30 : 35;
      const originalBasePrice = 35;
      return {
        price: isMagnetic ? basePrice + 5 : basePrice,
        originalPrice: isMagnetic ? originalBasePrice + 5 : originalBasePrice,
      };
    }

    // Default original price assumption (e.g. standard cross out is just the single price equivalent without discount, or maybe no original price crossed out if it's not discounted)
    // To maintain old logic, single original price was 35. Let's just say originalPrice = 35 + (isMagnetic ? 5 : 0)
    // For single, current == original so no strikethrough is shown, unless we force originalPrice = 35. 
    // Let's use the old formula for originalPrice to keep the visuals identical if needed:
    const originalBasePrice = 35;
    const computedOriginalPrice = isMagnetic ? originalBasePrice + 5 : originalBasePrice;

    return {
      price: parseFloat(matchedItem.price),
      originalPrice: computedOriginalPrice,
    };
  };

  return (
    <PricingContext.Provider value={{ pricing: initialPricing, getPriceForConfig }}>
      {children}
    </PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error("usePricing must be used within a PricingProvider");
  }
  return context;
}
