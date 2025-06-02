import { useRef, useState, forwardRef } from "react";
import HTMLFlipBook from "react-pageflip";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DataRoot, DateType } from "@/app/types/types";
/* xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx */
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

/* ssssssssssssssssssssssssssss */
interface PageProps {
  number?: number;
  children?: React.ReactNode;
  coverColor: string;
  TotalPage: string;
  currentIdea: any;
}

const PageCover = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard">
      <div className="page-content">
        <h2>{props.children}</h2>
      </div>
    </div>
  );
});

const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  const [savedDates, setSavedDates] = useState<DateType[]>([]);
  const savedIndex = savedDates.findIndex((d) => d.id === props.number);
  const saved = savedIndex >= 0 ? savedDates[savedIndex] : null;
  const currentIdea = saved || {
    id: props.number,
    idea: "paginatedIdeas[0],",
    imageUrl: null,
    date: null,
    notes: "",
  };

  return (
    <div
      className="p-5 bg-[#fdfaf7] text-[#785e3a] border border-[#c2b5a3] overflow-hidden absolute"
      ref={ref}
    >
      <div className="page-content">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-500">Idea #{props.number}</div>
          <div className="text-xs text-gray-400">
            Página {props.number} de {40}
          </div>
        </div>
        <h3
          className="text-xl font-bold mb-3"
          style={{ color: props.coverColor }}
        >
          Page header - {props.number}
        </h3>

        {/* Image section */}
        <div className="mb-3">
          {props.currentIdea.imageUrl ? (
            <div className="relative w-full h-32 rounded overflow-hidden">
              <img
                src={props.currentIdea.imageUrl || "/placeholder.svg"}
                alt={props.currentIdea.idea}
                className="w-full h-full object-cover"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  const updatedIdea = {
                    ...props.currentIdea,
                    imageUrl: null,
                  };
                  /*    const updatedDates = [...savedDates];
                  if (savedIndex >= 0) {
                    updatedDates[savedIndex] = updatedIdea;
                  } else {
                    updatedDates.push(updatedIdea);
                  }
                  setSavedDates(updatedDates); */
                }}
              >
                Eliminar
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-32">
              <Button
                variant="ghost"
                onClick={(e) => {
                  // Set the selected idea for the file input
                  //fileInputRef.current?.click();
                }}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Subir imagen
              </Button>
            </div>
          )}
        </div>
        {/* fin imagen section */}

        {/* Date and time section */}
        <div className="mb-3">
          <Label className="text-sm mb-1 block">Fecha y Hora</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-xs",
                    !currentIdea.date && "text-muted-foreground"
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
                      newDate.setHours(currentIdea.date.getHours());
                      newDate.setMinutes(currentIdea.date.getMinutes());
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
                  //...currentIdea,
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
          <Label className="text-sm mb-1 block">Notas</Label>
          <Textarea
            value={currentIdea.notes}
            onChange={(e) => {
              const updatedIdea = {
                ...currentIdea,
                notes: e.target.value,
              };
              const updatedDates = [...savedDates];
              /*  if (savedIndex >= 0) {
                updatedDates[savedIndex] = updatedIdea;
              } else {
                updatedDates.push(updatedIdea);
              }
              setSavedDates(updatedDates); */
            }}
            placeholder="Escribe tus notas sobre esta cita..."
            className="text-sm"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
});

export function Browse2({
  dataPage,
  setDataPage,
  coverColor,
}: {
  dataPage: DataRoot;
  setDataPage: (m: DataRoot) => void;
  coverColor: string;
}) {
  const [currentIdea, setCurrentIdea] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const flipBook = useRef<any>(null); // Tipo any porque el tipo exacto de HTMLFlipBook no está expuesto
  const [searchTerm, setSearchTerm] = useState(
    dataPage?.targetDate?.title ?? ""
  );
  const nextButtonClick = () => {
    flipBook.current?.pageFlip()?.flipNext();
  };

  const prevButtonClick = () => {
    flipBook.current?.pageFlip()?.flipPrev();
  };

  const [flipBg, setFlipBg] = useState("bg-white");

  const pageFlipColors = [
    "bg-gradient-to-r from-pink-100 via-white to-pink-200",
    "bg-gradient-to-r from-blue-100 via-white to-blue-200",
    "bg-gradient-to-r from-green-100 via-white to-green-200",
    // ...etc
  ];

  const onPage = (e: { data: number }) => {
    setPage(e.data);
    setFlipBg(pageFlipColors[e.data % pageFlipColors.length]);
  };
  return (
    <div
      className="flex  flex-col relative md:aspect-[4/3]  aspect-[3/3] w-full mx-auto rounded-xl shadow-lg p-3 "
      style={{
        backgroundColor: "white",
        border: `8px solid ${coverColor}`,
      }}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ideas de citas..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          onBlur={() => {
            console.log("dejo de pulsar");
            //setDataPage()
          }}
          className="pl-10"
        />
      </div>
      <HTMLFlipBook
        width={550}
        height={733}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        flippingTime={1200}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.8}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={onPage}
        ref={flipBook}
      >
        {/*  <PageCover>BOOK TITLE</PageCover> */}
        {Array.from({ length: 40 }, (_, i) => (
          <Page
            currentIdea={currentIdea}
            key={i + 1}
            number={i + 1}
            coverColor={coverColor}
            TotalPage={"" + 40}
          >
            Lorem ipsum...
          </Page>
        ))}
        {/* <PageCover>THE END</PageCover> */}
      </HTMLFlipBook>

      <div className="container">
        <div>
          <button type="button" onClick={prevButtonClick}>
            Previous page
          </button>
          [<span>{page}</span> of <span>{totalPage}</span>]
          <button type="button" onClick={nextButtonClick}>
            Next page
          </button>
        </div>
      </div>
    </div>
  );
}
