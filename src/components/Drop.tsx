"use client";
import Image from "next/image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function Drop() {
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
  const [garmentPreview, setGarmentPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const onDropPerson = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setPersonImage(file);
    setPersonPreview(URL.createObjectURL(file));
  };

  const onDropGarment = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setGarmentImage(file);
    setGarmentPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!personImage || !garmentImage) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("personImage", personImage);
    formData.append("garmentImage", garmentImage);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status !== 200) throw new Error("Upload failed");

      const data = response.data;
      console.log("Response:", data);
      console.log("Processed Image URL:", data.processedImageUrl);
      // TODO: Update the state with the processed image URL
      setResult(data.processedImageUrl);
      // setResult(`data:image/png;base64,${data.processedImageUrl}`);
      // const blob = new Blob([data.processedImage], { type: "image/png" });
      // const imageUrl = URL.createObjectURL(blob);
      // setResult(imageUrl);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const {
    getRootProps: getPersonRootProps,
    getInputProps: getPersonInputProps,
  } = useDropzone({ onDrop: onDropPerson });
  const {
    getRootProps: getGarmentRootProps,
    getInputProps: getGarmentInputProps,
  } = useDropzone({ onDrop: onDropGarment });

  return (
    <div className="p-4 border border-gray-700 rounded-lg mx-10">
      <div className="flex items-center justify-start space-x-4">
        <div
          {...getPersonRootProps()}
          className="border-2 border-dashed p-6 text-center cursor-pointer border-black"
        >
          <input {...getPersonInputProps()} />
          <p>Drag & drop a person image here, or click to select</p>
          {personPreview && (
            <div className="flex justify-start items-center">
              <Image
                src={personPreview}
                alt="Person Preview"
                className="mt-4 w-72 h-72 object-contain"
                width={300}
                height={300}
              />
            </div>
          )}
        </div>
        <div className="text-2xl">+</div>
        <div
          {...getGarmentRootProps()}
          className="border-2 border-dashed p-6 text-center cursor-pointer border-black"
        >
          <input {...getGarmentInputProps()} />
          <p>Drag & drop a garment image here, or click to select</p>
          {garmentPreview && (
            <div className="flex justify-start items-center">
              <Image
                src={garmentPreview}
                alt="Garment Preview"
                className="mt-4 w-72 h-72 object-contain"
                width={300}
                height={300}
              />
            </div>
          )}
        </div>

        <div className="text-2xl">→</div>
        {/* TODO: Add the processed image here */}
        {result && (
          <div className="border-2 border-dashed p-6 text-center border-black">
            <Image
              src={result}
              alt="Processed Result"
              className="mt-4 w-72 h-72 object-contain"
              width={300}
              height={300}
            />
          </div>
        )}
      </div>

      <div className="flex justify-start mt-8">
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-black text-white rounded"
          disabled={loading}
        >
          {loading ? "Processing..." : "Upload & Process"}
        </button>
      </div>
    </div>
  );
}
