import React, { useState } from "react";
import {
  Calendar,
  momentLocalizer,
  Event as CalendarEvent,
  SlotInfo,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
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

  const handleEventClick = (event: CalendarEvent) => {
    alert(`Event: ${event.title}`);
  };

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
    <div className="flex justify-center p-4">
      <div className="w-full max-w-5xl h-[80vh]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          selectable
          style={{ height: "100%", padding: "2rem" }}
          // onSelectEvent={handleEventClick}
          views={["month", "day", "agenda"]}
          popup={true}
          onDoubleClickEvent={handleDoubleClickEvent}
          className="bg-white shadow-md rounded-md"
        />
      </div>
    </div>
  );
};

export default MyCalendar;
