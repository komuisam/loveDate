import { useRef, useState, forwardRef, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DataRoot, DateType } from "@/app/types/types";
import { Search, Calendar, ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { dateIdeas } from "@/lib/date-ideas-object";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { TimePickerDemo } from "@/components/time-picker";

/* const PageCover = forwardRef<HTMLDivElement, DateType>((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard">
      <div className="page-content">
        <h2>{props.children}</h2>
      </div>
    </div>
  );
}); */

const Page = forwardRef<HTMLDivElement, DateType>((props, ref) => {
  const [savedDates, setSavedDates] = useState<
    (DateType & { totalpage: number; coverColor: string })[]
  >([]);
  /*  const savedIndex = savedDates.findIndex((d) => d.id === props.id);
  const saved = savedIndex >= 0 ? savedDates[savedIndex] : null; */
  const { id, imageUrl, date, notes, title, totalpage, coverColor } = props;

  return (
    <div
      className="p-5 bg-[#fdfaf7] text-[#785e3a] border border-[#c2b5a3] overflow-hidden absolute"
      ref={ref}
    >
      <div className="page-content">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-500">Idea #{id}</div>
          <div className="text-xs text-gray-400">
            Página {id} de {totalpage}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-3" style={{ color: coverColor }}>
          Titulo: {title ?? "Por defecto"}
        </h3>

        <div className="mb-3">
          {imageUrl ? (
            <div className="relative w-full h-32 rounded overflow-hidden">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-cover"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  /*  const updatedIdea = {
                    ...props.currentIdea,
                    imageUrl: null,
                  }; */
                }}
              >
                Eliminar
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-32">
              <Button variant="ghost">
                <ImageIcon className="mr-2 h-4 w-4" />
                Subir imagen
              </Button>
            </div>
          )}
        </div>

        <div className="mb-3">
          <Label className="text-sm mb-1 block">Fecha y Hora</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-xs",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-3 w-3" />
                  {date
                    ? format(date, "PPP", {
                        locale: es,
                      })
                    : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={date || undefined}
                  onSelect={(date) => {
                    if (!date) return;
                    let newDate = date;
                    if (date) {
                      newDate = new Date(date);
                      newDate.setHours(date.getHours());
                      newDate.setMinutes(date.getMinutes());
                    }

                    const updatedIdea = {
                      // ...currentIdea,
                      date: newDate,
                    };
                    const updatedDates = [...savedDates];
                    /*  if (savedIndex >= 0) {
                      updatedDates[savedIndex] = updatedIdea;
                    } else {
                      updatedDates.push(updatedIdea);
                    } */
                    setSavedDates(updatedDates);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <TimePickerDemo
              setDate={(time) => {
                let newDate = time;
                if (date) {
                  newDate = new Date(date);
                  newDate.setHours(time.getHours());
                  newDate.setMinutes(time.getMinutes());
                }

                const updatedIdea = {
                  date: newDate,
                };
                const updatedDates = [...savedDates];
                /*  if (savedIndex >= 0) {
                  updatedDates[savedIndex] = updatedIdea;
                } else {
                  updatedDates.push(updatedIdea);
                } */
                setSavedDates(updatedDates);
              }}
              date={date || new Date()}
            />
          </div>
        </div>

        <div className="mb-3">
          <Label className="text-sm mb-1 block">Notas</Label>
          <Textarea
            value={notes}
            onChange={(e) => {
              e.stopPropagation();
              /*  const updatedIdea = {
                ...currentIdea,
                notes: e.target.value,
              }; */
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
  totalPage = dateIdeas.length,
}: {
  dataPage: DataRoot;
  setDataPage: (m: DataRoot) => void;
  coverColor: string;
  totalPage: number;
}) {
  const [pageSearh, setPageSearh] = useState<number | "">(1);
  const [currentIdea, setCurrentIdea] = useState(0);
  const [page, setPage] = useState(0);
  const flipBook = useRef<any>(null);
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

  const prevButtonClick = () => {
    flipBook.current?.pageFlip()?.flipPrev();
  };

  const onPage = (e: { data: number }) => {
    setPage(e.data);
    setPageSearh(e.data + 1);
  };

  return (
    <div
      className="justify-between flex  min-w-[385px] max-h-[80vh] min-h-[80vh] md:min-h-[70vh] flex-col relative md:aspect-[4/3] aspect-auto w-full mx-auto rounded-xl shadow-lg sm:p-3 py-3"
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
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <HTMLFlipBook
        width={550}
        style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
        height={650}
        size="stretch"
        minWidth={315}
        maxWidth={800}
        flippingTime={1200}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.8}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={onPage}
        ref={flipBook}
        className={"bg-[#f8f9fa] rounded-sm"}
        startPage={page}
        drawShadow={true}
        usePortrait={true}
        startZIndex={0}
        autoSize={true}
        clickEventForward={true}
        useMouseEvents={false}
        swipeDistance={0}
        showPageCorners={true}
        disableFlipByClick={false}
      >
        {Array.from({ ...dateIdeas, length: totalPage }, (value, i) => {
          return (
            <Page
              title={value.title}
              id={i + 1}
              imageUrl={value.imageUrl}
              date={value.date}
              notes={value.notes}
              key={i + 1}
              coverColor={coverColor}
            >
              Lorem ipsum...
            </Page>
          );
        })}
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
