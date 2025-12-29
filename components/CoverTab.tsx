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
    coverImage, setCoverImage,
    appBgImage, setAppBgImage
  } = useStore();

  const [editingCover, setEditingCover] = useState(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const appBgInputRef = useRef<HTMLInputElement>(null);

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

  const handleAppBgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const bgUrl = await readFile(file);
      // Directly set background without crop for now, or could use crop too if needed
      setAppBgImage(bgUrl);
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
            <div className="w-full max-w-md md:max-w-4xl bg-black/60 p-6 rounded-xl backdrop-blur-md transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Text & Color */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="cover-title" className="text-white text-sm font-medium">
                      Título
                    </Label>
                    <Input
                      id="cover-title"
                      value={coverTitle}
                      onChange={(e) => setCoverTitle(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover-subtitle" className="text-white text-sm font-medium">
                      Subtítulo
                    </Label>
                    <Textarea
                      id="cover-subtitle"
                      value={coverSubtitle}
                      onChange={(e) => setCoverSubtitle(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all resize-none h-24"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover-color" className="text-white text-sm font-medium">
                      Color Principal
                    </Label>
                    <div className="flex items-center gap-3">
                      <div className="relative overflow-hidden rounded-full w-10 h-10 border border-white/30 shadow-sm">
                          <Input
                            id="cover-color"
                            type="color"
                            value={coverColor}
                            onChange={(e) => setCoverColor(e.target.value)}
                            className="absolute -top-2 -left-2 w-16 h-16 p-0 border-none cursor-pointer bg-transparent"
                          />
                      </div>
                      <Input
                        value={coverColor}
                        onChange={(e) => setCoverColor(e.target.value)}
                        className="bg-white/10 border-white/20 text-white font-mono text-xs flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Images */}
                <div className="space-y-4">
                     <Label className="text-white text-sm font-medium">Imágenes</Label>
                     <div className="grid grid-cols-2 gap-4">
                        {/* Cover Image */}
                         <div 
                              className="aspect-square relative border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-white/40 transition-all group overflow-hidden"
                              onClick={() => fileInputRef.current?.click()}
                            >
                                {coverImage ? (
                                    <>
                                        <img src={coverImage} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                             <Edit className="w-6 h-6 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center p-2 text-center">
                                        <Upload className="h-6 w-6 mb-2 text-white/60" />
                                        <span className="text-xs text-white/80">Portada</span>
                                    </div>
                                )}
                            </div>

                        {/* App Bg Image */}
                         <div 
                              className="aspect-square relative border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-white/40 transition-all group overflow-hidden"
                              onClick={() => appBgInputRef.current?.click()}
                            >
                               {appBgImage ? (
                                    <>
                                        <img src={appBgImage} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                             <Edit className="w-6 h-6 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center p-2 text-center">
                                        <ImageIcon className="h-6 w-6 mb-2 text-white/60" />
                                        <span className="text-xs text-white/80">Fondo App</span>
                                    </div>
                                )}
                            </div>
                     </div>
                     
                     {/* Remove Buttons */}
                     <div className="flex gap-2">
                        {coverImage && (
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setCoverImage(null); }} className="flex-1 text-[10px] h-8 text-red-300 hover:text-red-100 hover:bg-red-500/20">
                                Quitar Portada
                            </Button>
                        )}
                        {appBgImage && (
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setAppBgImage(null); }} className="flex-1 text-[10px] h-8 text-red-300 hover:text-red-100 hover:bg-red-500/20">
                                Quitar Fondo
                            </Button>
                        )}
                     </div>
                </div>
              </div>

               {/* Hidden Inputs */}
               <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
               <input type="file" ref={appBgInputRef} onChange={handleAppBgChange} accept="image/*" className="hidden" />

              <Button
                onClick={() => setEditingCover(false)}
                className="w-full mt-8 bg-white text-black hover:bg-white/90 font-medium shadow-lg hover:shadow-xl transition-all"
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
