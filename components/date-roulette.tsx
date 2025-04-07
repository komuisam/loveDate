"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Book, RefreshCw, Heart, ImageIcon } from "lucide-react";

import { ContractTab } from "./ContractTab";
import { CoverTab } from "./CoverTab";
import { Roulet } from "./Rulete";
import { Browse } from "./Browse";
import { History } from "./History";

type SavedDate = {
  id: number;
  idea: string;
  imageUrl: string | null;
  date: Date | null;
  notes: string;
};

export function DateRoulette() {
  const [coverColor, setCoverColor] = useState("#f43f5e"); // rose-500

  const [savedDates, setSavedDates] = useState<SavedDate[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<SavedDate | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    localStorage.setItem("savedDates", JSON.stringify(savedDates));
  }, [savedDates]);

  return (
    <div className="container mx-auto py-8 px-4">
      <Tabs defaultValue="cover" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="cover">
            <Book className="mr-2 h-4 w-4" />
            Portada
          </TabsTrigger>
          <TabsTrigger value="contract">
            <Heart className="mr-2 h-4 w-4" />
            Contrato
          </TabsTrigger>
          <TabsTrigger value="roulette">
            <RefreshCw className="mr-2 h-4 w-4" />
            Ruleta
          </TabsTrigger>
          <TabsTrigger value="browse">
            <Heart className="mr-2 h-4 w-4" />
            Explorar Ideas
          </TabsTrigger>
          <TabsTrigger value="history">
            <ImageIcon className="mr-2 h-4 w-4" />
            Recuerdos
          </TabsTrigger>
        </TabsList>

        {/* Cover Tab */}
        <TabsContent value="cover" className="mt-6">
          <CoverTab coverColor={coverColor} setCoverColor={setCoverColor} />
        </TabsContent>

        {/* Contract Tab */}

        <TabsContent value="contract" className="mt-6">
          <ContractTab coverColor="red" />
        </TabsContent>

        {/* Roulette Tab */}
        <TabsContent value="roulette" className="mt-6">
          <Roulet coverColor={coverColor} />
        </TabsContent>

        {/* Browse Tab */}
        <TabsContent value="browse" className="mt-6">
          <Browse />
        </TabsContent>

        {/* History Tab - Simplified version */}
        <TabsContent value="history" className="mt-6">
          <History coverColor={coverColor} />
        </TabsContent>
      </Tabs>
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && selectedIdea) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const imageUrl = e.target?.result as string;

              // Update the saved dates with the new image
              const updatedDates = [...savedDates];
              const existingIndex = updatedDates.findIndex(
                (d) => d.id === selectedIdea.id
              );

              if (existingIndex >= 0) {
                updatedDates[existingIndex] = {
                  ...updatedDates[existingIndex],
                  imageUrl,
                };
              } else {
                updatedDates.push({
                  ...selectedIdea,
                  imageUrl,
                });
              }

              setSavedDates(updatedDates);
              setSelectedIdea(null);
            };
            reader.readAsDataURL(file);
          }
        }}
        className="hidden"
      />
    </div>
  );
}
