import { useRef, useState, forwardRef } from "react";
import HTMLFlipBook from "react-pageflip";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DataRoot } from "@/app/types/types";

import {
  Search,
  Calendar,
  ImageIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CustomCalendar } from "@/components/CustomCalendar";
import { TimePickerDemo } from "@/components/time-picker";
import { useStore } from "@/hooks/useStore";


interface PageProps {
  number?: number;
  children?: React.ReactNode;
  coverColor: string;
  totalPage: number;
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
  const { savedDates, addSavedDate, updateSavedDate } = useStore();
  const savedIndex = savedDates.findIndex((d) => d.id === props.number);
  const saved = savedIndex >= 0 ? savedDates[savedIndex] : null;
  const initialIdea = saved || {
    id: props.number || 0,
    title: `Idea #${props.number}`,
    idea: "paginatedIdeas[0],",
    imageUrl: null,
    date: null,
    totalPage: 1,
    notes: "",
  };

  const currentIdea = {
    ...initialIdea,
    date: initialIdea.date ? new Date(initialIdea.date) : null,
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
            Página {props.number} de {props.totalPage}
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
                <CustomCalendar
                  date={currentIdea.date || undefined}
                  setDate={(date) => {
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
                      title: currentIdea.title || `Cita #${props.number}`,
                      id: props.number || 0, // Ensure ID is number
                    };

                    if (savedIndex >= 0) {
                      updateSavedDate(updatedIdea);
                    } else {
                      addSavedDate(updatedIdea);
                    }
                  }}
                  coverColor={props.coverColor}
                  savedDates={savedDates}
                  compact={true}
                  className="bg-white border-0 shadow-none p-0"
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
                  title: currentIdea.title || `Cita #${props.number}`,
                  id: props.number || 0,
                };

                if (savedIndex >= 0) {
                  updateSavedDate(updatedIdea);
                } else {
                  addSavedDate(updatedIdea);
                }
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

export function Browse({
  dataPage,
  setDataPage,
  coverColor,
  totalPage,
}: {
  dataPage: DataRoot;
  setDataPage: (m: DataRoot) => void;
  coverColor: string;
  totalPage: number;
}) {
  const [currentIdea, setCurrentIdea] = useState(0);
  const [pageSearh, setPageSearh] = useState<number | "">(1);
  const [page, setPage] = useState(
    dataPage?.targetDate?.id ? dataPage?.targetDate?.id - 1 : 0
  );

  const flipBook = useRef<any>(null); // Tipo any porque el tipo exacto de HTMLFlipBook no está expuesto
  const [searchTerm, setSearchTerm] = useState(
    dataPage?.targetDate?.title ?? ""
  );
  const pageInputRef = useRef<HTMLInputElement>(null);

  const goToPage = (pageNumber: number) => {
    const targetPage = Math.max(0, Math.min(pageNumber - 1, totalPage - 1));
    if (flipBook.current?.pageFlip()) {
      flipBook.current.pageFlip().turnToPage(targetPage);
      console.log(flipBook.current.pageFlip().turnToPage);
    }
    setPage(targetPage);
    setPageSearh(targetPage + 1);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;

    const clampedValue = Math.max(1, Math.min(value, totalPage));
    if (value == 0) {
      setPageSearh("");
      return;
    } else {
      setPageSearh(clampedValue);
    }
  };

  const nextButtonClick = () => {
    flipBook.current?.pageFlip()?.flipNext();
  };
  console.log(` startZIndex=${dataPage?.targetDate?.id ?? 0}`);
  const prevButtonClick = () => {
    flipBook.current?.pageFlip()?.flipPrev();
  };
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      if (pageInputRef.current) {
        pageInputRef.current.value = String(page + 1);
      }
      return;
    }

    const pageNum = parseInt(value);
    if (!isNaN(pageNum)) {
      const clampedPage = Math.max(1, Math.min(pageNum, totalPage));
      goToPage(clampedPage);
      if (pageInputRef.current) {
        pageInputRef.current.value = String(clampedPage);
      }
    }
  };

  const [flipBg, setFlipBg] = useState("bg-white");

  const pageFlipColors = [
    "bg-gradient-to-r from-pink-100 via-white to-pink-200",
    "bg-gradient-to-r from-blue-100 via-white to-blue-200",
    "bg-gradient-to-r from-green-100 via-white to-green-200",
  ];

  const onPage = (e: { data: number }) => {
    setPage(e.data);
    setFlipBg(pageFlipColors[e.data % pageFlipColors.length]);
  };
  return (
    <div
      className="flex  flex-col relative max-h-[80vh]  w-full mx-auto rounded-xl shadow-lg p-3 "
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
        height={500}
        size="stretch"
        minWidth={315}
        autoSize={true}
        maxWidth={1000}
        flippingTime={1200}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.8}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={onPage}
        ref={flipBook}
        className={""}
        style={{ color: "red" }}
        startPage={page ?? 0}
        drawShadow={false}
        usePortrait={false}
        clickEventForward={false}
        useMouseEvents={false}
        swipeDistance={0}
        showPageCorners={false}
        disableFlipByClick={false}
        startZIndex={0}
      >
        {/*  <PageCover>BOOK TITLE</PageCover> */}
        {Array.from({ length: 50 }, (_, i) => (
          <Page
            currentIdea={currentIdea}
            key={i + 1}
            number={i + 1}
            coverColor={coverColor}
            totalPage={totalPage}
          ></Page>
        ))}
        {/* <PageCover>THE END</PageCover> */}
      </HTMLFlipBook>

      <div className="flex justify-center items-center py-4 bg-gray-50 rounded-b-lg shadow">
        <button
          type="button"
          onClick={prevButtonClick}
          className="px-4 py-2 mr-3 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={page === 0}
        >
          {"<"}
        </button>
        <span className="text-gray-600 font-medium">
          Página{" "}
          <input
            ref={pageInputRef}
            className={`w-12 justify-center text-center border-2 rounded-md border-black [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none`}
            type="number"
            min={1}
            max={totalPage}
            value={pageSearh}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={(e) => {
              console.log({ e });
              if (e.key === "Enter") {
                pageInputRef.current?.blur();
              }
            }}
          />{" "}
          de <span className="text-blue-600">{totalPage}</span>
        </span>
        <button
          type="button"
          onClick={nextButtonClick}
          className="px-4 py-2 ml-3 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={page + 1 === totalPage}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
