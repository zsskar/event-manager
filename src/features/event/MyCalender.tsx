import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, SlotInfo } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ContentLayout } from "@/components/layout/ContentLayout";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { DatePicker } from "./DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { useRecoilState, useRecoilValue } from "recoil";
import { categoryState } from "@/store/atoms/category";
import { tagsState } from "@/store/atoms/tags";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { useSession } from "@clerk/clerk-react";
import { eventState } from "@/store/atoms/event";
import { Event } from "@/App";
import { ViewEventDetails } from "./ViewEventDetailsSheet";
import { EventWithPopover } from "./EventPopover";
import FullCalendar from "@fullcalendar/react"; // React wrapper for FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid"; // For month, week, and day views
import timeGridPlugin from "@fullcalendar/timegrid"; // For time grid view
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg } from "@fullcalendar/core/index.js";

const localizer = momentLocalizer(moment);

const eventsDummData = [
  {
    start: "2024-11-24",
    end: "2024-11-25",
    title: "Dummy Event",
  },
];

interface EventTypeCalender {
  id: string;
  title: string;
  start: string;
  end: string;
}

type EventType = {
  name: string;
  location: string;
  fromDate: string;
  toDate: string;
  tags: string;
  category: string;
  description: string;
  createdBy: string;
};

