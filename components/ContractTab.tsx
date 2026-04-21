"use client";

import React, {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Heart, Edit, Check, Undo, Plus, Trash2 } from "lucide-react";
import { DataRoot } from "@/app/types/types";
import { useStore } from "@/hooks/useStore";
export function ContractTab({
  coverColor = "red",
  dataPage,
  setDataPage,
  setLastSection,
  setContractAccepted,
  contractAccepted,
}: {
  coverColor: string;
  dataPage: DataRoot;
  setDataPage: (data: DataRoot) => void;
  setLastSection: (section: string) => void;
  setContractAccepted: (accepted: boolean) => void;
  contractAccepted: boolean;
}) {
  const { commitments, setCommitments } = useStore();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [person1, setPerson1] = useState(dataPage.person1 ?? "");
  const [person2, setPerson2] = useState(dataPage.person2 ?? "");

  const handleConfirm = () => {
    if (person1 && person2) {
      setIsConfirmModalOpen(true);
    } else {
      alert("Por favor, ambos deben firmar el contrato antes de continuar.");
    }
  };

  const finalizeSealing = () => {
    setContractAccepted(true);
    setLastSection("cover");
    setIsConfirmModalOpen(false);
  };

  const handleUpdateCommitment = (index: number, value: string) => {
    const updated = [...commitments];
    updated[index] = value;
    setCommitments(updated);
  };

  const handleAddCommitment = () => {
    setCommitments([...commitments, "Nuevo compromiso"]);
  };

  const handleRemoveCommitment = (index: number) => {
    setCommitments(commitments.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setDataPage({ ...dataPage, person1, person2 });
  }, [person1, person2]);

  return (
    <div
      className="relative  min-h-[80vh] w-full    mx-auto rounded-xl shadow-lg "
      style={{
        backgroundColor: "white",
        border: `8px solid ${coverColor}`,
        fontFamily: "var(--font-dancing-script), cursive",
        fontWeight: 600,
      }}
    >
      {contractAccepted && (
        <div className="absolute top-3 left-3 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLastSection("cover")}
            className="text-white hover:bg-black/20 h-16 w-16 [&_svg]:size-10"
          >
            <Undo size={40} style={{ color: coverColor }} />
          </Button>
        </div>
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center w-4/5 m-auto">
        <div className="w-full ">
          <div className="text-center ">
            <h2 className="text-4xl font-bold" style={{ color: coverColor }}>
              Contrato de Citas
            </h2>
            <p className="text-xl text-gray-500 mt-2">
              Un compromiso para disfrutar juntos
            </p>
          </div>

          <div className=" text-center text-2xl mt-6">
            <p>Nosotros, firmamos y nos comprometemos a:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4 max-h-48 overflow-y-auto px-4">
              {commitments.map((commitment, index) => (
                <div key={index} className="flex items-center gap-2 group">
                  <span className="text-pink-400">•</span>
                  {!contractAccepted ? (
                    <div className="flex-1 flex items-center gap-1">
                      <Input
                        value={commitment}
                        onChange={(e) =>
                          handleUpdateCommitment(index, e.target.value)
                        }
                        className="border-none bg-transparent h-7 p-0 focus-visible:ring-0 text-lg md:text-xl font-[family-name:var(--font-dancing-script)]"
                        style={{
                          fontFamily: "var(--font-dancing-script), cursive",
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCommitment(index)}
                        className="h-6 w-6 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-left text-lg md:text-xl">{commitment}</p>
                  )}
                </div>
              ))}
              {!contractAccepted && (
                <Button
                  variant="ghost"
                  onClick={handleAddCommitment}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-pink-400 h-7"
                >
                  <Plus className="h-3 w-3" /> Añadir compromiso
                </Button>
              )}
            </div>
          </div>

          <div className="pt-6 flex justify-between ">
            <div className="text-center">
              <Input
                id="person1"
                defaultValue={person1}
                onBlur={(e) => setPerson1(e.target.value)}
                placeholder="Tu nombre"
                className="border-none w-36 md:w-44 mx-auto text-center text-4xl"
                style={{
                  fontFamily: "var(--font-dancing-script), cursive",
                  fontWeight: 700,
                }}
              />

              <div className="border-t border-gray-300 w-36 md:w-44 mx-auto pt-1">
                <p className="text-2xl text-gray-500">{"Firma"}</p>
              </div>
            </div>
            <div className="text-center">
              <Input
                id="person2"
                defaultValue={person2}
                onBlur={(e) => setPerson2(e.target.value)}
                placeholder="Tu pareja"
                className="border-none w-36 md:w-44 mx-auto text-center text-4xl"
                style={{
                  fontFamily: "var(--font-dancing-script), cursive",
                  fontWeight: 700,
                }}
              />
              <div className="border-t border-gray-300 w-36 md:w-44 mx-auto pt-1">
                <p className="text-2xl text-gray-500">{"Firma"}</p>
              </div>
            </div>
          </div>

          {!contractAccepted && (
            <div className="flex justify-center w-full items-center gap-2">
              <div className="text-center py-2">
                <div className="inline-flex items-center justify-center rounded-full bg-gray-100 px-4 py-1 text-md">
                  <Heart className="mr-2 h-3 w-3" style={{ color: coverColor }} />
                  <span style={{ color: coverColor }}>
                    Fecha: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <Button
                  onClick={handleConfirm}
                  style={{
                    backgroundColor: coverColor,
                    color: "white",
                  }}
                  className="px-8 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform text-2xl"
                >
                  Sellar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md border-pink-200" hideClose>
          <DialogHeader>
            <DialogTitle className="flex flex-row items-center justify-center gap-3 text-2xl font-bold text-center">
              <Heart
                className="h-8 w-8 animate-pulse shrink-0"
                style={{ color: coverColor }}
                fill={coverColor}
              />
              ¿Sellar su compromiso?
              <Heart
                className="h-8 w-8 animate-pulse shrink-0"
                style={{ color: coverColor }}
                fill={coverColor}
              />
            </DialogTitle>
            <DialogDescription className="text-center text-lg pt-4">
              Al sellar este contrato, sus promesas quedarán grabadas
              permanentemente y ya no podrán ser editadas.
              <br />
              <br />
              ¿Están listos para comenzar esta aventura juntos?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-center gap-4 sm:justify-center pt-6">
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
              className="rounded-full px-6"
            >
              Aún no
            </Button>
            <Button
              onClick={finalizeSealing}
              style={{
                backgroundColor: coverColor,
                color: "white",
              }}
              className="rounded-full px-8  hover:bg-pink-600 text-white font-bold shadow-lg transition-all"
            >
              ¡Sí, acepto!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
