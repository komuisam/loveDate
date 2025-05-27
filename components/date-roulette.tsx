"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dateIdeas } from "@/lib/date-ideas";
import { Book, RefreshCw, Heart, ImageIcon, Edit } from "lucide-react";

import { ContractTab } from "./ContractTab";
import { CoverTab } from "./CoverTab";
//import { Roulet } from "./Rulete";
import Roulet from "@/components/rulet";
import { Browse } from "./Browse";
import { History } from "./History";
import { DataRoot, DateType } from "@/app/types/types";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export function DateRoulette() {
  const [spinComplete, onSpinComplete] = useState<number | null>(null);
  const [coverColor, setCoverColor] = useState("#f43f5e"); // rose-500
  const [loading, setLoading] = useState(false); // rose-500

  const [dataPage, setDataPage] = useState<DataRoot>({
    Dates: [],
    person1: "",
    person2: "",
    lastseccion: "",
  });

  const [activeTab, setActiveTab] = useState(dataPage?.lastseccion || "cover");

  const [selectedIdea, setSelectedIdea] = useState<DateType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sections = {
    cover: {
      label: "Portada",
      content: (
        <CoverTab coverColor={coverColor} setCoverColor={setCoverColor} />
      ),
    },
    contract: {
      label: "Contrato",
      content: (
        <ContractTab
          coverColor={coverColor}
          dataPage={dataPage}
          setDataPage={setDataPage}
        />
      ),
    },
    roulette: {
      label: "Ruleta",
      content: (
        <Roulet
          coverColor={coverColor}
          onSpinComplete={onSpinComplete}
          totalNumbers={50}
          spinDuration={5}
          extraRotations={5}
        />
      ),
    },
    browse: {
      label: "Explorar Ideas",
      content: <Browse />,
    },
    history: {
      label: "Recuerdos",
      content: <History coverColor={coverColor} />,
    },
  };

  function safePageStatus() {
    const dataPageSaved = localStorage.getItem("dataPage");
    if (dataPageSaved) {
      try {
        const parsed = JSON.parse(dataPageSaved);
        setDataPage(parsed);
      } catch (e) {
        console.error("Error al obtener valores guardada: ", e);
      }
    }
  }

  // Load saved dates from localStorage on initial render
  useEffect(() => {
    safePageStatus();
    setLoading(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("dataPage", JSON.stringify(dataPage));
  }, [dataPage]);

  useEffect(() => {
    selectIdeaToEdit(spinComplete as number);
  }, [spinComplete]);

  const [savedDates, setSavedDates] = useState<DateType[]>([]);

  function selectIdeaToEdit(ideaIndex: number) {
    const idea = dateIdeas[ideaIndex];
    const existingSaved = savedDates.find((d) => d.id === ideaIndex);
    let selected = null;
    if (existingSaved) {
      selected = existingSaved;
    } else {
      selected = {
        title: dateIdeas[ideaIndex],
        id: ideaIndex,
        idea: idea,
        imageUrl: null,
        date: null,
        notes: "",
      };
    }

    setDataPage({ ...dataPage, targetDate: selected });
    setSelectedIdea(selected);
    console.log({ selected });
  }
  console.log({ dataPage });
  return (
    <>
      {loading && (
        <div className="container mx-auto py-2 px-4 ">
          <Tabs
            value={activeTab} // Controlado por estado
            onValueChange={setActiveTab}
            defaultValue={
              dataPage?.lastseccion ? dataPage.lastseccion : "cover"
            }
            className="w-full max-w-4xl mx-auto "
          >
            <TabsList className="p-0 grid w-full grid-cols-5 border-2 border-red-950 ">
              {Object.entries(sections).map(
                ([key, section]: [key: any, section: any], i) => {
                  return (
                    <TabsTrigger
                      onClick={() => {
                        setDataPage({ ...dataPage, lastseccion: key });
                      }}
                      key={i + key + "tablist"}
                      value={key}
                      className="text-center items-center justify-center"
                    >
                      {section.label}
                    </TabsTrigger>
                  );
                }
              )}
            </TabsList>

            {Object.entries(sections).map(
              ([key, section]: [key: any, section: any], i) => {
                return (
                  <TabsContent
                    key={i + key + "section"}
                    value={key}
                    className="mt-6"
                  >
                    {section.content}
                  </TabsContent>
                );
              }
            )}
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
                  const updatedDates = [...dataPage.Dates];
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

                  setSelectedIdea(null);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />
          {spinComplete !== null && dataPage.lastseccion == "roulette" && (
            <Card
              className={`fixed inset-0 max-w-md py-2 h-fit z-[1000] `}
              style={{
                transform: "translate(-50%, -50%)",
                top: "20%",
                left: "50%",
                borderRadius: "16px",
                border: `${coverColor} 4px solid`,
              }}
            >
              <CardContent>
                <h3 className="text-xl font-bold mb-2">Tu idea de cita:</h3>
                <p className="text-lg">{selectedIdea?.title}</p>
                <div className="mt-4 flex justify-center">
                  <Button
                    className="px-6 py-2"
                    style={{
                      backgroundColor: coverColor,
                      borderColor: coverColor,
                    }}
                    onClick={() => {
                      setActiveTab("browse");
                      setDataPage({ ...dataPage, lastseccion: "browse" });
                    }}
                  >
                    Guardar esta idea
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
