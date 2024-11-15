import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { RecoilRoot } from "recoil";
import { Toaster } from "@/components/ui/sonner";
import TRPCProvider from "./utils/trpc-provider";

export type TagGroup = {
  color: string;
  tags: string[];
  createdBy?: string;
  createdAt: string;
  id: number;
};

export type Category = {
  category: string;
};

// export const tags: TagGroup[] = [
//   {
//     color: "#000000",
//     tags: ["TAG1", "TAG2", "TAG3"],
//   },
//   {
//     color: "#262",
//     tags: ["TAG4", "TAG5"],
//   },
//   {
//     color: "#0724",
//     tags: ["TAG6"],
//   },
//   {
//     color: "#984",
//     tags: ["TAG7"],
//   },
// ];

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
  return (
    <>
      <TRPCProvider>
        <RecoilRoot>
          <AppRoutes />
        </RecoilRoot>
        <Toaster />
      </TRPCProvider>
    </>
  );
}

export default App;
