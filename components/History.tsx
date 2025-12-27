"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Upload, Save, Maximize2 } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DateType } from "@/app/types/types";

function MemoryCard({ date, index, coverColor, onExpand }: { date: DateType, index: number, coverColor: string, onExpand: (url: string) => void }) {
  const { updateSavedDate } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [notes, setNotes] = useState(date.notes || "");
  const [image, setImage] = useState(date.imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine unsaved changes
  const hasChanges = (image !== date.imageUrl) || (notes !== (date.notes || ""));

  // Determine flip state based on hover, focus, or unsaved changes
  const isFlipped = isHovered || isFocused || hasChanges;

  // Sync state if props change (reset dirty state on save)
  useEffect(() => {
    setNotes(date.notes || "");
    setImage(date.imageUrl);
  }, [date]);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateSavedDate({
      ...date,
      notes: notes,
      imageUrl: image
    });
    setIsFocused(false); // Remove focus after saving (optional, but good UX)
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="group h-[350px] w-full perspective-[1000px] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] shadow-md rounded-xl ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}>

        {/* FRONT FACE */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl overflow-hidden bg-white border border-gray-200 flex flex-col">
          <div className="relative w-full h-2/3">
            {image ? (
              <img src={image} alt={date.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300">
                <ImageIcon className="w-12 h-12" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <span className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm text-stone-600">
                #{date.id}
              </span>
            </div>
          </div>

          <div className="h-1/3 p-4 flex flex-col justify-center bg-white">
            <h3 className="font-bold text-stone-800 text-lg leading-tight line-clamp-2">{date.title}</h3>
            <p className="text-sm text-stone-500 mt-1">
              {date.date ? format(new Date(date.date), "PPP", { locale: es }) : "Sin fecha"}
            </p>
          </div>
        </div>

        {/* BACK FACE (Edit Mode) */}
        <div
          className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl overflow-hidden bg-white border border-gray-200 flex flex-col"
        >
          <div className="p-3 bg-stone-50 border-b flex justify-between items-center">
            <h4 className="font-bold text-stone-700 text-sm">Editar Recuerdo</h4>
            {/* Image Change Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-stone-400 hover:text-stone-600"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              title="Cambiar foto"
            >
              <Upload className="w-3 h-3" />
            </Button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div className="flex-1 p-3">
            <Textarea
              className="w-full h-full resize-none text-sm bg-transparent border-0 focus-visible:ring-0 p-0 text-stone-600 font-serif italic"
              placeholder="Escribe tus notas aquí..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onFocus={() => setIsFocused(true)} // Keep flipped when focused
              onBlur={() => setIsFocused(false)} // Allow flip back when blurred
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="p-3 border-t bg-stone-50 flex gap-2 justify-between items-center">
            {image && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-stone-400 hover:text-stone-600"
                onClick={(e) => { e.stopPropagation(); onExpand(image); }}
                title="Ver foto completa"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="sm"
              className="bg-stone-800 hover:bg-stone-700 text-white shadow-sm h-8 px-3 text-xs"
              style={{ backgroundColor: coverColor }}
              onClick={handleSave}
            >
              <Save className="w-3 h-3 mr-1" />
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function History() {
  const { savedDates, coverColor } = useStore();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const memories = savedDates;

  return (
    <div
      className="relative min-h-[80vh] w-full py-6 px-4 mx-auto rounded-xl shadow-lg bg-white"
      style={{
        border: `8px solid ${coverColor}`,
      }}
    >
      <div className="space-y-8">
        <h2
          className="text-3xl font-bold text-center font-serif"
          style={{ color: coverColor }}
        >
          Álbum de Recuerdos
        </h2>

        {memories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {memories.map((date, index) => (
                <MemoryCard
                  key={`${date.id}-${index}`}
                  date={date}
                  index={index}
                  coverColor={coverColor}
                  onExpand={setSelectedPhoto}
                />
              ))}
            </div>

            {/* Photo Modal */}
            {selectedPhoto && (
              <div
                className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4 animate-in fade-in"
                onClick={() => setSelectedPhoto(null)}
              >
                <div className="relative max-w-4xl max-h-[90vh]">
                  <img
                    src={selectedPhoto}
                    alt="Foto ampliada"
                    className="max-w-full max-h-[90vh] object-contain rounded-md"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full"
                    onClick={() => setSelectedPhoto(null)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-100 rounded-full p-8 mb-6">
              <ImageIcon className="h-16 w-16 text-gray-300" />
            </div>
            <h3 className="text-2xl font-medium text-gray-700 mb-2">
              Tu álbum está vacío
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Guarda citas desde la ruleta o el libro para comenzar a construir tus recuerdos.
            </p>
            <Button
              onClick={() => {
                const tabsElement = document.querySelector('[value="browse"]') as HTMLElement;
                if (tabsElement) tabsElement.click();
              }}
              style={{ backgroundColor: coverColor }}
              className="text-white px-8 py-2"
            >
              Ir a Explorar Ideas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
