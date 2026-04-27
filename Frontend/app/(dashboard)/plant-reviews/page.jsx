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
      </div>
    </div>
  );
}
