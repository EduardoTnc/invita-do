"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Sparkles, Star, Camera, Users, Calendar, MapPin, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ThreeHero } from '@/components/marketing/three-hero';
import { useLanguage } from '@/components/language-provider';

export default function BodasLandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-rose-100 selection:text-rose-900">
      {/* ── Theme Specific Styles ──────────────────────── */}
      <style jsx global>{`
        :root {
          --wedding-primary: oklch(0.7 0.12 20); /* Rose Gold / Elegant Pink */
          --wedding-accent: oklch(0.85 0.05 80); /* Champagne */
        }
        .dark {
          --wedding-primary: oklch(0.75 0.1 20);
        }
      `}</style>

      {/* ── Background Elements ───────────────────────── */}
      <div className="absolute inset-0 z-0">
         <ThreeHero />
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle,var(--wedding-primary)_0%,transparent_70%)] blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-[radial-gradient(circle,var(--wedding-accent)_0%,transparent_70%)] blur-[100px]" />
      </div>

      {/* ── Hero Section ───────────────────────────────── */}
      <section className="relative z-20 pt-48 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1 }}
           className="mb-8 flex justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-background border border-[var(--wedding-primary)] flex items-center justify-center shadow-2xl relative">
             <Heart className="h-10 w-10 text-[var(--wedding-primary)] fill-[var(--wedding-primary)] opacity-20 absolute scale-150 animate-pulse" />
             <Heart className="h-10 w-10 text-[var(--wedding-primary)] fill-[var(--wedding-primary)]" />
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl sm:text-7xl lg:text-9xl font-heading font-extrabold mb-10 tracking-tighter leading-[0.85] text-foreground"
        >
          {t("wedding.title1")} <br />
          <span className="text-[var(--wedding-primary)]">{t("wedding.title2")}</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed text-balance"
        >
          {t("wedding.desc")}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <Link href="/auth/login">
            <Button size="xl" className="rounded-full gap-3 px-12 py-9 bg-[var(--wedding-primary)] hover:opacity-90 shadow-2xl shadow-[var(--wedding-primary)]/20 text-xl font-bold transition-all hover:scale-105 active:scale-95 text-white">
              {t("wedding.cta1")}
              <Sparkles className="h-6 w-6" />
            </Button>
          </Link>
          <Link href="#preview">
            <Button variant="outline" size="xl" className="rounded-full px-12 py-9 glass border-[var(--wedding-primary)]/20 text-xl hover:bg-white/10 transition-all">
              {t("wedding.cta2")}
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ── Product Preview ────────────────────────────── */}
      <section id="preview" className="relative z-20 py-20 px-4">
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           className="relative max-w-5xl mx-auto"
        >
           <div className="relative group">
              <div className="absolute -inset-4 bg-[var(--wedding-primary)]/10 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative glass p-4 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.1)] border-white/20">
                 <Image 
                   src="/digital_invite_mobile_mockup_1773349007115.png" 
                   alt="Digital Wedding Invitation" 
                   width={500} 
                   height={1000} 
                   className="rounded-[3rem] w-full max-w-[450px] mx-auto"
                 />
                 
                 {/* Floating Detail Cards */}
                 <motion.div 
                    animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute -right-12 top-1/3 glass p-6 rounded-3xl shadow-xl border-white/20 hidden lg:block"
                 >
                    <div className="flex items-center gap-4 mb-3">
                       <MapPin className="h-5 w-5 text-[var(--wedding-primary)]" />
                       <div>
                          <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">{t("party.showcase_items.2").split(" ")[0]}</p>
                          <p className="font-bold text-sm">Catedral de la Luz</p>
                       </div>
                    </div>
                    <div className="h-1 w-full bg-[var(--wedding-primary)]/10 rounded-full" />
                 </motion.div>

                 <motion.div 
                    animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
                    transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                    className="absolute -left-12 bottom-1/4 glass p-6 rounded-3xl shadow-xl border-white/20 hidden lg:block"
                 >
                    <div className="flex items-center gap-4">
                       <Gift className="h-5 w-5 text-[var(--wedding-primary)]" />
                       <p className="font-bold">{t("wedding.items.gift.title")}</p>
                    </div>
                 </motion.div>
              </div>
           </div>
        </motion.div>
      </section>

      {/* ── Detailed Features Grid ────────────────────── */}
      <section className="relative z-20 py-40 px-4 bg-background">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
               <h2 className="text-4xl sm:text-6xl font-heading font-black tracking-tighter mb-6">
                  {t("wedding.features_title1")} <span className="text-[var(--wedding-primary)] italic">{t("wedding.features_title2")}</span>
               </h2>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t("wedding.features_subtitle")}
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { 
                   icon: Star, 
                   title: t("wedding.items.luxe.title"), 
                   desc: t("wedding.items.luxe.desc") 
                 },
                 { 
                   icon: Users, 
                   title: t("wedding.items.rsvp.title"), 
                   desc: t("wedding.items.rsvp.desc") 
                 },
                 { 
                   icon: Camera, 
                   title: t("wedding.items.gallery.title"), 
                   desc: t("wedding.items.gallery.desc") 
                 },
                 { 
                   icon: Calendar, 
                   title: t("wedding.items.agenda.title"), 
                   desc: t("wedding.items.agenda.desc") 
                 },
                 { 
                   icon: Gift, 
                   title: t("wedding.items.gift.title"), 
                   desc: t("wedding.items.gift.desc") 
                 },
                 { 
                   icon: Sparkles, 
                   title: t("wedding.items.seating.title"), 
                   desc: t("wedding.items.seating.desc") 
                 }
               ].map((feature, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-[var(--wedding-primary)]/30 transition-all group"
                 >
                   <div className="w-16 h-16 rounded-2xl bg-[var(--wedding-primary)]/10 flex items-center justify-center mb-8 group-hover:bg-[var(--wedding-primary)] transition-colors duration-500">
                     <feature.icon className="h-8 w-8 text-[var(--wedding-primary)] group-hover:text-white transition-colors" />
                   </div>
                   <h3 className="text-2xl font-bold font-heading mb-4 text-foreground">{feature.title}</h3>
                   <p className="text-muted-foreground leading-relaxed italic line-clamp-3">{feature.desc}</p>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* ── Conclusion CTA ─────────────────────────────── */}
      <section className="relative z-20 py-32 px-4 text-center">
         <div className="max-w-4xl mx-auto p-20 rounded-[4rem] bg-[var(--wedding-primary)]/5 border border-[var(--wedding-primary)]/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--wedding-primary)]/10 blur-[100px] -z-10" />
            <h2 className="text-4xl sm:text-6xl font-heading font-black mb-10 tracking-tighter leading-none">
               {t("wedding.cta_title1")} <br /><span className="text-[var(--wedding-primary)]">{t("wedding.cta_title2")}</span>
            </h2>
            <Link href="/auth/login">
               <Button size="xl" className="rounded-full gap-3 px-12 py-9 bg-[var(--wedding-primary)] text-white hover:opacity-90 shadow-2xl transition-all font-bold text-xl">
                  {t("wedding.cta_button")}
                  <ArrowRight className="h-6 w-6" />
               </Button>
            </Link>
            <p className="mt-8 text-sm text-muted-foreground font-medium uppercase tracking-[0.3em]">
               {t("wedding.subtext")}
            </p>
         </div>
      </section>
    </div>
  );
}
