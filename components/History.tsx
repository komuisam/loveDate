"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, RefreshCw, Heart, ImageIcon } from "lucide-react";

import { dateIdeas } from "@/lib/date-ideas";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ContractTab } from "./ContractTab";
import { CoverTab } from "./CoverTab";
import { Roulet } from "./Rulete";
import { Browse } from "./Browse";

type SavedDate = {
  id: number;
  idea: string;
  imageUrl: string | null;
  date: Date | null;
  notes: string;
};

export function History({ coverColor = "red" }: { coverColor: string }) {
  const [savedDates, setSavedDates] = useState<SavedDate[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Load saved dates from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem("savedDates");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convertir las fechas de cadena a objetos Date
        const withDates = parsed.map((item: any) => ({
          ...item,
          date: item.date ? new Date(item.date) : null,
        }));
        setSavedDates(withDates);
      } catch (e) {
        console.error("Error al analizar las fechas guardadas", e);
      }
    }
  }, []);

  // Save to localStorage whenever savedDates changes
  useEffect(() => {
    localStorage.setItem("savedDates", JSON.stringify(savedDates));
  }, [savedDates]);

  // Save contract names to localStorage

  // Filtrar citas con imágenes para la sección de historia
  const datesWithImages = savedDates.filter((date) => date.imageUrl);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <h2
          className="text-2xl font-bold text-center"
          style={{ color: coverColor }}
        >
          Álbum de Recuerdos
        </h2>

        {datesWithImages.length > 0 ? (
          <>
            {/* Photo gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {datesWithImages.map((date) => (
                <div
                  key={date.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedPhoto(date.imageUrl)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={date.imageUrl || "/placeholder.svg"}
                      alt={date.idea}
                      className="w-full h-full object-cover"
                    />
                    {date.date && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                        {format(date.date, "PPP", { locale: es })}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm truncate">
                      {date.idea}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Photo modal */}
            {selectedPhoto && (
              <div
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedPhoto(null)}
              >
                <div className="max-w-3xl max-h-[80vh] relative">
                  <img
                    src={selectedPhoto || "/placeholder.svg"}
                    alt="Foto ampliada"
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                    onClick={() => setSelectedPhoto(null)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              No hay recuerdos guardados
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Guarda tus citas con imágenes en la sección "Explorar Ideas" para
              crear tu álbum de recuerdos.
            </p>
            <Button
              onClick={() => {
                const tabsElement = document.querySelector(
                  '[value="browse"]'
                ) as HTMLElement;
                if (tabsElement) {
                  tabsElement.click();
                }
              }}
              style={{
                backgroundColor: coverColor,
                borderColor: coverColor,
              }}
            >
              Ir a Explorar Ideas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
