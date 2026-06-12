"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();


const handleSubmit = async (e:any) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/dashboard"); // No localStorage needed (cookie-based auth)
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("Something went wrong");
  }

  setLoading(false);
};


  const handleGoogleLogin = () => {
    // If using NextAuth
    window.location.href = "/api/auth/signin/google";
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT SIDE - Welcome */}
      <div className="w-full md:w-1/2 bg-blue-700 text-white flex items-center justify-center px-8 py-16">
        <div className="max-w-md text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Welcome to Telco Brush Ware
          </h1>

          <p className="text-base md:text-lg leading-relaxed">
           Telco Brush Ware provides premium paint accessories and professional
            tools designed for durability and superior finishing.
            Login to access your secure business dashboard.
          </p>

          <div className="mt-8 text-sm opacity-80">
            Trusted Quality • Secure Access • Professional Service
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login */}
      <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Login in to your account
          </h2>

          <p className="text-gray-500 mb-6 text-sm">
            Enter your credentials to continue
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="/signup" // Change to actual forgot password route
                className="text-sm text-blue-600 hover:underline"
              >
                signup
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition font-semibold disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t"></div>
            <span className="px-3 text-sm text-gray-400">OR</span>
            <div className="flex-1 border-t"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>

        </div>
      </div>

    </div>
  );
}