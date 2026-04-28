"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  LogOut,
  MapPin,
  ShieldCheck,
  Sprout,
  Waves
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BASE_URL } from "@/utils/api";

const settings = [
  { label: "Personal Information", icon: CircleUserRound },
  { label: "My Farm Details", icon: Sprout },
  { label: "Notification Preferences", icon: BadgeCheck },
  { label: "Language", icon: Waves },
  { label: "Privacy Policy", icon: ShieldCheck }
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ cropAnalysisCount: 0, soilAnalysisCount: 0, totalAnalysisCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const controller = new AbortController();

    const loadProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setUser(data.user);
        setStats(data.stats || stats);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    return () => controller.abort();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="mx-auto max-w-6xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-sm text-red-700">{error}</CardContent>
        </Card>
      </div>
    );
  }

  const displayName = user?.name || "Farmer";
  const initial = displayName.trim().charAt(0).toUpperCase() || "F";
  const joinedOn = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }) : "Recently";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(135deg,_#ffffff_0%,_#f0fdf4_100%)] shadow-sm">
        <div className="grid gap-6 p-6 md:grid-cols-[auto,1fr,auto] md:items-center md:p-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-900 text-3xl font-semibold text-white shadow-lg">
            {initial}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-3xl font-semibold tracking-tight text-emerald-950">{displayName}</h2>
              <Badge className="bg-emerald-900 text-white hover:bg-emerald-900">Verified Farmer</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-emerald-900/75">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {user?.location || "Location not set"}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                Joined {joinedOn}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {user?.cropType && <Badge variant="secondary">{user.cropType}</Badge>}
              {user?.email && <Badge variant="outline">{user.email}</Badge>}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button className="gap-2 bg-emerald-900 hover:bg-emerald-800" onClick={() => router.push("/crop-analysis")}>
              Start Analysis
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Farm Overview</CardTitle>
            <CardDescription>Live account details pulled from your backend profile.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">Email</p>
              <p className="mt-2 text-sm font-medium text-emerald-950">{user?.email || "Not set"}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">Location</p>
              <p className="mt-2 text-sm font-medium text-emerald-950">{user?.location || "Not set"}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">Primary Crop</p>
              <p className="mt-2 text-sm font-medium text-emerald-950">{user?.cropType || "Not set"}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">Member Since</p>
              <p className="mt-2 text-sm font-medium text-emerald-950">{joinedOn}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-900 text-white">
          <CardHeader>
            <CardTitle className="text-white">Activity Summary</CardTitle>
            <CardDescription className="text-emerald-100">Your recent platform usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-emerald-100">Crop Analyses</p>
              <p className="mt-1 text-3xl font-semibold">{stats.cropAnalysisCount}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-emerald-100">Soil Tests</p>
              <p className="mt-1 text-3xl font-semibold">{stats.soilAnalysisCount}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-emerald-100">Total Analyses</p>
              <p className="mt-1 text-3xl font-semibold">{stats.totalAnalysisCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings &amp; Account</CardTitle>
          <CardDescription>Quick access to your personal and farm settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 p-0">
          {settings.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-emerald-50"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-900">
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="font-medium text-emerald-950">{item.label}</span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
