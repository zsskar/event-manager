import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { useRecoilState } from "recoil";
import { Toaster } from "@/components/ui/sonner";
import { tagsState } from "./store/atoms/tags";
import { useSession } from "@clerk/clerk-react";
import { useEffect } from "react";
import { trpc } from "./utils/trpc";
import { categoryState } from "./store/atoms/category";
import { eventState } from "./store/atoms/event";

export type TagGroup = {
  color: string;
  tags: string[];
  createdBy?: string;
  createdAt?: string;
  id: number;
};

export type Category = {
  category: string;
  createdBy?: string;
  createdAt?: string;
  id: number;
};

export type EventStatus = {
  PLANNED: "PLANNED";
  ONGOING: "ONGOING";
  COMPLETED: "COMPLETED";
  CANCELED: "CANCELED";
};

export type Event = {
  category: string | null;
  name: string;
  createdBy: string;
  location: string | null;
  fromDate: string;
  toDate: string;
  description: string | null;
  tags: string | null;
  status: EventStatus | string;
  id: number;
  createdAt: string;
  updatedAt: string;
};

function App() {
  const { session, isLoaded } = useSession();
  const [, setTagsData] = useRecoilState(tagsState);
  const [, setCategoriesData] = useRecoilState(categoryState);
  const [, setEvents] = useRecoilState(eventState);
  const { data: tags, isLoading: isTagsLoading } =
    trpc.tags.getTagsByUserId.useQuery(
      { userId: session?.user.id as string }, // Input to the query
      { enabled: isLoaded && !!session?.user.id } // Ensure query runs only when `userId` is available
    );

  const { data: categories, isLoading: isCategoriesLoading } =
    trpc.category.getCategoriesByUserId.useQuery(
      { userId: session?.user.id as string },
      { enabled: isLoaded && !!session?.user.id }
    );

  const { data: events, isLoading: isEventLoading } =
    trpc.calender.getAllEventsByUserId.useQuery(
      { userId: session?.user.id as string },
      { enabled: isLoaded && !!session?.user.id }
    );

  useEffect(() => {
    if (!isTagsLoading && tags) {
      setTagsData(tags);
    }
    if (!isCategoriesLoading && categories) {
      setCategoriesData(categories);
    }
    if (!isEventLoading && events) {
      setEvents(events.events);
    }
  }, [
    isTagsLoading,
    isCategoriesLoading,
    isEventLoading,
    tags,
    categories,
    events,
  ]);

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
