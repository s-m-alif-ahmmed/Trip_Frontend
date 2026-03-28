// import useCookie from "@/hooks/useCookie";
// import useLocalStorage from "@/hooks/useLocalStorage";
// import { createContext, useState } from "react";

// const AuthContext = createContext(null);

// const AuthContextProvider = ({ children }) => {
//   // const [userData, setUserData, clearUserData] = useLocalStorage(
//   //   "user-data",
//   //   ""
//   // );
//   const [accessToken, setAccessToken, clearAccessToken] = useCookie(
//     "access-token",
//     ""
//   );
//   const [chooseRole, setChooseRole, clearChooseRole] = useLocalStorage(
//     "role",
//     ""
//   );
//   const [lastMessage, setLastMessage] = useState("");

//   const isLogged = false;

//   const register = async () => {};

//   const login = async () => {};

//   const logout = async () => {
//     clearAccessToken();
//     // clearUserData();
//   };

//   const [profileDataLoading, setProfileDataLoading] = useState(false);
//   const [companyDataLoading, setCompanyDataLoading] = useState(false);

//   return (
//     <AuthContext.Provider
//       value={{
//         isLogged,
//         chooseRole,
//         setChooseRole,
//         clearChooseRole,
//         register,
//         login,
//         logout,
//         profileDataLoading,
//         setProfileDataLoading,
//         accessToken,
//         setAccessToken,
//         lastMessage,
//         setLastMessage,
//         companyDataLoading,
//         setCompanyDataLoading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContextProvider, AuthContext };
