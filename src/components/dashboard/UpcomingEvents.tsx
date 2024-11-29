import { Calendar, MapPin } from "lucide-react";
import { GroupedEvent } from "./Dashboard";
import NoDataMessage from "../NoDataMessage";

type props = {
  getEventByGrouping: () => GroupedEvent[];
};
export default function UpcomingEvents({ getEventByGrouping }: props) {
  const getDay = (date: string) => {
    const [day] = date.split("/");
    return day;
  };

  return (
    <>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Ready for upcoming events (Top 5):
      </h3>
      <div className="relative border-l-4 border-blue-500 dark:border-gray-700 space-y-8">
        {getEventByGrouping().length > 0 ? (
          getEventByGrouping().map((day, index) => (
            <div
              key={index}
              className="relative group flex items-start pl-6 sm:pl-10"
            >
              {/* Timeline Dot with Arrow */}
              <div className="absolute top-6 transform -translate-x-6 sm:-translate-x-10 flex flex-col items-center z-10">
                {/* Dot */}
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">
                    {getDay(day.date)}
                  </span>
                </div>
                {/* Arrow */}
                <div className="w-0 h-0 border-t-[8px] border-t-blue-500 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent mt-1"></div>
              </div>

              {/* Timeline Line */}
              {/* <div className="absolute top-0 left-[1.25rem] sm:left-[2.5rem] w-1 h-full bg-blue-500 dark:bg-gray-700 z-0"></div> */}

              {/* Event Content */}
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-700  p-6 shadow-lg transition-transform transform hover:scale-[1.02] w-full">
                {/* Date Header */}
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-blue-900 dark:text-blue-300 flex items-center">
                    <Calendar className="mr-2 text-blue-500 dark:text-blue-300" />
                    {day.date}{" "}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-400 ml-2">
                      ({day.events.length}{" "}
                      {day.events.length > 1 ? "events" : "event"})
                    </span>
                  </h4>
                </div>

                {/* Event Cards */}
                <ul className="space-y-4">
                  {day.events.map((event, i) => (
                    <li
                      key={i}
                      className="border border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-700 p-5 rounded-lg shadow-md hover:shadow-lg hover:bg-blue-50 dark:hover:bg-gray-600 transition"
                    >
                      <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {event.name}
                      </h5>
                      <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                        <MapPin className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-300" />
                        {event.location}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <NoDataMessage
            title="No Upcoming Events Found!"
            description="It looks like there aren't any events scheduled for now. Check
                back later or create a new event."
          />
        )}
      </div>
    </>
  );
}
