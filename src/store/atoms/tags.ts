import { TagGroup } from "@/App";
import { atom } from "recoil";

export const tagsState = atom<TagGroup[]>({
  key: "tagsState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
