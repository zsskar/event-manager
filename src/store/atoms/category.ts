import { Category } from "@/App";
import { atom } from "recoil";

export const categoryState = atom<Category[]>({
  key: "categoryState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
