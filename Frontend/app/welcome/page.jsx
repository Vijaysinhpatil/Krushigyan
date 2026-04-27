import Link from "next/link";
import { ArrowRight, Bot, Leaf } from "lucide-react";
import { Lexend } from "next/font/google";

import { Button } from "@/components/ui/button";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export default function WelcomePage() {
  return (
    <main className={`relative flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-8 ${lexend.className}`}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.35)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDtekjIQjY782-M1_pL2AGUufckq_6ufXgioqAYCNtTVd3InH-XdHW0dIhruBTM4lT19cuBazvw-om0REnGnQWgs95iLunRrFSWNTfnJhPhHbixvVnx4ZNhi6TNqSKf-MnUP-0UmKW4J_EKHKe3BUmDVMINXylgg8NPZUi-8yn1p0u80DrAvTZGaqehUg8OQNbB7Op98Nytn9qf92sCdBMqhx-ZyKIizSB36T425zlSNxoRP8tf9GeT_CAOoLcf6U_gOHle-NkD2a4')"
        }}
      />

      <section className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/40 bg-white/85 p-8 text-center shadow-2xl backdrop-blur-md sm:p-10">
        <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 shadow-lg">
          <div className="relative">
            <Leaf className="h-10 w-10" />
            <Bot className="absolute -bottom-4 -right-5 h-6 w-6 rounded-full bg-white p-1 text-emerald-700" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-emerald-900 sm:text-5xl">Krushigyan</h1>
        <p className="mt-3 text-lg text-emerald-950/80">Smart Farming Made Simple</p>
        <div className="mx-auto my-7 h-1 w-16 rounded-full bg-amber-700/30" />

        <Button asChild className="h-12 w-full max-w-sm rounded-full bg-emerald-900 text-base hover:bg-emerald-800">
          <Link href="/auth" className="mx-auto flex items-center gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        <div className="mt-6 flex items-center justify-center gap-1 text-sm text-emerald-950/70">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-700" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-700 [animation-delay:200ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-700 [animation-delay:400ms]" />
          <span className="ml-2">Initializing AI...</span>
        </div>
      </section>

      <footer className="absolute bottom-4 z-10 px-4 text-center text-xs text-white/85 sm:text-sm">
        © 2024 Krushigyan AI. Bridging technology and traditional agricultural wisdom.
      </footer>
    </main>
  );
}
