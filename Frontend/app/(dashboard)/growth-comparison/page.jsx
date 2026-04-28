"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  ImagePlus,
  LineChart,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Upload
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BASE_URL } from "@/utils/api";

const createPreview = (file) => (file ? URL.createObjectURL(file) : null);

export default function GrowthComparisonPage() {
  const [day15Image, setDay15Image] = useState(null);
  const [day30Image, setDay30Image] = useState(null);
  const [day15Preview, setDay15Preview] = useState(null);
  const [day30Preview, setDay30Preview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    return () => {
      if (day15Preview) URL.revokeObjectURL(day15Preview);
      if (day30Preview) URL.revokeObjectURL(day30Preview);
    };
  }, [day15Preview, day30Preview]);

  const handleImageChange = (event, slot) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size should not exceed 5MB.");
      return;
    }

    setError("");
    setResult(null);

    if (slot === "day15") {
      if (day15Preview) URL.revokeObjectURL(day15Preview);
      setDay15Image(file);
      setDay15Preview(createPreview(file));
    } else {
      if (day30Preview) URL.revokeObjectURL(day30Preview);
      setDay30Image(file);
      setDay30Preview(createPreview(file));
    }
  };

  const clearImage = (slot) => {
    if (slot === "day15") {
      if (day15Preview) URL.revokeObjectURL(day15Preview);
      setDay15Image(null);
      setDay15Preview(null);
    } else {
      if (day30Preview) URL.revokeObjectURL(day30Preview);
      setDay30Image(null);
      setDay30Preview(null);
    }
    setResult(null);
  };

  const handleCompare = async () => {
    if (!day15Image || !day30Image) {
      setError("Please upload both Day 15 and Day 30 images first.");
      return;
    }

    setLoading(true);
    setProgress(10);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("day15Image", day15Image);
    formData.append("day30Image", day30Image);

    try {
      const token = localStorage.getItem("token");
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 12));
      }, 450);

      const response = await fetch(`${BASE_URL}/api/crop/compare`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Comparison failed");
      }

      setResult(data.data);
    } catch (err) {
      setError(err.message || "Failed to connect to the comparison server.");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit">Season Tracking</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-emerald-950">Growth Comparison</h2>
          <p className="max-w-2xl text-muted-foreground">
            Compare two crop photos from different dates and get AI guidance on growth, yield, and next actions.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Gemini AI</Badge>
          <Badge variant="outline">Day 15 vs Day 30</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="space-y-6 md:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Day 15 Upload</CardTitle>
              <CardDescription>Add the earlier crop image for comparison.</CardDescription>
            </CardHeader>
            <CardContent>
              {day15Preview ? (
                <div className="space-y-4">
                  <img src={day15Preview} alt="Day 15 preview" className="h-64 w-full rounded-2xl object-cover" />
                  <Button variant="outline" className="w-full" onClick={() => clearImage("day15")}>
                    Remove Day 15 Image
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="day15-upload"
                  className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-6 text-center transition-colors hover:border-emerald-500 hover:bg-emerald-50"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900/10 text-emerald-900">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-900">Upload Crop Photo (Day 15)</p>
                  <p className="mt-2 text-sm text-muted-foreground">PNG or JPG, up to 5MB</p>
                  <input
                    id="day15-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageChange(event, "day15")}
                  />
                </label>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Day 30 Upload</CardTitle>
              <CardDescription>Add the later crop image to measure progress.</CardDescription>
            </CardHeader>
            <CardContent>
              {day30Preview ? (
                <div className="space-y-4">
                  <img src={day30Preview} alt="Day 30 preview" className="h-64 w-full rounded-2xl object-cover" />
                  <Button variant="outline" className="w-full" onClick={() => clearImage("day30")}>
                    Remove Day 30 Image
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="day30-upload"
                  className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-6 text-center transition-colors hover:border-emerald-500 hover:bg-emerald-50"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900/10 text-emerald-900">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-900">Upload Crop Photo (Day 30)</p>
                  <p className="mt-2 text-sm text-muted-foreground">PNG or JPG, up to 5MB</p>
                  <input
                    id="day30-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageChange(event, "day30")}
                  />
                </label>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 md:col-span-7">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Visual Progress</CardTitle>
                <CardDescription>Review the two stages side by side before running analysis.</CardDescription>
              </div>
              <Badge className="bg-emerald-900 text-white hover:bg-emerald-900">Side-by-side</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-emerald-50">
                    {day15Preview ? (
                      <img src={day15Preview} alt="Day 15 selected" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-emerald-900/50">
                        <Upload className="h-10 w-10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-950">
                      DAY 15
                    </span>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">Day 15</p>
                </div>

                <div className="space-y-3">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-emerald-50">
                    {day30Preview ? (
                      <img src={day30Preview} alt="Day 30 selected" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-emerald-900/50">
                        <Upload className="h-10 w-10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-950">
                      DAY 30
                    </span>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">Day 30</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <Button
                  onClick={handleCompare}
                  disabled={!day15Image || !day30Image || loading}
                  className="h-12 w-full gap-2 bg-emerald-900 hover:bg-emerald-800"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Comparing growth...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4" />
                      Analyze & Get Suggestions
                    </>
                  )}
                </Button>

                {loading && (
                  <div className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing comparison</span>
                      <span className="font-semibold text-emerald-900">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                      <Sparkles className="h-5 w-5 text-emerald-700" />
                      <Badge variant="secondary">Health Status</Badge>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-950">Crop Health Comparison</h3>
                      <p className="mt-2 text-sm font-medium text-emerald-800">Good Growth Identified</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{result.cropHealthComparison}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                      <TrendingUp className="h-5 w-5 text-emerald-700" />
                      <Badge variant="secondary">Metrics</Badge>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-950">Growth Analysis</h3>
                      <p className="mt-2 text-sm font-medium text-emerald-800">Visible seasonal progress</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{result.growthAnalysis}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                      <LineChart className="h-5 w-5 text-amber-700" />
                      <Badge variant="secondary">Projection</Badge>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-950">Revenue Optimization</h3>
                      <p className="mt-2 text-sm font-medium text-emerald-800">Expected yield uplift</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{result.revenueOptimization}</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-emerald-100 bg-emerald-50/60">
                <CardHeader>
                  <CardTitle>Actionable Suggestions</CardTitle>
                  <CardDescription>Use these next steps to keep crop growth on track.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Array.isArray(result.suggestions) && result.suggestions.length > 0 ? (
                    result.suggestions.map((suggestion, index) => (
                      <div key={suggestion} className="flex items-start gap-3 rounded-2xl border border-white bg-white p-4 shadow-sm">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-900 text-sm font-semibold text-white">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-relaxed text-emerald-950">{suggestion}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 rounded-2xl border border-white bg-white p-4 text-sm text-muted-foreground">
                      <ArrowRight className="h-4 w-4 text-emerald-700" />
                      AI suggestions will appear here after comparison.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
