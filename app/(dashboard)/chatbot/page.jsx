import { Bot, Paperclip, SendHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function ChatbotPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col">
      <Card className="flex min-h-[calc(100dvh-11rem)] flex-col overflow-hidden md:min-h-[calc(100vh-10rem)]">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-900">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>AgriBot Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">Online and ready to help</p>
              </div>
            </div>
            <Badge>Live</Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="max-w-xl rounded-2xl rounded-tl-sm bg-secondary p-3 text-sm">
            Hello John, your recent soil report shows slightly low nitrogen levels for corn growth. Want a fertilizer schedule?
          </div>
          <div className="ml-auto max-w-xl rounded-2xl rounded-tr-sm bg-emerald-100 p-3 text-sm text-emerald-900">
            Yes. Also I noticed orange spots on wheat leaves, what could that be?
          </div>
          <div className="max-w-xl space-y-3 rounded-2xl rounded-tl-sm bg-secondary p-3 text-sm">
            Likely Leaf Rust. I am loading a quick treatment workflow based on your region.
            <div className="rounded-lg border bg-background p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span>Disease Pattern Analysis</span>
                <span className="font-semibold text-emerald-800">85%</span>
              </div>
              <Progress value={85} />
            </div>
          </div>
        </CardContent>

        <CardFooter className="block space-y-3 border-t bg-background/90 p-3 sm:p-4 md:p-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["How to treat rust?", "Best corn planting time?", "Check soil pH", "Punjab weather forecast"].map((item) => (
              <Badge key={item} variant="secondary" className="whitespace-nowrap px-3 py-1">
                {item}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-2xl border bg-white p-2">
            <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full p-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input className="border-0 text-sm focus-visible:ring-0" placeholder="Ask AgriBot about crops, soil, weather..." />
            <Button size="sm" className="rounded-xl">
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <div className="h-20 md:hidden" aria-hidden />
    </div>
  );
}
