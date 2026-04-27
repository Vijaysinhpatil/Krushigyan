import { Download, FlaskConical, History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const nutrients = [
  { name: "Nitrogen", value: "185 kg/ha", status: "High", width: "80%" },
  { name: "Phosphorus", value: "22 kg/ha", status: "Deficient", width: "25%" },
  { name: "Potassium", value: "240 kg/ha", status: "Optimum", width: "60%" }
];

export default function SoilTestingPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-emerald-900">Soil Health Dashboard</h2>
          <p className="text-muted-foreground">Analyze field composition and optimize nutrient planning.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="mr-2 h-4 w-4" />
            Past Logs
          </Button>
          <Button>New Analysis</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Visual Soil Scan</CardTitle>
              <CardDescription>Upload soil image or enter lab values manually.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="flex h-56 items-center justify-center rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/40">
                <div className="text-center">
                  <FlaskConical className="mx-auto mb-2 h-8 w-8 text-emerald-700" />
                  <p className="font-medium text-emerald-900">Upload Soil Photo</p>
                </div>
              </div>
              <div className="space-y-3">
                <Input placeholder="Organic Carbon (%)" />
                <Input placeholder="Soil Texture (Sandy Loam / Clay)" />
                <Input placeholder="Moisture (%)" />
                <Button className="w-full">Run Full Analysis</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            {nutrients.map((item) => (
              <Card key={item.name}>
                <CardHeader className="pb-2">
                  <CardDescription>{item.name}</CardDescription>
                  <CardTitle className="text-xl">{item.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm font-medium text-emerald-800">{item.status}</p>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-emerald-600" style={{ width: item.width }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Card className="bg-amber-100">
            <CardHeader>
              <CardTitle>Soil pH Balance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-4xl font-bold text-emerald-900">6.4</p>
              <p className="text-sm text-muted-foreground">Slightly acidic. Good for most legumes and tubers.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>DAP application: 50kg/acre</p>
              <p>Add organic mulch to improve carbon</p>
              <p>Rotate with legumes next cycle</p>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Full Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
