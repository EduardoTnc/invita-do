import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    try {
        const { members } = await req.json();

        if (!members || !Array.isArray(members)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // Update each member's status (CONFIRMED or CANCELLED)
        const promises = members.map((member: { id: string; status: 'CONFIRMED' | 'CANCELLED'; dietary_restrictions?: string }) => {
            return supabase
                .from("guests")
                .update({
                    status: member.status,
                    dietary_restrictions: member.dietary_restrictions || null
                })
                .eq("id", member.id);
        });

        await Promise.all(promises);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("RSVP Submit error:", error);
        return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 });
    }
}
