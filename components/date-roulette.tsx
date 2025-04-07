"use client";

import type React from "react";
import dynamic from "next/dynamic";
const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);
//import { Wheel } from "react-custom-roulette";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Book,
  RefreshCw,
  Heart,
  Edit,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  ImageIcon,
} from "lucide-react";

const data = Array.from({ length: 20 }, (m, i) => {
  const backgroundColor = i % 2 === 0 ? "green" : "#ffffff";
  const textColor = i % 2 === 0 ? "white" : "black";
  return {
    option: +i + 1,
    style: { backgroundColor, textColor },
  };
});

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
import { ContractTab } from "./ContractTab";
import { CoverTab } from "./CoverTab";
import { Roulet } from "./Rulete";

type SavedDate = {
  id: number;
  idea: string;
  imageUrl: string | null;
  date: Date | null;
  notes: string;
};

export function DateRoulette() {
  const [coverTitle, setCoverTitle] = useState("Nuestra Agenda de Citas");
  const [coverSubtitle, setCoverSubtitle] = useState(
    "100 Ideas para Compartir Juntos"
  );
  const [coverColor, setCoverColor] = useState("#f43f5e"); // rose-500
  const [editingCover, setEditingCover] = useState(false);
  /* eliminar */ const [spinning, setSpinning] = useState(false); // Fixed: was using spinning as initial value

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [savedDates, setSavedDates] = useState<SavedDate[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<SavedDate | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const wheelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

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

  const spinWheel = () => {
    const randomIndex = Math.floor(Math.random() * dateIdeas.length);
    setPrizeNumber(randomIndex);
    setMustSpin(true);
  };

  const resetWheel = () => {
    if (wheelRef.current) {
      wheelRef.current.style.transition = "none";
      wheelRef.current.style.transform = "rotate(0deg)";
    }
    setSelectedDate(null);
  };

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedIdea) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedIdea({
          ...selectedIdea,
          imageUrl,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveDate = () => {
    if (!selectedIdea) return;

    const existingIndex = savedDates.findIndex((d) => d.id === selectedIdea.id);

    if (existingIndex >= 0) {
      // Update existing date
      const updatedDates = [...savedDates];
      updatedDates[existingIndex] = selectedIdea;
      setSavedDates(updatedDates);
    } else {
      // Add new date
      setSavedDates([...savedDates, selectedIdea]);
    }

    // Reset form
    setSelectedIdea(null);
    setSelectedTime(null);
    setNotes("");
  };

  const selectIdeaToEdit = (ideaIndex: number) => {
    const idea = dateIdeas[ideaIndex];
    const existingSaved = savedDates.find((d) => d.id === ideaIndex);

    if (existingSaved) {
      setSelectedIdea(existingSaved);
      setSelectedTime(existingSaved.date);
      setNotes(existingSaved.notes);
    } else {
      setSelectedIdea({
        id: ideaIndex,
        idea,
        imageUrl: null,
        date: null,
        notes: "",
      });
      setSelectedTime(null);
      setNotes("");
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && selectedIdea) {
      // If we already have a time, preserve it
      let newDate = date;
      if (selectedIdea.date) {
        newDate = new Date(date);
        newDate.setHours(selectedIdea.date.getHours());
        newDate.setMinutes(selectedIdea.date.getMinutes());
      }

      setSelectedIdea({
        ...selectedIdea,
        date: newDate,
      });
    }
  };

  const handleTimeChange = (time: Date) => {
    setSelectedTime(time);

    if (selectedIdea) {
      let newDate = time;

      // If we already have a date, preserve it
      if (selectedIdea.date) {
        newDate = new Date(selectedIdea.date);
        newDate.setHours(time.getHours());
        newDate.setMinutes(time.getMinutes());
      }

      setSelectedIdea({
        ...selectedIdea,
        date: newDate,
      });
    }
  };

  // Filtrar citas con imágenes para la sección de historia
  const datesWithImages = savedDates.filter((date) => date.imageUrl);

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
          <Roulet />
          {/*    <div className="flex flex-col items-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96 mb-8">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-8 h-8 z-10">
                <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-black mx-auto"></div>
              </div>

              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                innerRadius={1}
                innerBorderColor={"black"}
                innerBorderWidth={5}
                radiusLineColor={"orange"}
                radiusLineWidth={2}
                backgroundColors={["#3e3e3e", "#df3428"]}
                textColors={["#ffffff"]}
              />
            </div>

            <div className="space-y-4 w-full max-w-md">
              <div className="flex gap-2">
                <Button
                  onClick={spinWheel}
                  disabled={spinning}
                  className="flex-1"
                  style={{
                    backgroundColor: coverColor,
                    borderColor: coverColor,
                  }}
                >
                  <RefreshCw
                    className={cn("mr-2 h-4 w-4", spinning && "animate-spin")}
                  />
                  {spinning ? "Girando..." : "Girar Ruleta"}
                </Button>

                <Button
                  variant="outline"
                  onClick={resetWheel}
                  disabled={spinning || selectedDate === null}
                  className="flex-1"
                >
                  Reiniciar
                </Button>
              </div>

              {selectedDate !== null && (
                <Card className="mt-4">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-2">Tu idea de cita:</h3>
                    <p className="text-lg">{dateIdeas[selectedDate]}</p>

                    <div className="mt-4">
                      <Button
                        onClick={() => selectIdeaToEdit(selectedDate)}
                        style={{
                          backgroundColor: coverColor,
                          borderColor: coverColor,
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Guardar esta idea
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-2">
            Los números en la ruleta (1-20) representan diferentes ideas de
            citas
          </div> */}
        </TabsContent>

        {/* Browse Tab */}
        <TabsContent value="browse" className="mt-6">
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
                                          currentIdea.imageUrl ||
                                          "/placeholder.svg"
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
                                            updatedDates[savedIndex] =
                                              updatedIdea;
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
                                          selected={
                                            currentIdea.date || undefined
                                          }
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
                                            const updatedDates = [
                                              ...savedDates,
                                            ];
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
                                          updatedDates[savedIndex] =
                                            updatedIdea;
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
                                          currentIdea.imageUrl ||
                                          "/placeholder.svg"
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
                                            updatedDates[savedIndex] =
                                              updatedIdea;
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
                                          selected={
                                            currentIdea.date || undefined
                                          }
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
                                            const updatedDates = [
                                              ...savedDates,
                                            ];
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
                                          updatedDates[savedIndex] =
                                            updatedIdea;
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
        </TabsContent>

        {/* History Tab - Simplified version */}
        <TabsContent value="history" className="mt-6">
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
                  Guarda tus citas con imágenes en la sección "Explorar Ideas"
                  para crear tu álbum de recuerdos.
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
