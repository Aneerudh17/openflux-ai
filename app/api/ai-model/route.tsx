import Constants from "@/data/Constants";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

export const maxDuration = 300;

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Magic description that triggers the cache bypass
const CACHE_TRIGGER = "generate as per the given image";

export async function POST(req: NextRequest) {

  try {

    const { model, description, imageUrl } = await req.json();

    // Check if the description starts with the cache trigger phrase
    const rawDescription = description.split(":")[0]?.trim().toLowerCase();

    if (rawDescription === CACHE_TRIGGER) {
      console.log("Cache hit — returning cached response from cache_response.txt");

      const cachePath = path.join(process.cwd(), "app", "api", "ai-model", "cache_response.txt");
      const cachedCode = fs.readFileSync(cachePath, "utf-8");

      // Stream the cached code back in chunks to match the normal flow
      const stream = new ReadableStream({
        start(controller) {
          const chunkSize = 200;
          for (let i = 0; i < cachedCode.length; i += chunkSize) {
            controller.enqueue(
              new TextEncoder().encode(cachedCode.slice(i, i + chunkSize))
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
    }

    // --- Normal Gemini flow ---

    // find model from constants.tsx ( only gemini - changing it later to 3.0)
    const ModelObj = Constants.AiModelList.find(
      (item) => item.name === model
    );

    // Default - Gemini 2.5 Flash
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