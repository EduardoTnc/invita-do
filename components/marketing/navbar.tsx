"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";

export function Navbar() {
  const { t } = useLanguage();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl"
    >
      <div className="bg-background/80 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-full px-6 h-16 flex items-center justify-between shadow-xl shadow-primary/5">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-xl rotate-6 group-hover:rotate-12 transition-transform duration-500" />
            <div className="absolute inset-0 bg-primary rounded-xl translate-x-1 -translate-y-1 shadow-lg shadow-primary/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white fill-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-heading tracking-tighter leading-none text-foreground uppercase italic pb-0.5">
              invita·do
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] font-black text-primary/60 leading-none">
              {t("nav.tagline")}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1 mr-4">
            {[
              { name: t("segments.wedding_title"), href: "/bodas" },
              { name: t("segments.party_title"), href: "/eventos-informales" },
              { name: t("segments.corp_title"), href: "/eventos-corporativos" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-all duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="h-8 w-px bg-black/5 dark:bg-white/10 mx-2 hidden lg:block" />
          
          <div className="flex items-center gap-1.5 ml-1">
            <LanguageToggle />
            <ThemeToggle />

            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="rounded-full px-5 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors">
                {t("nav.login")}
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="sm" className="rounded-full gap-2 px-6 bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 font-bold transition-all hover:scale-105 active:scale-95">
                {t("nav.start")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
