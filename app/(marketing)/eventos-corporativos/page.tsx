"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, ShieldCheck, BarChart3, Users2, Briefcase, Globe, CheckCircle2, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/components/language-provider';

export default function EventosCorporativosLandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* ── Theme Specific Styles ──────────────────────── */}
      <style jsx global>{`
        :root {
          --corp-primary: oklch(0.5 0.18 250); /* Deep Professional Blue */
          --corp-muted: oklch(0.92 0.02 240);
        }
        .dark {
          --corp-primary: oklch(0.6 0.15 250);
        }
      `}</style>

      {/* ── Background Elements ───────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[var(--corp-primary)]/5 to-transparent -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[var(--corp-primary)]/10 rounded-full blur-[120px] -z-10" />

      {/* ── Hero Section ───────────────────────────────── */}
      <section className="relative z-10 pt-48 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-8"
        >
          <div className="px-5 py-2 rounded-full border border-[var(--corp-primary)]/20 bg-[var(--corp-primary)]/5 text-[var(--corp-primary)] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
             <ShieldCheck className="h-4 w-4" />
             {t("corp.badge")}
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl sm:text-7xl lg:text-9xl font-heading font-extrabold mb-10 tracking-tighter leading-[0.85] text-center max-w-5xl text-foreground"
        >
          {t("corp.title1")} <br />
          <span className="text-[var(--corp-primary)]">{t("corp.title2")}</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 text-center leading-relaxed"
        >
          {t("corp.desc")}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link href="/auth/login">
            <Button size="xl" className="rounded-xl gap-3 px-12 py-9 bg-[var(--corp-primary)] text-white hover:opacity-90 shadow-2xl shadow-[var(--corp-primary)]/20 text-xl font-bold transition-all">
              {t("corp.cta1")}
              <ArrowRight className="h-6 w-6" />
            </Button>
          </Link>
          <Link href="#capabilities">
            <Button variant="outline" size="xl" className="rounded-xl px-12 py-9 border-[var(--corp-primary)]/20 text-xl font-semibold hover:bg-white/5 transition-all">
               {t("corp.cta2")}
            </Button>
          </Link>
        </motion.div>

        {/* ── Visual Backdrop (Dashboard) ────────────────── */}
        <motion.div
           initial={{ opacity: 0, y: 100 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, delay: 0.6 }}
           className="mt-32 relative w-full max-w-6xl mx-auto"
        >
           <div className="glass border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-6 bg-background/50">
              <div className="aspect-video relative rounded-xl overflow-hidden border border-white/5 bg-slate-900">
                 <Image 
                   src="/saas_dashboard_mockup_1773348992651.png" 
                   alt="SaaS Corporate Dashboard" 
                   fill
                   className="object-cover opacity-90"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
              </div>
           </div>
        </motion.div>
      </section>

      {/* ── Trusted By Section ─────────────────────────── */}
      <section className="py-20 border-y border-white/5 bg-white/2 pb-20">
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 opacity-40 grayscale">
            <p className="font-black uppercase tracking-[0.3em] text-xs text-muted-foreground whitespace-nowrap">Utilizado por líderes en:</p>
            <div className="flex flex-wrap justify-center gap-12 text-xl font-heading font-bold italic">
               <span>FINTECH.CO</span>
               <span>GLOBAL·X</span>
               <span>PRIME·TECH</span>
               <span>ELITE·CORP</span>
            </div>
         </div>
      </section>

      {/* ── Key Capabilities ───────────────────────────── */}
      <section id="capabilities" className="relative z-10 py-40 px-4">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
               <div className="space-y-12">
                  <h2 className="text-5xl sm:text-7xl font-heading font-extrabold tracking-tighter leading-none">
                     {t("corp.capabilities.title1")} <br />{t("corp.capabilities.title2").split(".")[0]} <span className="text-[var(--corp-primary)]">{t("corp.capabilities.title2").split(".")[1] || "CONTROL."}</span>
                  </h2>
                  <div className="space-y-8">
                     {[
                       { icon: ShieldCheck, title: t("corp.capabilities.items.security.title"), desc: t("corp.capabilities.items.security.desc") },
                       { icon: BarChart3, title: t("corp.capabilities.items.analytics.title"), desc: t("corp.capabilities.items.analytics.desc") },
                       { icon: Building2, title: t("corp.capabilities.items.white.title"), desc: t("corp.capabilities.items.white.desc") }
                     ].map((item, i) => (
                       <div key={i} className="flex gap-6 group">
                          <div className="w-14 h-14 rounded-2xl bg-[var(--corp-primary)]/10 flex items-center justify-center shrink-0 group-hover:bg-[var(--corp-primary)] transition-colors duration-500">
                             <item.icon className="h-6 w-6 text-[var(--corp-primary)] group-hover:text-white" />
                          </div>
                          <div>
                             <h3 className="text-2xl font-bold font-heading mb-2">{item.title}</h3>
                             <p className="text-muted-foreground text-lg leading-relaxed">{item.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               
               <div className="relative group">
                  <div className="absolute -inset-10 bg-[var(--corp-primary)]/5 rounded-full blur-[100px] animate-pulse-slow" />
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-4">
                        <div className="h-64 rounded-3xl bg-[var(--corp-primary)]/5 border border-white/5 flex items-center justify-center">
                           <Monitor className="h-16 w-16 text-[var(--corp-primary)]/20" />
                        </div>
                        <div className="h-48 rounded-3xl bg-muted p-8 flex flex-col justify-end">
                           <p className="text-3xl font-black text-[var(--corp-primary)]">100%</p>
                           <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Compliant</p>
                        </div>
                     </div>
                     <div className="space-y-4 pt-12">
                        <div className="h-48 rounded-3xl bg-[var(--corp-primary)]/20 p-8 flex flex-col justify-end">
                           <p className="text-3xl font-black text-[var(--corp-primary)] leading-none mb-1">99.9%</p>
                           <p className="text-xs font-bold uppercase tracking-widest text-[var(--corp-primary)]/60">Uptime SLA</p>
                        </div>
                        <div className="h-64 rounded-3xl bg-background border border-white/5 flex items-center justify-center">
                           <Globe className="h-16 w-16 text-primary/10" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ── Conclusion CTA ─────────────────────────────── */}
      <section className="relative z-10 py-40 px-4">
         <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto p-12 sm:p-24 rounded-[4rem] border border-[var(--corp-primary)]/20 bg-[var(--corp-primary)]/[0.02] dark:bg-[var(--corp-primary)]/[0.05] backdrop-blur-3xl text-center relative overflow-hidden shadow-2xl shadow-[var(--corp-primary)]/5"
         >
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--corp-primary),transparent_70%)] opacity-[0.03] dark:opacity-[0.1]" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[var(--corp-primary)]/10 rounded-full blur-[80px]" />
            
            <h2 className="relative z-10 text-5xl sm:text-7xl font-heading font-black mb-10 tracking-tighter leading-none uppercase italic text-foreground text-balance">
               {t("corp.cta.title1")} <br /><span className="text-[var(--corp-primary)]">{t("corp.cta.title2")}</span>
            </h2>
            
            <p className="relative z-10 text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-balance font-medium">
               {t("corp.cta.desc")}
            </p>

            <Link href="/auth/login" className="relative z-10 inline-block">
               <Button size="xl" className="rounded-2xl gap-4 px-16 py-10 bg-[var(--corp-primary)] text-white hover:opacity-90 shadow-2xl shadow-[var(--corp-primary)]/30 transition-all font-black text-2xl uppercase italic group">
                  {t("corp.cta.button")}
                  <CheckCircle2 className="h-8 w-8 text-white" />
               </Button>
            </Link>
            
            <div className="relative z-10 mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6 text-muted-foreground/60 text-[10px] font-black uppercase tracking-[0.3em]">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--corp-primary)] animate-pulse" />
                  {t("corp.compliance.iso")}
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--corp-primary)] animate-pulse" />
                  {t("corp.compliance.support")}
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--corp-primary)] animate-pulse" />
                  {t("corp.compliance.api")}
               </div>
            </div>
         </motion.div>
      </section>
    </div>
  );
}
