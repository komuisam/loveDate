"use client";

import { useEffect, useState, useRef } from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface TimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function TimePickerDemo({ date, setDate }: TimePickerProps) {
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const [hour, setHour] = useState(
    date ? date.getHours().toString().padStart(2, "0") : "12"
  );
  const [minute, setMinute] = useState(
    date ? date.getMinutes().toString().padStart(2, "0") : "00"
  );

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setHour("");
      return;
    }

    const numericValue = Number.parseInt(value.replace(/[^0-9]/g, ""));
    if (isNaN(numericValue)) return;

    if (numericValue >= 0 && numericValue <= 23) {
      setHour(numericValue.toString().padStart(2, "0"));
      if (value.length >= 2) {
        minuteRef.current?.focus();
      }
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setMinute("");
      return;
    }

    const numericValue = Number.parseInt(value.replace(/[^0-9]/g, ""));
    if (isNaN(numericValue)) return;

    if (numericValue >= 0 && numericValue <= 59) {
      setMinute(numericValue.toString().padStart(2, "0"));
    }
  };

  const handleTimeChange = () => {
    const newDate = new Date(date);
    newDate.setHours(Number.parseInt(hour));
    newDate.setMinutes(Number.parseInt(minute));
    setDate(newDate);
  };

  useEffect(() => {
    if (date) {
      setHour(date.getHours().toString().padStart(2, "0"));
      setMinute(date.getMinutes().toString().padStart(2, "0"));
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[120px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {format(date, "p")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <div className="grid gap-1 text-center">
              <Label htmlFor="hours" className="text-xs">
                Horas
              </Label>
              <Input
                ref={hourRef}
                id="hours"
                className="w-16 text-center"
                value={hour}
                onChange={handleHourChange}
                maxLength={2}
              />
            </div>
            <div className="text-xl mb-1">:</div>
            <div className="grid gap-1 text-center">
              <Label htmlFor="minutes" className="text-xs">
                Minutos
              </Label>
              <Input
                ref={minuteRef}
                id="minutes"
                className="w-16 text-center"
                value={minute}
                onChange={handleMinuteChange}
                maxLength={2}
              />
            </div>
          </div>
          <Button onClick={handleTimeChange}>Aceptar</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
