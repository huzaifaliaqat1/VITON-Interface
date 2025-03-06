import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("Received upload request...");

    const formData = await req.formData();
    console.log("FormData received:", formData);

    const file = formData.get("file") as File;
    if (!file) {
      console.error("No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("File received:", file.name, file.type, file.size);

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("Buffer size:", buffer.length);

    // 📌 Send image to Astria API
    const apiResponse = await fetch("https://api.astria.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer xy`,  // Use your real key
        "Content-Type": "multipart/form-data",
      },
      body: formData,  // Astria API might require formData directly
    });

    console.log("Astria API response status:", apiResponse.status);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Astria API Error:", errorText);
      return NextResponse.json({ error: errorText }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    console.log("Astria API response:", data);

    return NextResponse.json({ processedImageUrl: data.image_url });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
