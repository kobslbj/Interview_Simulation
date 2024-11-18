import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function getOpenAIResponse(request: Request) {
  try {
    const { text, options } = await request.json();
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: text }],
      max_tokens: options?.maxTokens ?? 150,
      temperature: options?.temperature ?? 0.7,
    });

    return NextResponse.json({ 
      content: response.choices[0].message?.content?.trim() ?? "No response content" 
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again." },
      { status: 500 }
    );
  }
}
