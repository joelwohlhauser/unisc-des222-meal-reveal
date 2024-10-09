"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// Camera component
const Camera = ({ onCapture }: { onCapture: (imageUrl: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCamera, setHasCamera] = useState(true);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
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
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
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
    <div className="flex flex-col items-center gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        {hasCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full w-full scale-x-[-1] transform object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-300">
            <svg
              className="h-24 w-24 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <button
        onClick={captureImage}
        className="w-full rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition duration-300 hover:bg-blue-600"
        disabled={!hasCamera}
      >
        Take Picture
      </button>
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 text-white">
      <div className="container mx-auto flex max-w-md flex-col items-center justify-center gap-8">
        <h1 className="text-center text-3xl font-bold sm:text-4xl">
          {step === "camera" && "Take a Picture"}
          {step === "details" && "Meal Details"}
          {step === "analysis" && "Meal Analysis"}
        </h1>

        {step === "camera" && <Camera onCapture={handleCapture} />}

        {(step === "details" || step === "analysis") && imageUrl && (
          <div className="flex w-full flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={imageUrl}
                alt="Captured meal"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
            {step === "details" && (
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 rounded-lg bg-gray-500 px-6 py-3 font-bold text-white transition duration-300 hover:bg-gray-600"
              >
                Retake Picture
              </button>
            )}
          </div>
        )}

        {step === "details" && (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <label
                htmlFor="mealDescription"
                className="block text-sm font-medium"
              >
                Meal Description (Optional)
              </label>
              <textarea
                id="mealDescription"
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={3}
              ></textarea>
            </div>
            <div className="flex">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition duration-300 hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? "Analyzing..." : "Analyze Meal"}
              </button>
            </div>
          </form>
        )}

        {step === "analysis" && analysis && (
          <div className="w-full space-y-4">
            <h2 className="text-xl font-semibold">Analysis Result:</h2>
            <p className="text-white">{analysis}</p>
            <button
              onClick={resetForm}
              className="w-full rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition duration-300 hover:bg-blue-600"
            >
              Analyze Another Meal
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
