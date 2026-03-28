import { LanguageContext } from "@/context/LanguageContextProvider";
import { useContext } from "react";

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      "useLanguageContext must be used within a LanguageContextProvider",
    );
  }
  return context;
};
