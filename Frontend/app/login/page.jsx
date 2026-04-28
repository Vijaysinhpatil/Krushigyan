"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Lexend } from "next/font/google";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/api";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Authentication failed");
      } else {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 1000);
      }
    } catch (err) {
      setError("An error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={`min-h-screen bg-[#fbf9f8] ${lexend.className}`}>
      <div className="grid min-h-screen md:grid-cols-2">
        <section className="relative hidden md:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(15,82,56,0.35), rgba(15,82,56,0.55)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJ8tVe9zz7nff-aeSlzysFYgHFuJCBwJnwl9IdFSJnuzkTkPjFkDelSD-HRfRDHw2CmZuuxhCCOYc6A5hx58vcEsupC_qnEWu_M1rv4ClPsCavhrtAofNUJp_Snm-HRs7dGXV478H0Zi5xygWrkJJOFsO0t-YGCHfhPy51pewKtjTKco5YsrbrRSGH-T8p68XPnV6NzCmy_l_pzF8PlhayLKDqk2kdv_eNCBYtdVZPqTac-85NMmsZ40fPkz6-2sSOjk1UHMqFBhs')"
            }}
          />
          <div className="absolute bottom-10 left-10 max-w-md text-white">
            <h1 className="text-4xl font-semibold">Krushigyan</h1>
            <p className="mt-3 text-lg text-white/90">Bridging technology and traditional agricultural wisdom.</p>
          </div>
        </section>

        <section className="flex items-center justify-center p-4 sm:p-8">
          <Card className="w-full max-w-md rounded-2xl border-emerald-100 bg-white shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-7 text-center">
                <h2 className="text-2xl font-semibold text-emerald-900">
                  Welcome Back
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your details to access your dashboard.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700 text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700 text-center">
                  {success}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-900/80">Email Address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-10"
                      placeholder="farmer@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-900/80">Password</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      className="h-12 pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button disabled={loading} type="submit" className="mt-2 h-12 w-full gap-2 rounded-lg bg-emerald-900 hover:bg-emerald-800">
                  {loading ? "Processing..." : "Sign In"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-emerald-800 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
