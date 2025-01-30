// utils/auth.js
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie"; 
import { useRouter } from "next/router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token") || null); // Initialize token with the cookie value
  const [user, setUser] = useState({
    email: "",
    username: "",
    role: "",
  });
  const router = useRouter();

  const logoutUser = () => {
    Cookies.remove("token"); // Clear token from cookies
    setToken(null); // Reset the token state
    setUser({ email: "", username: "", role: "" }); // Clear user data
    router.push("/"); // Redirect to login page
  };

  const storeTokenInCookies = (token) => {
    Cookies.set("token", token, { expires: 30, secure: true, sameSite: "Strict" });
    setToken(token); // Update token state
  };

  const isLoggedIn = !!token; // Boolean indicating if user is logged in

  const userAuthentication = async () => {
    const storedToken = Cookies.get("token"); // Get token from cookies

    if (!storedToken) {
      console.log("No token found in cookies");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.userData); // Update user data in state
        setToken(storedToken); // Update token in state
      } else {
        console.warn("Invalid or expired token. Logging out...");
        logoutUser(); // Logout on invalid token
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      logoutUser(); // Logout on error
    }
  };

  useEffect(() => {
    userAuthentication();
  }, [token]); // Trigger user authentication whenever the token changes

  return (
    <AuthContext.Provider value={{ token, user, storeTokenInCookies, logoutUser, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
