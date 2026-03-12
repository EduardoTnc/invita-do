"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Users,
  LayoutGrid,
  Zap,
  ArrowRight,
  Star,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Monitor,
  Smartphone,
  Lock,
  Calendar,
  Layers,
  Heart,
  Building2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThreeHero } from "@/components/marketing/three-hero";
import { useLanguage } from "@/components/language-provider";

export default function LandingPage() {
  const { t, language } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-background">
      {/* ── Background Decoration ───────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      {/* ── Hero Section ───────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-32">
        <ThreeHero />

        <div className="relative z-20 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="glass px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-primary border-primary/20 shadow-lg shadow-primary/5">
              {t("hero.badge")}
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl sm:text-7xl lg:text-8xl font-heading font-extrabold tracking-tighter leading-[0.9] mb-8 text-foreground"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t("hero.title1")}
            <br />
            <span className="text-primary">{t("hero.title2")}</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {t("hero.desc")}
          </motion.p>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/auth/login">
              <Button size="xl" className="rounded-full gap-3 text-lg px-12 py-8 bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 group">
                {t("hero.cta1")}
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                variant="outline"
                size="xl"
                className="rounded-full text-lg px-12 py-8 glass hover:bg-white/10 transition-all active:scale-95"
              >
                {t("hero.cta2")}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* ── Product Showcase (Large Image) ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative max-w-6xl mx-auto mt-24 px-4 hidden sm:block z-30"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-indigo-500/30 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative glass border-white/10 rounded-[2rem] overflow-hidden shadow-2xl p-4 bg-background/50">
              <Image
                src="/saas_dashboard_mockup_1773348992651.png"
                alt="Dashboard de invita·do"
                width={1200}
                height={675}
                className="rounded-xl border border-white/5 shadow-2xl"
              />

              {/* Decorative floating icon */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-12 top-1/4 glass-dark p-6 rounded-3xl shadow-2xl border-white/10 hidden lg:flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Mobile App</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features Section (Bento Grid) ───────────────── */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight mb-4 text-foreground">
              {t("features.title")} <span className="text-muted-foreground font-light text-primary/60">{t("features.subtitle")}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 auto-rows-[280px]">
            {/* 1. Gestión Segura (Large) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 group"
            >
              <Card className="h-full border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all overflow-hidden relative">
                <div className="absolute inset-0 z-0">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent" />
                </div>

                <CardContent className="p-10 flex flex-col h-full relative z-10">
                  <div className="flex-1 flex flex-col gap-6">
                    {/* Security Visual UI */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass p-4 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Auth Protocol</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-1.5 w-full bg-white/10 rounded-full" />
                          <div className="h-1.5 w-[80%] bg-white/10 rounded-full" />
                        </div>
                      </div>
                      <div className="glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2">
                        <Lock className="h-6 w-6 text-primary" />
                        <span className="text-[10px] font-bold opacity-40">SSL SECURE</span>
                      </div>
                    </div>
                    {/* User list with lock icons */}
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-primary/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted" />
                            <div className="h-2 w-24 bg-white/10 rounded-full" />
                          </div>
                          <ShieldCheck className="h-4 w-4 text-emerald-500 opacity-60" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 shadow-xl shadow-primary/10">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold font-heading mb-4 text-foreground">{t("features.secure_title")}</h3>
                    <p className="text-muted-foreground leading-relaxed">{t("features.secure_desc")}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 2. RSVP Inteligente */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-1 md:row-span-1 group"
            >
              <Card className="h-full border-white/5 bg-white/5 backdrop-blur-sm p-8 flex flex-col justify-between hover:bg-white/10 transition-all">
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-primary uppercase">RSVP Live</span>
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-primary/20 rounded-full" />
                    <div className="h-1.5 w-[60%] bg-primary/20 rounded-full" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading mb-2">{t("features.rsvp_title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("features.rsvp_desc")}</p>
                </div>
              </Card>
            </motion.div>

            {/* 3. Mesas IA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-1 md:row-span-1 group"
            >
              <Card className="h-full border-white/5 bg-white/5 backdrop-blur-sm p-8 flex flex-col items-center justify-center text-center overflow-hidden relative hover:bg-white/10 transition-all">
                <div className="relative mb-6 scale-110">
                  <div className="w-24 h-24 rounded-full border-4 border-dashed border-primary/20 flex items-center justify-center animate-spin-slow">
                    <div className="w-14 h-14 rounded-full bg-primary/10" />
                  </div>
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <div
                      key={deg}
                      style={{ transform: `rotate(${deg}deg) translateY(-48px)` }}
                      className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 rounded-full border border-primary/20 bg-background shadow-lg"
                    />
                  ))}
                </div>
                <h3 className="text-xl font-bold font-heading mb-1">{t("features.tables_title")}</h3>
                <p className="text-sm text-muted-foreground">{t("features.tables_desc")}</p>
              </Card>
            </motion.div>

            {/* 4. Alcance Global (Large) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-1 group"
            >
              <Card className="h-full border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden relative hover:bg-white/10 transition-all">
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] opacity-20" />
                  <Globe className="h-80 w-80 text-primary absolute -bottom-32 -right-32 rotate-12" />
                </div>
                <div className="relative z-10 p-10 flex flex-col h-full justify-between">
                  <div className="flex gap-4">
                    <span className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">32 Idiomas</span>
                    <span className="px-4 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">Multi-Currency</span>
                  </div>
                  <div className="max-w-md">
                    <h3 className="text-3xl font-bold font-heading mb-4">{t("features.global_title")}</h3>
                    <p className="text-muted-foreground leading-relaxed leading-relaxed">{t("features.global_desc")}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Niches Section ──────────────────────────────── */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-6xl font-heading font-bold tracking-tight text-foreground">
                {t("niches.title")} <br />{t("niches.title_highlight")}
              </h2>
            </div>
            <p className="text-muted-foreground text-lg md:mb-4">
              {t("niches.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t("segments.wedding_title"),
                href: "/bodas",
                icon: Heart,
                desc: t("segments.wedding_desc"),
                color: "oklch(0.7 0.12 20)"
              },
              {
                title: t("segments.party_title"),
                href: "/eventos-informales",
                icon: Zap,
                desc: t("segments.party_desc"),
                color: "oklch(0.75 0.18 55)"
              },
              {
                title: t("segments.corp_title"),
                href: "/eventos-corporativos",
                icon: Building2,
                desc: t("segments.corp_desc"),
                color: "oklch(0.5 0.18 250)"
              },
            ].map((niche) => (
              <Link key={niche.title} href={niche.href} className="group">
                <div className="relative overflow-hidden rounded-3xl h-[450px] transition-all duration-700 bg-white/5 border border-white/5 hover:border-primary/20">
                  <div className="absolute inset-0 bg-background/80 z-10" />
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-3xl rounded-full" 
                    style={{ backgroundColor: niche.color }}
                  />

                  <div className="absolute bottom-0 left-0 p-10 z-20 w-full">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500"
                      style={{ backgroundColor: `${niche.color}20` }}
                    >
                      <niche.icon className="h-6 w-6" style={{ color: niche.color }} />
                    </div>
                    <h3 className="text-3xl font-bold font-heading mb-4 text-foreground group-hover:translate-x-2 transition-transform">{niche.title}</h3>
                    <p className="text-muted-foreground group-hover:translate-x-2 transition-transform delay-75">{niche.desc}</p>
                    <div className="mt-8 flex items-center gap-2 font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500" style={{ color: niche.color }}>
                      {t("segments.cta")} <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof / Showcase Section ────────────── */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-5 w-5 fill-primary text-primary" />)}
              </div>
               <h2 className="text-4xl sm:text-5xl font-heading font-black tracking-tighter text-foreground leading-tight text-balance">
                {t("social.title1")} <br /><span className="text-primary italic uppercase">{t("social.title2")}</span>
              </h2>
              <blockquote className="text-2xl text-muted-foreground font-medium leading-relaxed italic border-l-4 border-primary/20 pl-8">
                {t("social.quote")}
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{t("social.client_name")}</p>
                  <p className="text-sm text-muted-foreground">{t("social.client_event")}</p>
                </div>
              </div>
            </div>

            {/* Collage of generated mockups */}
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="space-y-4">
                <div className="h-64 rounded-3xl overflow-hidden glass relative group">
                  <Image src="/digital_invite_mobile_mockup_1773349007115.png" alt="Invite Mockup" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="h-48 rounded-3xl overflow-hidden glass-dark relative group">
                  <Image src="/event_gallery_preview_1773349023326.png" alt="Gallery Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="h-48 rounded-3xl overflow-hidden glass-dark relative group flex items-center justify-center bg-primary/5">
                  <Monitor className="h-16 w-16 text-primary/20" />
                </div>
                <div className="h-64 rounded-3xl overflow-hidden glass relative group">
                  <Image src="/saas_dashboard_mockup_1773348992651.png" alt="Dashboard Mini" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              </div>
              {/* Decorative blurs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[100px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Final ───────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] animate-pulse-slow" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="w-20 h-20 bg-primary rounded-3xl mx-auto mb-10 rotate-12 flex items-center justify-center shadow-2xl shadow-primary/40 animate-glow">
            <Zap className="h-10 w-10 text-white fill-white" />
          </div>
           <h2 className="text-5xl sm:text-7xl font-heading font-bold mb-10 tracking-tight text-foreground leading-none">
            {t("cta.title1")} <br /><span className="text-primary">{t("cta.title2")}</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
             <Link href="/auth/login">
              <Button size="xl" className="rounded-full gap-3 px-10 py-8 bg-primary text-white hover:bg-primary/90 transition-all font-bold">
                {t("hero.cta1")}
                <CheckCircle2 className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-balance text-muted-foreground max-w-[250px] text-left leading-relaxed">
              {t("cta.subtext_enterprise")}
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
