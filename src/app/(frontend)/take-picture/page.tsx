"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TakePicturePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

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

  const captureAndUpload = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsUploading(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob(resolve as BlobCallback, "image/jpeg"),
    );
    const file = new File([blob], "meal-picture.jpg", { type: "image/jpeg" });

    try {
      const response = await fetch(`/api/meal/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = (await response.json()) as { url: string };
      console.log("Upload successful:", result);

      // Navigate to meal-details page with the image URL
      router.push(`/meal-details?imageUrl=${encodeURIComponent(result.url)}`);
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 text-white">
      <div className="container mx-auto flex max-w-md flex-col items-center justify-center gap-8">
        <h1 className="text-center text-3xl font-bold sm:text-4xl">
          Take a picture
        </h1>
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-gray-300">
          {hasCamera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
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
          )}
        </div>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <button
          onClick={captureAndUpload}
          disabled={isUploading}
          className="w-full rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition duration-300 hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isUploading ? "Uploading..." : "Take picture of meal"}
        </button>
      </div>
    </main>
  );
}
