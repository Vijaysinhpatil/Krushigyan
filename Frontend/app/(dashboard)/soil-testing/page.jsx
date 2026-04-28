"use client";

import { useState } from "react";
import { Upload, FileImage, Languages, RefreshCw, Sprout, TestTube, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
<<<<<<< HEAD
=======
import { API_BASE_URL } from "@/lib/api";
>>>>>>> 261795388178aeda18d91682b90e9c8c97550a8b

export default function SoilTestingPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [organicCarbon, setOrganicCarbon] = useState("");
  const [soilTexture, setSoilTexture] = useState("Loamy");
  const [moisture, setMoisture] = useState("");
  const [language, setLanguage] = useState("en");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError("");
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      setError("Please select a soil image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("organicCarbon", organicCarbon);
    formData.append("soilTexture", soilTexture);
    formData.append("moisture", moisture);
    formData.append("language", language);

    try {
<<<<<<< HEAD
      const response = await fetch("http://localhost:5000/api/soil/analyze", {
        method: "POST",
=======
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/soil/analyze`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
>>>>>>> 261795388178aeda18d91682b90e9c8c97550a8b
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Analysis failed");
      }

      setResult(data.data);
    } catch (err) {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getNutrientColor = (levelStr) => {
    const lower = String(levelStr).toLowerCase();
    if (lower.includes("high") || lower.includes("good") || lower.includes("optimal")) return "bg-emerald-500";
    if (lower.includes("low") || lower.includes("poor") || lower.includes("deficient")) return "bg-red-500";
    return "bg-amber-500"; // Medium/Moderate
  };

  const parseNutrientValue = (levelStr) => {
    const lower = String(levelStr).toLowerCase();
    if (lower.includes("high") || lower.includes("good") || lower.includes("optimal")) return 85;
    if (lower.includes("low") || lower.includes("poor") || lower.includes("deficient")) return 25;
    return 50; // Medium/Moderate
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-emerald-900">Soil Health Testing</h2>
          <p className="text-muted-foreground">Upload soil sample images and parameters for complete NPK and pH analysis.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Gemini AI</Badge>
          <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Smart Lab</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-6 text-center">
                {preview ? (
                  <div className="mb-4 flex flex-col items-center">
                    <img src={preview} alt="Soil Preview" className="mb-4 max-h-64 rounded-lg object-contain" />
                    <Button variant="outline" onClick={() => { setImage(null); setPreview(null); setResult(null); }}>
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto mb-3 h-9 w-9 text-emerald-700" />
                    <h3 className="text-lg font-semibold text-emerald-900">Drop your soil photo here</h3>
                    <p className="mb-5 text-sm text-muted-foreground">Supports JPG, PNG up to 5MB</p>
                    <label htmlFor="image-upload">
                      <Button asChild>
                        <span>Select from Device</span>
                      </Button>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </>
                )}
              </div>
              
              {/* Manual Inputs Grid */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-900/80">Organic Carbon (%)</label>
                  <input 
                    type="number" 
                    value={organicCarbon} 
                    onChange={(e) => setOrganicCarbon(e.target.value)}
                    placeholder="e.g. 1.2"
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-900/80">Moisture (%)</label>
                  <input 
                    type="number" 
                    value={moisture} 
                    onChange={(e) => setMoisture(e.target.value)}
                    placeholder="e.g. 25"
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-emerald-900/80">Soil Texture</label>
                  <select 
                    value={soilTexture} 
                    onChange={(e) => setSoilTexture(e.target.value)}
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Sandy">Sandy</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Clay">Clay</option>
                  </select>
                </div>
              </div>

              {/* Language & Submit */}
              <div className="mt-6 flex flex-wrap items-end gap-4">
                <div className="flex-1 space-y-2 min-w-[200px]">
                  <label className="text-sm font-medium text-emerald-900/80 flex items-center gap-2">
                    <Languages className="h-4 w-4" /> Output Language
                  </label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="mr">Marathi (मराठी)</option>
                    <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  </select>
                </div>
                
                <Button 
                  onClick={handleAnalyze} 
                  disabled={!image || loading} 
                  className="h-12 flex-1 min-w-[200px] bg-emerald-900 hover:bg-emerald-800"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing soil health...
                    </>
                  ) : (
                    <>
                      <TestTube className="mr-2 h-4 w-4" />
                      Run Full Analysis
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div className="mt-4 rounded bg-red-100 p-3 text-sm text-red-700 flex items-center gap-2">
                  <span className="font-semibold">{error}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {loading && (
            <Card>
              <CardHeader>
                <CardTitle>Lab Processing</CardTitle>
                <CardDescription>Synthesizing organic data and visual patterns using AI.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="animate-pulse">Analyzing soil health...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Soil Health Summary</CardTitle>
                <CardDescription>Comprehensive overview of your field's condition.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-emerald-50 p-5 text-emerald-900 border border-emerald-100 shadow-sm leading-relaxed text-sm md:text-base">
                  <Sprout className="mb-2 h-6 w-6 text-emerald-600" />
                  {result.soilHealth}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {result && (
          <div className="space-y-6 lg:col-span-4">
            
            {/* pH Level */}
            <Card className="bg-blue-900 text-white shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-100 flex items-center gap-2 text-lg">
                  <TestTube className="h-5 w-5" /> Estimated pH Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-medium leading-snug">
                  {result.phLevel}
                </div>
              </CardContent>
            </Card>

            {/* NPK Values */}
            <Card>
              <CardHeader>
                <CardTitle>NPK Analysis</CardTitle>
                <CardDescription>Nutrient breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Nitrogen (N)</span>
                    <span className="text-muted-foreground capitalize">{result.nutrients.nitrogen}</span>
                  </div>
                  <Progress value={parseNutrientValue(result.nutrients.nitrogen)} className="h-2" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Phosphorus (P)</span>
                    <span className="text-muted-foreground capitalize">{result.nutrients.phosphorus}</span>
                  </div>
                  <Progress value={parseNutrientValue(result.nutrients.phosphorus)} className="h-2" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Potassium (K)</span>
                    <span className="text-muted-foreground capitalize">{result.nutrients.potassium}</span>
                  </div>
                  <Progress value={parseNutrientValue(result.nutrients.potassium)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Actionable Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
