"use client";

import React, { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Heart, Edit, Check, Upload, Image as ImageIcon } from "lucide-react";

// Utility to create an image element
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

// Utility to crop image
async function getCroppedImg(imageSrc: string, pixelCrop: Area) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg");
}

import { useStore } from "@/hooks/useStore";

// ... (existing imports/utils)

export function CoverTab() {
  const { 
    coverColor, setCoverColor, 
    coverTitle, setCoverTitle, 
    coverSubtitle, setCoverSubtitle, 
    coverImage, setCoverImage 
  } = useStore();

  const [editingCover, setEditingCover] = useState(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setIsCropModalOpen(true);
      // Reset crop/zoom specific to new image if desired
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    }
  };

  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result as string));
      reader.readAsDataURL(file);
    });
  };

  const handleSaveCrop = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        setCoverImage(croppedImage);
        setIsCropModalOpen(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <>
      <div
        className="relative min-h-[80vh] w-full mx-auto rounded-lg shadow-xl overflow-hidden bg-cover bg-center"
        style={{ 
          backgroundColor: coverColor,
          backgroundImage: coverImage ? `url(${coverImage})` : undefined
        }}
      >
        {/* Overlay to ensure text readability if image fits */}
        {coverImage && <div className="absolute inset-0 bg-black/40" />}

        <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-white z-10">
          {editingCover ? (
            <div className="w-full space-y-4 max-w-md bg-black/50 p-6 rounded-xl backdrop-blur-sm">
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
                  Color de Fondo (si no hay imagen)
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="cover-color"
                    type="color"
                    value={coverColor}
                    onChange={(e) => setCoverColor(e.target.value)}
                    className="w-12 h-12 p-1 bg-transparent border-white/30 cursor-pointer"
                  />
                  <Input
                    value={coverColor}
                    onChange={(e) => setCoverColor(e.target.value)}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Imagen de Portada</Label>
                <div 
                  className="border-2 border-dashed border-white/30 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-6 w-6 mb-2 text-white/50" />
                  <span className="text-sm text-white/80">Subir imagen...</span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {coverImage && (
                   <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverImage(null);
                      }}
                      className="w-full mt-2"
                   >
                     Quitar Imagen
                   </Button>
                )}
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
                <h1 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
                  {coverTitle}
                </h1>
                <p className="text-lg md:text-xl drop-shadow-md">{coverSubtitle}</p>
              </div>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <div className="inline-flex items-center justify-center rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur-md">
                  <Heart className="mr-2 h-4 w-4" />
                  100 Ideas de Citas
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CROP MODAL */}
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="sm:max-w-xl z-[9999]" >
          <DialogHeader>
            <DialogTitle>Ajustar Imagen</DialogTitle>
          </DialogHeader>
          
          <div className="relative w-full h-64 bg-slate-900 rounded-md overflow-hidden my-4">
             {imageSrc && (
               <Cropper
                 image={imageSrc}
                 crop={crop}
                 zoom={zoom}
                 aspect={4 / 3} // Or standard landscape aspect ratio
                 onCropChange={setCrop}
                 onCropComplete={onCropComplete}
                 onZoomChange={setZoom}
               />
             )}
          </div>

          <div className="space-y-2">
            <Label>Zoom</Label>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(v) => setZoom(v[0])}
            />
          </div>

          <DialogFooter>
             <Button variant="outline" onClick={() => setIsCropModalOpen(false)}>Cancelar</Button>
             <Button onClick={handleSaveCrop}>Guardar Recorte</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
