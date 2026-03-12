"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, PartyPopper, Sparkles, Music, Camera, Share2, Calendar, MapPin, Zap, Smartphone, Rocket, Smile } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/components/language-provider';

export default function EventosInformalesLandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-purple-100 selection:text-purple-900">
      {/* ── Theme Specific Styles ──────────────────────── */}
      <style jsx global>{`
        :root {
          --party-primary: oklch(0.65 0.25 300); /* Vivid Purple */
          --party-accent: oklch(0.8 0.2 320); /* Neon Pinkish */
        }
        .dark {
          --party-primary: oklch(0.7 0.2 300);
        }
      `}</style>

      {/* ── Background Patterns ────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,var(--party-primary)_0%,transparent_50%)] blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,var(--party-accent)_0%,transparent_50%)] blur-[100px]" />
      </div>

      {/* ── Hero Section ───────────────────────────────── */}
      <section className="relative z-20 pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 mb-8"
        >
          <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold tracking-wider uppercase">{t("party.badge")}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-7xl sm:text-8xl lg:text-[10rem] font-heading font-black mb-8 tracking-tighter leading-[0.8] text-foreground"
        >
          {t("party.title1")} <br />
          <span className="text-[var(--party-primary)]">{t("party.title2")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl sm:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto mb-16 leading-tight uppercase tracking-tighter"
        >
          {t("party.desc")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link href="/auth/login">
            <Button size="xl" className="rounded-2xl gap-3 px-10 py-9 bg-foreground text-background hover:bg-foreground/90 shadow-2xl transition-all font-black text-2xl uppercase italic">
              {t("party.cta1")}
              <Zap className="h-6 w-6 fill-current" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="outline" size="xl" className="rounded-2xl px-10 py-9 glass border-white/20 text-xl font-bold uppercase transition-all">
              {t("party.cta2")}
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ── Feature Highlights (Cards) ────────────────── */}
      <section id="how-it-works" className="relative z-20 py-40 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Smartphone,
              title: t("party.features.items.invites.title"),
              desc: t("party.features.items.invites.desc"),
              color: "var(--party-primary)"
            },
            {
              icon: Smile,
              title: t("party.features.items.reminders.title"),
              desc: t("party.features.items.reminders.desc"),
              color: "var(--party-accent)"
            },
            {
              icon: Camera,
              title: t("party.features.items.polls.title"),
              desc: t("party.features.items.polls.desc"),
              color: "white"
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, rotate: i % 2 === 0 ? 1 : -1 }}
              className="p-12 rounded-[3rem] bg-white/5 border border-white/5 hover:border-[var(--party-primary)]/40 transition-all flex flex-col gap-6"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl"
                style={{ backgroundColor: feature.color }}
              >
                <feature.icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-3xl font-black font-heading mb-4 uppercase">{feature.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Visual Showcase ────────────────────────────── */}
      <section className="relative z-20 py-40 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 space-y-10">
            <h2 className="text-6xl sm:text-8xl font-heading font-black tracking-tighter leading-[0.8] uppercase italic">
              {t("party.showcase_title").split(".")[0]}. <br />
              <span className="text-[var(--party-primary)]">{t("party.showcase_title").split(".")[1] || "MOMENTOS."}</span>
            </h2>
            <div className="space-y-6">
              {[
                t("party.showcase_items.1"),
                t("party.showcase_items.2"),
                t("party.showcase_items.3")
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-xl font-bold uppercase tracking-tighter">
                  <Zap className="h-6 w-6 text-[var(--party-primary)] fill-current" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="w-[400px] h-[700px] glass p-2 rounded-[3.5rem] shadow-2xl relative z-10 mx-auto">
              <Image
                src="/event_gallery_preview_1773349023326.png"
                alt="App Preview"
                width={400}
                height={800}
                className="rounded-[3rem] h-full object-cover"
              />
            </div>
            {/* Decorative floating elements */}
            <motion.div
              animate={{ y: [0, -30, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-10 -right-10 w-24 h-24 bg-[var(--party-primary)] rounded-full blur-[40px] opacity-60"
            />
            <motion.div
              animate={{ x: [0, 40, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-[var(--party-accent)] rounded-full blur-[50px] opacity-40"
            />
          </div>
        </div>
      </section>

      {/* ── CTA Final ───────────────────────────────────── */}
      <section className="relative z-20 py-32 px-4 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-6xl sm:text-9xl font-heading font-black mb-12 tracking-tighter leading-none uppercase italic">
            {t("party.cta.title1")} <br /><span className="text-[var(--party-primary)]">{t("party.cta.title2")}</span>
          </h2>
          <Link href="/auth/login">
            <Button size="xl" className="rounded-full gap-4 px-16 py-10 bg-[var(--party-primary)] text-white hover:opacity-90 shadow-[0_0_60px_rgba(var(--party-primary),0.4)] transition-all font-black text-3xl uppercase italic">
              {t("party.cta.button")}
              <Rocket className="h-8 w-8" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
