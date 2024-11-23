import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "next-themes";

export function DatePicker({
  startDate,
  placeholder,
  date,
  setToDate,
}: {
  startDate?: Date;
  placeholder: string;
  date: Date;
  setToDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal transition-colors",
            !date && "text-muted-foreground",
            placeholder === "From Date" && "cursor-not-allowed opacity-50",
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
              : "bg-white text-black border-gray-300 hover:bg-gray-100"
          )}
          disabled={placeholder === "From Date"}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-auto p-0 transition-colors shadow-md",
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        )}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={setToDate}
          initialFocus
          disabled={(currentDate) =>
            (startDate != undefined ? startDate : currentDate) > currentDate
          }
          className={cn(
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          )}
        />
      </PopoverContent>
    </Popover>
  );
}
