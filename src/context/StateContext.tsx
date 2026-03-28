import { createContext, useEffect, useState, type ReactNode } from "react";
import useFetchData from "@/hooks/useFetchData";
import axios from "axios";

interface StateContextType {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isSmall: boolean;
  setIsSmall: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTrip: any;
  setSelectedTrip: React.Dispatch<React.SetStateAction<any>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  state: number;
  setState: React.Dispatch<React.SetStateAction<number>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  systemSettingsData: any;
  isSystemSettingsPending: boolean;
  priceManageData: any;
  isPriceManagePending: boolean;
  handleLoginState: any;
}

const StateContext = createContext<StateContextType | null>(null);

const StateContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [state, setState] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  const { data: systemSettingsData, isPending: isSystemSettingsPending } =
    useFetchData("/system-setting", false);
  const { data: priceManageData, isPending: isPriceManagePending } =
    useFetchData("/price-manage", false);

  const handleLoginState = async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user-detail`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
          },
        );
        if (response?.data?.data) {
          setIsLoggedIn(true);
          setUserData(response.data.data);
        } else {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };
  useEffect(() => {
    handleLoginState();
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmall(window.innerWidth < 768 ? true : false);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <StateContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        isSmall,
        setIsSmall,
        selectedTrip,
        setSelectedTrip,
        isLoggedIn,
        setIsLoggedIn,
        state,
        setState,
        email,
        setEmail,
        token,
        setToken,
        userData,
        setUserData,
        systemSettingsData,
        isSystemSettingsPending,
        priceManageData,
        isPriceManagePending,
        handleLoginState
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export { StateContextProvider, StateContext };
