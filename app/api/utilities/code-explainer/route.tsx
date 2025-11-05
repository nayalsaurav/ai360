import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { userPrompt } = await req.json();
    if (!userPrompt)
      return NextResponse.json(
        { error: "Missing code snippet." },
        { status: 400 }
      );

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Explain the following code step by step in simple, beginner-friendly terms:\n\n${userPrompt}`,
    });

    const explanation = response.text;
    return NextResponse.json({ explanation });
  } catch (err) {
    console.error("Code Explainer Error:", err);
    return NextResponse.json(
      { error: "Failed to explain code." },
      { status: 500 }
    );
  }
}
