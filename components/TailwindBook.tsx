"use client";

import React, { useState, useMemo, useRef } from "react";
import { dateIdeas } from "@/lib/date-ideas-object";
import { DataRoot } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Upload, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CustomCalendar } from "@/components/CustomCalendar";
import { useStore } from "@/hooks/useStore";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface BookProps {
    coverColor: string;
    dataPage?: DataRoot;
    setDataPage?: (data: DataRoot) => void;
    onSelect?: () => void; // Optional navigation fallback
}

// A single physical sheet of paper with two sides (Front & Back)
function Sheet({
    index,
    flipped,
    zIndex,
    frontContent,
    backContent,
    onFlip,
    color,
}: {
    index: number;
    flipped: boolean;
    zIndex: number;
    frontContent: React.ReactNode;
    backContent: React.ReactNode;
    onFlip: () => void;
    color: string;
}) {
    return (
        <div
            className="absolute top-0 w-full h-full transition-all duration-700 ease-in-out cursor-pointer"
            style={{
                zIndex: zIndex,
                transformStyle: "preserve-3d",
                transform: `rotateY(${flipped ? -180 : 0}deg) translateZ(1px)`,
                transformOrigin: "left center",
                transitionProperty: "transform, z-index",
                transitionDuration: "700ms, 0ms",
                transitionDelay: `0ms, ${flipped ? 350 : 0}ms`,
            }}
            onClick={(e) => {
                e.stopPropagation();
                onFlip();
            }}
        >
            {/* FRONT FACE */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-[#fdfaf7] border border-stone-200 shadow-sm overflow-hidden flex flex-col items-center p-6 rounded-r-md" style={{ backfaceVisibility: "hidden" }}>
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-stone-300/30 to-transparent pointer-events-none" />
                {frontContent}
                <div className="absolute inset-2 border rounded-r-sm pointer-events-none" style={{ borderColor: color, opacity: 0.1 }} />
            </div>

            {/* BACK FACE */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-[#fdfaf7] border border-stone-200 shadow-sm overflow-hidden flex flex-col items-center p-6 rounded-l-md" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-stone-300/30 to-transparent pointer-events-none" />
                {backContent}
                <div className="absolute inset-2 border rounded-l-sm pointer-events-none" style={{ borderColor: color, opacity: 0.1 }} />
            </div>
        </div>
    );
}

export function TailwindBook({ coverColor, dataPage, setDataPage, onSelect }: BookProps) {
    const { addSavedDate, savedDates } = useStore();
    const ideas = Object.values(dateIdeas);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeIdea, setActiveIdea] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [notes, setNotes] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sheets = useMemo(() => {
        const arr = [];
        arr.push({ id: "cover", front: { type: "cover", data: null }, back: { type: "idea", data: ideas[0] } });
        let i = 1;
        while (i < ideas.length) {
            arr.push({ id: `idea-${i}`, front: { type: "idea", data: ideas[i] }, back: { type: "idea", data: ideas[i + 1] || null } });
            i += 2;
        }
        return arr;
    }, [ideas]);

    const [currentSheetIndex, setCurrentSheetIndex] = useState(-1);
    const [searchTerm, setSearchTerm] = useState("");

    const handleNext = () => { if (currentSheetIndex < sheets.length - 1) setCurrentSheetIndex(p => p + 1); };
    const handlePrev = () => { if (currentSheetIndex >= 0) setCurrentSheetIndex(p => p - 1); };

    const handleSearch = (term: string) => {
        const idx = ideas.findIndex(i => i.title.toLowerCase().includes(term.toLowerCase()));
        if (idx !== -1) setCurrentSheetIndex(Math.floor(idx / 2));
    };

    const openSelectionModal = (idea: any) => {
        setActiveIdea(idea);
        setSelectedImage(null);
        setNotes(""); // Reset notes

        const existing = savedDates.find(d => d.id === idea.id);
        if (existing && existing.date) setSelectedDate(new Date(existing.date));
        else setSelectedDate(new Date());

        if (existing && existing.imageUrl) setSelectedImage(existing.imageUrl);
        if (existing && existing.notes) setNotes(existing.notes);

        setIsModalOpen(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmMemory = () => {
        if (!activeIdea || !selectedDate) return;

        addSavedDate({
            id: activeIdea.id,
            title: activeIdea.title,
            date: selectedDate,
            imageUrl: selectedImage,
            notes: notes
        });

        setIsModalOpen(false);
    };

    return (
        <div className="w-full flex flex-col items-center gap-6 py-8">
            {/* Search */}
            <div className="relative w-80 z-20">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Buscar idea..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSearch(searchTerm)}
                    className="pl-10 bg-white shadow-sm border-gray-200 rounded-full"
                />
            </div>

            {/* Book */}
            <div className="relative w-[340px] md:w-[600px] h-[500px]" style={{ perspective: "1500px" }}>
                <div className="absolute left-1/2 top-0 bottom-0 w-4 -ml-2 bg-stone-900 rounded-sm shadow-2xl" />
                <div className="absolute right-0 w-1/2 h-full top-0 preserve-3d">
                    {sheets.map((sheet, i) => (
                        <Sheet
                            key={sheet.id}
                            index={i}
                            flipped={i <= currentSheetIndex}
                            zIndex={i <= currentSheetIndex ? i : sheets.length - i}
                            color={coverColor}
                            onFlip={() => i <= currentSheetIndex ? setCurrentSheetIndex(i - 1) : setCurrentSheetIndex(i)}
                            frontContent={
                                <div className="h-full flex flex-col items-center justify-between text-center w-full">
                                    {sheet.front.type === "cover" ? (
                                        <div className="flex-1 flex flex-col items-center justify-center">
                                            <h1 className="text-4xl font-serif text-stone-800 mb-4 tracking-wide">Libro de<br />Citas</h1>
                                            <div className="w-16 h-1 bg-current mb-4 rounded-full" style={{ color: coverColor }} />
                                            <p className="text-stone-500 text-sm">Explora nuevas experiencias</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-full flex justify-between items-center text-xs text-stone-400 font-serif uppercase tracking-widest border-b pb-2">
                                                <span>Date Night</span><span>#{sheet.front.data?.id}</span>
                                            </div>
                                            <div className="flex-1 flex flex-col items-center justify-center py-4">
                                                <h2 className="text-2xl font-medium text-stone-700 font-serif mb-4 leading-snug">{sheet.front.data?.title}</h2>
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-stone-50 text-stone-300 mb-4"><span className="text-xl font-serif">{(i * 2)}</span></div>
                                                <p className="text-sm text-stone-500 line-clamp-6">Una cita romántica perfecta...</p>
                                            </div>
                                            <div className="w-full pt-4 border-t">
                                                <Button variant="outline" size="sm" className="w-full text-xs hover:bg-stone-50"
                                                    onClick={(e) => { e.stopPropagation(); openSelectionModal(sheet.front.data); }}
                                                >
                                                    Seleccionar Idea
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            }
                            backContent={
                                <div className="h-full flex flex-col items-center justify-between text-center w-full">
                                    {sheet.back.data ? (
                                        <>
                                            <div className="w-full flex justify-between items-center text-xs text-stone-400 font-serif uppercase tracking-widest border-b pb-2">
                                                <span>#{sheet.back.data.id}</span><span>Date Night</span>
                                            </div>
                                            <div className="flex-1 flex flex-col items-center justify-center py-4">
                                                <h2 className="text-2xl font-medium text-stone-700 font-serif mb-4 leading-snug">{sheet.back.data.title}</h2>
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-stone-50 text-stone-300 mb-4"><span className="text-xl font-serif">{(i * 2) + 1}</span></div>
                                                <p className="text-sm text-stone-500 line-clamp-6">Una aventura única...</p>
                                            </div>
                                            <div className="w-full pt-4 border-t">
                                                <Button variant="outline" size="sm" className="w-full text-xs hover:bg-stone-50"
                                                    onClick={(e) => { e.stopPropagation(); openSelectionModal(sheet.back.data); }}
                                                >
                                                    Seleccionar Idea
                                                </Button>
                                            </div>
                                        </>
                                    ) : <div className="flex-1 flex items-center justify-center"><p className="text-stone-300 font-serif italic">Fin del libro</p></div>}
                                </div>
                            }
                        />
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mt-4">
                <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentSheetIndex === -1} className="rounded-full shadow-sm"><ChevronLeft className="h-4 w-4" /></Button>
                <span className="text-sm text-stone-500 font-medium font-serif min-w-24 text-center">Página {currentSheetIndex + 2} / {sheets.length + 1}</span>
                <Button variant="outline" size="icon" onClick={handleNext} disabled={currentSheetIndex === sheets.length - 1} className="rounded-full shadow-sm"><ChevronRight className="h-4 w-4" /></Button>
            </div>

            {/* MEMORY CREATION MODAL */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-[9999]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-serif text-center" style={{ color: coverColor }}>
                            Agendar Cita #{activeIdea?.id}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                        {/* Left Col: Calendar */}
                        <div className="flex flex-col items-center">
                            <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" /> Selecciona la Fecha
                            </h3>
                            <div className="border rounded-xl p-4 shadow-sm bg-white w-full flex justify-center">
                                <CustomCalendar
                                    date={selectedDate}
                                    setDate={setSelectedDate}
                                    savedDates={savedDates}
                                    coverColor={coverColor}
                                />
                            </div>
                            {selectedDate && (
                                <p className="mt-4 text-sm font-medium" style={{ color: coverColor }}>
                                    {format(selectedDate, "PPP", { locale: es })}
                                </p>
                            )}
                        </div>

                        {/* Right Col: Image Upload & Description */}
                        <div className="flex flex-col items-center">
                            <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Foto de Portada (Opcional)
                            </h3>

                            <div
                                className="w-full aspect-square max-w-[250px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 transition-colors relative overflow-hidden group bg-white mb-6"
                                style={{ borderColor: coverColor }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {selectedImage ? (
                                    <>
                                        <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-xs font-medium">Cambiar imagen</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm text-gray-500">Haz clic para subir una foto</p>
                                        <p className="text-xs text-gray-400 mt-1">Se usará en tus Recuerdos</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />

                            <div className="w-full">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción / Notas</h3>
                                <Textarea
                                    placeholder="Escribe algo sobre este recuerdo..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="resize-none h-24 bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-2 sm:justify-center">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button
                            onClick={handleConfirmMemory}
                            style={{ backgroundColor: coverColor }}
                            className="min-w-[200px]"
                            disabled={!selectedDate}
                        >
                            Confirmar y Crear Recuerdo
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
