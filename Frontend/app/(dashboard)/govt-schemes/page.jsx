<<<<<<< HEAD
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const schemes = [
  {
    title: "PM-Kisan Samman Nidhi",
    description: "Direct income support of ₹6,000 per year for eligible farmer families.",
    tag: "Featured"
  },
  {
    title: "Pradhan Mantri Krishi Sinchayee Yojana",
    description: "Financial assistance for drip and sprinkler irrigation systems.",
    tag: "Irrigation"
  },
  {
    title: "Soil Health Card Subsidy",
    description: "Subsidy support for fertilizer purchases based on soil profile.",
    tag: "Fertilizer"
  },
  {
    title: "Fasal Bima Yojana",
    description: "Crop insurance coverage against natural risks and loss.",
    tag: "Insurance"
  }
];

export default function GovtSchemesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-emerald-900">Agricultural Subsidies and Programs</h2>
        <p className="text-muted-foreground">Filter active government support schemes relevant to your region and crop profile.</p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 pt-6 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search schemes, subsidies, keywords..." />
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Fertilizer</Badge>
            <Badge variant="secondary">Irrigation</Badge>
            <Badge variant="secondary">Livestock</Badge>
=======
"use client";

import { useState, useEffect } from "react";
import { Search, ExternalLink, Loader2, Languages, ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/api";

export default function GovtSchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [language, setLanguage] = useState("en");

  const categories = ["All", "Financial Support", "Insurance", "Fertilizer", "Irrigation", "Livestock"];

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/schemes`);
        const data = await response.json();
        if (data.success) {
          setSchemes(data.data);
        }
      } catch (error) {
        console.error("Error fetching schemes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const handleApply = (link) => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  // Filter schemes based on search query and category
  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (scheme.translations[language] && scheme.translations[language].toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || scheme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredScheme = filteredSchemes.find(s => s.isFeatured) || filteredSchemes[0];
  const regularSchemes = filteredSchemes.filter(s => s.id !== featuredScheme?.id);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-2 bg-emerald-100 text-emerald-800">
            Govt. Portal Integration
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-emerald-900">Smart Scheme Discovery</h2>
          <p className="text-muted-foreground mt-1">Find and apply for government subsidies directly from KrushiGYAN.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border shadow-sm">
          <Languages className="h-4 w-4 text-emerald-600" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm bg-transparent border-none focus:ring-0 outline-none text-slate-700 cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>
      </div>

      <Card className="shadow-sm border-emerald-100">
        <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              className="pl-9 bg-slate-50 focus-visible:ring-emerald-500" 
              placeholder="Search schemes, subsidies, keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Badge 
                key={cat} 
                variant={selectedCategory === cat ? "default" : "outline"}
                className={`cursor-pointer px-3 py-1.5 transition-colors ${selectedCategory === cat ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "hover:bg-emerald-50 text-slate-600"}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
>>>>>>> 261795388178aeda18d91682b90e9c8c97550a8b
          </div>
        </CardContent>
      </Card>

<<<<<<< HEAD
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-emerald-900 text-white">
          <CardHeader>
            <Badge className="w-fit bg-emerald-600 text-white hover:bg-emerald-600">Featured Program</Badge>
            <CardTitle className="pt-2 text-white">PM-Kisan Samman Nidhi</CardTitle>
            <CardDescription className="text-emerald-100">
              Direct income support of ₹6,000 per year to landholding farmer families.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button className="bg-white text-emerald-900 hover:bg-emerald-50">Apply Now</Button>
            <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
              Learn More
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-amber-100">
          <CardHeader>
            <CardTitle>Available Funds</CardTitle>
            <CardDescription>Remaining district allocation for this quarter.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-emerald-900">₹2.4 Cr</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {schemes.slice(1).map((scheme) => (
          <Card key={scheme.title}>
            <CardHeader>
              <Badge variant="secondary" className="w-fit">
                {scheme.tag}
              </Badge>
              <CardTitle className="text-xl">{scheme.title}</CardTitle>
              <CardDescription>{scheme.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Apply Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>
=======
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="text-center p-12 border rounded-xl bg-slate-50 text-slate-500 shadow-sm">
          No schemes found matching your criteria. Try adjusting your filters.
        </div>
      ) : (
        <>
          {featuredScheme && (
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2 bg-emerald-900 text-white shadow-md overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <CardHeader className="relative z-10">
                  <Badge className="w-fit bg-emerald-500 text-white hover:bg-emerald-500 mb-2">Featured Program</Badge>
                  <CardTitle className="pt-2 text-white text-2xl">{featuredScheme.name}</CardTitle>
                  <CardDescription className="text-emerald-100 text-base mt-2 max-w-xl leading-relaxed">
                    {featuredScheme.translations[language] || featuredScheme.translations['en']}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                  <div>
                    <p className="text-emerald-200 text-sm font-medium mb-1">Estimated Benefit</p>
                    <p className="text-3xl font-bold text-white">{featuredScheme.benefit}</p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button 
                      className="bg-white text-emerald-900 hover:bg-emerald-50 w-full sm:w-auto font-semibold"
                      onClick={() => handleApply(featuredScheme.applyLink)}
                      disabled={!featuredScheme.applyLink}
                    >
                      Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-amber-900">Eligibility Notice</CardTitle>
                  <CardDescription className="text-amber-700/80">Key requirement for {featuredScheme.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-amber-100/50 rounded-lg border border-amber-200/50 text-amber-900 font-medium">
                    {featuredScheme.eligibility}
                  </div>
                  <p className="text-sm text-amber-700 mt-4 flex items-center">
                    Keep your Aadhaar and land records ready before applying.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {regularSchemes.map((scheme) => (
              <Card key={scheme.id} className="flex flex-col shadow-sm hover:shadow-md transition-shadow border-slate-200">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                      {scheme.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-emerald-950 line-clamp-2">{scheme.name}</CardTitle>
                  <CardDescription className="text-slate-600 line-clamp-3 mt-2 min-h-[60px]">
                    {scheme.translations[language] || scheme.translations['en']}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Benefit</p>
                    <p className="text-sm font-semibold text-emerald-700">{scheme.benefit}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Eligibility</p>
                    <p className="text-sm text-slate-700">{scheme.eligibility}</p>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t mt-auto">
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleApply(scheme.applyLink)}
                    disabled={!scheme.applyLink}
                  >
                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
>>>>>>> 261795388178aeda18d91682b90e9c8c97550a8b
    </div>
  );
}
