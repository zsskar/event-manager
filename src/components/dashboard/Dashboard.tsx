import React from "react";
import { ContentLayout } from "../layout/ContentLayout";
import { useRecoilState } from "recoil";
import { tagsState } from "@/store/atoms/tags";
import { categoryState } from "@/store/atoms/category";
import { useSession } from "@clerk/clerk-react";
import { Separator } from "../ui/separator";
import { Locate, LucideWatch, Timer } from "lucide-react";

const Dashboard: React.FC = () => {
  const tags = useRecoilState(tagsState);
  const categories = useRecoilState(categoryState);
  const { session } = useSession();

  return (
    <ContentLayout title="Dashboard">
      <div className="flex justify-center dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg  p-3 w-full">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Welcome, {session?.user.fullName}!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300">
                Total Events
              </h3>
              <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-100">
                10
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                Total Tags
              </h3>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-100">
                {tags?.length}
              </p>
            </div>

            <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                Total Categories
              </h3>
              <p className="text-2xl font-bold text-green-800 dark:text-green-100">
                {categories?.length}
              </p>
            </div>

            <div className="bg-purple-100 dark:bg-purple-800 p-4 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                Upcoming Events
              </h3>
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-100">
                5
              </p>
            </div>
          </div>
          <Separator className="mb-6 mt-6" />

          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Ready for upcoming events (Top 5):
          </h3>

          <div className="space-y-6">
            {[
              {
                date: "24-11-2024",
                events: [
                  {
                    name: "Event -1",
                    time: "10 AM",
                    location: "Conference Hall A",
                  },
                  { name: "Event -2", time: "11 AM", location: "Room B12" },
                ],
              },
              {
                date: "25-11-2024",
                events: [
                  {
                    name: "Event -3",
                    time: "10 AM",
                    location: "Main Auditorium",
                  },
                ],
              },
              {
                date: "01-12-2024",
                events: [
                  {
                    name: "Event -4",
                    time: "10 AM",
                    location: "Community Center",
                  },
                ],
              },
            ].map((day, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-5 shadow-lg"
              >
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                  <LucideWatch /> {day.date} ({day.events.length}{" "}
                  {day.events.length > 1 ? "events" : "event"})
                </h4>

                <ul className="space-y-4">
                  {day.events.map((event, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-start bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md"
                    >
                      <div>
                        <h5 className="text-gray-800 dark:text-gray-100 font-medium text-lg flex items-center">
                          {event.name}
                        </h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center mt-1">
                          <Locate />
                          &nbsp; {event.location}
                        </p>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                        <Timer />
                        {event.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default Dashboard;
