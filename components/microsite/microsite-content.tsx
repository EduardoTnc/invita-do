"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Heart,
    Calendar,
    MapPin,
    Clock,
    ChevronDown,
    Check,
    Volume2,
    VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAudioStore } from "@/stores/audio-store";
import { RsvpForm } from "./rsvp-form";
import { GalleryFeed } from "./gallery-feed";

interface Event {
    id: string;
    title: string;
    slug: string;
    event_type: string;
    date: string;
    end_date: string | null;
    location_name: string | null;
    location_address: string | null;
    theme_config: unknown;
    music_url: string | null;
    cover_image_url: string | null;
    is_private: boolean;
}

const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" as const },
    },
};

export function MicrositeContent({ event, photos }: { event: Event; photos: any[] }) {
    const { isMuted, toggleMute, initAudio } = useAudioStore();

    useEffect(() => {
        if (event.music_url) {
            initAudio(event.music_url);
        }
    }, [event.music_url, initAudio]);

    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const formattedTime = eventDate.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Calculate countdown
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    const hours = Math.max(
        0,
        Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Music Toggle */}
            {event.music_url && (
                <button
                    onClick={toggleMute}
                    className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                    {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                    ) : (
                        <Volume2 className="h-4 w-4" />
                    )}
                </button>
            )}

            {/* ── Hero Section ──────────────────────────── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 -z-10">
                    {event.cover_image_url ? (
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${event.cover_image_url})` }}
                        >
                            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
                        </div>
                    ) : (
                        <>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-3xl" />
                        </>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Heart className="h-10 w-10 text-primary fill-primary mx-auto mb-6 opacity-80" />

                    <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
                        Estás invitado a
                    </p>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-tight mb-6">
                        {event.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-muted-foreground mb-8">
                        <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            {formattedDate}
                        </span>
                        <span className="hidden sm:block">·</span>
                        <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            {formattedTime}
                        </span>
                    </div>

                    {/* Countdown */}
                    <div className="flex items-center justify-center gap-6 mb-10">
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-heading font-bold text-primary">
                                {days}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">
                                Días
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl font-heading font-bold text-primary">
                                {hours}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">
                                Horas
                            </div>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="gap-2 text-base px-10 py-6"
                        onClick={() =>
                            document
                                .getElementById("rsvp")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                    >
                        Confirmar asistencia
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </motion.div>
            </section>

            {/* ── Location Section ──────────────────────── */}
            {(event.location_name || event.location_address) && (
                <motion.section
                    className="py-20 px-6 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                >
                    <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-heading font-semibold mb-2">
                        {event.location_name}
                    </h2>
                    {event.location_address && (
                        <p className="text-muted-foreground max-w-md mx-auto">
                            {event.location_address}
                        </p>
                    )}
                    {event.location_address && (
                        <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(
                                event.location_address
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline" className="mt-6 gap-2">
                                <MapPin className="h-4 w-4" />
                                Ver en Google Maps
                            </Button>
                        </a>
                    )}
                </motion.section>
            )}

            {/* ── RSVP Section ──────────────────────────── */}
            <motion.section
                id="rsvp"
                className="py-20 px-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
            >
                <div className="max-w-md mx-auto text-center">
                    <h2 className="text-2xl font-heading font-semibold mb-2">
                        Confirma tu asistencia
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Ingresa tu nombre tal como aparece en la invitación
                    </p>

                    <RsvpForm eventId={event.id} />
                </div>
            </motion.section>

            {/* ── Gallery Section ──────────────────────────── */}
            <motion.section
                id="gallery"
                className="py-20 px-6 bg-muted/30 border-y border-border/50"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
            >
                <GalleryFeed eventId={event.id} initialPhotos={photos} />
            </motion.section>

            {/* ── Footer ────────────────────────────────── */}
            <footer className="py-8 px-6 text-center border-t border-border/50">
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
                    <span>Hecho con</span>
                    <Heart className="h-3 w-3 text-primary fill-primary" />
                    <span>en</span>
                    <a
                        href="https://invita.do"
                        className="text-primary hover:underline font-medium"
                    >
                        invita·do
                    </a>
                </div>
            </footer>
        </div>
    );
}
