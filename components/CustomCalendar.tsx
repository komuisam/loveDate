import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths } from "date-fns";
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
    const [month, setMonth] = React.useState<Date>(date || new Date());

    // Sync month if date changes externally and is far away? 
    // Usually better not to force jump unless explicitly requested, 
    // but initializing state with date is good.

    const handlePreviousMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        setMonth((prev) => addMonths(prev, -1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.preventDefault();
        setMonth((prev) => addMonths(prev, 1));
    };

    // Sizing classes
    const daySizeClasses = compact
        ? "h-9 w-9 text-sm p-0"
        : "h-16 w-16 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-lg sm:text-xl p-0";

    const iconSizeClasses = compact
        ? "h-4 w-4"
        : "h-10 w-10";

    const navButtonClasses = compact
        ? "h-7 w-7"
        : "h-10 w-10"; // Although buttons are external now

    const monthTitleClasses = compact
        ? "text-sm font-medium"
        : "text-2xl"; // Adjust if needed, but Calendar component handles title size mostly via classNames.month

    return (
        <div className={cn("relative flex items-center justify-center w-full", className)}>
            <Button
                variant="ghost"
                className={cn("absolute left-0 z-10 hover:bg-transparent", navButtonClasses)}
                onClick={handlePreviousMonth}
            >
                <ChevronLeft className={cn("text-gray-400", iconSizeClasses)} />
            </Button>

            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                month={month}
                onMonthChange={setMonth}
                locale={es}
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className="rounded-md border shadow-sm p-4 w-full flex justify-center bg-white"
                modifiers={{
                    booked: (date) => savedDates.some((d) => {
                        if (!d.date) return false;
                        const savedWithTime = new Date(d.date);
                        return savedWithTime.toDateString() === date.toDateString();
                    }),
                }}
                modifiersStyles={{
                    booked: {
                        fontWeight: "bold",
                        textDecoration: "underline",
                        textDecorationColor: coverColor,
                        color: coverColor,
                        backgroundColor: "#fca5a5",
                    }
                }}
                classNames={{
                    nav: "hidden", // Hide internal navigation
                    month: cn("space-y-4 w-full", compact ? "text-base" : "text-2xl"),
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex w-full justify-between mb-2",
                    row: "flex w-full justify-between",
                    // Dynamic day classes
                    day: cn(
                        "text-center font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-full",
                        daySizeClasses
                    ),
                    selected: "bg-gray-300 text-gray-900 hover:bg-gray-300 focus:bg-gray-300 opacity-100",
                    disabled: "bg-gray-200 opacity-50 cursor-not-allowed hover:bg-gray-200 decoration-slate-500",
                    cell: cn(
                        "flex items-center justify-center text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        compact ? "h-9 w-9" : "h-16 w-16 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
                    ),
                    head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                }}
                components={{
                    DayButton: (props: any) => {
                        const { day, modifiers, ...rest } = props;
                        const dateValue = day.date; // day is CalendarDay in v9

                        return (
                            <button {...rest}>
                                <div className="relative w-full h-full flex items-center justify-center">
                                    {dateValue.getDate()}
                                </div>
                            </button>
                        )
                    }
                }}
            />

            <Button
                variant="ghost"
                className={cn("absolute right-0 z-10 hover:bg-transparent", navButtonClasses)}
                onClick={handleNextMonth}
            >
                <ChevronRight className={cn("text-gray-400", iconSizeClasses)} />
            </Button>
        </div>
    );
}
