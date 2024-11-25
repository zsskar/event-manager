import { Event } from "@/App";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ArrowRight, Calendar, Clock, Info, MapPin, Tag } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import DeleteEventButton from "./DeleteEventButton";
import { EventTypeCalender } from "./MyCalender";
import { useRecoilState } from "recoil";
import { eventState } from "@/store/atoms/event";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export function ViewEventDetails({
  openSheet,
  setOpenSheet,
  selectedEvent,
  setAvailableEvents,
}: {
  openSheet: boolean;
  setOpenSheet: Dispatch<SetStateAction<boolean>>;
  selectedEvent: Event;
  setAvailableEvents: Dispatch<React.SetStateAction<EventTypeCalender[]>>;
}) {
  const [events, setEvents] = useRecoilState(eventState);
  const deleteMutation = trpc.calender.deleteEventById.useMutation();

  const filterEvents = (eventId: number) => {
    const filterEvents1 = events.filter((event) => event.id !== eventId);
    setEvents(filterEvents1);
    setAvailableEvents((prev) =>
      prev.filter((event) => event.id !== eventId.toString())
    );
  };

  const deleteEvent = (eventId: number) => {
    console.log("Will delete event in some time :" + eventId);
    deleteMutation.mutate(
      { id: eventId },
      {
        onSuccess: () => {
          filterEvents(eventId);
          setOpenSheet(!openSheet);
          toast.success("Event deleted successfully.", {
            position: "top-right",
          });
        },
        onError: () => {
          toast.success("Error while deleting event.", {
            position: "top-right",
          });
        },
      }
    );
  };
  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetContent className="p-5 shadow-2xl bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <SheetHeader>
          <SheetTitle className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Event Details
          </SheetTitle>
          <SheetDescription className="mt-2 text-base text-gray-600 dark:text-gray-400">
            Discover everything you need to know about this event in one place.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-8 py-6">
          {/* Event Name */}
          <div className="flex items-center gap-4">
            <Info className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            <div className="flex-1">
              <Label className="block font-bold text-gray-700 dark:text-gray-300">
                Name
              </Label>
              <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {selectedEvent?.name || "N/A"}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex items-center gap-4">
            <Info className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            <div className="flex-1">
              <Label className="block  font-bold text-gray-700 dark:text-gray-300">
                Description
              </Label>
              <div className="text-base text-gray-900 dark:text-gray-100">
                {selectedEvent?.description || "N/A"}
              </div>
            </div>
          </div>

          {/* From Date → To Date */}
          <div className="flex items-center gap-4">
            <Calendar className="w-6 h-6 text-green-600 dark:text-green-300" />
            <div className="flex-1">
              <Label className="block font-bold text-gray-700 dark:text-gray-300">
                Duration
              </Label>
              <div className="flex items-center text-gray-900 dark:text-gray-100">
                <span className="text-lg font-semibold">
                  {formatDate(selectedEvent?.fromDate) || "N/A"}
                </span>
                <ArrowRight className="w-5 h-5 mx-2 text-gray-500 dark:text-gray-400" />
                <span className="text-lg font-semibold">
                  {formatDate(
                    new Date(
                      new Date(selectedEvent.toDate).setDate(
                        new Date(selectedEvent.toDate).getDate() - 1
                      )
                    ).toString()
                  ) || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-4">
            <MapPin className="w-6 h-6 text-red-600 dark:text-red-300" />
            <div className="flex-1">
              <Label className="block font-bold text-gray-700 dark:text-gray-300">
                Location
              </Label>
              <div className="text-base text-gray-900 dark:text-gray-100">
                {selectedEvent?.location || "N/A"}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-4">
            <Tag className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
            <div className="flex-1">
              <Label className="block font-bold text-gray-700 dark:text-gray-300">
                Tags
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedEvent?.tags && selectedEvent?.tags.length > 0 ? (
                  selectedEvent.tags.split(",").map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    No tags
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center gap-4">
            <Info className="w-6 h-6 text-pink-600 dark:text-pink-300" />
            <div className="flex-1">
              <Label className="block font-bold text-gray-700 dark:text-gray-300">
                Category
              </Label>
              <div className="text-base text-gray-900 dark:text-gray-100">
                {selectedEvent?.category || "N/A"}
              </div>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-center gap-4">
            <Clock className="w-6 h-6 text-teal-600 dark:text-teal-300" />
            <div className="flex-1">
              <Label className="block font-bold text-gray-700 dark:text-gray-300">
                Created At
              </Label>
              <div className="text-base text-gray-900 dark:text-gray-100">
                {formatDate(selectedEvent?.createdAt) || "N/A"}
              </div>
            </div>
          </div>
          <DeleteEventButton
            deleteEvent={deleteEvent}
            eventId={selectedEvent.id}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
