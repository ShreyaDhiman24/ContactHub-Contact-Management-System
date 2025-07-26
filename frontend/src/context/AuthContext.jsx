import { createContext, useContext, useEffect, useState } from "react";
import apiConnect from "../utils/apiConnect";
import ToastContext from "./ToastContext";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { toast } = useContext(ToastContext);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const loginUser = async (userData) => {
    try {
      const data = await apiConnect.post("/login", userData);
      return data;
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const registerUser = async (userData) => {
    try {
      const data = await apiConnect.post("/register", userData);
      return data;
    } catch (error) {
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };

  const checkUserLoggedIn = async () => {
    if (isCheckingAuth) return;
    setIsCheckingAuth(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setIsCheckingAuth(false);
      return;
    }

    try {
      const user = await apiConnect.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(user);
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(
          error.message || "Something went wrong while checking login."
        );
      }

      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ loginUser, registerUser, user, setUser,  isCheckingAuth}}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthContext;
