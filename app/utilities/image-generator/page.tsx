"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download, AlertCircle, Wand2 } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setError(null);
    setImage("");

    try {
      const response = await fetch("/api/utilities/image-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong.");
      }

      const data = await response.json();
      setImage(data.image || "");
    } catch (err) {
      console.error("Image Generator Error:", err);
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "generated-image.png";
    link.click();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && prompt.trim() && !loading) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Image Generator</h1>
            <p className="text-muted-foreground">
              Generate stunning images from text descriptions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Create Image</CardTitle>
                <CardDescription>
                  Describe the image you want to generate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Input
                    placeholder="e.g., A serene mountain landscape at sunset with golden clouds..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be descriptive and specific for better results
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-3 p-3 bg-destructive/10 text-destructive rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium mb-3">Sample Prompts</p>
                  <div className="space-y-2">
                    {[
                      "A futuristic city with flying cars",
                      "Underwater coral reef with colorful fish",
                      "Medieval castle on a misty mountain",
                    ].map((sample) => (
                      <button
                        key={sample}
                        onClick={() => setPrompt(sample)}
                        className="w-full text-left p-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors truncate"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Result Section */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Image</CardTitle>
                <CardDescription>Your AI-generated creation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading && (
                  <div className="space-y-4">
                    <Skeleton className="w-full aspect-square rounded-lg" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                )}

                {image && !loading && (
                  <>
                    <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden border border-border">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt="Generated"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      onClick={handleDownload}
                      size="lg"
                      className="w-full bg-transparent"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Image
                    </Button>
                  </>
                )}

                {!image && !loading && (
                  <div className="aspect-square rounded-lg border border-dashed border-border flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      Enter a prompt and click "Generate Image" to create your
                      masterpiece
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
