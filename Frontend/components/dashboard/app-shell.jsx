"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Plus } from "lucide-react";

import { navItems } from "@/components/dashboard/nav-items";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";

export function AppShell({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const controller = new AbortController();

    const loadUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch {
        // Ignore auth refresh errors and fall back to cached data.
      }
    };

    loadUser();

    return () => controller.abort();
  }, []);

  const displayName = user?.name || "Farmer";
  const displayLocation = [user?.location, user?.cropType].filter(Boolean).join(" | ") || "Dashboard member";
  const initial = displayName.trim().charAt(0).toUpperCase() || "F";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-background to-emerald-50/60">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-emerald-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <h1 className="text-xl font-semibold tracking-tight text-emerald-900">AgriAssistant</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-100 text-sm font-semibold text-emerald-800">
              {initial}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] pt-16">
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-72 shrink-0 border-r border-emerald-100 bg-white md:block">
          <div className="p-5">
            <p className="text-sm font-semibold text-emerald-900">{displayName}</p>
            <p className="text-xs text-muted-foreground">{displayLocation}</p>
          </div>
          <nav className="space-y-1 px-3 py-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-emerald-50 text-emerald-900" : "text-muted-foreground hover:bg-emerald-50/70 hover:text-emerald-900"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-h-[calc(100vh-64px)] flex-1 p-4 pb-24 md:p-8 md:pb-8">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-emerald-100 bg-white/95 px-1 pb-2 pt-2 backdrop-blur md:hidden">
        <div className={cn("grid", navItems.length > 5 ? "grid-cols-7" : "grid-cols-5")}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center gap-1 py-1">
                <span className={cn("rounded-xl p-2", active && "bg-emerald-100 text-emerald-900")}>
                  <item.icon className={cn("h-4 w-4", active ? "text-emerald-900" : "text-muted-foreground")} />
                </span>
                <span className={cn("text-[10px] font-medium", active ? "text-emerald-900" : "text-muted-foreground")}>{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <Button className="fixed bottom-24 right-4 h-12 w-12 rounded-full p-0 shadow-lg md:bottom-8 md:right-8">
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
