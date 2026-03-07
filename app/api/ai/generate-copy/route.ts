import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { eventDetails, tone } = await req.json();

        if (!eventDetails) {
            return NextResponse.json({ error: "No event details provided" }, { status: 400 });
        }

        const { object } = await generateObject({
            model: google("models/gemini-1.5-flash-latest"),
            schema: z.object({
                variants: z.array(z.object({
                    title: z.string().describe("The main headline or title of the invitation"),
                    body: z.string().describe("The body text, elegant and persuasive copy"),
                    callToAction: z.string().describe("The text on the RSVP button"),
                })).length(3).describe("Return exactly 3 copy variants to choose from"),
                reasoning: z.string().describe("Explanation of the semantic differences between the 3 variants"),
            }),
            prompt: `
            You act as an expert senior copywriter for luxury and modern events.
            A user needs compelling texts for their interactive web invitation.

            Event Details:
            ${JSON.stringify(eventDetails, null, 2)}
            
            Requested Tone: ${tone || "Elegant and emotional"}
            
            Please provide exactly 3 variants of the copy (title, body, and button CTA text) following the requested tone.
            `,
        });

        return NextResponse.json(object);
    } catch (error: any) {
        console.error("Copywriting generation error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate copy" }, { status: 500 });
    }
}
