import NotFoundError from "@/pages/Error/NotFoundError";
import Home from "@/pages/home/Home";
import DashboardHomePage from "@/pages/private/DashboardHomePage";
import SettingsPage from "@/pages/private/SettingsPage";
import BookingCancelPage from "@/pages/public/BookingCancelPage";
import PaymentConfirmationPage from "@/pages/public/PaymentConfirmationPage";
import { createBrowserRouter } from "react-router";
import ErrorPage from "@/pages/Error/ErrorPage";
import MainLayout from "@/layouts/MainLayout";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dashboard",
        element: <DashboardHomePage />,
      },
      {
        path: "dashboard/settings",
        element: <SettingsPage />,
      },
      {
        path: "booking/cancel",
        element: <BookingCancelPage />,
      },
      {
        path: "booking/payment-confirmation",
        element: <PaymentConfirmationPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundError />,
  },
]);
