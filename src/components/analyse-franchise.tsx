"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Search, X, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FrontendFranchise {
  // Add proper typing based on your franchise data structure
  [key: string]: any;
}

interface AnalyseFranchiseProps {
  franchise: FrontendFranchise;
}

export default function FloatingActionButton({
  franchise,
}: AnalyseFranchiseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  const apiKey =
    "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";

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const buildPrompt = useCallback(
    (userMessage: string, franchiseData: FrontendFranchise) => {
      const franchiseText = JSON.stringify(franchiseData, null, 2);
      return `
You are a business consultant specializing in franchise evaluation.
Provide a comprehensive but concise analysis (5-7 sentences max).
Use clear headings and bullet points for readability.

Franchise Details:
${franchiseText}

User Question or Context:
${userMessage}

Please provide:
## 📊 Overview
Brief summary of the franchise

## 💪 Strengths & Opportunities
Key advantages and growth potential

## ⚠️ Risks & Considerations
Potential challenges and weaknesses

## 💰 Financial Insights
Investment requirements and ROI potential

## 🎯 Recommendation
Clear investment recommendation with reasoning
`;
    },
    []
  );

  const analyseFranchise = useCallback(async () => {
    if (!apiKey) {
      setError(
        "API key is required. Please configure your OpenRouter API key."
      );
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setResult(null);

      const prompt = buildPrompt(
        "Please analyze this franchise for investment potential.",
        franchise
      );

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "Franchise Analyzer",
          },
          body: JSON.stringify({
            model: "nvidia/nemotron-nano-9b-v2:free",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant for analyzing franchise opportunities. Provide structured, actionable insights.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content =
        data?.choices?.[0]?.message?.content ?? "No response received.";
      setResult(content);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to analyze franchise");
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, buildPrompt, franchise]);

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
      setError(null);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setResult(null);
    setError(null);
  };

  return (
    <>
      {/* Backdrop */}
      {/* {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity" />
      )} */}

      {/* Floating Action Button */}
      <Button
        ref={buttonRef}
        onClick={handleToggle}
        size="lg"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        aria-label={
          isOpen ? "Close franchise analyzer" : "Open franchise analyzer"
        }
      >
        {isOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
      </Button>

      {/* Expandable Panel */}
      {isOpen && (
        <Card
          ref={modalRef}
          className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] shadow-2xl border-0 animate-in slide-in-from-bottom-2 duration-200"
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Franchise Analyzer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!result && !error && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Get AI-powered insights about this franchise opportunity.
                </p>
                <Button
                  onClick={analyseFranchise}
                  disabled={isLoading || !apiKey}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyze Franchise
                    </>
                  )}
                </Button>
                {!apiKey && (
                  <Badge
                    variant="destructive"
                    className="w-full justify-center"
                  >
                    API Key Required
                  </Badge>
                )}
              </div>
            )}

            {error && (
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-destructive">
                      Analysis Failed
                    </p>
                    <p className="text-xs text-destructive/80">{error}</p>
                  </div>
                </div>
                <Button
                  onClick={analyseFranchise}
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  disabled={!apiKey}
                >
                  Try Again
                </Button>
              </div>
            )}

            {result && (
              <div className="space-y-3">
                <div className="max-h-96 overflow-y-auto">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        h2: ({ children }) => (
                          <h2 className="text-base font-semibold mt-4 mb-2 first:mt-0">
                            {children}
                          </h2>
                        ),
                        p: ({ children }) => (
                          <p className="text-sm leading-relaxed mb-2">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="text-sm space-y-1 mb-3">{children}</ul>
                        ),
                        li: ({ children }) => (
                          <li className="text-sm">{children}</li>
                        ),
                      }}
                    >
                      {result}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={analyseFranchise}
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    disabled={isLoading}
                  >
                    Re-analyze
                  </Button>
                  <Button
                    onClick={() => setResult(null)}
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
