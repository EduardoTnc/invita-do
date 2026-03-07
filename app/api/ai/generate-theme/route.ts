import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

export const maxDuration = 30; // 30 seconds max for AI generation

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
        }

        const { object } = await generateObject({
            model: google("models/gemini-1.5-pro-latest"),
            schema: z.object({
                themeConfig: z.object({
                    colors: z.object({
                        primary: z.string().describe("Hex code for the primary brand color"),
                        secondary: z.string().describe("Hex code for the secondary accent color"),
                        background: z.string().describe("Hex code for the background color"),
                        text: z.string().describe("Hex code for the main text color"),
                    }),
                    fonts: z.object({
                        heading: z.string().describe("Google Font name for headings (e.g., 'Playfair Display')"),
                        body: z.string().describe("Google Font name for body text (e.g., 'Inter')"),
                    }),
                    styling: z.object({
                        borderRadius: z.enum(["sm", "md", "lg", "full", "none"]).describe("The border radius token"),
                        animations: z.boolean().describe("Whether animations are enabled"),
                    }),
                }),
                reasoning: z.string().describe("A brief, elegant explanation of why these colors and fonts were chosen for the event's mood"),
            }),
            prompt: `
            You are an expert event designer. A user is planning an event and gave the following prompt for the "vibe" or theme:
            "${prompt}"
            
            Based on this description, generate a complete, beautiful design system (themeConfig) suitable for an elegant, modern web invitation.
            The colors should be harmonious and highly accessible.
            Select elegant Google Fonts that match the mood.
            `,
        });

        return NextResponse.json(object);
    } catch (error: any) {
        console.error("Theme generation error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate theme" }, { status: 500 });
    }
}
