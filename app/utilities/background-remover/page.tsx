"use client";

import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Download, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function BackgroundRemoverPage() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResult(null);
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to load image. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async () => {
    if (!image) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64File = image.split(",")[1]; // Extract pure base64 string

      const response = await fetch("/api/utilities/background-remover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64File }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong.");
      }

      const data = await response.json();
      setResult(data.url || "");
    } catch (err) {
      console.error("Background Remover Error:", err);
      setError("Failed to remove background. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = "background-removed.png";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Background Remover</h1>
            <p className="text-muted-foreground">
              Remove backgrounds from images instantly with AI precision.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
                <CardDescription>
                  Select an image to remove the background
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, GIF (max 10MB)
                  </p>
                </div>

                {image && (
                  <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-3 p-3 bg-destructive/10 text-destructive rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleRemoveBackground}
                  disabled={!image || loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Remove Background"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Result Section */}
            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
                <CardDescription>
                  Your processed image will appear here
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading && (
                  <div className="space-y-4">
                    <Skeleton className="w-full h-64 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                )}

                {result && !loading && (
                  <>
                    <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden border border-border">
                      <Image
                        src={result}
                        alt="Result"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <Button
                      onClick={handleDownload}
                      size="lg"
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Result
                    </Button>
                  </>
                )}

                {!result && !loading && (
                  <div className="h-64 rounded-lg border border-dashed border-border flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      Upload an image and click “Remove Background” to see the
                      result.
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
