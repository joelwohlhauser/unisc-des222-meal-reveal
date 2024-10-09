"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

// Camera component
const Camera = ({ onCapture }: { onCapture: (imageUrl: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCamera, setHasCamera] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCamera(false);
      }
    }

    void setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Flip the image horizontally
      ctx.scale(-1, 1);
      ctx.drawImage(
        video,
        -video.videoWidth,
        0,
        video.videoWidth,
        video.videoHeight,
      );
      // Reset the transformation
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    const imageUrl = canvas.toDataURL("image/jpeg");
    onCapture(imageUrl);
  };

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6">
      <div className="relative aspect-square w-full overflow-hidden">
        {/* Loading message */}
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600">
          Loading camera...
        </div>
        {hasCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="relative h-full w-full scale-x-[-1] transform object-cover"
          />
        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center bg-gray-200 p-4 text-center">
            <h3 className="mb-2 text-xl font-bold text-red-600">
              Camera Not Available
            </h3>
            <p className="text-gray-700">
              This app requires access to your camera. Please ensure you&apos;ve
              granted camera permissions and reload the page.
            </p>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="mb-4 w-full px-4 md:mb-6 md:px-6">
        <Button onClick={captureImage} className="w-full" disabled={!hasCamera}>
          Take Picture
        </Button>
      </div>
    </div>
  );
};

// Main component
export default function MealAnalysisPage() {
  const [step, setStep] = useState<"camera" | "details" | "analysis">("camera");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [mealDescription, setMealDescription] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCapture = (capturedImageUrl: string) => {
    setImageUrl(capturedImageUrl);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, upload the image
      const imageBlob = await fetch(imageUrl!).then((r) => r.blob());
      const imageFile = new File([imageBlob], "meal-picture.jpg", {
        type: "image/jpeg",
      });

      const uploadResponse = await fetch(
        `/api/meal/upload?filename=${imageFile.name}`,
        {
          method: "POST",
          body: imageFile,
        },
      );

      if (!uploadResponse.ok) throw new Error("Upload failed");

      const uploadResult = (await uploadResponse.json()) as { url: string };

      // Then, analyze the meal
      const analyzeResponse = await fetch("/api/meal/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadResult.url,
          mealDescription,
        }),
      });

      if (!analyzeResponse.ok) throw new Error("Analysis failed");

      const analyzeResult = (await analyzeResponse.json()) as {
        analysis: string;
      };
      setAnalysis(analyzeResult.analysis);
      setStep("analysis");
    } catch (error) {
      console.error("Error processing meal:", error);
      alert("An error occurred while processing the meal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setImageUrl(null);
    setMealDescription("");
    setAnalysis(null);
    setStep("camera");
  };

  const handleRetake = () => {
    setImageUrl(null);
    setMealDescription("");
    setStep("camera");
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
      <div className="container mx-auto max-w-lg space-y-8 px-4 pb-16 pt-8 md:pt-16">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          {step === "camera" && "Take a Picture"}
          {step === "details" && "Meal Details"}
          {step === "analysis" && "Meal Analysis"}
        </h1>

        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
          {step === "camera" && (
            <div className="overflow-hidden rounded-t-2xl">
              <Camera onCapture={handleCapture} />
            </div>
          )}

          {(step === "details" || step === "analysis") && imageUrl && (
            <div className="w-full">
              <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl">
                <Image
                  src={imageUrl}
                  alt="Captured meal"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          )}

          {step != "camera" && (
            <div className="space-y-6 p-4 md:p-6">
              {step === "details" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetake}
                    className="w-full"
                  >
                    Retake Picture
                  </Button>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="mealDescription"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Meal Description (Optional)
                      </label>
                      <Textarea
                        id="mealDescription"
                        value={mealDescription}
                        onChange={(e) => setMealDescription(e.target.value)}
                        className="mt-1"
                        rows={3}
                        placeholder="Describe your meal here..."
                      />
                    </div>
                    <div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? "Analyzing..." : "Analyze Meal"}
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {step === "analysis" && analysis && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Nutrition Facts
                    </h2>
                    <p className="text-gray-700">{analysis}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {step === "analysis" && analysis && (
          <Button onClick={resetForm} className="w-full">
            Analyze another Meal
          </Button>
        )}
      </div>
    </main>
  );
}
