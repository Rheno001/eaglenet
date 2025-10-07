import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";



export default function Auth() {
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Sign Up
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ fullName: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  const endpoint = isLogin
    ? "http://localhost/backend/login.php"
    : "http://localhost/backend/reg.php";

  // Prepare payload based on form type
  const payload = isLogin
    ? {
        email: formData.email,
        password: formData.password,
      }
    : {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      };

  try {
    const response = await axios.post(endpoint, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const result = response.data;

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: result.message || (isLogin ? "Login successful" : "Registration successful"),
        showConfirmButton: true,
      });

      // Reset form
      setFormData({ fullName: "", email: "", password: "" });

      // Save user info in localStorage
      const userData = {
        email: formData.email,
        fullName:
          result.user?.fullName || // if backend provides it
          formData.fullName || // from form input
          "User", // fallback
      };

      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect to dashboard after login
      if (isLogin) {
        navigate("/pages/dashboard");
      }
    } else {
      // Show backend error or fallback
      setError(result.message || (isLogin ? "Login failed" : "Registration failed"));
    }
  } catch (err) {
    console.error("Server or network error:", err);
    if (err.response && err.response.data) {
      setError(err.response.data.message || "Server error occurred");
    } else {
      setError("Cannot connect to server. Please check your connection.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen mt-10 flex items-center justify-center bg-gray-50 px-4 py-10 text-gray-900">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
        <div className="text-center mb-8">
          {isLogin ? (
            <LogIn className="mx-auto h-10 w-10 text-gray-900" />
          ) : (
            <UserPlus className="mx-auto h-10 w-10 text-gray-900" />
          )}
          <h1 className="text-3xl font-bold mt-3">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h1>
          <p className="text-gray-500 mt-2">
            {isLogin
              ? "Sign in to continue"
              : "Join us today to manage your logistics easily"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="mt-1 w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-gray-900 outline-none"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-gray-900 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-gray-900 outline-none"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-gray-900 font-medium hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
