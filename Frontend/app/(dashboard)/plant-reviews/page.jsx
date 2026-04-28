<<<<<<< HEAD
import { PenSquare, Star, ThumbsUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const reviews = [
  {
    user: "Amrit Singh",
    title: "Impressive growth cycle with minimal water",
    content: "Dwarf Emerald pea variety needed less irrigation and gave crisp, uniform pods.",
    likes: 24
  },
  {
    user: "Rajiv Mehta",
    title: "The standard for monsoon rice",
    content: "Basmati Prime gave near 100% germination and stable output in clay-heavy soil.",
    likes: 42
  }
];

export default function PlantReviewsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-2">
            Community Knowledge
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-emerald-900">Plant Reviews</h2>
          <p className="text-muted-foreground">Learn from verified experiences shared by farmers in your region.</p>
        </div>
        <Button>
          <PenSquare className="mr-2 h-4 w-4" />
          Write a Review
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Badge className="w-fit">Trending Variety</Badge>
            <CardTitle>Heritage Gold Wheat Seeds</CardTitle>
            <CardDescription>Consistent yield and strong resistance to localized blight.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">128 community reviews</p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-900 text-white">
          <CardHeader>
            <CardTitle className="text-white">Farmer Approval</CardTitle>
            <CardDescription className="text-emerald-100">Verified by regional field officers.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold">94%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((review) => (
          <Card key={review.user}>
            <CardHeader>
              <CardTitle className="text-xl">{review.title}</CardTitle>
              <CardDescription>{review.user}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{review.content}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ThumbsUp className="h-4 w-4" />
                Helpful ({review.likes})
              </div>
            </CardContent>
          </Card>
        ))}
=======
"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ThumbsUp, Star, Loader2, UploadCloud, CheckCircle2, User, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/api";

