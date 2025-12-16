"use client";

import React, { useState, useEffect } from "react";
import { CustomCalendar } from "@/components/CustomCalendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/hooks/useStore";
import { format, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import { Heart, ChevronLeft, ChevronRight, Trash2, Calendar as CalendarIcon } from "lucide-react";

export function CalendarTab() {
    const { dataPage, coverColor, addSavedDate, setLastSection, savedDates, setDataPage, removeSavedDate, updateSavedDate } = useStore();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [month, setMonth] = useState<Date>(new Date());
    const [reschedulingId, setReschedulingId] = useState<number | null>(null);

    const targetDate = dataPage.targetDate;

    const handleRemove = (id: number) => {
        removeSavedDate(id);
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
                    date: date
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
            });
            // Also update in global dataPage.Dates if needed, or just rely on savedDates
            // But let's follow the pattern if dataPage.Dates is used for something else

            setLastSection("history");
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
                    <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                        <p className="text-lg font-medium text-gray-800 flex items-center justify-center gap-2">
                            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                            {targetDate.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Idea #{targetDate.id}</p>
                    </div>
                ) : (
                    <p className="text-gray-500">Selecciona una idea en la ruleta primero</p>
                )}
            </div>

            <Card className="w-full max-w-[95%] md:max-w-[80%] border-none shadow-none flex justify-center">
                <CardContent className="p-0 w-full flex justify-center">
                    <CustomCalendar
                        date={date}
                        setDate={setDate}
                        savedDates={savedDates}
                        coverColor={coverColor}
                    />
                </CardContent>
            </Card>

            {/* Existing Appointment Display */}
            {date && savedDates.find(d => d.date && new Date(d.date).toDateString() === date.toDateString()) && !reschedulingId && (
                <div className="w-full max-w-md bg-pink-50 border border-pink-200 rounded-lg p-4 mt-2 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-center font-bold text-gray-700 mb-2">¡Ya tienes una cita agendada!</h3>
                    {savedDates.filter(d => d.date && new Date(d.date).toDateString() === date.toDateString()).map((appointment, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-3">
                            <div className="flex flex-col items-center gap-1">
                                <p className="font-semibold text-lg flex items-center gap-2" style={{ color: coverColor }}>
                                    <Heart className="w-4 h-4 fill-current" />
                                    {appointment.title}
                                </p>
                                <p className="text-sm text-gray-500">Idea #{appointment.id}</p>
                                {appointment.notes && <p className="text-sm italic text-gray-600 mt-1">"{appointment.notes}"</p>}
                            </div>

                            <div className="flex gap-2 w-full justify-center mt-2">
                                <Button
                                    variant="outline"
                                    className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                                    onClick={() => handleRemove(appointment.id)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                    onClick={() => handleRescheduleStart(appointment.id)}
                                >
                                    <CalendarIcon className="w-4 h-4 mr-2" />
                                    Reprogramar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Rescheduling Banner */}
            {reschedulingId && (
                <div className="w-full max-w-md bg-blue-50 border border-blue-200 rounded-lg p-4 mt-2 animate-in fade-in slide-in-from-bottom-4 text-center">
                    <p className="font-medium text-blue-800 mb-1">Modo Reprogramación</p>
                    <p className="text-sm text-blue-600">Selecciona la nueva fecha en el calendario</p>
                </div>
            )}

            <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                {/* Show Booking UI only if date is not booked OR if we are rescheduling */}
                {date && (!savedDates.some(d => d.date && new Date(d.date).toDateString() === date.toDateString()) || reschedulingId) && (
                    <>
                        <div className="text-center mb-4">
                            <span className="text-sm text-gray-500">
                                {reschedulingId ? "Nueva fecha seleccionada:" : "Fecha seleccionada:"}
                            </span>
                            <p className="font-semibold text-lg" style={{ color: coverColor }}>
                                {format(date, "PPP", { locale: es })}
                            </p>
                        </div>

                        {reschedulingId ? (
                            <div className="flex flex-col w-full gap-2">
                                <Button
                                    className="w-full text-white bg-blue-600 hover:bg-blue-700"
                                    size="lg"
                                    onClick={handleRescheduleConfirm}
                                    disabled={
                                        // Disable if selected date is same as original date (optional check, requires finding original)
                                        false
                                    }
                                >
                                    Confirmar Nueva Fecha
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={cancelReschedule}
                                    className="text-gray-500"
                                >
                                    Cancelar Reprogramación
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className="w-full text-white"
                                size="lg"
                                style={{ backgroundColor: coverColor }}
                                onClick={handleSave}
                                disabled={!targetDate}
                            >
                                Confirmar y Guardar en Recuerdos
                            </Button>
                        )}
                    </>
                )}

                {!reschedulingId && (
                    <Button
                        variant="ghost"
                        onClick={() => setLastSection("roulette")}
                        className="text-gray-500"
                    >
                        Volver a la Ruleta
                    </Button>
                )}
            </div>
        </div >
    );
}
