import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";
import { StateContextProvider } from "@/context/StateContext";
import { LanguageContextProvider } from "@/context/LanguageContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const MainProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageContextProvider>
        <StateContextProvider>
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </StateContextProvider>
      </LanguageContextProvider>
    </QueryClientProvider>
  );
};

export default MainProvider;
