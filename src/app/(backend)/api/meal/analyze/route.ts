import { NextResponse } from "next/server";
import OpenAI from "openai";
import { env } from "~/env.mjs";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

interface NutritionResponse {
  calories?: number;
  fat?: number;
  protein?: number;
  error?: string;
}

export async function POST(request: Request) {
  const { imageUrl, mealDescription } = await request.json() as {
    imageUrl: string;
    mealDescription: string;
  };

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are the AI for the 'MealReveal' app, designed to provide nutritional information for meals based on images uploaded by users. Your task involves two primary functions:

1. Meal Identification:
   When a user uploads an image of a meal, first determine if the meal or any food item can be recognized. If you cannot identify any meal or food item in the image, return a JSON response in this format:
   {"error": "I'm sorry, but I didn't recognize any meal or food in the provided image."}

2. User-Provided Information:
   <description>${mealDescription}</description>

3. Nutritional Information Reporting:
   If you do recognize the meal or food item in the image, provide its nutritional information in the following JSON format:
   {"calories": 500, "fat": 20, "protein": 30}

Return ONLY the JSON response, no additional text.`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content;
    let nutritionData: NutritionResponse = {};

    if (content) {
      try {
        const parsedData = JSON.parse(content) as unknown;
        if (
          parsedData &&
          typeof parsedData === 'object' &&
          (
            ('calories' in parsedData && typeof parsedData.calories === 'number') ||
            ('error' in parsedData && typeof parsedData.error === 'string')
          )
        ) {
          nutritionData = parsedData as NutritionResponse;
        } else {
          nutritionData = { error: "Invalid response format" };
        }
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        nutritionData = { error: "Failed to parse nutrition data" };
      }
    }

    return NextResponse.json(nutritionData);
  } catch (error) {
    console.error("Error analyzing meal:", error);
    return NextResponse.json({ error: "Failed to analyze meal" }, { status: 500 });
  }
}