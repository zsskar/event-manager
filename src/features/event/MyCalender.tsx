import React, { useState } from "react";
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

const localizer = momentLocalizer(moment);

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

const categories = [
  { value: "category1", label: "Category 1" },
  { value: "category2", label: "Category 2" },
  { value: "category3", label: "Category 3" },
];

const availableTags = [
  { value: "tag1", label: "Tag 1" },
  { value: "tag2", label: "Tag 2" },
  { value: "tag3", label: "Tag 3" },
  { value: "tag4", label: "Tag 4" },
];

const MyCalendar: React.FC = () => {
  const { theme } = useTheme();
  const today = new Date().getDate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [toDate, setToDate] = useState<Date>();

  const [eventData, setEventData] = useState({
    name: "",
    location: "",
    fromDate: "",
    toDate: "",
    tags: availableTags,
    category: categories,
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
    const clickedDate = slotInfo.start.getDate();
    if (clickedDate < today) {
      return;
    }
    setEventData((prev) => ({
      ...prev,
      fromDate: slotInfo.start.toString(),
    }));

    setToDate(slotInfo.start);

    setSelectedDate(clickedDate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleSelectTags = (selectedTags: any) => {
    setEventData({ ...eventData, tags: selectedTags });
  };

  const handleSelectCategory = (selectedCategory: any) => {
    setEventData({ ...eventData, category: selectedCategory });
  };

  const handleSubmit = () => {
    // Handle form submission here, e.g., save event details
    console.log("Event Created:", eventData);
    setIsModalOpen(false); // Close dialog after submission
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
            startAccessor="start"
            endAccessor="end"
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
              if (date.getDate() < today) {
                return {
                  style: {
                    backgroundColor: "#f5f5f5", // Light gray for past dates
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
                  id="name"
                  name="name"
                  value={eventData.name}
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
                  id="location"
                  name="location"
                  value={eventData.location}
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
                  date={toDate || new Date(eventData.fromDate)}
                  placeholder="To Date"
                  setToDate={setToDate}
                />
              </div>

              {/* Tags (Multi-select Dropdown) */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <div className="col-span-3">
                  <Select
                    isMulti
                    value={eventData.tags}
                    onChange={handleSelectTags}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Category (Dropdown) */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <div className="col-span-3">
                  <Select
                    options={categories}
                    value={eventData.category}
                    onChange={handleSelectCategory}
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
              <Button onClick={handleSubmit}>Save Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ContentLayout>
  );
};

export default MyCalendar;
