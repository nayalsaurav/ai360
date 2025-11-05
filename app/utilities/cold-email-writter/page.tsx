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
import { Loader2, Copy, Check, AlertCircle, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ColdEmailPage() {
  const [context, setContext] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!context.trim()) {
      setError("Please provide context for the email.");
      return;
    }

    setLoading(true);
    setError(null);
    setEmail("");

    try {
      const response = await fetch("/api/utilities/cold-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: context }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong.");
      }

      const data = await response.json();
      setEmail(data.coldEmail || "No email generated.");
    } catch (err) {
      console.error("Cold Email Error:", err);
      setError("Failed to generate email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Cold Email Generator</h1>
            <p className="text-muted-foreground">
              Create persuasive cold emails that get responses
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Email Context</CardTitle>
                <CardDescription>
                  Tell us about your prospect and offering
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Example: I want to reach out to marketing managers at SaaS companies about our lead generation tool. The prospect is Jane Doe who runs marketing at TechCorp..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="min-h-96 resize-none"
                />

                {error && (
                  <div className="flex items-center gap-3 p-3 bg-destructive/10 text-destructive rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={!context.trim() || loading}
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
                      <Mail className="w-4 h-4 mr-2" />
                      Generate Email
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
                    <CardTitle>Your Email</CardTitle>
                    <CardDescription>Ready to send</CardDescription>
                  </div>
                  {email && (
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

                {email && !loading && (
                  <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap text-sm leading-relaxed animate-in fade-in duration-300 font-sans">
                    {email}
                  </div>
                )}

                {!email && !loading && (
                  <div className="h-full rounded-lg border border-dashed border-border flex items-center justify-center min-h-96">
                    <p className="text-muted-foreground text-center">
                      Provide context and click "Generate Email" to create a
                      persuasive cold email
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
