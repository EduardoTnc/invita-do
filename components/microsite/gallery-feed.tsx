"use client";

import { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadPublicPhoto } from "@/lib/actions/gallery-public";
import { motion, AnimatePresence } from "framer-motion";

type Photo = {
    id: string;
    image_url: string;
    created_at: string;
};

export function GalleryFeed({ eventId, initialPhotos }: { eventId: string; initialPhotos: Photo[] }) {
    const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset states
        setIsSuccess(false);
        setIsUploading(true);

        try {
            // Read file as base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Data = reader.result as string;
                const fileName = file.name.replace(/\s+/g, '-').toLowerCase();

                const response = await uploadPublicPhoto(eventId, base64Data, fileName, file.type);

                if (response.success) {
                    setIsSuccess(true);
                    setTimeout(() => setIsSuccess(false), 5000); // hide success msg after 5s
                } else {
                    alert("Error al subir la imagen. Intenta nuevamente.");
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Ocurrió un error inesperado al subir la foto.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset input
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-heading font-semibold">Galería de Fotos</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Captura los mejores momentos y compártelos con todos. Las fotos serán publicadas aquí después de ser aprobadas por el anfitrión.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 pt-6">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />

                    <Button
                        size="lg"
                        className="gap-2 rounded-full h-14 px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Subiendo...
                            </>
                        ) : (
                            <>
                                <Camera className="w-5 h-5" />
                                Compartir una Foto
                            </>
                        )}
                    </Button>

                    <AnimatePresence>
                        {isSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 text-green-600 bg-green-500/10 px-4 py-2 rounded-full mt-2 text-sm"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                ¡Foto enviada! Estará visible cuando el anfitrión la apruebe.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Photos Masonry / Grid */}
            {photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo, i) => (
                        <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative aspect-square rounded-xl overflow-hidden group border shadow-sm"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={photo.image_url}
                                alt="Momento del evento"
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
                    <UploadCloud className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium text-foreground">Aún no hay fotos en la galería</p>
                    <p className="text-sm">¡Sé el primero en compartir un recuerdo especial!</p>
                </div>
            )}
        </div>
    );
}
