import { ModeToggle } from "@/components/shared/mode-toggle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAuthenticated } from "@/utils/auth";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loginError, setLoginError] = useState<string>("");
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/app");
    }
  });

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formdata = new FormData(e.currentTarget);

    const email = formdata.get('email') as string;
    const password = formdata.get('password') as string;

    if (validateForm(email, password)) {
      setIsLoading(true);

      setLoginError("");
      try {
        const response: AxiosResponse = await axios.post(
          `${BASE_URL}/api/login`,
          { email, password },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        navigate("/app");
      } catch (error) {
        const err = error as AxiosError;
        console.error("Login error:", err.message, err.response?.data, err.response?.status);

        if (err.response?.data && typeof err.response.data === "object" && "error" in err.response.data) {
          setLoginError((err.response.data as { error: string }).error);
        } else if (err.response?.status === 401) {
          setLoginError("Invalid email or password");
        } else if (err.response?.status === 400) {
          setLoginError("Email and password are required");
        } else {
          setLoginError("Login failed. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }

  const validateForm = (email: string, password: string) => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = "* Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "* Email is not valid";
    }

    if (!password) {
      newErrors.password = "* Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
        <div className="border-2 shadow-xl shadow-lime-400 pt-8 px-8 rounded-lg w-lg">
          <div className="flex flex-col items-center">
            <img src="logo-v1.png" alt="Login page icon" className="h-24 w-24" />
          </div>
          <div className="w-auto">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {loginError && (
                <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{loginError}</p>
              )}
              <Input type="text" name="email" placeholder="email" />
              {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              <Input type={showPassword ? "text" : "password"} name="password" placeholder="Password" />
              {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
                <div className="flex flex-row gap-4 items-center text-sm">
                  <Checkbox id="showPassword" className="" checked={showPassword} onCheckedChange={checked => setShowPassword(!!checked)} /> 
                  <Label htmlFor="showPassword" >Show Password?</Label>
                </div>
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