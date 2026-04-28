"use client";

import { useState } from "react";
import { AlertTriangle, CloudRain, Upload, FileImage, Languages, RefreshCw, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BASE_URL } from "@/utils/api";

export default function CropAnalysisPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should not exceed 5MB.");
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
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setProgress(10);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("language", language);

    try {
      const token = localStorage.getItem("token");
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 15));
      }, 500);

      const response = await fetch(`${BASE_URL}/api/crop/analyze`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Analysis failed");
      }

      setResult(data.data);
    } catch (err) {
      setError(err.message || "Failed to connect to the analysis server.");
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-emerald-900">Crop Health Intelligence</h2>
          <p className="text-muted-foreground">Upload plant images and get instant disease detection with recommended actions.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Gemini AI</Badge>
          <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Smart Analysis</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 p-6 text-center">
                {preview ? (
                  <div className="mb-4 flex flex-col items-center">
                    <img src={preview} alt="Crop Preview" className="mb-4 max-h-64 rounded-lg object-contain" />
                    <Button variant="outline" onClick={() => { setImage(null); setPreview(null); setResult(null); }}>
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto mb-3 h-9 w-9 text-emerald-700" />
                    <h3 className="text-lg font-semibold text-emerald-900">Drop your crop photo here</h3>
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
              
              <div className="mt-6 flex flex-wrap items-end gap-4">
                <div className="flex-1 space-y-2 min-w-[200px]">
                  <label className="text-sm font-medium text-emerald-900/80 flex items-center gap-2">
                    <Languages className="h-4 w-4" /> Output Language
                  </label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <FileImage className="mr-2 h-4 w-4" />
                      Analyze Crop
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div className="mt-4 rounded bg-red-100 p-3 text-sm text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> {error}
                </div>
              )}
            </CardContent>
          </Card>

          {loading && (
            <Card>
              <CardHeader>
                <CardTitle>Analyzing Specimen</CardTitle>
                <CardDescription>Scanning for diseases, nutrient deficiencies, and pests using Gemini AI.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing...</span>
                  <span className="font-semibold text-emerald-800">{progress}%</span>
                </div>
                <Progress value={progress} />
              </CardContent>
            </Card>
          )}

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Disease Result</CardTitle>
                <CardDescription>Analysis complete based on the uploaded specimen.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                <div className="relative h-56 rounded-xl overflow-hidden bg-emerald-50">
                   <img src={preview} alt="Analyzed" className="h-full w-full object-cover" />
                </div>
                <div className="space-y-4">
                  <div>
                    <Badge className="mb-2 bg-red-600 text-white hover:bg-red-600">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Issue Detected
                    </Badge>
                    <h3 className="text-xl font-semibold text-emerald-900">{result.detectedDisease}</h3>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900 border border-emerald-100 shadow-sm">
                    <strong>Solution:</strong>
                    <p className="mt-1">{result.solution}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {result && (
          <div className="space-y-6 lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                  <h4 className="font-semibold flex items-center gap-2 mb-2 text-blue-900">
                    <CheckCircle2 className="h-4 w-4" /> Steps to Treat
                  </h4>
                  <p className="text-blue-800 whitespace-pre-wrap">{result.treatmentSteps}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Precautions</CardTitle>
                <CardDescription>How to prevent this in the future.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-amber-50 p-4 border border-amber-100 text-sm text-amber-900 whitespace-pre-wrap">
                  {result.precautions}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