export default function PlantReviewsPage() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // New Post State
  const [isCreating, setIsCreating] = useState(false);
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("en");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Suggestion input state per post
  const [suggestionInputs, setSuggestionInputs] = useState({});
  const [suggestionLoading, setSuggestionLoading] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`);
      const data = await response.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async () => {
    if (!description.trim() || !imageFile) return;

    setSubmitLoading(true);
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("description", description);
    formData.append("language", language);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setPosts([data.data, ...posts]);
        setIsCreating(false);
        setDescription("");
        setImageFile(null);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Create post error", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAddSuggestion = async (postId) => {
    const text = suggestionInputs[postId];
    if (!text?.trim()) return;

    setSuggestionLoading(prev => ({ ...prev, [postId]: true }));
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/reviews/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (data.success) {
        setPosts(posts.map(p => p._id === postId ? data.data : p));
        setSuggestionInputs(prev => ({ ...prev, [postId]: "" }));
      }
    } catch (error) {
      console.error("Add suggestion error", error);
    } finally {
      setSuggestionLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleHelpful = async (postId, suggestionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/reviews/${postId}/helpful/${suggestionId}`, {
        method: "PATCH",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      const data = await response.json();
      if (data.success) {
        setPosts(posts.map(p => p._id === postId ? data.data : p));
      }
    } catch (error) {
      console.error("Mark helpful error", error);
    }
  };

  const handleMarkBest = async (postId, suggestionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/reviews/${postId}/best/${suggestionId}`, {
        method: "PATCH",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      const data = await response.json();
      if (data.success) {
        setPosts(posts.map(p => p._id === postId ? data.data : p));
      } else {
        alert(data.message || "Could not mark as best");
      }
    } catch (error) {
      console.error("Mark best error", error);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-2 bg-emerald-100 text-emerald-800">
            Farmer Discussion Platform
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-emerald-900">Plant Problems & Solutions</h2>
          <p className="text-muted-foreground mt-1">Upload a photo of your plant issue and get suggestions from the community.</p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <MessageSquare className="mr-2 h-4 w-4" />
            Ask the Community
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="border-emerald-200 shadow-md">
          <CardHeader className="bg-emerald-50/50 pb-4">
            <CardTitle className="text-xl text-emerald-900">Create a New Discussion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Image Upload */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Plant Image</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-emerald-200 border-dashed rounded-xl cursor-pointer bg-emerald-50/30 hover:bg-emerald-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="h-40 object-contain rounded-md" />
                      ) : (
                        <>
                          <UploadCloud className="w-10 h-10 mb-3 text-emerald-500" />
                          <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span></p>
                          <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                        </>
                      )}
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Problem Description</label>
                  <Textarea 
                    placeholder="Describe what's wrong with your crop..." 
                    className="min-h-[120px] resize-none focus-visible:ring-emerald-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Language</label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:ring-emerald-500"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिंदी)</option>
                    <option value="mr">Marathi (मराठी)</option>
                    <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={() => setIsCreating(false)} disabled={submitLoading}>Cancel</Button>
            <Button onClick={handleCreatePost} disabled={submitLoading || !description || !imageFile} className="bg-emerald-600 hover:bg-emerald-700">
              {submitLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Post Discussion
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Feed */}
      <div className="space-y-8">
        {loadingPosts ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center p-12 border rounded-xl bg-slate-50 text-slate-500">
            No discussions yet. Be the first to ask!
          </div>
        ) : (
          posts.map(post => {
            // Sort suggestions: Best first, then AI, then by helpful count
            const sortedSuggestions = [...post.suggestions].sort((a, b) => {
              if (a.isBest) return -1;
              if (b.isBest) return 1;
              if (a.isAI && !b.isAI) return -1;
              if (!a.isAI && b.isAI) return 1;
              return b.helpfulCount - a.helpfulCount;
            });

            return (
              <Card key={post._id} className="overflow-hidden border-slate-200">
                <div className="flex flex-col md:flex-row">
                  {/* Image side */}
                  <div className="w-full md:w-1/3 bg-slate-100 flex items-center justify-center p-4">
                    <img 
                      src={`${API_BASE_URL}${post.imagePath}`} 
                      alt="Crop Issue" 
                      className="rounded-lg object-cover w-full max-h-[300px]"
                      onError={(e) => { e.target.src = '/placeholder.svg' }}
                    />
                  </div>
                  
                  {/* Content side */}
                  <div className="w-full md:w-2/3 flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <User className="h-4 w-4" />
                          <span className="font-medium text-slate-700">{post.userName}</span>
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Badge variant="outline" className="text-xs bg-slate-50 uppercase">{post.language}</Badge>
                      </div>
                      <p className="mt-3 text-slate-800 text-base leading-relaxed">{post.description}</p>
                    </CardHeader>
                    
                    <CardContent className="flex-1 bg-slate-50/50 border-t pt-4 mt-2">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" /> 
                        Suggestions ({post.suggestions.length})
                      </h4>
                      
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {sortedSuggestions.map(sug => (
                          <div 
                            key={sug._id} 
                            className={`p-3 rounded-lg border ${sug.isBest ? 'bg-amber-50 border-amber-200' : sug.isAI ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-xs font-semibold flex items-center gap-1 text-slate-700">
                                {sug.isAI && <Sparkles className="h-3 w-3 text-emerald-600" />}
                                {sug.userName}
                                {sug.isBest && <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800 text-[10px] h-4 py-0 px-1"><Star className="h-3 w-3 mr-1 fill-amber-500" /> Best</Badge>}
                              </span>
                              <span className="text-[10px] text-slate-400">{new Date(sug.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-slate-700">{sug.text}</p>
                            
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 text-xs px-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleHelpful(post._id, sug._id)}
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" /> Helpful ({sug.helpfulCount})
                              </Button>
                              
                              {!sug.isBest && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 text-xs px-2 text-slate-400 hover:text-amber-600"
                                  onClick={() => handleMarkBest(post._id, sug._id)}
                                >
                                  Mark as Best
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        {post.suggestions.length === 0 && (
                          <p className="text-sm text-slate-400 text-center py-4">No suggestions yet.</p>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-3 border-t bg-slate-50">
                      <div className="flex w-full items-center space-x-2">
                        <Input 
                          placeholder="Write a suggestion..." 
                          className="flex-1 bg-white focus-visible:ring-emerald-500"
                          value={suggestionInputs[post._id] || ""}
                          onChange={(e) => setSuggestionInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddSuggestion(post._id);
                          }}
                        />
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleAddSuggestion(post._id)}
                          disabled={suggestionLoading[post._id]}
                        >
                          {suggestionLoading[post._id] ? <Loader2 className="h-4 w-4 animate-spin" /> : "Suggest"}
                        </Button>
                      </div>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            );
          })
        )}
>>>>>>> 261795388178aeda18d91682b90e9c8c97550a8b
      </div>
    </div>
  );
}
