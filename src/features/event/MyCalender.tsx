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
import Select, { components } from "react-select";
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
import { Info, MapPin, Tag, Tags } from "lucide-react";
import EventUpdateInfo from "./EventUpdateInfo";

export interface EventTypeCalender {
  id: string;
  title: string;
  start: string;
  end: string;
  location: string;
}

export type EventType = {
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
      location: event.location || "",
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
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ensure today is normalized to midnight

    const clickedDate = new Date(start);
    clickedDate.setHours(0, 0, 0, 0); // Normalize clickedDate to midnight
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
    eventData.location.length == 0;

  const getSelectedEvent = (eventId: string) => {
    return events.find((event) => event.id.toString() === eventId);
  };

  return (
    <ContentLayout title="My Calendar">
      <div className="flex justify-center p-4">
        <div
          className={`w-full max-w-5xl h-[80vh] ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
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
              const event = getSelectedEvent(info.event.id);
              setSelectedEvent(event);
              setOpenSheet(!openSheet); // Open your custom sheet
            }}
            select={(info) => {
              console.log("Select :" + info);

              handleDateClick(info);
            }}
            dayCellDidMount={(info) => {
              const cellDate = new Date(info.date); // Date of the calendar cell
              const normalizedDate = new Date(
                cellDate.getFullYear(),
                cellDate.getMonth(),
                cellDate.getDate()
              );

              const normalizedToday = new Date(); // Today's date normalized
              normalizedToday.setHours(0, 0, 0, 0); // Remove time component

              if (normalizedDate < normalizedToday) {
                // Past dates
                info.el.style.backgroundColor = "#9999"; // Light gray
                info.el.style.color = "#999"; // Muted text
                info.el.style.pointerEvents = "none"; // Disable interactions
              } else {
                // Future and current dates
                info.el.style.pointerEvents = "auto"; // Ensure clickable
                info.el.style.cursor = "pointer"; // Indicate interactivity
              }
            }}
            eventContent={(eventInfo) => {
              const selectedEvent = getSelectedEvent(eventInfo.event.id);
              return (
                <EventWithPopover
                  event={selectedEvent}
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
          />
        </div>
      </div>
      <EventUpdateInfo />

      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onOpenChange={() => {
            clearForm();
            setIsModalOpen((prev) => !prev);
          }}
        >
          <DialogContent className="sm:max-w-[600px] p-6">
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>
                Create your event here for the selected date. The "From Date" is
                your selected date and "To Date" is optional.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Event Name
                </Label>
                <div className="relative">
                  <Info
                    className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <Input
                    required
                    id="name"
                    name="name"
                    value={eventData.name}
                    onChange={handleInputChange}
                    className={`pl-10 ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-800 text-white"
                        : "border-input bg-background text-black"
                    }`}
                    placeholder="Event Name"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                <div className="relative">
                  <MapPin
                    className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <Input
                    required
                    id="location"
                    name="location"
                    value={eventData.location}
                    onChange={handleInputChange}
                    className={`pl-10  ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-800 text-white"
                        : "border-input bg-background text-black"
                    }`}
                    placeholder="Location"
                  />
                </div>
              </div>

              {/* From Date */}
              <div className="flex flex-col gap-2 sm:col-span-1">
                <Label htmlFor="fromDate" className="text-sm font-medium">
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
              <div className="flex flex-col gap-2 sm:col-span-1">
                <Label htmlFor="toDate" className="text-sm font-medium">
                  To Date
                </Label>
                <DatePicker
                  startDate={fromDate}
                  date={toDate || new Date(eventData.toDate)}
                  placeholder="To Date"
                  setToDate={setToDate}
                />
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="tags" className="text-sm font-medium">
                  Tags
                </Label>
                <Select
                  required
                  isMulti
                  formatOptionLabel={(e) => (
                    <div className="flex items-center">
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
                  components={{
                    DropdownIndicator: (props) => (
                      <components.DropdownIndicator {...props}>
                        <Tags className="text-gray-500" />
                      </components.DropdownIndicator>
                    ),
                    MultiValueContainer: (props) => (
                      <components.MultiValueContainer {...props}>
                        <Tag className="mr-1 w-5 h-5 mt-1 ml-1 text-gray-400" />
                        {props.children}
                      </components.MultiValueContainer>
                    ),
                  }}
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
                    valueContainer: (baseStyles) => ({
                      ...baseStyles,
                    }),
                    menu: (baseStyles) => ({
                      ...baseStyles,
                      backgroundColor: isDarkMode ? "#2D3748" : "#FFFFFF",
                    }),
                  }}
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Select
                  required
                  options={availableCategories}
                  onChange={(selected) =>
                    setEventData((prev) => ({
                      ...prev,
                      category: selected?.value || "",
                    }))
                  }
                  components={{
                    DropdownIndicator: (props) => (
                      <components.DropdownIndicator {...props}>
                        <Info className="text-gray-500" />
                      </components.DropdownIndicator>
                    ),
                    SingleValue: ({ data, ...props }) => (
                      <components.SingleValue {...props}>
                        <div className="flex items-center">
                          <Info className="mr-1 w-5 h-5 text-gray-400" />
                          {data.label}
                        </div>
                      </components.SingleValue>
                    ),
                  }}
                  classNamePrefix="custom-select"
                  className={`w-full}`}
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      backgroundColor: isDarkMode ? "#2D3748" : "#FFFFFF",
                      borderColor: isDarkMode ? "#4A5568" : "#E2E8F0",
                      color: isDarkMode ? "#FFFFFF" : "#000000",
                    }),
                    valueContainer: (baseStyles) => ({
                      ...baseStyles,
                    }),
                    menu: (baseStyles) => ({
                      ...baseStyles,
                      backgroundColor: isDarkMode ? "#2D3748" : "#FFFFFF",
                    }),
                    singleValue: (baseStyles) => ({
                      ...baseStyles,
                      color: isDarkMode ? "#FFFFFF" : "#000000", // Explicit text color for the selected value
                    }),
                  }}
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="description" className="text-sm font-medium">
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
                  className={`p-2 border rounded-md ${
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
          setAvailableEvents={setAvailableEvents}
        />
      )}
    </ContentLayout>
  );
};

export default MyCalendar;
