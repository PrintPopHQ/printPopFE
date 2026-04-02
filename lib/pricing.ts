import { ENV } from "@/services/env";

export interface PricingItem {
  id: string;
  case_type: "magnetic" | "non_magnetic";
  plan_type: "single" | "pair_of_2" | "pair_of_3" | "family_plan";
  price: string;
  created_at: string;
  updated_at: string;
}

export interface PricingResponse {
  responseCode: number;
  message: string;
  data: PricingItem[];
}

export async function getPricing(): Promise<PricingItem[]> {
  try {
    // Next.js fetch with revalidation for deduplication on the server
    const res = await fetch(`${ENV.API_URL}api/pricing`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("Failed to fetch pricing:", res.statusText);
      return [];
    }

    const json = (await res.json()) as PricingResponse;
    return json?.data || [];
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return [];
  }
}
