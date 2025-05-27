"use client";
import { Heart, Edit, Check } from "lucide-react";
import { dateIdeas } from "@/lib/date-ideas";
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

import { cn } from "@/lib/utils";
import Roulette from "./Rulete2";
import { DateType } from "@/app/types/types";

export function Roulet({ coverColor = "red" }: { coverColor: string }) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  /* date */

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<DateType | null>(null);
  const [savedDates, setSavedDates] = useState<DateType[]>([]);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  /* end date */

  const handleSpinClick = () => {
    if (selectedIdea) {
      setSelectedIdea(null);
    }
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);

      setMustSpin(true);
    }
  };

  const data = Array.from({ length: dateIdeas.length }, (_, i) => {
    console.log(dateIdeas[i]);
    const backgroundColor = i % 2 === 0 ? coverColor : "#ffffff";
    const textColor = i % 2 === 0 ? "white" : "black";
    return {
      option: /* dateIdeas[i].slice(0, 6), */ String(i + 1),
      style: { backgroundColor, textColor },
    };
  });

  const selectIdeaToEdit = (ideaIndex: number) => {
    const idea = data[ideaIndex];

    const existingSaved = savedDates.find((d) => d.id === ideaIndex);
    console.log({ idea, ideaIndex, existingSaved });
    if (existingSaved) {
      setSelectedIdea(existingSaved);
      setSelectedTime(existingSaved.date);
      setNotes(existingSaved.notes);
    } else {
      setSelectedIdea({
        title: dateIdeas[ideaIndex],
        id: ideaIndex,
        idea: idea.option,
        imageUrl: null,
        date: null,
        notes: "",
        ...idea,
      });
      setSelectedTime(null);
      setNotes("");
    }
  };

  return (
    <div
      className="flex  flex-col relative md:aspect-[4/2] aspect-[3/4] w-full    mx-auto rounded-lg shadow-lg "
      style={{ backgroundColor: "white", border: "solid 8px " + coverColor }}
    >
      <div className="text-center w-full">
        <h2 className="text-2xl font-bold" style={{ color: coverColor }}>
          Gira y disfruta de las Citas
        </h2>
      </div>
      <div
        className="flex justify-center  relative w-full mx-auto"
        style={{
          height: "80vh",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000, // Opcional: asegura que quede por encima de otros elementos
            padding: "24px", // Opcional: espacio interno
          }}
          className="flex flex-col justify-center items-center"
        >
          <div
            style={{
              width: 300,
              height: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Wheel
              key={"roulet"}
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}
              innerRadius={2}
              innerBorderColor={"black"}
              innerBorderWidth={5}
              radiusLineColor={"#f7d292"}
              radiusLineWidth={2}
              backgroundColors={["#3e3e3e", "#df3428", "#df3c28"]}
              textDistance={90}
              textColors={["#fff"]}
              pointerProps={{
                src: "/hear.svg",
                style: {
                  rotate: "46deg",
                  transform: "translateX(-5px) translateY(30px)",
                },
              }}
              onStopSpinning={() => {
                setMustSpin(false);
                selectIdeaToEdit(prizeNumber);
                /* console.log({ selectedDate }); */
              }}
            />
            <button
              onClick={handleSpinClick}
              disabled={mustSpin}
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-2 border-blue-300 absolute z-[1001] "
              style={{
                backgroundColor: coverColor,
              }}
            >
              {mustSpin
                ? "Girando..."
                : prizeNumber == 0
                ? "Girar Ruleta"
                : prizeNumber + 1}
            </button>
          </div>
        </div>
        {selectedIdea !== null && (
          <Card className="w-full py-2 m-2 h-fit z-[1000]">
            <CardContent>
              <h3 className="text-xl font-bold mb-2">Tu idea de cita:</h3>
              <p className="text-lg">{selectedIdea.title}</p>

              <div className="mt-2">
                <Button
                  onClick={() => selectIdeaToEdit(prizeNumber)}
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
  );
}
