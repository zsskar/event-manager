import { cn } from "@/lib/utils";
import { useState } from "react";
import { createPortal } from "react-dom";

export const EventWithPopover = ({ event, isDarkMode }) => {
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
      <span
        className={cn(
          "text-bold rounded hover:bg-blue-600 transition duration-200",
          isDarkMode ? "text-gray-200" : "text-gray-900"
        )}
      >
        {event.title}
      </span>
      {isPopoverOpen &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: popoverPosition.top,
              left: popoverPosition.left,
              transform: "translate(-50%, -100%)",
              zIndex: 9999, // Ensure this is very high
            }}
            className={cn(
              "w-64 shadow-lg rounded-md p-4 transition-all duration-300 transform",
              isPopoverOpen ? "opacity-100 scale-100" : "opacity-0 scale-95",
              isDarkMode
                ? "bg-gray-800 text-gray-100"
                : "bg-white text-gray-800"
            )}
          >
            <h3
              className={cn(
                "font-bold text-lg mb-2",
                isDarkMode ? "text-gray-100" : "text-gray-800"
              )}
            >
              {event.title}
            </h3>
            <p
              className={cn(
                "text-sm",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}
            >
              <strong>Start:</strong> {formatDate(event.start)}
            </p>
            <p
              className={cn(
                "text-sm",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}
            >
              <strong>End:</strong>{" "}
              {formatDate(
                new Date(
                  new Date(event.end).setDate(new Date(event.end).getDate() - 1)
                ).toString()
              )}
            </p>
            <div
              className={cn(
                "absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 shadow",
                isDarkMode ? "bg-gray-800" : "bg-white"
              )}
              style={{ zIndex: -1 }}
            ></div>
          </div>,
          document.body // Render popover at the root level
        )}
    </div>
  );
};
