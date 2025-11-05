"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Check, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CodeExplainerPage() {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExplain = async () => {
    if (!code.trim()) {
      setError("Please enter some code to explain.");
      return;
    }

    setLoading(true);
    setError(null);
    setExplanation("");

    try {
      const response = await fetch("/api/utilities/code-explainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong.");
      }

      const data = await response.json();
      setExplanation(data.explanation || "No explanation generated.");
    } catch (err) {
      console.error("Code Explainer Error:", err);
      setError("Failed to explain code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (explanation) {
      navigator.clipboard.writeText(explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Code Explainer</h1>
            <p className="text-muted-foreground">
              Get simple, beginner-friendly explanations for any code snippet
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Your Code</CardTitle>
                <CardDescription>
                  Paste any code snippet you'd like explained
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Paste your code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-96 font-mono text-sm resize-none"
                />

                {error && (
                  <div className="flex items-center gap-3 p-3 bg-destructive/10 text-destructive rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleExplain}
                  disabled={!code.trim() || loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Explain Code"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Explanation Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Explanation</CardTitle>
                    <CardDescription>
                      Simple breakdown of your code
                    </CardDescription>
                  </div>
                  {explanation && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopy}
                      className="gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading && (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/6" />
                  </div>
                )}

                {explanation && !loading && (
                  <p className="text-foreground leading-relaxed animate-in fade-in duration-300">
                    {explanation}
                  </p>
                )}

                {!explanation && !loading && (
                  <div className="h-full rounded-lg border border-dashed border-border flex items-center justify-center min-h-96">
                    <p className="text-muted-foreground text-center">
                      Paste code and click "Explain Code" to get a detailed
                      explanation
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
