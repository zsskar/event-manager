import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { getFetch, httpBatchLink, loggerLink } from "@trpc/client";

const getAPIUrl = () => {
  return `http://localhost:${8000}`;
};

const TRPCProvider = (props: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink(),
        httpBatchLink({
          url: `${getAPIUrl()}/api/trpc`,
          fetch: async (input, init?) => {
            const fetch = getFetch();
            return fetch(input, {
              ...init,
              credentials: "include",
            });
          },
        }),
      ],
    })
  );

  return (
    <>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
};

export default TRPCProvider;
