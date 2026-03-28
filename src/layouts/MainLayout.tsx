import { Outlet } from "react-router";
import Navbar from "@/components/layout/Navbar";
import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const MainLayout = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div
      className={`font-poppins min-h-screen ${isHome ? "bg-white" : "bg-[#F4F6F8]"}`}
    >
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
