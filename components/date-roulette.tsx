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
