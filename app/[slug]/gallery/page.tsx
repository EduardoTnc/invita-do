"use client";

import { motion } from "framer-motion";
import { Camera, Image as ImageIcon, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicGallery({ params }: { params: { slug: string } }) {
  // En producción, esto se obtiene en tiempo real desde Supabase con ISR/PPR o SWR
  const approvedPhotos = [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b",
    "https://images.unsplash.com/photo-1519741497674-611481863552",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
    "https://images.unsplash.com/photo-1512413913411-447dd845511b",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8"
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-rose-500/30">
      <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="font-heading font-bold text-xl">{params.slug}</div>
          <Button variant="outline" className="gap-2 bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-full">
            <Camera className="h-4 w-4" />
            <span className="hidden sm:inline">Subir Foto</span>
          </Button>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Heart className="h-10 w-10 text-rose-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Nuestros Recuerdos</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Revive los mejores momentos del evento capturados por ti y todos nuestros invitados.
          </p>
        </motion.div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {approvedPhotos.map((url, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="break-inside-avoid relative group rounded-xl overflow-hidden bg-white/5"
            >
              <img
                src={url}
                alt={`Memoria ${i}`}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Floating Upload Button for Mobile */}
        <div className="fixed bottom-6 w-full left-0 px-4 flex justify-center sm:hidden z-50">
          <Button size="lg" className="w-full max-w-xs rounded-full gap-2 shadow-2xl shadow-rose-500/20 bg-rose-500 hover:bg-rose-600 text-white">
            <Camera className="h-5 w-5" />
            Tomar Foto
          </Button>
        </div>
      </main>
    </div>
  );
}
