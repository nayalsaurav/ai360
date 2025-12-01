"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Crop,
  Download,
  Expand,
  Loader2,
  Scissors,
  Type,
  Zap,
  Eye,
  EyeOff,
  Upload as UploadIcon,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { saveAs } from "file-saver";
import {
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";

type JobStatus = "idle" | "queued" | "processing" | "completed" | "error";

interface ProcessingJob {
  id: string;
  type: string;
  status: JobStatus;
  progress: number;
  result?: string;
}

const primaryTools = [
  {
    id: "e-bgremove",
    name: "Remove Background",
    icon: Scissors,
    color: "primary",
    description: "Remove background with AI",
  },
  {
    id: "e-changebg",
    name: "Change Background",
    icon: Expand,
    color: "primary",
    description: "Replace background with AI",
    hasPrompt: true,
  },
  {
    id: "e-edit",
    name: "AI Edit",
    icon: Type,
    color: "secondary",
    description: "Edit image with text prompts",
    hasPrompt: true,
  },
  {
    id: "bg-genfill",
    name: "Generative Fill",
    icon: Expand,
    color: "primary",
    description: "Fill empty areas with AI",
    hasPrompt: true,
  },
];

const secondaryTools = [
  {
    id: "e-dropshadow",
    name: "AI Drop Shadow",
    icon: Zap,
    color: "secondary",
    description: "Add realistic shadows",
  },
  {
    id: "e-retouch",
    name: "AI Retouch",
    icon: Zap,
    color: "primary",
    description: "Enhance and retouch image",
  },
  {
    id: "e-upscale",
    name: "AI Upscale 2x",
    icon: Zap,
    color: "secondary",
    description: "Upscale image quality",
  },
  {
    id: "e-genvar",
    name: "Generate Variations",
    icon: Type,
    color: "primary",
    description: "Create image variations",
    hasPrompt: true,
  },
  {
    id: "e-crop-face",
    name: "Face Crop",
    icon: Crop,
    color: "secondary",
    description: "Smart face-focused cropping",
  },
  {
    id: "e-crop-smart",
    name: "Smart Crop",
    icon: Crop,
    color: "primary",
    description: "AI-powered intelligent cropping",
  },
];

const allTools = [...primaryTools, ...secondaryTools];

function Button({
  children,
  onClick,
  variant = "default",
  className = "",
  disabled = false,
  size = "md",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-all";
  const sizeCls =
    size === "sm"
      ? "px-2 py-1 text-xs"
      : size === "lg"
      ? "px-6 py-3 text-base"
      : "px-4 py-2 text-sm";
  const variantCls =
    variant === "outline"
      ? "border border-border bg-transparent"
      : variant === "ghost"
      ? "bg-transparent"
      : "bg-primary text-black";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizeCls} ${variantCls} ${
        disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-sm"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function UploadZone({
  onImageUpload,
}: {
  onImageUpload: (url: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImageLocal, setUploadedImageLocal] = useState<string | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFiles(files);
    },
    []
  );

  const getUploadAuthParams = async () => {
    const response = await fetch("/api/upload-auth");
    if (!response.ok) throw new Error("Failed to get upload auth params");
    return response.json();
  };

  const uploadToImageKit = async (file: File): Promise<string> => {
    try {
      const { token, expire, signature, publicKey } =
        await getUploadAuthParams();

      const result = await upload({
        file,
        fileName: file.name,
        folder: "pixora-uploads",
        expire,
        token,
        signature,
        publicKey,
        onProgress: () => {},
      });

      return result.url || "";
    } catch (error) {
      if (error instanceof ImageKitInvalidRequestError) {
        throw new Error("Invalid upload request");
      } else if (error instanceof ImageKitServerError) {
        throw new Error("ImageKit server error");
      } else if (error instanceof ImageKitUploadNetworkError) {
        throw new Error("Network error during upload");
      } else {
        throw new Error("Upload failed");
      }
    }
  };

  const handleFiles = async (files: File[]) => {
    const imageFile = files.find((f) => f.type.startsWith("image/"));
    if (!imageFile) return;
    setIsUploading(true);

    try {
      const url = await uploadToImageKit(imageFile);
      setUploadedImageLocal(url);
      onImageUpload(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setUploadedImageLocal(null);
    onImageUpload("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {uploadedImageLocal ? (
        <div className="rounded-xl p-4 border bg-card shadow-sm relative">
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 z-10 p-1 bg-card rounded-full hover:bg-destructive/10 transition-colors"
          >
            <X className="h-4 w-4 text-foreground" />
          </button>

          <div className="aspect-square rounded-lg overflow-hidden">
            <img
              src={uploadedImageLocal}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-3 text-center">
            <p className="text-sm font-medium text-foreground">
              {uploadedImageLocal.startsWith("data:")
                ? "Local preview"
                : "Uploaded to cloud"}
            </p>
            <p className="text-xs text-muted-foreground">
              Ready for AI magic ✨
            </p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <label
            htmlFor="file-upload"
            className="cursor-pointer block text-center"
          >
            <motion.div
              animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
              className="mb-4"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-4">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : isDragOver ? (
                  <UploadIcon className="w-8 h-8 animate-bounce" />
                ) : (
                  <ImageIcon className="w-8 h-8" />
                )}
              </div>
            </motion.div>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isUploading
                ? "Uploading to cloud..."
                : isDragOver
                ? "Drop your photo here"
                : "Upload Photo"}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {isUploading
                ? "Please wait while we upload your image"
                : "Drag & drop or click to browse"}
            </p>

            <Button variant="outline" className="border" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Browse Files
                </>
              )}
            </Button>
          </label>
        </div>
      )}

      <div className="mt-4 text-center">
        <div className="text-xs text-muted-foreground">
          Supports JPG, PNG, WebP up to 10MB
        </div>
      </div>
    </motion.div>
  );
}

