import { AlertTriangle, CloudRain, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function CropAnalysisPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-emerald-900">Crop Health Intelligence</h2>
          <p className="text-muted-foreground">Upload plant images and get instant disease detection with recommended actions.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">AI Model v4.2</Badge>
          <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">98% Accuracy</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-10 text-center">
                <Upload className="mx-auto mb-3 h-9 w-9 text-emerald-700" />
                <h3 className="text-lg font-semibold text-emerald-900">Drop your crop photo here</h3>
                <p className="mb-5 text-sm text-muted-foreground">Supports JPG, PNG up to 10MB</p>
                <Button>Select from Gallery</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analyzing Specimen</CardTitle>
              <CardDescription>Scanning for leaf blast, bacterial blight and brown spot patterns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span className="font-semibold text-emerald-800">74%</span>
              </div>
              <Progress value={74} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disease Result</CardTitle>
              <CardDescription>Primary detection zone marked from uploaded sample.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="relative h-56 rounded-xl bg-gradient-to-br from-amber-100 via-lime-100 to-emerald-100">
                <div className="absolute inset-6 rounded-lg border-4 border-red-500/60" />
              </div>
              <div className="space-y-4">
                <div>
                  <Badge className="mb-2 bg-red-600 text-white hover:bg-red-600">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    Disease Detected
                  </Badge>
                  <h3 className="text-xl font-semibold">Rice Leaf Blast</h3>
                  <p className="text-sm text-muted-foreground">Confidence score: 92.4%</p>
                </div>
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-900">Urgency is high. Start fungicide cycle within the next 24 hours.</div>
                <Button className="w-full">Get Treatment Plan</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>1. Apply Tricyclazole 75WP at 0.6g/L.</p>
              <p>2. Pause nitrogen-heavy fertilizer for 7 days.</p>
              <p>3. Drain field for 48 hours to reduce humidity.</p>
              <Button variant="outline" className="w-full">
                Order Supplies
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Alerts</CardTitle>
              <CardDescription>3 similar cases in 5km radius of Ludhiana.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-32 rounded-lg bg-gradient-to-br from-emerald-200 to-emerald-400" />
            </CardContent>
          </Card>

          <Card className="bg-emerald-900 text-white">
            <CardHeader>
              <CardTitle className="text-white">Weather Advisory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-emerald-100">
              <p className="text-3xl font-bold text-white">31°C</p>
              <p className="flex items-center gap-2">
                <CloudRain className="h-4 w-4" /> 92% humidity expected tonight.
              </p>
              <p>Ensure airflow in dense patches to slow fungal spread.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
