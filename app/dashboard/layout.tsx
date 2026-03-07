import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { Profile } from "@/types/database";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const profile = data as Profile | null;

    return (
        <DashboardShell
            user={{
                id: user.id,
                email: user.email ?? "",
                full_name: profile?.full_name ?? user.user_metadata?.full_name ?? "",
                avatar_url: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? "",
                subscription_tier: profile?.subscription_tier ?? "FREE",
            }}
        >
            {children}
        </DashboardShell>
    );
}
