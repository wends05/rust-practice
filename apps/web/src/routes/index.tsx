import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { helloOptions } from "../query-options";

export const Route = createFileRoute("/")({
  component: Home,
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(helloOptions);
  },
});

function Home() {
  const { data, isLoading, error } = useQuery(helloOptions);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-8">
      <p className="mt-4 text-lg">Backend says: {data?.message ?? "nothing yet"}</p>
    </div>
  );
}
