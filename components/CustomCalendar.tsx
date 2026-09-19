import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, addDays, startOfMonth, startOfWeek, isSameMonth, isSameDay, isBefore, startOfToday, startOfDay, format } from "date-fns";
import { es } from "date-fns/locale";
import { DateType } from "@/app/types/types";
import { cn } from "@/lib/utils";

interface CustomCalendarProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    savedDates: DateType[];
    coverColor: string;
    compact?: boolean;
    className?: string;
}

export function CustomCalendar({
    date,
    setDate,
    savedDates,
    coverColor,
    compact = false,
    className
}: CustomCalendarProps) {
    const [fullMonth, setFullMonth] = React.useState<Date>(date || new Date());
    // Trim month to first day so startOfMonth comparisons are stable
    const month = startOfMonth(fullMonth);
    const today = startOfToday();

    const handlePreviousMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        setFullMonth((prev) => addMonths(prev, -1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        setFullMonth((prev) => addMonths(prev, 1));
    };

    const iconSizeClasses = compact ? "h-4 w-4" : "h-10 w-10";
    const navButtonClasses = compact ? "h-7 w-7" : "h-10 w-10";
    const daySizeClasses = compact ? "text-sm" : "text-lg sm:text-xl";

    // Build a 6x7 grid starting on Monday
    const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const days = Array.from({ length: 6 * 7 }, (_, i) => addDays(gridStart, i));
    const weekdays = Array.from({ length: 7 }, (_, i) =>
        format(addDays(gridStart, i), "EEEEEE", { locale: es })
    );

    return (
        <div className={cn("relative flex flex-col items-center justify-center w-full", className)}>
            <div className="w-full flex justify-between items-center px-8 mb-4">
                <Button
                    variant="ghost"
                    className={cn("z-10 hover:bg-transparent p-2", navButtonClasses)}
                    onClick={handlePreviousMonth}
                >
                    <ChevronLeft className={cn("text-gray-400", iconSizeClasses)} />
                </Button>
                <span className={cn(
                    "font-serif font-medium capitalize",
                    compact ? "text-base" : "text-xl"
                )}>
                    {format(month, "MMMM yyyy", { locale: es })}
                </span>
                <Button
                    variant="ghost"
                    className={cn("z-10 hover:bg-transparent p-2", navButtonClasses)}
                    onClick={handleNextMonth}
                >
                    <ChevronRight className={cn("text-gray-400", iconSizeClasses)} />
                </Button>
            </div>

            <div className="w-full max-w-[420px] grid grid-cols-7 gap-1 sm:gap-2">
                {weekdays.map((wd, i) => (
                    <div
                        key={i}
                        className="text-center text-muted-foreground font-normal text-[0.8rem] uppercase"
                    >
                        {wd}
                    </div>
                ))}

                {days.map((day, i) => {
                    const isDisabled = isBefore(day, today);
                    const isOutside = !isSameMonth(day, month);
                    const isBooked = savedDates.some((d) => {
                        if (!d.date) return false;
                        return startOfDay(new Date(d.date)).getTime() === day.getTime();
                    });
                    const isSelected = !!date && startOfDay(date).getTime() === day.getTime();

                    return (
                        <button
                            key={i}
                            type="button"
                            aria-label={format(day, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                            onClick={() => {
                                if (isDisabled) return;
                                setDate(day);
                                if (isOutside) setFullMonth(startOfMonth(day));
                            }}
                            disabled={isDisabled}
                            className={cn(
                                "aspect-square rounded-full flex items-center justify-center w-full transition-colors text-center",
                                daySizeClasses,
                                isDisabled && "opacity-40 cursor-not-allowed",
                                isOutside && "opacity-30",
                                !isDisabled && !isBooked && "hover:bg-gray-100",
                                isSelected && "bg-gray-300 text-black",
                                isBooked && !isSelected && "bg-[#fca5a5]"
                            )}
                            style={
                                isSelected
                                    ? { color: "black", backgroundColor: "#d1d5db" }
                                    : isBooked
                                        ? { color: "black", backgroundColor: "#fca5a5" }
                                        : undefined
                            }
                        >
                            {format(day, "d", { locale: es })}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}