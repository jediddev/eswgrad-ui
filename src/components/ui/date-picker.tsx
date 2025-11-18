"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
    value?: Date;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    className?: string;
    fromYear?: number;
    toYear?: number;
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Pick a date",
    className,
    fromYear,
    toYear,
}: DatePickerProps) {
    const currentYear = new Date().getFullYear();
    const effectiveFromYear = fromYear ?? 1900;
    const effectiveToYear = toYear ?? currentYear;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!value}
                    className={cn(
                        "w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "PPP") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    initialFocus
                    captionLayout="dropdown"
                    fromYear={effectiveFromYear}
                    toYear={effectiveToYear}
                />
            </PopoverContent>
        </Popover>
    );
}
