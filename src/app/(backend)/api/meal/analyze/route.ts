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
  breakdown?: string;
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
              text: `You are the AI for the 'MealReveal' app, designed to provide nutritional information for meals based on images uploaded by users. Follow these steps:

1. First, list all ingredients and food items you can identify in the image.
2. For each identified item, estimate its portion size and nutritional content.
3. Consider any cooking methods visible in the image.
4. Factor in any additional information from the user description:
<description>
${mealDescription}
</description>
5. Calculate the total nutritional values.

<BreakdownTemplate>
[ Start with one sentence describing what meal you see. ]
\n
[ Then provide a bullet-point list where each line follows this format:
* [ingredient name] ([portion size]): [calories]cal, [fat]g fat, [protein]g protein ]\n
\n\n[ End on a new line with one sentence evaluating if this meal is healthy or not and why. ]
</BreakdownTemplate>

Provide your response in the following JSON format:
{
  "breakdown": "Generated breakdown here with the BreakdownTemplate",
  "calories": total_calories_number,
  "fat": total_fat_grams_number,
  "protein": total_protein_grams_number
}

If you cannot identify the meal, respond with:
{"error": "I'm sorry, but I didn't recognize any meal or food in the provided image."}

Important: Ensure response is valid JSON. No markdown, no code blocks, just the JSON object.`,
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
      max_tokens: 1000,
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