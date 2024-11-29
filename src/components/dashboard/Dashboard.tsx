import React from "react";
import { ContentLayout } from "../layout/ContentLayout";
import { useRecoilValue } from "recoil";
import { tagsState } from "@/store/atoms/tags";
import { categoryState } from "@/store/atoms/category";
import { useSession } from "@clerk/clerk-react";
import { Separator } from "../ui/separator";
import { eventState } from "@/store/atoms/event";
import { Event } from "@/App";
import UpcomingEvents from "./UpcomingEvents";
import { Calendar, CalendarCheckIcon, List, Tags } from "lucide-react";

export type GroupedEvent = {
  date: string;
  events: {
    name: string;
    time: Date;
    location: string;
  }[];
};

const Dashboard: React.FC = () => {
  const tags = useRecoilValue(tagsState);
  const categories = useRecoilValue(categoryState);
  const events = useRecoilValue(eventState);
  const { session } = useSession();

  const totalUpcomingEvents = () => {
    const upcomingEvents = events.filter(
      (event) => new Date(event.fromDate) >= new Date()
    );
    return upcomingEvents;
  };

  const getEventByGrouping = () => {
    return groupByDate(totalUpcomingEvents());
  };

  const groupByDate = (events: Event[]): GroupedEvent[] => {
    const grouped = events.reduce(
      (acc: Record<string, GroupedEvent>, event) => {
        const date = new Date(event.fromDate).toLocaleDateString("en-GB"); // Format: DD-MM-YYYY
        if (!acc[date]) {
          acc[date] = { date, events: [] };
        }

        acc[date].events.push({
          name: event.name,
          time: new Date(event.fromDate),
          location: event.location as string,
        });

        return acc;
      },
      {}
    );
    return Object.values(grouped).slice(0, 5); // Limit to 5 objects
  };

  return (
    <ContentLayout title="Dashboard">
      <div className="flex justify-center dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg  p-3 w-full">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Welcome, {session?.user.fullName}!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Total Events */}
            <div className="border border-gray-500 dark:border-gray-600 bg-yellow-100 dark:bg-yellow-800 p-6 rounded-lg shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
              <div className="w-12 h-12 bg-yellow-300 dark:bg-yellow-600 rounded-full flex items-center justify-center mb-4">
                <Calendar className=" text-yellow-700 dark:text-yellow-200 text-2xl" />
              </div>

              <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">
                Total Events
              </h3>
              <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-100 mt-2">
                {events?.length}
              </p>
            </div>

            {/* Total Tags */}
            <div className="border border-gray-500 dark:border-gray-600 bg-blue-100 dark:bg-blue-800 p-6 rounded-lg shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
              <div className="w-12 h-12 bg-blue-300 dark:bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <Tags className="text-blue-700 dark:text-blue-200 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                Total Tags
              </h3>
              <p className="text-3xl font-bold text-blue-800 dark:text-blue-100 mt-2">
                {tags?.length}
              </p>
            </div>

            {/* Total Categories */}
            <div className="border border-gray-500 dark:border-gray-600 bg-green-100 dark:bg-green-800 p-6 rounded-lg shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
              <div className="w-12 h-12 bg-green-300 dark:bg-green-600 rounded-full flex items-center justify-center mb-4">
                <List className="text-green-700 dark:text-green-200 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                Total Categories
              </h3>
              <p className="text-3xl font-bold text-green-800 dark:text-green-100 mt-2">
                {categories?.length}
              </p>
            </div>

            {/* Upcoming Events */}
            <div className="border border-gray-500 dark:border-gray-600 bg-purple-100 dark:bg-purple-800 p-6 rounded-lg shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
              <div className="w-12 h-12 bg-purple-300 dark:bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <CalendarCheckIcon className="text-purple-700 dark:text-purple-200 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                Upcoming Events
              </h3>
              <p className="text-3xl font-bold text-purple-800 dark:text-purple-100 mt-2">
                {totalUpcomingEvents().length}
              </p>
            </div>
          </div>

          <Separator className="mb-6 mt-6" />
          <UpcomingEvents getEventByGrouping={getEventByGrouping} />
        </div>
      </div>
    </ContentLayout>
  );
};

export default Dashboard;
