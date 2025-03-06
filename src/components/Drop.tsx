"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Drop() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setResult(data.processedImageUrl); // Adjust according to API response
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="p-4 border border-gray-300 rounded-lg">
      <div
        {...getRootProps()}
        className="border-2 border-dashed p-6 text-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <p>Drag & drop an image here, or click to select</p>
      </div>

      {preview && <img src={preview} alt="Preview" className="mt-4 w-40 h-40 object-cover" />}

      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload & Process"}
      </button>

      {result && <img src={result} alt="Processed Result" className="mt-4 w-40 h-40 object-cover" />}
    </div>
  );
}