const MyCalendar: React.FC = () => {
  const { theme } = useTheme();
  const today = new Date();
  const normalizedToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const categories = useRecoilValue(categoryState);
  const tags = useRecoilValue(tagsState);
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [availableEvents, setAvailableEvents] = useState<EventTypeCalender[]>(
    []
  );

  const [events, setEvents] = useRecoilState(eventState);
  const createMutation = trpc.calender.createEvent.useMutation();
  const { session, isLoaded } = useSession();

  const {
    data: eventsData,
    isLoading,
    error,
  } = trpc.calender.getAllEventsByUserId.useQuery(
    { userId: session?.user.id as string },
    { enabled: isLoaded && !!session?.user.id }
  );

  const transformEvents = (eventData: Event[]): EventTypeCalender[] =>
    eventData.map((event) => ({
      id: event.id.toString(),
      title: event.name,
      start: new Date(event.fromDate).toISOString().split("T")[0],
      end: new Date(event.toDate).toISOString().split("T")[0],
    }));

  useEffect(() => {
    if (!isLoading && eventsData) {
      // Transform events and set states
      console.log("EVents: ", eventsData.events);

      const transformed = transformEvents(eventsData.events);
      setEvents(eventsData.events); // Keep the raw data for backend consistency
      setAvailableEvents(transformed); // Store transformed events for the calendar
    }
    if (error) {
      toast.error("Error loading events");
    }
  }, [eventsData, isLoading]);

  const availableCategories = categories.map((c) => {
    return { value: c.category, label: c.category };
  });

  const availableTags = tags.flatMap((group) =>
    group.tags.map((tag) => ({
      value: tag,
      label: tag,
      color: group.color,
    }))
  );

  const [eventData, setEventData] = useState<{
    name: string;
    location: string;
    fromDate: string;
    toDate: string;
    tags: string[];
    category: string;
    description: string;
  }>({
    name: "",
    location: "",
    fromDate: "",
    toDate: "",
    tags: [], // Correctly initialized as an empty array
    category: "",
    description: "",
  });

  const isDarkMode = theme === "dark";

  // const [events] = useState<Event[]>([
  //   {
  //     id: 1,
  //     title: "Sample Event",
  //     start: new Date(2024, 10, 7, 10, 0),
  //     end: new Date(2024, 10, 7, 11, 0),
  //     allDay: true,
  //   },
  //   {
  //     id: 2,
  //     title: "Another Event",
  //     start: new Date(2024, 10, 8, 12, 0),
  //     end: new Date(2024, 10, 8, 13, 0),
  //     allDay: false,
  //   },
  // ]);

  const getDateOnly = (date: Date) => {
    return new Date(date.setDate(date.getDate() + 1))
      .toISOString()
      .split("T")[0];
  };

  const handleDateClick = (slotInfo: DateSelectArg) => {
    const { start, end } = slotInfo;

    const endDate = new Date(end.getTime() - 24 * 60 * 60 * 1000);
    const startDate = new Date(start);
    const clickedDate = start;
    if (clickedDate < today) {
      return;
    }
    setEventData((prev) => ({
      ...prev,
      fromDate: getDateOnly(startDate),
      toDate: getDateOnly(end),
    }));

    setFromDate(start);
    setToDate(endDate);
    setIsModalOpen(true);
  };

  const clearForm = () => {
    setEventData({
      name: "",
      location: "",
      fromDate: "",
      toDate: "",
      tags: [],
      category: "",
      description: "",
    });
  };

  const handleSubmit = () => {
    const updatedData = {
      ...eventData,
      tags: eventData.tags.join(","),
      createdBy: session?.user.id as string,
    };
    createEvent(updatedData);
  };

  const createEvent = (eventData: EventType) => {
    createMutation.mutate(eventData, {
      onSuccess: (data) => {
        toast.success("Event created successfully.", {
          position: "top-right",
        });
        console.log("Created Event :", data);
        const transformed = transformEvents([data.event]);
        setAvailableEvents((prev) => [...prev, ...transformed]);
        clearForm();
        setEvents((prev) => [...prev, data.event]);
        setIsModalOpen(false);
      },
      onError: (error) => {
        toast.error("Something went wrong.", {
          position: "top-right",
        });
        console.error("Error inserting data:", error);
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const disableButton =
    eventData.category.length == 0 ||
    eventData.name.length == 0 ||
    eventData.tags.length == 0 ||
    eventData.category.length == 0;

  return (
    <ContentLayout title="My Calendar">
      <div className="flex justify-center p-4">
        <div
          className={`w-full max-w-5xl h-[80vh] ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          {/* <Calendar
            tooltipAccessor={null} // Disable default tooltips
            components={{
              event: EventWithPopover, // Custom event rendering
            }}
            localizer={localizer}
            startAccessor="start"
            endAccessor="end"
            events={availableEvents}
            defaultView="month"
            style={{
              height: "100%",
              padding: "2rem",
              backgroundColor: isDarkMode ? "#333" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            }}
            views={["month"]}
            popup={true}
            selectable
            onSelectSlot={handleDateClick}
            dayPropGetter={(date) => {
              const normalizedDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
              );

              if (normalizedDate < normalizedToday) {
                return {
                  style: {
                    height: "100%", // Full height of the parent container
                    padding: "2rem",
                    backgroundColor: "#9999", // Light gray for past dates
                    color: "#999", // Muted text color
                    pointerEvents: "none", // Disable interactions
                  },
                };
              }
              return {};
            }}
            onSelectEvent={(theSelectedEvent) => {
              console.log("Select event :", theSelectedEvent);
              const selectedEvent = events.find(
                (event) => event.id === theSelectedEvent.id
              );
              setSelectedEvent(selectedEvent);
              setOpenSheet(!openSheet);
            }}
            // onDoubleClickEvent={handleDoubleClickEvent}
            className="shadow-md rounded-md overflow-auto" // Ensure scrollable area
          /> */}
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView="dayGridMonth" // Default view
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
            dayMaxEventRows={2}
            events={availableEvents} // Events data
            selectable={true} // Allow date selection
            editable={false} // Disable drag-and-drop
            eventClick={(info) => {
              const selectedEvent = events.find(
                (event) => event.id.toString() === info.event.id
              );

              setSelectedEvent(selectedEvent);
              setOpenSheet(!openSheet); // Open your custom sheet
            }}
            select={(info) => {
              handleDateClick(info);
            }}
            dayCellDidMount={(info) => {
              const cellDate = new Date(info.date);
              const normalizedDate = new Date(
                cellDate.getFullYear(),
                cellDate.getMonth(),
                cellDate.getDate()
              );

              if (normalizedDate < normalizedToday) {
                info.el.style.backgroundColor = "#9999"; // Light gray for past dates
                info.el.style.color = "#999"; // Muted text color
                info.el.style.pointerEvents = "none"; // Disable interactions
              } else {
                info.el.style.pointerEvents = "cursor";
              }
            }}
            eventContent={(eventInfo) => {
              return (
                <EventWithPopover
                  event={eventInfo.event}
                  isDarkMode={isDarkMode}
                />
              );
            }}
            height="100%" // Full height of the container
            themeSystem="standard" // Theme configuration (dark/light mode)
            dayHeaderClassNames="font-bold text-lg" // Custom day header styles
            dayCellClassNames={({ date }) =>
              date < normalizedToday ? "bg-gray-200 text-gray-400" : ""
            }
            viewClassNames="shadow-md rounded-md overflow-auto"
            eventClassNames={({ event }) =>
              theme === "dark"
                ? "bg-blue-400 text-white"
                : "bg-blue-500 text-black"
            }
          />
        </div>
      </div>
      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onOpenChange={() => {
            clearForm();
            setIsModalOpen((prev) => !prev);
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>
                Create your event here for the selected date. The "From Date" is
                your selected date and "To Date" is optional.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Event Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Event Name
                </Label>
                <Input
                  required={true}
                  id="name"
                  name="name"
                  value={eventData.name}
                  onChange={handleInputChange}
                  className={`col-span-3 ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-800 text-white"
                      : "border-input bg-background text-black"
                  }`}
                  placeholder="Event Name"
                />
              </div>

              {/* Location */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  required={true}
                  id="location"
                  name="location"
                  value={eventData.location}
                  onChange={handleInputChange} // Add this
                  className={`col-span-3 ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-800 text-white"
                      : "border-input bg-background text-black"
                  }`}
                  placeholder="Location"
                />
              </div>

              {/* From Date */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fromDate" className="text-right">
                  From Date
                </Label>
                {fromDate && (
                  <DatePicker
                    date={fromDate}
                    placeholder="From Date"
                    setToDate={setToDate}
                  />
                )}
              </div>

              {/* To Date */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="toDate" className="text-right">
                  To Date
                </Label>
                <DatePicker
                  startDate={fromDate}
                  date={toDate || new Date(eventData.toDate)}
                  placeholder="To Date"
                  setToDate={setToDate}
                />
              </div>

              {/* Tags (Multi-select Dropdown) */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <div
                  className={`col-span-3 border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-800 text-white"
                      : "border-input bg-background text-black"
                  } ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
                >
                  <Select
                    required={true}
                    isMulti
                    formatOptionLabel={(e) => (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor: e.color,
                            marginRight: "8px",
                            borderRadius: "50%",
                          }}
                        ></div>
                        {e.label}
                      </div>
                    )}
                    closeMenuOnSelect={false}
                    options={availableTags}
                    onChange={(selected) =>
                      setEventData((prev) => ({
                        ...prev,
                        tags: selected.map((tag) => tag.value),
                      }))
                    }
                    classNamePrefix="custom-select"
                    className={`w-full ${
                      isDarkMode
                        ? "custom-select-dark" // Custom styles for dark theme
                        : "custom-select-light" // Custom styles for light theme
                    }`}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: isDarkMode ? "#2D3748" : "#FFFFFF",
                        borderColor: isDarkMode ? "#4A5568" : "#E2E8F0",
                        color: isDarkMode ? "#FFFFFF" : "#000000",
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: isDarkMode ? "#2D3748" : "#FFFFFF",
                      }),
                      option: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor: state.isFocused
                          ? isDarkMode
                            ? "#4A5568"
                            : "#E2E8F0"
                          : isDarkMode
                          ? "#2D3748"
                          : "#FFFFFF",
                        color: isDarkMode ? "#FFFFFF" : "#000000",
                      }),
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <div
                  className={`col-span-3 border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-800 text-white"
                      : "border-input bg-background text-black"
                  } ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm`}
                >
                  <Select
                    required={true}
                    options={availableCategories}
                    onChange={(selected) =>
                      setEventData((prev) => ({
                        ...prev,
                        category: selected?.value || "",
                      }))
                    }
                    classNamePrefix="custom-select"
                    className={`w-full ${
                      isDarkMode ? "custom-select-dark" : "custom-select-light"
                    }`}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: isDarkMode ? "#2D3748" : "#FFFFFF",
                        borderColor: isDarkMode ? "#4A5568" : "#E2E8F0",
                        color: isDarkMode ? "#FFFFFF" : "#000000",
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: isDarkMode ? "#2D3748" : "#FFFFFF",
                      }),
                      option: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor: state.isFocused
                          ? isDarkMode
                            ? "#4A5568"
                            : "#E2E8F0"
                          : isDarkMode
                          ? "#2D3748"
                          : "#FFFFFF",
                        color: isDarkMode ? "#FFFFFF" : "#000000",
                      }),
                      singleValue: (baseStyles) => ({
                        ...baseStyles,
                        color: isDarkMode ? "#FFFFFF" : "#000000", // Ensures selected value text color respects theme
                      }),
                      placeholder: (baseStyles) => ({
                        ...baseStyles,
                        color: isDarkMode ? "#A0AEC0" : "#718096", // Matches muted text color for each theme
                      }),
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={eventData.description}
                  onChange={(e) =>
                    setEventData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className={`col-span-3 p-2 border rounded-md ${
                    isDarkMode
                      ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400 focus:border-gray-500 focus:ring-gray-500"
                      : "bg-white text-black border-gray-300 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                  } focus:ring-2`}
                  placeholder="Event Description"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleSubmit} disabled={disableButton}>
                Save Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {selectedEvent && (
        <ViewEventDetails
          openSheet={openSheet}
          setOpenSheet={setOpenSheet}
          selectedEvent={selectedEvent}
        />
      )}
    </ContentLayout>
  );
};

export default MyCalendar;
