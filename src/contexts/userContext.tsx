import { User } from "@/types/User";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const defaultUser: User = {
    first_name: "",
    last_name: "",
    email: "",
    avatar:"",
}

type UserContextType = {
    user: User;
    updateUser: (newSettings: Partial<User>) => void
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(defaultUser)

    const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
      
        const fetchUser = async () => {
          try {
            const res = await axios.get(`${BASE_URL}/api/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
          } catch (err) {
            setUser(defaultUser);
          }
        };
      
        fetchUser();
    }, []);


    const updateUser = (newUser: Partial<User>) => {
        setUser((prev) => ({...prev, ...newUser}))
    }


    return (
        <UserContext.Provider value={{ user, updateUser }} >
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider")
    }
    return context
}