function CanvasEditor({
  originalImage,
  processedImage,
  isProcessing,
}: {
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
}) {
  const [showComparison, setShowComparison] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  if (!originalImage) {
    return (
      <div className="rounded-xl border bg-card p-6 aspect-[4/3] flex items-center justify-center shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🎨</span>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            Ready for Magic
          </h3>
          <p className="text-muted-foreground">
            Upload a photo to start editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        layout
        className="relative rounded-xl border bg-card overflow-hidden aspect-[4/3] shadow-sm"
      >
        {isProcessing && (
          <div className="absolute inset-0 bg-background/80 z-10 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-3 text-primary animate-spin" />
              <p className="text-foreground font-medium">
                AI is working its magic...
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This usually takes a few seconds
              </p>
            </div>
          </div>
        )}

        {showComparison && processedImage ? (
          <div
            className="relative w-full h-full cursor-ew-resize"
            onMouseMove={handleSliderMove}
          >
            <div className="absolute inset-0">
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={processedImage}
                alt="Processed"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className="absolute top-0 bottom-0 w-1 bg-primary"
              style={{
                left: `${sliderPosition}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-card rounded-full flex items-center justify-center">
                  <div className="w-1 h-4 bg-primary rounded-full" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 text-xs font-medium text-card-foreground bg-card/80 px-2 py-1 rounded">
              BEFORE
            </div>
            <div className="absolute bottom-4 right-4 text-xs font-medium text-background bg-primary px-2 py-1 rounded">
              AFTER
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <img
              src={processedImage || originalImage}
              alt={processedImage ? "Processed" : "Original"}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {processedImage && !isProcessing && (
          <div className="absolute top-4 right-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
              className="bg-card/30 border"
            >
              {showComparison ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Compare
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Compare
                </>
              )}
            </Button>
          </div>
        )}
      </motion.div>

      <div className="text-center">
        {isProcessing ? (
          <p className="text-sm text-primary">Processing with AI...</p>
        ) : processedImage ? (
          <p className="text-sm text-primary">
            ✨ Magic applied! Compare or export your result
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Select a tool to start editing
          </p>
        )}
      </div>
    </div>
  );
}

export default function EditorSingleFile() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [currentJob, setCurrentJob] = useState<ProcessingJob | null>(null);
  const [editHistory, setEditHistory] = useState<ProcessingJob[]>([]);
  const [activeEffects, setActiveEffects] = useState<Set<string>>(new Set());
  const [promptText, setPromptText] = useState("");
  const [showPromptInput, setShowPromptInput] = useState(false);

  useEffect(() => {
    if (!uploadedImage) {
      setProcessedImage(null);
      setActiveEffects(new Set());
    }
  }, [uploadedImage]);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl || null);
    setProcessedImage(null);
    setCurrentJob(null);
  };

  const getImageKitTransform = (tooldId: string, prompt?: string): string => {
    const transforms: Record<string, string> = {
      "e-bgremove": "e-bgremove",
      "e-changebg": prompt
        ? `e-changebg-prompt-${encodeURIComponent(prompt)}`
        : "e-changebg",
      "e-edit": prompt ? `e-edit:${encodeURIComponent(prompt)}` : "e-edit",
      "bg-genfill": prompt
        ? `bg-genfill:${encodeURIComponent(prompt)}`
        : "bg-genfill",
      "e-dropshadow": "e-dropshadow",
      "e-retouch": "e-retouch",
      "e-upscale": "e-upscale",
      "e-genvar": prompt
        ? `e-genvar:${encodeURIComponent(prompt)}`
        : "e-genvar",
      "e-crop-face": "e-crop-face",
      "e-crop-smart": "e-crop-smart",
    };

    return transforms[tooldId] || "";
  };

  const applyEffect = async (toolId: string, prompt?: string) => {
    if (!uploadedImage) return;

    const newJob: ProcessingJob = {
      id: Date.now().toString(),
      type: toolId,
      status: "queued",
      progress: 0,
    };

    setCurrentJob(newJob);

    const newActiveEffects = new Set(activeEffects);
    newActiveEffects.add(toolId);
    setActiveEffects(newActiveEffects);

    const allEffects = Array.from(newActiveEffects);
    const transforms = allEffects.map((effect) =>
      getImageKitTransform(effect, effect === toolId ? prompt : undefined)
    );
    const newImageUrl = `${uploadedImage}?tr=${transforms.join(",")}`;

    try {
      setCurrentJob((prev) =>
        prev ? { ...prev, status: "processing", progress: 10 } : null
      );

      let attempts = 0;
      const maxAttempts = 60;
      const pollInterval = 5000;

      const pollImageKit = async (): Promise<boolean> => {
        attempts++;
        try {
          const response = await fetch(newImageUrl, {
            method: "HEAD",
            cache: "no-cache",
          });
          if (response.ok) {
            setProcessedImage(newImageUrl);
            setCurrentJob((prev) =>
              prev ? { ...prev, progress: 100, status: "completed" } : null
            );

            const completedJob = {
              ...newJob,
              status: "completed" as JobStatus,
              progress: 100,
              result: newImageUrl,
            };
            setEditHistory((prev) => [completedJob, ...prev.slice(0, 2)]);
            return true;
          }
        } catch (error) {
          // still processing
        }

        const progress = Math.min(10 + attempts * 1.5, 90);
        setCurrentJob((prev) => (prev ? { ...prev, progress } : null));

        if (attempts >= maxAttempts) {
          setProcessedImage(newImageUrl);
          setCurrentJob((prev) =>
            prev ? { ...prev, progress: 100, status: "completed" } : null
          );

          const completedJob = {
            ...newJob,
            status: "completed" as JobStatus,
            progress: 100,
            result: newImageUrl,
          };
          setEditHistory((prev) => [completedJob, ...prev.slice(0, 2)]);
          return true;
        }

        await new Promise((r) => setTimeout(r, pollInterval));
        return pollImageKit();
      };

      await pollImageKit();
    } catch (error) {
      console.error("Error applying effect:", error);
      setCurrentJob((prev) => (prev ? { ...prev, status: "error" } : null));
    }
  };

  const handleToolClick = async (toolId: string) => {
    if (!uploadedImage) return;

    const tool = allTools.find((t) => t.id === toolId);
    if (!tool) return;

    const newActiveEffects = new Set(activeEffects);
    if (newActiveEffects.has(toolId)) {
      newActiveEffects.delete(toolId);
      setActiveEffects(newActiveEffects);

      const remainingEffects = Array.from(newActiveEffects);
      const newImageUrl =
        remainingEffects.length > 0
          ? `${uploadedImage}?tr=${remainingEffects
              .map((effect) => getImageKitTransform(effect))
              .join(",")}`
          : uploadedImage;
      setProcessedImage(newImageUrl);
      return;
    }

    if ((tool as any).hasPrompt) {
      setShowPromptInput(true);
      setPromptText("");
      setCurrentJob({
        id: Date.now().toString(),
        type: toolId,
        status: "idle",
        progress: 0,
      });
      return;
    }

    await applyEffect(toolId);
  };

  const handlePromptSubmit = async () => {
    if (!promptText.trim()) return;
    const waitingToolId = currentJob?.type;
    if (!waitingToolId) return;
    setShowPromptInput(false);
    setPromptText("");
    await applyEffect(waitingToolId, promptText);
  };

  const handleExport = (format: string) => {
    if (!processedImage) return;
    saveAs(processedImage, `pixora-${Date.now()}.${format}`);
  };

  return (
    <section id="editor" className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-3">
            <span className="text-primary">Magic</span>
            <span className="text-foreground"> Studio</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your photo and transform it with AI-powered tools — all free.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="p-0">
              <UploadZone onImageUpload={handleImageUpload} />
            </div>

            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                AI Tools
              </h3>

              {showPromptInput && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 p-4 bg-card rounded-lg border border-border shadow-sm"
                >
                  <textarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="Describe what you want to change..."
                    className="w-full p-3 bg-transparent border border-input rounded-md text-foreground placeholder:text-muted-foreground resize-none"
                    rows={3}
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={handlePromptSubmit}
                      disabled={!promptText.trim()}
                      className="flex-1"
                    >
                      Apply
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowPromptInput(false);
                        setCurrentJob(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                {primaryTools.map((tool) => {
                  const isActive = activeEffects.has(tool.id);
                  const isProcessing =
                    currentJob?.type === tool.id &&
                    currentJob.status === "processing";
                  const isDisabled =
                    !uploadedImage || currentJob?.status === "processing";

                  return (
                    <Button
                      key={tool.id}
                      variant={isActive ? "default" : "outline"}
                      className={`w-full justify-start transition-all ${
                        isActive ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => handleToolClick(tool.id)}
                      disabled={isDisabled}
                    >
                      <tool.icon
                        className={`h-4 w-4 mr-2 ${
                          isProcessing ? "animate-pulse" : ""
                        }`}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{tool.name}</div>
                        {(tool as any).hasPrompt && (
                          <div className="text-xs opacity-70">
                            Requires Prompt
                          </div>
                        )}
                      </div>
                      {isActive && !isProcessing && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                      {isProcessing && (
                        <Loader2 className="h-4 w-4 ml-auto animate-spin" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <CanvasEditor
              originalImage={uploadedImage}
              processedImage={processedImage}
              isProcessing={currentJob?.status === "processing"}
            />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Additional Tools
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {secondaryTools.map((tool) => {
                  const isActive = activeEffects.has(tool.id);
                  const isProcessing =
                    currentJob?.type === tool.id &&
                    currentJob.status === "processing";
                  const isDisabled =
                    !uploadedImage || currentJob?.status === "processing";

                  return (
                    <Button
                      key={tool.id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className={`justify-start transition-all ${
                        isActive ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => handleToolClick(tool.id)}
                      disabled={isDisabled}
                    >
                      <tool.icon
                        className={`h-3 w-3 mr-2 ${
                          isProcessing ? "animate-pulse" : ""
                        }`}
                      />
                      <span className="text-xs">{tool.name}</span>
                      {isActive && !isProcessing && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full ml-auto" />
                      )}
                      {isProcessing && (
                        <Loader2 className="h-3 w-3 ml-auto animate-spin" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="rounded-xl p-6 border bg-card text-card-foreground shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Job Status</h3>

              {currentJob ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {currentJob.status === "processing" ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    ) : currentJob.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    ) : currentJob.status === "queued" ? (
                      <Clock className="h-5 w-5 text-muted-foreground animate-pulse" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    )}

                    <div>
                      <p className="font-medium capitalize">
                        {allTools.find((t) => t.id === currentJob.type)?.name ||
                          currentJob.type.replace("-", " ")}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {currentJob.status === "queued" &&
                          "Preparing AI transformation..."}
                        {currentJob.status === "processing" &&
                          `Processing with AI... (${currentJob.progress}%)`}
                        {currentJob.status === "completed" &&
                          "AI transformation completed!"}
                        {currentJob.status === "error" && "Processing failed"}
                      </p>
                    </div>
                  </div>

                  {(currentJob.status === "processing" ||
                    currentJob.status === "queued") && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentJob.status === "queued"
                            ? "bg-muted-foreground animate-pulse"
                            : "bg-primary"
                        }`}
                        style={{
                          width:
                            currentJob.status === "queued"
                              ? "100%"
                              : `${currentJob.progress}%`,
                        }}
                      />
                      <div className="text-xs text-muted-foreground mt-1 text-center">
                        {currentJob.status === "queued" && "Initializing..."}
                        {currentJob.status === "processing" &&
                          "Waiting for AI to complete transformation..."}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Upload an image and select a tool to start
                </p>
              )}

              {editHistory?.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-sm font-semibold mb-3">Recent Edits</h4>
                  <div className="space-y-2">
                    {editHistory?.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground capitalize">
                          {job?.type?.replace("-", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {processedImage && (
                <div className="mt-6">
                  <Button
                    variant={"default"}
                    onClick={() => handleExport("jpg")}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
