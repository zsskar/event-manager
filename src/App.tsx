import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { useRecoilState } from "recoil";
import { Toaster } from "@/components/ui/sonner";
import { tagsState } from "./store/atoms/tags";
import { useSession } from "@clerk/clerk-react";
import { useEffect } from "react";
import { trpc } from "./utils/trpc";

export type TagGroup = {
  color: string;
  tags: string[];
  createdBy?: string;
  createdAt?: string;
  id: number;
};

export type Category = {
  category: string;
};

export const categories: Category[] = [
  { category: "Category1" },
  { category: "Category2" },
  { category: "Category3" },
  { category: "Category4" },
  { category: "Category5" },
  { category: "Category6" },
  { category: "Category7" },
];

function App() {
  const { session, isLoaded } = useSession();
  const [, setTagsData] = useRecoilState(tagsState);
  const {
    data: tags,
    isLoading,
    error,
  } = trpc.tags.getTagsByUserId.useQuery(
    { userId: session?.user.id as string }, // Input to the query
    { enabled: isLoaded && !!session?.user.id } // Ensure query runs only when `userId` is available
  );

  useEffect(() => {
    if (!isLoading && tags) {
      setTagsData(tags); // Store fetched data in state
    }
  }, [isLoading, tags]);

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
