import axios from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const isAuthenticated = async () => {
    const token = localStorage.getItem("token");
    if(token){
        try{
            await axios.post(
                `${BASE_URL}/api/check-session`,
                {},
                {
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
            return true
        }catch(error){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.error);
            }else{
                toast.error(error instanceof Error? error.message : "Session status check failed!")
            }
            return false;
        }
    }
    return false
};