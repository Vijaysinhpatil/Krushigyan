"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScanSearch, FlaskConical, BarChart3, Bot, Gavel, Leaf, ArrowRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // ignore
      }
    }
  }, []);

  const features = [
    {
      title: "Crop Analysis",
      description: "Detect diseases from leaf images instantly.",
      icon: ScanSearch,
      href: "/crop-analysis",
      color: "bg-emerald-100 text-emerald-700"
    },
    {
      title: "Soil Testing",
      description: "Analyze soil health and get crop recommendations.",
      icon: FlaskConical,
      href: "/soil-testing",
      color: "bg-amber-100 text-amber-700"
    },
    {
      title: "AI Chatbot",
      description: "Talk to AgriBot for farming advice in your language.",
      icon: Bot,
      href: "/chatbot",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Govt Schemes",
      description: "Discover and apply for agricultural subsidies.",
      icon: Gavel,
      href: "/govt-schemes",
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "Plant Reviews",
      description: "Discuss plant issues with the farmer community.",
      icon: Leaf,
      href: "/plant-reviews",
      color: "bg-rose-100 text-rose-700"
    },
    {
      title: "Growth Comparison",
      description: "Compare crop growth across different days.",
      icon: BarChart3,
      href: "/growth-comparison",
      color: "bg-cyan-100 text-cyan-700"
    }
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-emerald-900">
          Welcome back, {user?.name?.split(' ')[0] || 'Farmer'}!
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          What would you like to do today? Select a tool below to get started.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col hover:shadow-md transition-shadow border-emerald-100">
            <CardHeader>
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl text-slate-800">{feature.title}</CardTitle>
              <CardDescription className="text-base mt-2">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-4">
              <Button asChild className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-none">
                <Link href={feature.href}>
                  Open Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
