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
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}
