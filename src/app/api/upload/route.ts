import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    // console.log("Request body:", req.body);
    const formData = await req.formData();
    const personImage = formData.get("personImage") as File;
    const garmentImage = formData.get("garmentImage") as File;

    if (!personImage || !garmentImage) {
      return NextResponse.json(
        { error: "Both images are required" },
        { status: 400 }
      );
    }

    const personBuffer = Buffer.from(await personImage.arrayBuffer());
    const garmentBuffer = Buffer.from(await garmentImage.arrayBuffer());

    const apiFormData = new FormData();
    apiFormData.append("person_image", new Blob([personBuffer]), personImage.name);
    apiFormData.append("garment_image", new Blob([garmentBuffer]), garmentImage.name);

    const pixelcutResponse = await axios.post(
      'https://api.developer.pixelcut.ai/v1/try-on',
      apiFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'X-API-KEY': process.env.PIXELCUT_API_KEY!,
        },
      }
    );

    console.log("Pixelcut API response:", pixelcutResponse.data);

    if (!pixelcutResponse.data) {
      return NextResponse.json(
        { error: "Server Error from Backend" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      processedImageUrl: pixelcutResponse.data.processedImageUrl,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    } else {
      console.error("Error:", (error as Error).message);
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
