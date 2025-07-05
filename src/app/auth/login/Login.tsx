import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);
    navigate('dashboard');
  }

  return (
    <>
        <div className="border-2 shadow-xl shadow-lime-400 pt-8 px-8 rounded-lg w-lg">
          <div className="flex flex-col items-center">
            <img src="logo-v1.png" alt="Login page icon" className="h-24 w-24" />
          </div>
          <div className="w-auto">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input type="text" placeholder="Username" />
              <Input type="password" placeholder="Password" />
              <Button type="submit" className=" rounded-lg bg-lime-400  border-1 text-black text-sm cursor-pointer hover:bg-lime-700" >{isLoading ? "Loading..." : "Login"}</Button>
              <ModeToggle/>
            </form>
          </div>
          <p className="normal-text text-lime-700/81 text-center mt-6 mb-2 flex flex-col"><span>&copy; 2024-Present, Vinuth Sri Aramapath.</span> <span> All rights reserved.</span></p>
        </div>
    </>
  )
}

export default Login;