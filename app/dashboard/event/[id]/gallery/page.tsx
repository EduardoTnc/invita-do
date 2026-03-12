"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Image as ImageIcon } from "lucide-react";

// Mock data to demonstrate UI behavior
const mockPhotos = [
  { id: "1", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc", status: "PENDING_MODERATION", guest: "Juan Pérez" },
  { id: "2", url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b", status: "APPROVED", guest: "Ana López" },
  { id: "3", url: "https://images.unsplash.com/photo-1519741497674-611481863552", status: "PENDING_MODERATION", guest: "Carlos Ruiz" },
];

export default function DashboardGallery({ params }: { params: { id: string } }) {
  const [photos, setPhotos] = useState(mockPhotos);

  const handleApprove = (id: string) => {
    setPhotos(photos.map(p => p.id === id ? { ...p, status: "APPROVED" } : p));
  };

  const handleReject = (id: string) => {
    setPhotos(photos.map(p => p.id === id ? { ...p, status: "REJECTED" } : p));
  };

  const pendingPhotos = photos.filter(p => p.status === "PENDING_MODERATION");
  const approvedPhotos = photos.filter(p => p.status === "APPROVED");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Galería del Evento</h1>
          <p className="text-muted-foreground mt-2">Modera las fotos subidas por tus invitados en tiempo real.</p>
        </div>
        <div className="flex gap-4 text-sm bg-muted px-4 py-2 rounded-lg">
          <div><span className="font-bold">{pendingPhotos.length}</span> Pendientes</div>
          <div><span className="font-bold text-green-600">{approvedPhotos.length}</span> Aprobadas</div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-amber-500" /> Por Moderar
        </h2>

        {pendingPhotos.length === 0 ? (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-12 text-center text-muted-foreground">
              No hay fotos pendientes de moderación.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pendingPhotos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden group">
                <div className="aspect-[4/5] relative overflow-hidden bg-muted">
                  <img src={photo.url} alt="Subida por invitado" className="object-cover w-full h-full" />
                </div>
                <CardContent className="p-4 flex items-center justify-between bg-card border-t">
                  <div className="text-sm">
                    <p className="font-medium truncate max-w-[120px]">{photo.guest}</p>
                    <p className="text-xs text-muted-foreground">Hace 5 min</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleReject(photo.id)}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50" onClick={() => handleApprove(photo.id)}>
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4 pt-10">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-green-500" /> Galería Pública (Aprobadas)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {approvedPhotos.map((photo) => (
            <div key={photo.id} className="aspect-square rounded-xl overflow-hidden relative group">
              <img src={photo.url} alt="Aprobada" className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="sm" variant="destructive" onClick={() => handleReject(photo.id)}>Remover</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
