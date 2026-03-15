import Constants from "@/data/Constants";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 300;

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {

  try {

    const { model, description, imageUrl } = await req.json();

    // Find model from constants
    const ModelObj = Constants.AiModelList.find(
      (item) => item.name === model
    );

    // Default to Gemini 2.5 Flash
    const modelName = ModelObj?.modelName ?? "gemini-2.5-flash";

    console.log("Using Gemini model:", modelName);

    const modelClient = genAI.getGenerativeModel({
      model: modelName,
    });


    // Send request to Gemini
    const result = await modelClient.generateContentStream({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: description,
            },
            {
              fileData: {
                mimeType: "image/png",
                fileUri: imageUrl,
              },
            },
          ],
        },
      ],
    });

    // Stream response back to frontend
    const stream = new ReadableStream({
      async start(controller) {

        for await (const chunk of result.stream) {

          const text = chunk.text();

          controller.enqueue(
            new TextEncoder().encode(text)
          );
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });

  } catch (error) {

    console.error("Gemini API Error:", error);

    return new Response(
      JSON.stringify({ error: "AI generation failed" }),
      {
        status: 500,
      }
    );
  }
}