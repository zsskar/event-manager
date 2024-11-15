import { atom } from "recoil";

export const categoryState = atom({
  key: "categoryState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
