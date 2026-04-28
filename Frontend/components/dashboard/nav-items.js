import { Bot, FlaskConical, Gavel, ScanSearch, Leaf, UserRound, BarChart3, LayoutDashboard } from "lucide-react";

export const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Crop Analysis", href: "/crop-analysis", icon: ScanSearch },
  { label: "Soil Testing", href: "/soil-testing", icon: FlaskConical },
  { label: "Growth Comparison", href: "/growth-comparison", icon: BarChart3 },
  { label: "AI Chatbot", href: "/chatbot", icon: Bot },
  { label: "Govt Schemes", href: "/govt-schemes", icon: Gavel },
  { label: "Plant Reviews", href: "/plant-reviews", icon: Leaf },
  { label: "Profile", href: "/profile", icon: UserRound }
];
