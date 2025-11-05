import { NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";

export async function POST(req: Request) {
  try {
    const { file } = await req.json();

    if (!file)
      return NextResponse.json(
        { error: "Missing image file" },
        { status: 400 }
      );

    const uploadResult = await imagekit.upload({
      file, // base64 string
      folder: "minor-project",
      fileName: `original_${Date.now()}.png`,
    });

    const transformedUrl = imagekit.url({
      src: uploadResult.url,
      transformation: [
        {
          bg: "auto",
        },
      ],
    });

    return NextResponse.json({ url: transformedUrl });
  } catch (error) {
    console.error("Background removal failed:", error);
    return NextResponse.json(
      { error: "Failed to remove background" },
      { status: 500 }
    );
  }
}
