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
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Edit } from "lucide-react";

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

type SavedDate = {
  id: number;
  idea: string;
  imageUrl: string | null;
  date: Date | null;
  notes: string;
};

export function Roulet({ coverColor = "red" }: { coverColor: string }) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  return (
    <>
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
        onStopSpinning={() => {
          console.log(prizeNumber + 1);
          setMustSpin(false);
        }}
      />
      <Button
        onClick={handleSpinClick}
        disabled={mustSpin}
        className="flex-1"
        style={{
          backgroundColor: coverColor,
          borderColor: coverColor,
        }}
      >
        <RefreshCw className={cn("mr-2 h-4 w-4", mustSpin && "animate-spin")} />
        {mustSpin ? "Girando..." : "Girar Ruleta"}
      </Button>

      {/* <Button
          variant="outline"
          onClick={resetWheel}
          disabled={mustSpin || selectedDate === null}
          className="flex-1"
        >
          Reiniciar
        </Button> */}
    </>
  );
}
/* 
export function Roulet({ coverColor = "red" }: { coverColor: string }) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [savedDates, setSavedDates] = useState<SavedDate[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<SavedDate | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
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
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center">
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
              disabled={mustSpin}
              className="flex-1"
              style={{
                backgroundColor: coverColor,
                borderColor: coverColor,
              }}
            >
              <RefreshCw
                className={cn("mr-2 h-4 w-4", mustSpin && "animate-spin")}
              />
              {mustSpin ? "Girando..." : "Girar Ruleta"}
            </Button>

            <Button
              variant="outline"
              onClick={resetWheel}
              disabled={mustSpin || selectedDate === null}
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
        Los números en la ruleta (1-20) representan diferentes ideas de citas
      </div>
    </div>
  );
}
 */
