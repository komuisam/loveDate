"use client";

import type React from "react";
import dynamic from "next/dynamic";

//import { Wheel } from "react-custom-roulette";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  ImageIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { dateIdeas } from "@/lib/date-ideas";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { TimePickerDemo } from "@/components/time-picker";

type SavedDate = {
  title: string;
  id: number;
  idea: string;
  imageUrl: string | null;
  date: Date | null;
  notes: string;
};

export function Browse() {
  const [coverColor, setCoverColor] = useState("#f43f5e"); // rose-500
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [savedDates, setSavedDates] = useState<SavedDate[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<SavedDate | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const itemsPerPage = 2; // Two ideas per page (left and right)

  const filteredDateIdeas = dateIdeas.filter((idea) =>
    idea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDateIdeas.length / itemsPerPage);
  const paginatedIdeas = filteredDateIdeas.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

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

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  // Filtrar citas con imágenes para la sección de historia
  const datesWithImages = savedDates.filter((date) => date.imageUrl);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ideas de citas..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            className="pl-10"
          />
        </div>

        {/* Book-style pagination */}
        <div className="relative w-full max-w-3xl mx-auto h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Book binding */}
          <div className="absolute left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 bg-gray-300 z-10 shadow-inner"></div>

          {/* Page content */}
          <div className="relative w-full h-full flex">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentPage}
                custom={direction}
                variants={{
                  enter: (direction) => ({
                    x: direction > 0 ? "100%" : "-100%",
                    opacity: 0,
                    rotateY: direction > 0 ? -15 : 15,
                  }),
                  center: {
                    x: 0,
                    opacity: 1,
                    rotateY: 0,
                    transition: {
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    },
                  },
                  exit: (direction) => ({
                    x: direction < 0 ? "100%" : "-100%",
                    opacity: 0,
                    rotateY: direction < 0 ? -15 : 15,
                    transition: {
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    },
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 flex"
                style={{ perspective: "1200px" }}
              >
                {/* Left page */}
                <div className="w-1/2 h-full p-6 bg-[#f8f9fa] border-r border-gray-200 flex flex-col overflow-y-auto">
                  {paginatedIdeas[0] ? (
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-500">
                          Idea #{currentPage * itemsPerPage + 1}
                        </div>
                        <div className="text-xs text-gray-400">
                          Página {currentPage + 1} de {totalPages}
                        </div>
                      </div>
                      <h3
                        className="text-xl font-bold mb-3"
                        style={{ color: coverColor }}
                      >
                        {paginatedIdeas[0]}
                      </h3>

                      {/* Check if this idea has been saved */}
                      {(() => {
                        const ideaIndex = currentPage * itemsPerPage;
                        const savedIndex = savedDates.findIndex(
                          (d) => d.id === ideaIndex
                        );
                        const saved =
                          savedIndex >= 0 ? savedDates[savedIndex] : null;

                        // Create a temporary idea object for editing
                        const currentIdea = saved || {
                          id: ideaIndex,
                          idea: paginatedIdeas[0],
                          imageUrl: null,
                          date: null,
                          notes: "",
                        };

                        return (
                          <div className="flex-1 flex flex-col">
                            {/* Image section */}
                            <div className="mb-3">
                              {currentIdea.imageUrl ? (
                                <div className="relative w-full h-32 rounded overflow-hidden">
                                  <img
                                    src={
                                      currentIdea.imageUrl || "/placeholder.svg"
                                    }
                                    alt={currentIdea.idea}
                                    className="w-full h-full object-cover"
                                  />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => {
                                      const updatedIdea = {
                                        ...currentIdea,
                                        imageUrl: null,
                                      };
                                      const updatedDates = [...savedDates];
                                      if (savedIndex >= 0) {
                                        updatedDates[savedIndex] = updatedIdea;
                                      } else {
                                        updatedDates.push(updatedIdea);
                                      }
                                      setSavedDates(updatedDates);
                                    }}
                                  >
                                    Eliminar
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-32">
                                  <Button
                                    variant="ghost"
                                    onClick={() => {
                                      // Set the selected idea for the file input
                                      setSelectedIdea(currentIdea);
                                      fileInputRef.current?.click();
                                    }}
                                  >
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Subir imagen
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Date and time section */}
                            <div className="mb-3">
                              <Label className="text-sm mb-1 block">
                                Fecha y Hora
                              </Label>
                              <div className="flex gap-2">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal text-xs",
                                        !currentIdea.date &&
                                          "text-muted-foreground"
                                      )}
                                    >
                                      <Calendar className="mr-2 h-3 w-3" />
                                      {currentIdea.date
                                        ? format(currentIdea.date, "PPP", {
                                            locale: es,
                                          })
                                        : "Seleccionar fecha"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <CalendarComponent
                                      mode="single"
                                      selected={currentIdea.date || undefined}
                                      onSelect={(date) => {
                                        if (!date) return;

                                        // Create a new date object with the selected date
                                        let newDate = date;
                                        if (currentIdea.date) {
                                          newDate = new Date(date);
                                          newDate.setHours(
                                            currentIdea.date.getHours()
                                          );
                                          newDate.setMinutes(
                                            currentIdea.date.getMinutes()
                                          );
                                        }

                                        const updatedIdea = {
                                          ...currentIdea,
                                          date: newDate,
                                        };
                                        const updatedDates = [...savedDates];
                                        if (savedIndex >= 0) {
                                          updatedDates[savedIndex] =
                                            updatedIdea;
                                        } else {
                                          updatedDates.push(updatedIdea);
                                        }
                                        setSavedDates(updatedDates);
                                      }}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>

                                <TimePickerDemo
                                  setDate={(time) => {
                                    // Create a new date object with the selected time
                                    let newDate = time;
                                    if (currentIdea.date) {
                                      newDate = new Date(currentIdea.date);
                                      newDate.setHours(time.getHours());
                                      newDate.setMinutes(time.getMinutes());
                                    }

                                    const updatedIdea = {
                                      ...currentIdea,
                                      date: newDate,
                                    };
                                    const updatedDates = [...savedDates];
                                    if (savedIndex >= 0) {
                                      updatedDates[savedIndex] = updatedIdea;
                                    } else {
                                      updatedDates.push(updatedIdea);
                                    }
                                    setSavedDates(updatedDates);
                                  }}
                                  date={currentIdea.date || new Date()}
                                />
                              </div>
                            </div>

                            {/* Notes section */}
                            <div className="mb-3">
                              <Label className="text-sm mb-1 block">
                                Notas
                              </Label>
                              <Textarea
                                value={currentIdea.notes}
                                onChange={(e) => {
                                  const updatedIdea = {
                                    ...currentIdea,
                                    notes: e.target.value,
                                  };
                                  const updatedDates = [...savedDates];
                                  if (savedIndex >= 0) {
                                    updatedDates[savedIndex] = updatedIdea;
                                  } else {
                                    updatedDates.push(updatedIdea);
                                  }
                                  setSavedDates(updatedDates);
                                }}
                                placeholder="Escribe tus notas sobre esta cita..."
                                className="text-sm"
                                rows={3}
                              />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No hay más ideas
                    </div>
                  )}
                </div>

                {/* Right page */}
                <div className="w-1/2 h-full p-6 bg-white flex flex-col overflow-y-auto">
                  {paginatedIdeas[1] ? (
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-500">
                          Idea #{currentPage * itemsPerPage + 2}
                        </div>
                        <div className="text-xs text-gray-400">
                          Página {currentPage + 1} de {totalPages}
                        </div>
                      </div>
                      <h3
                        className="text-xl font-bold mb-3"
                        style={{ color: coverColor }}
                      >
                        {paginatedIdeas[1]}
                      </h3>

                      {/* Check if this idea has been saved */}
                      {(() => {
                        const ideaIndex = currentPage * itemsPerPage + 1;
                        const savedIndex = savedDates.findIndex(
                          (d) => d.id === ideaIndex
                        );
                        const saved =
                          savedIndex >= 0 ? savedDates[savedIndex] : null;

                        // Create a temporary idea object for editing
                        const currentIdea = saved || {
                          id: ideaIndex,
                          idea: paginatedIdeas[1],
                          imageUrl: null,
                          date: null,
                          notes: "",
                        };

                        return (
                          <div className="flex-1 flex flex-col">
                            {/* Image section */}
                            <div className="mb-3">
                              {currentIdea.imageUrl ? (
                                <div className="relative w-full h-32 rounded overflow-hidden">
                                  <img
                                    src={
                                      currentIdea.imageUrl || "/placeholder.svg"
                                    }
                                    alt={currentIdea.idea}
                                    className="w-full h-full object-cover"
                                  />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => {
                                      const updatedIdea = {
                                        ...currentIdea,
                                        imageUrl: null,
                                      };
                                      const updatedDates = [...savedDates];
                                      if (savedIndex >= 0) {
                                        updatedDates[savedIndex] = updatedIdea;
                                      } else {
                                        updatedDates.push(updatedIdea);
                                      }
                                      setSavedDates(updatedDates);
                                    }}
                                  >
                                    Eliminar
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-32">
                                  <Button
                                    variant="ghost"
                                    onClick={() => {
                                      // Set the selected idea for the file input
                                      setSelectedIdea(currentIdea);
                                      fileInputRef.current?.click();
                                    }}
                                  >
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Subir imagen
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Date and time section */}
                            <div className="mb-3">
                              <Label className="text-sm mb-1 block">
                                Fecha y Hora
                              </Label>
                              <div className="flex gap-2">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal text-xs",
                                        !currentIdea.date &&
                                          "text-muted-foreground"
                                      )}
                                    >
                                      <Calendar className="mr-2 h-3 w-3" />
                                      {currentIdea.date
                                        ? format(currentIdea.date, "PPP", {
                                            locale: es,
                                          })
                                        : "Seleccionar fecha"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <CalendarComponent
                                      mode="single"
                                      selected={currentIdea.date || undefined}
                                      onSelect={(date) => {
                                        if (!date) return;

                                        // Create a new date object with the selected date
                                        let newDate = date;
                                        if (currentIdea.date) {
                                          newDate = new Date(date);
                                          newDate.setHours(
                                            currentIdea.date.getHours()
                                          );
                                          newDate.setMinutes(
                                            currentIdea.date.getMinutes()
                                          );
                                        }

                                        const updatedIdea = {
                                          ...currentIdea,
                                          date: newDate,
                                        };
                                        const updatedDates = [...savedDates];
                                        if (savedIndex >= 0) {
                                          updatedDates[savedIndex] =
                                            updatedIdea;
                                        } else {
                                          updatedDates.push(updatedIdea);
                                        }
                                        setSavedDates(updatedDates);
                                      }}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>

                                <TimePickerDemo
                                  setDate={(time) => {
                                    // Create a new date object with the selected time
                                    let newDate = time;
                                    if (currentIdea.date) {
                                      newDate = new Date(currentIdea.date);
                                      newDate.setHours(time.getHours());
                                      newDate.setMinutes(time.getMinutes());
                                    }

                                    const updatedIdea = {
                                      ...currentIdea,
                                      date: newDate,
                                    };
                                    const updatedDates = [...savedDates];
                                    if (savedIndex >= 0) {
                                      updatedDates[savedIndex] = updatedIdea;
                                    } else {
                                      updatedDates.push(updatedIdea);
                                    }
                                    setSavedDates(updatedDates);
                                  }}
                                  date={currentIdea.date || new Date()}
                                />
                              </div>
                            </div>

                            {/* Notes section */}
                            <div className="mb-3">
                              <Label className="text-sm mb-1 block">
                                Notas
                              </Label>
                              <Textarea
                                value={currentIdea.notes}
                                onChange={(e) => {
                                  const updatedIdea = {
                                    ...currentIdea,
                                    notes: e.target.value,
                                  };
                                  const updatedDates = [...savedDates];
                                  if (savedIndex >= 0) {
                                    updatedDates[savedIndex] = updatedIdea;
                                  } else {
                                    updatedDates.push(updatedIdea);
                                  }
                                  setSavedDates(updatedDates);
                                }}
                                placeholder="Escribe tus notas sobre esta cita..."
                                className="text-sm"
                                rows={3}
                              />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No hay más ideas
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
