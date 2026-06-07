import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "./api-client";
import type { CreateQuoteInput, Quote } from "./types/quote";

export const quoteKeys = {
  all: ["quotes"] as const,
  random: () => [...quoteKeys.all, "random"] as const,
};

export const helloOptions = queryOptions({
  queryKey: ["api", "health"] as const,
  queryFn: async () => {
    const res = await apiClient.get("/health/");
    return res.data as { status: string };
  },
  staleTime: 1000 * 60,
});

export const randomQuoteOptions = queryOptions({
  queryKey: quoteKeys.random(),
  queryFn: async () => {
    const res = await apiClient.get("/quotes/random");
    return res.data as Quote;
  },
  staleTime: 1000 * 30,
  placeholderData: (previousData) => previousData,
});

export async function createQuote(input: CreateQuoteInput): Promise<Quote> {
  const res = await apiClient.post("/quotes", input);
  return res.data as Quote;
}
