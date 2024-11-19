import { Event } from "@/App";
import { atom } from "recoil";

export const eventState = atom<Event[]>({
  key: "eventState",
  default: [],
});
