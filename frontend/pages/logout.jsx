import { useEffect } from "react";
import { useAuth } from "../utils/auth"; // Adjust the path to your `auth.jsx`
import { useRouter } from "next/router";

const Logout = () => {
  const { logoutUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Log out the user and navigate to the login page
    logoutUser();
    router.replace("/"); // Ensure the navigation does not trigger a re-render loop
  }, []); // Empty dependency array ensures this runs only once

  return null; // No UI is needed
};

export default Logout;
