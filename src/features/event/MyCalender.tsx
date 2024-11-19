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

const localizer = momentLocalizer(moment);

interface EventTypeCalender {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
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
  const [toDate, setToDate] = useState<Date>();
  const categories = useRecoilValue(categoryState);
  const [availableEvents, setAvailableEvents] = useState<EventTypeCalender[]>(
    []
  );
  const tags = useRecoilValue(tagsState);
  const [, setEvents] = useRecoilState(eventState);
  const createMutation = trpc.calender.createEvent.useMutation();
  const { session, isLoaded } = useSession();

  const { data: eventsData, isLoading } =
    trpc.calender.getAllEventsByUserId.useQuery(
      { userId: session?.user.id as string },
      { enabled: isLoaded && !!session?.user.id }
    );

  const transformEvents = (eventData: Event[]): EventTypeCalender[] =>
    eventData.map((event) => ({
      id: event.id,
      title: event.name,
      start: new Date(event.fromDate),
      end: new Date(event.toDate),
      allDay: false,
    }));

  useEffect(() => {
    if (!isLoading && eventsData) {
      // Transform events and set states
      const transformed = transformEvents(eventsData.events);
      setEvents(eventsData.events); // Keep the raw data for backend consistency
      setAvailableEvents(transformed); // Store transformed events for the calendar
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
    tags: string[]; // Ensure this is an array of strings
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

  const handleDateClick = (slotInfo: SlotInfo) => {
    const { start, end } = slotInfo;
    const endDate = new Date(end.getTime() - 24 * 60 * 60 * 1000);

    const clickedDate = start;
    if (clickedDate < today) {
      return;
    }
    setEventData((prev) => ({
      ...prev,
      fromDate: slotInfo.start.toString(),
      toDate: endDate.toString(),
    }));

    setToDate(endDate);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const updatedData = {
      ...eventData,
      tags: eventData.tags.join(","),
      createdBy: session?.user.id as string,
    };
    // console.log("Event Created:", updatedData);
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
          <Calendar
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
            views={["month", "agenda"]}
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
                    backgroundColor: "#9999", // Light gray for past dates
                    color: "#999", // Muted text color
                    pointerEvents: "none", // Disable interactions
                  },
                };
              }
              return {};
            }}
            // onDoubleClickEvent={handleDoubleClickEvent}
            className="shadow-md rounded-md"
          />
        </div>
      </div>
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
                  className="col-span-3"
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
                  className="col-span-3"
                  placeholder="Location"
                />
              </div>

              {/* From Date */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fromDate" className="text-right">
                  From Date
                </Label>
                <DatePicker
                  date={new Date(eventData.fromDate)}
                  placeholder="From Date"
                  setToDate={setToDate}
                />
              </div>

              {/* To Date */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="toDate" className="text-right">
                  To Date
                </Label>
                <DatePicker
                  startDate={new Date(eventData.fromDate)}
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
                <div className="col-span-3 border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
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
                    className="w-full"
                  />
                </div>
              </div>

              {/* Category (Dropdown) */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <div className="col-span-3 border border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm">
                  <Select
                    required={true}
                    options={availableCategories}
                    onChange={(selected) =>
                      setEventData((prev) => ({
                        ...prev,
                        category: selected?.value || "",
                      }))
                    }
                    className="w-full"
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
                  className="col-span-3 p-2 border rounded-md"
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
    </ContentLayout>
  );
};

export default MyCalendar;
