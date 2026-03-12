"use client";

import Link from "next/link";
import { Heart, Instagram, Twitter, Linkedin } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-white/5 py-16 px-4 sm:px-6 lg:px-8 mt-auto overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Heart className="h-5 w-5 text-primary fill-primary group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold font-heading tracking-tight">invita·do</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              {t("footer.desc")}
            </p>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider">{t("footer.product")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-medium">
              <li><Link href="/bodas" className="hover:text-primary transition-colors">{t("segments.wedding_title")}</Link></li>
              <li><Link href="/eventos-informales" className="hover:text-primary transition-colors">{t("segments.party_title")}</Link></li>
              <li><Link href="/eventos-corporativos" className="hover:text-primary transition-colors">{t("segments.corp_title")}</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">{t("nav.pricing")}</Link></li>
            </ul>
          </div>
 
          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-medium">
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footer.terms")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footer.cookies")}</Link></li>
            </ul>
          </div>
        </div>
 
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
            <span>© 2026 invita·do. {t("footer.made_with")}</span>
            <Heart className="h-3 w-3 text-primary fill-primary animate-pulse" />
            <span>{t("footer.for_the_world")}</span>
          </div>
          
          <div className="flex items-center gap-4">
             <Link href="#" className="w-8 h-8 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                <Instagram className="h-4 w-4" />
             </Link>
             <Link href="#" className="w-8 h-8 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                <Twitter className="h-4 w-4" />
             </Link>
             <Link href="#" className="w-8 h-8 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                <Linkedin className="h-4 w-4" />
             </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
