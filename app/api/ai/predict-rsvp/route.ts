import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { totalGuests, confirmedGuests, daysUntilEvent, eventType } = await req.json();

        if (totalGuests === undefined || confirmedGuests === undefined) {
            return NextResponse.json({ error: "Missing guest statistics" }, { status: 400 });
        }

        const { object } = await generateObject({
            model: google("models/gemini-1.5-flash-latest"),
            schema: z.object({
                predictedAttendance: z.number().describe("The final predicted number of attendees"),
                attendanceRate: z.number().describe("The predicted attendance rate percentage (e.g., 85 for 85%)"),
                confidence: z.enum(["High", "Medium", "Low"]).describe("Confidence level in the prediction"),
                recommendation: z.string().describe("A 1-sentence catering/logistic recommendation based on this prediction"),
                reasoning: z.string().describe("Explanation for why the model resulted in this prediction"),
            }),
            prompt: `
            You are an expert event data analyst.
            
            Current Event Stats:
            - Type: ${eventType || "General Event"}
            - Total Invitees: ${totalGuests}
            - Currently Confirmed: ${confirmedGuests}
            - Days until the event: ${daysUntilEvent || "Unknown"}
            
            Based on historical trends of typical drop-off rates, no-shows, and late RSVPs for this type of event, predict the final attendance number. Provide a realistic buffer margin.
            `,
        });

        return NextResponse.json(object);
    } catch (error: any) {
        console.error("RSVP Prediction error:", error);
        return NextResponse.json({ error: error.message || "Failed to predict RSVP" }, { status: 500 });
    }
}
