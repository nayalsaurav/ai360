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
import { Loader2, Copy, Check, AlertCircle, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SummarizerPage() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError("Please enter text to summarize.");
      return;
    }

    setLoading(true);
    setError(null);
    setSummary("");

    try {
      const response = await fetch("/api/utilities/summarizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong.");
      }

      const data = await response.json();
      setSummary(data.summary || "No summary generated.");
    } catch (err) {
      console.error("Summarizer Error:", err);
      setError("Failed to summarize text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Text Summarizer</h1>
            <p className="text-muted-foreground">
              Condense long content into concise summaries
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Your Content</CardTitle>
                <CardDescription>
                  Paste text you want to summarize
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Paste your text here. Articles, documents, emails - anything you want condensed into a concise summary..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-96 resize-none"
                />

                {error && (
                  <div className="flex items-center gap-3 p-3 bg-destructive/10 text-destructive rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    {text.length} characters
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {text.split(/\s+/).filter((w) => w.length > 0).length} words
                  </span>
                </div>

                <Button
                  onClick={handleSummarize}
                  disabled={!text.trim() || loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Summarize
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Result Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Summary</CardTitle>
                    <CardDescription>
                      Concise version of your content
                    </CardDescription>
                  </div>
                  {summary && (
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

                {summary && !loading && (
                  <div className="animate-in fade-in duration-300">
                    <p className="text-foreground leading-relaxed">{summary}</p>
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Compression ratio:{" "}
                        {summary.length > 0
                          ? Math.round((summary.length / text.length) * 100)
                          : 0}
                        % of original length
                      </p>
                    </div>
                  </div>
                )}

                {!summary && !loading && (
                  <div className="h-full rounded-lg border border-dashed border-border flex items-center justify-center min-h-96">
                    <p className="text-muted-foreground text-center">
                      Paste text and click "Summarize" to get a condensed
                      version
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
