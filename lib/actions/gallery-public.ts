"use server";

import { createClient } from "@supabase/supabase-js";

// We use the service role key here because public guests are not authenticated in Supabase Auth
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function uploadPublicPhoto(eventId: string, fileBase64: string, fileName: string, contentType: string) {
    try {
        // Convert base64 to Buffer
        const base64Data = fileBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        const filePath = `${eventId}/${Date.now()}-${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("gallery") // Assumes a 'gallery' bucket exists
            .upload(filePath, buffer, {
                contentType,
                upsert: false,
            });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
            .from("gallery")
            .getPublicUrl(uploadData.path);

        const { error: dbError } = await supabase
            .from("gallery_photos")
            .insert({
                event_id: eventId,
                image_url: publicUrlData.publicUrl,
                status: "PENDING", // Requires host approval
            });

        if (dbError) {
            // Rollback storage if DB fails? 
            console.error("DB Error. Removing image...");
            await supabase.storage.from("gallery").remove([uploadData.path]);
            throw dbError;
        }

        return { success: true };
    } catch (error: any) {
        console.error("Upload Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getApprovedPhotos(eventId: string) {
    const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .eq("event_id", eventId)
        .eq("status", "APPROVED")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to fetch gallery:", error);
        return [];
    }

    return data;
}
