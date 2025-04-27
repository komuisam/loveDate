"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, Edit, Check } from "lucide-react";
export function ContractTab({ coverColor = "red" }: { coverColor: string }) {
  const [person1, setPerson1] = useState("");
  const [person2, setPerson2] = useState("");

  useEffect(() => {
    // Cargar nombres de contacto
    const savedPerson1 = localStorage.getItem("person1");
    const savedPerson2 = localStorage.getItem("person2");
    if (savedPerson1) setPerson1(savedPerson1);
    if (savedPerson2) setPerson2(savedPerson2);
  }, []);

  useEffect(() => {
    localStorage.setItem("person1", person1);
  }, [person1]);

  useEffect(() => {
    localStorage.setItem("person2", person2);
  }, [person2]);

  return (
    <div
      className="relative md:aspect-[4/2] aspect-[3/4] w-full    mx-auto rounded-lg shadow-lg "
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
                value={person1}
                onChange={(e) => setPerson1(e.target.value)}
                placeholder="Tu nombre"
                className="border-gray-300  w-36 md:w-44 mx-auto text-center"
              />

              <div className="border-t border-gray-300 w-36 md:w-44 mx-auto pt-1">
                <p className="text-xs text-gray-500">{person1 || "Firma"}</p>
              </div>
            </div>
            <div className="text-center">
              <Input
                id="person2"
                value={person2}
                onChange={(e) => setPerson2(e.target.value)}
                placeholder="Tu pareja"
                className="border-gray-300  w-36 md:w-44 mx-auto text-center"
              />
              <div className="border-t border-gray-300 w-36 md:w-44 mx-auto pt-1">
                <p className="text-xs text-gray-500">{person2 || "Firma"}</p>
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
