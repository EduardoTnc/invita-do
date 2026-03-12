"use client";

import { useLanguage } from "./language-provider";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative rounded-full px-4 h-10 w-[110px] flex items-center justify-between gap-2 hover:bg-primary/5 transition-all overflow-hidden border border-black/5 dark:border-white/10 shrink-0"
      onClick={() => setLanguage(language === "es" ? "en" : "es")}
    >
      <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
      
      <div className="relative flex-1 h-full flex items-center justify-center font-bold text-[9px] tracking-[0.2em] uppercase">
        <AnimatePresence mode="wait">
          <motion.span
            key={language}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute whitespace-nowrap"
          >
            {language === "es" ? "Español" : "English"}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Modern Toggle Dot indicator */}
      <div className="flex flex-col gap-0.5 shrink-0 ml-1">
        <div className={`w-1 h-1 rounded-full transition-colors duration-300 ${language === "en" ? "bg-primary shadow-[0_0_8px_var(--primary)]" : "bg-muted"}`} />
        <div className={`w-1 h-1 rounded-full transition-colors duration-300 ${language === "es" ? "bg-primary shadow-[0_0_8px_var(--primary)]" : "bg-muted"}`} />
      </div>
    </Button>
  );
}
