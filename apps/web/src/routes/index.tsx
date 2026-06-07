import { createFileRoute } from "@tanstack/react-router";
import HomePage from "../components/home-page";
import { randomQuoteOptions } from "../query-options";

export const Route = createFileRoute("/")({
  component: HomePage,
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(randomQuoteOptions);
  },
});
