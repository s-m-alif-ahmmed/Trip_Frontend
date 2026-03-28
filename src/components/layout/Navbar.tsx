import { Button } from "../ui/button";
import Container from "../shared/Container";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthDialog from "../dialogs/AuthDialog";
import { useStateContext } from "@/hooks/useStateContext";
import { Link, useLocation } from "react-router";
import { SettingsIcon } from "@/assets/icons/icon";
import { useLanguageContext } from "@/hooks/useLanguageContext";

const Navbar = () => {
  const { language, setLanguage, t } = useLanguageContext();
  const [isScroll, setIsScroll] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { isLoggedIn, setState, userData } = useStateContext();
  const location = useLocation();
  const pathname = location.pathname;

  const imgUserAvatar = "https://i.ibb.co.com/XkYLH2xR/avatar.png";

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;

      if (pathname === "/" && offset > 0) {
        setIsScroll(true);
      } else if (pathname !== "/" && offset > 0) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "py-4 sm:py-5 lg:py-6 z-50 sticky top-0 transition-all duration-300 ease-in-out",
          pathname === "/" ? "-mb-18 sm:-mb-21 lg:-mb-24" : "bg-[#F4F6F8]",
          {
            "bg-[#080F2A] shadow-md": isScroll,
          },
        )}
      >
        <Container
          as="nav"
          className={cn("flex items-center justify-between text-white", {
            "text-[#212B36]": pathname !== "/" && !isScroll,
          })}
        >
          <Link to="/" className="text-xl block">
            {t("nav.logo")}
          </Link>
          <div className="flex gap-3 sm:gap-4 lg:gap-5">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex justify-between items-center gap-1 text-white hover:text-white hover:bg-white/10 border min-w-17.5 sm:min-w-25 lg:min-w-30",
                    {
                      "text-[#212B36] hover:text-[#212B36] hover:bg-[#212B36]/5 border-[#212B36]":
                        pathname !== "/" && !isScroll,
                    },
                  )}
                >
                  <span className="text-sm font-medium hidden sm:inline">
                    {language === "en" ? "English" : "French"}
                  </span>
                  <span className="text-sm font-medium sm:hidden">
                    {language === "en" ? "En" : "Fr"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="min-w-30">
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>English</span>
                  {language === "en" && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("fr")}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>French</span>
                  {language === "fr" && <Check className="w-4 h-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-px bg-[#919EAB] my-2 hidden sm:block"></div>
            {isLoggedIn ? (
              <div className="flex gap-3">
                <Link
                  to="/dashboard/settings"
                  className="size-10 sm:size-11 lg:size-12 rounded-sm bg-white flex items-center justify-center p-2"
                >
                  <SettingsIcon className="" />
                </Link>
                <Link to="/dashboard" className="block sm:hidden">
                  <figure className="relative size-10 shrink-0">
                    <img
                      alt="User avatar"
                      className="rounded-full object-cover w-full h-full"
                      src={imgUserAvatar}
                    />
                  </figure>
                </Link>
                <Link
                  to="/dashboard"
                  className="bg-white hidden sm:flex gap-2 items-center justify-center px-3 py-2 pr-4 rounded-sm lg:min-w-35"
                >
                  <div className="relative size-7 lg:size-8 shrink-0">
                    <img
                      alt="User avatar"
                      className="rounded-full object-cover w-full h-full"
                      src={userData?.avatar || imgUserAvatar}
                    />
                  </div>
                  <span className="font-poppins font-semibold text-[#122464] text-sm lg:text-base leading-6">
                    {userData?.name.slice(0, 10) || t("nav.userFallback")}
                  </span>
                </Link>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => (setState(1), setIsRegisterOpen(true))}
                  className="hidden sm:block"
                >
                  {t("nav.signUp")}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => (setState(4), setIsRegisterOpen(true))}
                >
                  {t("nav.logIn")}
                </Button>
              </>
            )}
          </div>
        </Container>
      </header>

      <AuthDialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen} />
    </>
  );
};

export default Navbar;
