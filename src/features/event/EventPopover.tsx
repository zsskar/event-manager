import { Popover, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const EventWithPopover = ({ event }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverPosition({
      top: rect.top - 10, // Slightly above the event
      left: rect.left + rect.width / 2, // Center horizontally
    });
    setIsPopoverOpen(true);
  };

  const handleMouseLeave = () => {
    setIsPopoverOpen(false);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer"
    >
      <span className="text-bold  text-white rounded hover:bg-blue-600 transition duration-200">
        {event.title}
      </span>
      {isPopoverOpen && (
        <Popover open={isPopoverOpen}>
          <PopoverContent
            style={{
              position: "absolute",
              top: popoverPosition.top,
              left: popoverPosition.left,
              transform: "translate(-50%, -100%)",
              zIndex: 999,
            }}
            className={cn(
              "w-64 bg-white shadow-lg rounded-md p-4 transition-all duration-300 transform",
              isPopoverOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            <h3 className="font-bold text-lg text-gray-800 mb-2">
              {event.title}
            </h3>
            <p className="text-sm text-gray-600">
              <strong>Start:</strong> {formatDate(event.start)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>End:</strong>{" "}
              {formatDate(
                new Date(
                  new Date(event.end).setDate(new Date(event.end).getDate() - 1)
                ).toString()
              )}
            </p>
            <div
              className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow"
              style={{ zIndex: -1 }}
            ></div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
