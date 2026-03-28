import { RouterProvider } from "react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routes } from "@/routes/Routes";
import MainProvider from "@/provider/MainProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainProvider>
      <RouterProvider router={routes} />
    </MainProvider>
  </StrictMode>
);
