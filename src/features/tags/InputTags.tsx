import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Info } from "lucide-react";
import { Dispatch, SetStateAction, forwardRef, useState } from "react";
import { toast } from "sonner";

type InputTagsProps = {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
  placeholder: string;
};

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(
  ({ value, onChange, placeholder, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState("");

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints)); // Update the tags array here
        setPendingDataPoint(""); // Clear the input after adding the tag
      } else {
        toast("Please enter TAG value", {
          icon: <Info className="w-5 h-5 text-white" />, // Ensure the icon is white
          position: "top-right",
          className: "custom-toast", // Ensures all text inside the toast is white
        });
      }
    };

    return (
      <>
        <div className="flex">
          <Input
            value={pendingDataPoint}
            onChange={(e) => setPendingDataPoint(e.target.value)} // Update pendingDataPoint when input changes
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "," || e.key === " ") {
                e.preventDefault();
                addPendingDataPoint();
              }
            }}
            className="rounded-r-none"
            placeholder={placeholder}
            ref={ref}
            {...props}
          />
        </div>
        {value.length > 0 && (
          <div className="rounded-md min-h-[2.5rem] overflow-y-auto py-2 flex gap-2 flex-wrap items-center">
            {value.map((item, idx) => (
              <Badge key={idx}>
                {item.toUpperCase()}
                <button
                  type="button"
                  className="w-2 ml-2"
                  onClick={() => {
                    onChange(value.filter((i) => i !== item));
                  }}
                >
                  <Cross2Icon className="w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </>
    );
  }
);
