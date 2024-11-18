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
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            placeholder === "From Date" && "cursor-not-allowed opacity-50"
          )}
          disabled={placeholder === "From Date"}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setToDate}
          initialFocus
          disabled={(currentDate) =>
            (startDate != undefined ? startDate : currentDate) > currentDate
          }
        />
      </PopoverContent>
    </Popover>
  );
}
