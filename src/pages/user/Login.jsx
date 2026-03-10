import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { loginSuccess } from "../../context/authSlice";
import { loginUser } from "../../services/authApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    gsap.from(".login-box", { opacity: 0, y: 50, duration: 1 });
  }, []);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      dispatch(loginSuccess(user));
      localStorage.setItem("userInfo", JSON.stringify(user));

      toast.success("Logged in successfully 🎉");

      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-newPrimary mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="text-sm text-newPrimary hover:text-newPrimaryDark disabled:opacity-50"
            >
              Forgot Password?
            </button>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-newPrimary text-white py-2 rounded-md hover:bg-newPrimary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-gray-600">
            Don't have an account? <Link to="/signup" className="text-newPrimary hover:text-newPrimaryDark">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
