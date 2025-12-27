"use client";

import React, { useState, useEffect, useRef } from "react";
import { CustomCalendar } from "@/components/CustomCalendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/hooks/useStore";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Heart, Calendar as CalendarIcon, Upload, ImageIcon, Trash2 } from "lucide-react";

export function CalendarTab() {
    const { dataPage, coverColor, addSavedDate, setLastSection, savedDates, removeSavedDate, updateSavedDate } = useStore();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [reschedulingId, setReschedulingId] = useState<number | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [notes, setNotes] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const targetDate = dataPage.targetDate;

    // Load existing data if selecting a saved date or rescheduling
    useEffect(() => {
        if (!date) return;
        const existing = savedDates.find(d => d.date && new Date(d.date).toDateString() === date.toDateString());
        if (existing) {
            setNotes(existing.notes || "");
            setSelectedImage(existing.imageUrl || null);
        } else if (!reschedulingId) {
            // Reset if picking a fresh date? Only if not targetDate focused?
            // Actually, if we are planning *targetDate*, we want to keep its info nearby.
            // But if we click a date on calendar that HAS an event, we populate.
            setNotes("");
            setSelectedImage(null);
        }
    }, [date, savedDates, reschedulingId]);

    const handleRemove = (id: number) => {
        removeSavedDate(id);
        setNotes("");
        setSelectedImage(null);
    };

    const handleRescheduleStart = (id: number) => {
        setReschedulingId(id);
    };

    const cancelReschedule = () => {
        setReschedulingId(null);
    };

    const handleRescheduleConfirm = () => {
        if (reschedulingId && date) {
            const originalAppointment = savedDates.find(d => d.id === reschedulingId);
            if (originalAppointment) {
                updateSavedDate({
                    ...originalAppointment,
                    date: date,
                    notes: notes, // Update notes too?
                    imageUrl: selectedImage // Update image?
                });
                setReschedulingId(null);
            }
        }
    };

    const handleSave = () => {
        if (targetDate && date) {
            addSavedDate({
                ...targetDate,
                date: date,
                imageUrl: selectedImage,
                notes: notes
            });
            setLastSection("history");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div
            className="w-full min-h-[80vh] mx-auto rounded-xl shadow-lg p-6 flex flex-col items-center gap-6"
            style={{
                backgroundColor: "white",
                border: `8px solid ${coverColor}`,
            }}
        >
            <div className="text-center space-y-2">
                <h2
                    className="text-2xl font-bold"
                    style={{ color: coverColor }}
                >
                    Planifica tu Cita
                </h2>
                {targetDate ? (
                    <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 mb-6">
                        <p className="text-lg font-medium text-gray-800 flex items-center justify-center gap-2">
                            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                            {targetDate.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Idea #{targetDate.id}</p>
                    </div>
                ) : (
                    <p className="text-gray-500 mb-6">Selecciona una fecha para ver o añadir detalles</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
                {/* Left Col: Calendar */}
                <div className="flex flex-col items-center">
                    <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" /> Selecciona la Fecha
                    </h3>
                    <div className="border rounded-xl p-4 shadow-sm bg-white w-full flex justify-center">
                        <CustomCalendar
                            date={date}
                            setDate={setDate}
                            savedDates={savedDates}
                            coverColor={coverColor}
                        />
                    </div>

                    {/* Existing Appointment Display logic below calendar */}
                    {date && savedDates.find(d => d.date && new Date(d.date).toDateString() === date.toDateString()) && !reschedulingId && (
                        <div className="w-full mt-4 bg-pink-50 border border-pink-200 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-center font-bold text-gray-700 mb-2">¡Cita agendada!</h3>
                            {savedDates.filter(d => d.date && new Date(d.date).toDateString() === date.toDateString()).map((appointment, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-3">
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="font-semibold text-lg flex items-center gap-2" style={{ color: coverColor }}>
                                            <Heart className="w-4 h-4 fill-current" />
                                            {appointment.title}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 w-full justify-center">
                                        <Button
                                            variant="outline"
                                            className="h-8 text-xs border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                                            onClick={() => handleRemove(appointment.id)}
                                        >
                                            <Trash2 className="w-3 h-3 mr-1" />
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Col: Image & Notes */}
                <div className="flex flex-col items-center">
                    <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Detalles del Recuerdo
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

                    <div className="w-full max-w-[350px]">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción / Notas</h3>
                        <Textarea
                            placeholder="Escribe algo sobre este recuerdo..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="resize-none h-32 bg-white"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full max-w-[350px] mt-6">
                        {date && (
                            (() => {
                                const existing = savedDates.find(d => d.date && new Date(d.date).toDateString() === date.toDateString());

                                if (existing) {
                                    return (
                                        <Button
                                            className="w-full text-white shadow-md text-white shadow-md"
                                            size="lg"
                                            style={{ backgroundColor: coverColor }}
                                            onClick={() => {
                                                updateSavedDate({
                                                    ...existing,
                                                    notes: notes,
                                                    imageUrl: selectedImage
                                                });
                                                setLastSection("history");
                                            }}
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Actualizar Cambios
                                        </Button>
                                    );
                                } else if (reschedulingId) {
                                    // Reschedule Mode
                                    return (
                                        <div className="flex flex-col gap-2">
                                            <Button
                                                className="w-full text-white bg-blue-600 hover:bg-blue-700"
                                                onClick={handleRescheduleConfirm}
                                            >
                                                Confirmar Nueva Fecha
                                            </Button>
                                            <Button variant="ghost" onClick={cancelReschedule}>Cancelar</Button>
                                        </div>
                                    )
                                } else if (targetDate) {
                                    // New Appointment Mode
                                    return (
                                        <Button
                                            className="w-full text-white shadow-md"
                                            size="lg"
                                            style={{ backgroundColor: coverColor }}
                                            onClick={handleSave}
                                        >
                                            Confirmar y Guardar
                                        </Button>
                                    );
                                } else {
                                    return (
                                        <p className="text-xs text-center text-gray-400 mt-2">
                                            Selecciona una idea en la Ruleta o Libro para habilitar el guardado, o selecciona una fecha con cita para editarla.
                                        </p>
                                    );
                                }
                            })()
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
