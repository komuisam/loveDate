"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, Edit, Check } from "lucide-react";

export function CoverTab({
  coverColor = "red",
  setCoverColor = (e: string) => {},
}: {
  coverColor: string;
  setCoverColor: Function;
}) {
  const [coverTitle, setCoverTitle] = useState("Nuestra Agenda de Citas");
  const [coverSubtitle, setCoverSubtitle] = useState(
    "100 Ideas para Compartir Juntos"
  );
  const [editingCover, setEditingCover] = useState(false);

  return (
    <div
      className="relative  min-h-[80vh] w-full    mx-auto rounded-lg shadow-xl "
      style={{ backgroundColor: coverColor }}
    >
      <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-white">
        {editingCover ? (
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cover-title" className="text-white">
                Título
              </Label>
              <Input
                id="cover-title"
                value={coverTitle}
                onChange={(e) => setCoverTitle(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover-subtitle" className="text-white">
                Subtítulo
              </Label>
              <Textarea
                id="cover-subtitle"
                value={coverSubtitle}
                onChange={(e) => setCoverSubtitle(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover-color" className="text-white">
                Color de Fondo
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  id="cover-color"
                  type="color"
                  value={coverColor}
                  onChange={(e) => setCoverColor(e.target.value)}
                  className="w-12 h-12 p-1 bg-transparent border-white/30"
                />
                <Input
                  value={coverColor}
                  onChange={(e) => setCoverColor(e.target.value)}
                  className="bg-white/20 border-white/30 text-white"
                />
              </div>
            </div>

            <Button
              onClick={() => setEditingCover(false)}
              className="w-full mt-4 bg-white text-black hover:bg-white/90"
            >
              <Check className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        ) : (
          <>
            <div className="absolute top-4 right-4">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setEditingCover(true)}
                className="text-white hover:bg-white/20"
              >
                <Edit className="h-5 w-5" />
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {coverTitle}
              </h1>
              <p className="text-lg md:text-xl">{coverSubtitle}</p>
            </div>
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <div className="inline-flex items-center justify-center rounded-full bg-white/20 px-4 py-1 text-sm">
                <Heart className="mr-2 h-4 w-4" />
                100 Ideas de Citas
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
