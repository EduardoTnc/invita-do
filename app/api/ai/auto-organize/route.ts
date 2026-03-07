import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

export const maxDuration = 60; // Auto-organization can take up to 60s

export async function POST(req: Request) {
    try {
        const { guests, tables } = await req.json();

        if (!guests || !tables) {
            return NextResponse.json({ error: "Missing guests or tables data" }, { status: 400 });
        }

        const { object } = await generateObject({
            model: google("models/gemini-1.5-pro-latest"),
            schema: z.object({
                assignments: z.array(z.object({
                    guestId: z.string().describe("ID of the guest"),
                    tableId: z.string().describe("ID of the table they are assigned to"),
                })).describe("List of optimized seat assignments"),
                reasoning: z.string().describe("Brief explanation of the strategy used (e.g., grouped all children together, kept families at same table)."),
            }),
            prompt: `
            You are an expert event planner specifically hired for seating arrangements.
            
            You have the following guests to seat:
            ${JSON.stringify(guests, null, 2)}
            
            And you have the following tables with their maximum capacities:
            ${JSON.stringify(tables, null, 2)}
            
            RULES for seating:
            1. DO NOT exceed a table's maximum capacity.
            2. Guests belonging to the same guest_group_id should ideally be seated at the same table, so families or couples sit together.
            3. Children should ideally be grouped at tables with other families.
            4. If there aren't enough seats for all guests, leave the remaining guests unassigned. Only return assignments that are valid.
            
            Analyze the relationships, group IDs, ages, and constraints, and return the optimal seating assignments.
            `,
        });

        return NextResponse.json(object);
    } catch (error: any) {
        console.error("Auto-organize error:", error);
        return NextResponse.json({ error: error.message || "Failed to auto-organize tables" }, { status: 500 });
    }
}
