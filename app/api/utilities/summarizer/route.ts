import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const { userPrompt } = await req.json();
    if (!userPrompt)
      return NextResponse.json(
        { error: "Missing input text." },
        { status: 400 }
      );

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize the following text in a concise and meaningful way:\n\n${userPrompt}`,
    });
    console.log(response.text);
    const summary = response.text;

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("Summarizer Error:", err);
    return NextResponse.json(
      { error: "Failed to summarize text." },
      { status: 500 }
    );
  }
}
