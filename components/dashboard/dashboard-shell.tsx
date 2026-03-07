"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    LayoutDashboard,
    Plus,
    Settings,
    LogOut,
    Crown,
    ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUIStore } from "@/stores/ui-store";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface DashboardUser {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
    subscription_tier: string;
}

const navItems = [
    { href: "/dashboard", label: "Mis Eventos", icon: LayoutDashboard },
    { href: "/dashboard/event/create", label: "Nuevo Evento", icon: Plus },
];

export function DashboardShell({
    user,
    children,
}: {
    user: DashboardUser;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { isSidebarOpen, toggleSidebar } = useUIStore();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const initials = user.full_name
        ? user.full_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : user.email[0].toUpperCase();

    return (
        <div className="min-h-screen bg-background flex">
            {/* ── Sidebar ─────────────────────────────────── */}
            <motion.aside
                className={cn(
                    "fixed top-0 left-0 h-full bg-card border-r border-border/50 z-40 flex flex-col",
                    "lg:relative lg:translate-x-0"
                )}
                animate={{ width: isSidebarOpen ? 260 : 72 }}
                transition={{ duration: 0.2, ease: "easeInOut" as const }}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-4 gap-3 border-b border-border/50">
                    <Heart className="h-6 w-6 text-primary fill-primary shrink-0" />
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="text-lg font-bold font-heading tracking-tight whitespace-nowrap overflow-hidden"
                            >
                                invita·do
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-4 px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" &&
                                pathname.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3 h-11",
                                        !isSidebarOpen && "justify-center px-0"
                                    )}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    <AnimatePresence>
                                        {isSidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="whitespace-nowrap overflow-hidden"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* Upgrade Badge */}
                {user.subscription_tier === "FREE" && isSidebarOpen && (
                    <div className="px-3 pb-3">
                        <Link href="/dashboard/upgrade">
                            <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                                <div className="flex items-center gap-2 mb-1">
                                    <Crown className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">Plan Gratuito</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Actualiza a Premium para más funcionalidades
                                </p>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Collapse Toggle */}
                <div className="px-3 pb-3">
                    <Separator className="mb-3" />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center"
                        onClick={toggleSidebar}
                    >
                        <ChevronLeft
                            className={cn(
                                "h-4 w-4 transition-transform",
                                !isSidebarOpen && "rotate-180"
                            )}
                        />
                    </Button>
                </div>
            </motion.aside>

            {/* ── Main Content ────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
                    <div />
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-3 h-10 pl-2 pr-3 rounded-md hover:bg-accent transition-colors cursor-pointer outline-none">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            {isSidebarOpen && (
                                <div className="text-left hidden sm:block">
                                    <p className="text-sm font-medium leading-none">
                                        {user.full_name || "Mi cuenta"}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {user.email}
                                    </p>
                                </div>
                            )}
                            <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 h-5 hidden sm:inline-flex"
                            >
                                {user.subscription_tier}
                            </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Configuración
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Cerrar sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
