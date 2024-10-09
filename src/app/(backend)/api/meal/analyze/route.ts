import { NextResponse } from "next/server";
import OpenAI from "openai";
import { env } from "~/env";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

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
   When a user uploads an image of a meal, first determine if the meal or any food item can be recognized. If you cannot identify any meal or food item in the image, respond with:
   <error>I'm sorry, but I didn't recognize any meal or food in the provided image.</error>

2. User-Provided Information:
   <description>${mealDescription}</description>

3. Nutritional Information Reporting:
   If you do recognize the meal or food item in the image, provide its nutritional information. Use the user-provided description to tailor the results. Return the nutritional details in the following precise format:
   <nutrition>Calories: XXX, Fat: XXg, Protein: XXg</nutrition>

Do NOT add more information or return more text. Do not include the user-provided information in your response.`,
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

    let analysis = response.choices[0]?.message?.content;

    // Remove <nutrition> tags if they exist
    if (analysis) {
      analysis = analysis.replace(/<nutrition>|<\/nutrition>/g, '');
      analysis = analysis.replace(/<error>|<\/error>/g, '');
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error analyzing meal:", error);
    return NextResponse.json({ error: "Failed to analyze meal" }, { status: 500 });
  }
}