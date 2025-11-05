import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { userPrompt } = await req.json();
    if (!userPrompt)
      return NextResponse.json(
        { error: "Missing cold email context." },
        { status: 400 }
      );

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a marketing specialist. Write a short, persuasive cold email for the following context:\n\n${userPrompt}`,
    });

    const coldEmail = response.text;
    return NextResponse.json({ coldEmail });
  } catch (err) {
    console.error("Cold Email Error:", err);
    return NextResponse.json(
      { error: "Failed to generate cold email." },
      { status: 500 }
    );
  }
}
