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
import { Heart, Edit, Check } from "lucide-react";
import { DataRoot } from "@/app/types/types";
export function ContractTab({
  coverColor = "red",
  dataPage,
  setDataPage,
}: {
  coverColor: string;
  dataPage: DataRoot;
  setDataPage: Dispatch<SetStateAction<DataRoot>>;
}) {
  const [person1, setPerson1] = useState(dataPage.person1 ?? "");
  const [person2, setPerson2] = useState(dataPage.person2 ?? "");

  useEffect(() => {
    setDataPage({ ...dataPage, person1, person2 });
  }, [person1, person2]);

  return (
    <div
      className="relative md:aspect-[4/2] aspect-[3/4] w-full    mx-auto rounded-xl shadow-lg "
      style={{
        backgroundColor: "white",
        border: `8px solid ${coverColor}`,
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center w-4/5 m-auto">
        <div className="w-full ">
          <div className="text-center ">
            <h2 className="text-2xl font-bold" style={{ color: coverColor }}>
              Contrato de Citas
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Un compromiso para disfrutar juntos
            </p>
          </div>

          <div className=" text-center text-sm">
            <p>Nosotros, firmamos y nos comprometemos a:</p>
            <ul className="text-left list-disc pl-5 mt-2 space-y-1">
              <li>Hacer tiempo para disfrutar juntos</li>
              <li>Ser espontáneos y abiertos a nuevas experiencias</li>
              <li>Crear recuerdos inolvidables</li>
              <li>Priorizar nuestro tiempo juntos</li>
              <li>Divertirnos y reír mucho</li>
            </ul>
          </div>

          <div className="pt-6 flex justify-between">
            <div className="text-center">
              <Input
                id="person1"
                defaultValue={person1}
                onBlur={(e) => setPerson1(e.target.value)}
                placeholder="Tu nombre"
                className="border-gray-300  w-36 md:w-44 mx-auto text-center"
              />

              <div className="border-t border-gray-300 w-36 md:w-44 mx-auto pt-1">
                <p className="text-xs text-gray-500">{"Firma"}</p>
              </div>
            </div>
            <div className="text-center">
              <Input
                id="person2"
                defaultValue={person2}
                onBlur={(e) => setPerson2(e.target.value)}
                placeholder="Tu pareja"
                className="border-gray-300  w-36 md:w-44 mx-auto text-center"
              />
              <div className="border-t border-gray-300 w-36 md:w-44 mx-auto pt-1">
                <p className="text-xs text-gray-500">{"Firma"}</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <div className="inline-flex items-center justify-center rounded-full bg-gray-100 px-4 py-1 text-xs">
              <Heart className="mr-2 h-3 w-3" style={{ color: coverColor }} />
              <span style={{ color: coverColor }}>
                Fecha: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
