import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { useRecoilState } from "recoil";
import { Toaster } from "@/components/ui/sonner";
import { tagsState } from "./store/atoms/tags";
import { useSession } from "@clerk/clerk-react";
import { useEffect } from "react";
import { trpc } from "./utils/trpc";
import { categoryState } from "./store/atoms/category";

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

function App() {
  const { session, isLoaded } = useSession();
  const [, setTagsData] = useRecoilState(tagsState);
  const [, setCategoriesData] = useRecoilState(categoryState);
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

  useEffect(() => {
    if (!isTagsLoading && tags) {
      setTagsData(tags);
    }
    if (!isCategoriesLoading && categories) {
      setCategoriesData(categories);
    }
  }, [isTagsLoading, isCategoriesLoading, tags, categories]);

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
