import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "@/components/ui/sonner";

export type TagGroup = {
  color: string;
  tags: string[];
};

export const tags: TagGroup[] = [
  {
    color: "#000000",
    tags: ["TAG1", "TAG2", "TAG3"],
  },
  {
    color: "#262",
    tags: ["TAG4", "TAG5"],
  },
  {
    color: "#0724",
    tags: ["TAG6"],
  },
  {
    color: "#984",
    tags: ["TAG7"],
  },
];

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;
