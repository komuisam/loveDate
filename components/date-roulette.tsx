"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dateIdeas } from "@/lib/date-ideas-object";
import { Book, RefreshCw, Heart, ImageIcon, Edit } from "lucide-react";
import { ContractTab } from "./ContractTab";
import { CoverTab } from "./CoverTab";
//import { Roulet } from "./Rulete";
import Roulet from "@/components/rulet";

import { CalendarTab } from "./CalendarTab";
import { History as HistoryComponent } from "./History";
import { useStore } from "@/hooks/useStore";
import { DataRoot, DateType } from "@/app/types/types";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Browse } from "./book";

export function DateRoulette() {
  const [spinComplete, onSpinCompleteLocal] = useState<number | null>(null); // Keep local for animation or temporary state
  const [loading, setLoading] = useState(false);

  const {
    dataPage,
    setDataPage,
    updateDataPage,
    coverColor,
    setCoverColor,
    savedDates,
    setLastSection
  } = useStore();

  const onSpinComplete = (number: number | null) => {
    onSpinCompleteLocal(number);
    if (number !== null) {
      selectIdeaToEdit(number);
      // Wait a bit for the user to see the result on the wheel or immediately go
      // Currently the original code showed a card.
      // Let's keep the card logic but change the button in the card to go to Calendar
      // Or per user request "guarde una section de calendario", maybe auto navigate
    }
  };

  // const [activeTab, setActiveTab] = useState(dataPage?.lastseccion || "cover"); // Removed local state using store now


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
      content: (
        <Browse
          coverColor={coverColor}
          dataPage={dataPage}
          setDataPage={setDataPage}
          totalPage={Object.keys(dateIdeas).length}
        />
      ),
    },
    calendar: {
      label: "Agendar",
      content: <CalendarTab />,
    },
    history: {
      label: "Recuerdos",
      content: <HistoryComponent />,
    },
  };

  /* Safe page status and localStorage effects removed (handled by store) */
  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    selectIdeaToEdit(spinComplete as number);
  }, [spinComplete]);

  /* Removed local savedDates */

  function selectIdeaToEdit(ideaIndex: number) {
    if (!ideaIndex) {
      return;
    }
    const idea = dateIdeas[ideaIndex];
    const existingSaved = savedDates.find((d) => d.id === ideaIndex);
    let selected: DateType | null = null;
    if (existingSaved) {
      selected = existingSaved;
    } else {
      selected = {
        id: ideaIndex,
        ...dateIdeas[ideaIndex],
      };
    }

    setDataPage({ ...dataPage, targetDate: selected });
    setSelectedIdea(selected);
    console.log({ selected });
  }

  return (
    <>
      {loading && (
        <div className="container mx-auto py-2 px-4">
          <Tabs
            value={dataPage.lastseccion || "cover"}
            onValueChange={setLastSection}
            className="w-full mx-auto"
          >
            <TabsList
              className={`h-fit p-1 flex flex-row w-full bg-pink-100/50 backdrop-blur-sm border border-pink-200 rounded-lg shadow-sm`}
            >
              {Object.entries(sections).map(
                ([key, section]: [key: any, section: any], i) => {
                  return (
                    <TabsTrigger
                      key={i + key + "tablist"}
                      value={key}
                      className="text-xl text-center flex-1 mx-1 data-[state=active]:bg-white data-[state=active]:text-pink-600 text-gray-600 hover:bg-white/50 transition-all duration-200"
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
                    className=" mt-6"
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
                <h3 className="text-xl font-bold mb-2">
                  #{selectedIdea?.id} Tu cita:{" "}
                </h3>
                <p className="text-lg">{selectedIdea?.title}</p>
                <div className="mt-4 flex justify-center">
                  <Button
                    className="px-6 py-2"
                    style={{
                      backgroundColor: coverColor,
                      borderColor: coverColor,
                    }}
                    onClick={() => {
                      setLastSection("calendar");
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
