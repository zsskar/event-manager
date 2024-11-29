import { Event } from "@/App";
import { cn } from "@/lib/utils";
import { Clock, MapPinIcon } from "lucide-react";
import { MouseEvent, useState } from "react";
import { createPortal } from "react-dom";

export const EventWithPopover = ({
  event,
  isDarkMode,
}: {
  event: Event;
  isDarkMode: boolean;
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
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

  const getEventClass = (fromDate: string, toDate: string): string => {
    const currentDate = new Date();
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    if (currentDate > endDate) {
      // Event has passed
      return "bg-red-500 text-white";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      // Event is ongoing
      return "bg-green-500 text-white";
    } else if (currentDate < startDate) {
      // Event is upcoming
      return "bg-yellow-500 text-white";
    }

    return "bg-gray-500 text-white"; // Fallback in case of invalid dates
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer"
    >
      <span
        className={cn(
          "font-bold rounded py-2 px-2 transition duration-200",
          getEventClass(event.fromDate, event.toDate),
          isDarkMode
            ? "text-gray-200 hover:text-blue-400"
            : "text-gray-900 hover:text-blue-600"
        )}
      >
        {event?.name}
      </span>

      {isPopoverOpen &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: popoverPosition.top,
              left: popoverPosition.left,
              transform: "translate(-50%, -100%)",
              zIndex: 9999,
            }}
            className={cn(
              "bg-gradient-to-b  w-80 shadow-2xl rounded-2xl p-6 transition-all duration-300 transform",
              isPopoverOpen ? "opacity-100 scale-100" : "opacity-0 scale-95",
              isDarkMode
                ? "from-gray-900 to-gray-800 text-gray-100"
                : "from-white to-gray-100 text-gray-800"
            )}
          >
            <h3
              className={cn(
                "font-bold text-2xl mb-4",
                isDarkMode ? "text-blue-300" : "text-blue-700"
              )}
            >
              {event?.name}
            </h3>

            {/* Start Time */}
            <p className="text-base flex items-center mb-3">
              <Clock className="w-5 h-5 mr-2 text-blue-400" />
              <strong>Start: </strong> {formatDate(event?.fromDate)}
            </p>

            {/* End Time */}
            <p className="text-base flex items-center mb-3">
              <Clock className="w-5 h-5 mr-2 text-red-400" />
              <strong>End: </strong>
              {formatDate(
                new Date(
                  new Date(event?.toDate).setDate(
                    new Date(event?.toDate).getDate() - 1
                  )
                ).toString()
              )}
            </p>

            {/* Location */}
            {event.location && (
              <p className="text-base flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2 text-green-400" />
                <strong>Location: </strong> {event?.location}
              </p>
            )}

            <div
              className={cn(
                "absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-5 h-5 rotate-45",
                isDarkMode
                  ? "bg-gradient-to-b from-gray-900 to-gray-800"
                  : "bg-gradient-to-b from-white to-gray-100"
              )}
              style={{ zIndex: -2 }}
            ></div>
          </div>,
          document.body
        )}
    </div>
  );
};
