import React, { useState } from "react";
import {
  Calendar,
  momentLocalizer,
  Event as CalendarEvent,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ContentLayout } from "@/components/layout/ContentLayout";
import { useTheme } from "next-themes";

const localizer = momentLocalizer(moment);

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

const MyCalendar: React.FC = () => {
  const { theme } = useTheme();

  const isDarkMode = theme === "dark";

  const [events] = useState<Event[]>([
    {
      id: 1,
      title: "Sample Event",
      start: new Date(2024, 10, 7, 10, 0),
      end: new Date(2024, 10, 7, 11, 0),
      allDay: true,
    },
    {
      id: 2,
      title: "Another Event",
      start: new Date(2024, 10, 8, 12, 0),
      end: new Date(2024, 10, 8, 13, 0),
      allDay: false,
    },
  ]);

  // const handleEventClick = (event: CalendarEvent) => {
  //   alert(`Event: ${event.title}`);
  // };

  // const handleSelectSlot = (slotInfo: SlotInfo) => {
  //   const title = prompt("Enter event title");
  //   if (title) {
  //     setEvents([
  //       ...events,
  //       {
  //         id: 3,
  //         title,
  //         start: slotInfo.start,
  //         end: slotInfo.end,
  //         allDay: slotInfo.action === "select",
  //       },
  //     ]);
  //   }
  // };

  const handleDoubleClickEvent = (event: CalendarEvent) => {
    alert(`Double-clicked on event: ${event.title}`);
    // Here you could open a modal or navigate to a detailed view of the event
  };
  return (
    <ContentLayout title="My Calendar">
      <div className="flex justify-center p-4">
        <div
          className={`w-full max-w-5xl h-[80vh] ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            style={{
              height: "100%",
              padding: "2rem",
              backgroundColor: isDarkMode ? "#333" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            }}
            views={["month", "day", "agenda"]}
            popup={true}
            onDoubleClickEvent={handleDoubleClickEvent}
            className="shadow-md rounded-md"
          />
        </div>
      </div>
    </ContentLayout>
  );
};

export default MyCalendar;
