import { AppColors } from "./config";

export const flexOne = {
  flex: 1,
};

export const container = {
  flex: 1,
  padding: 8,
  paddingBottom: 0,
};

export const mainBackground = (theme: "light" | "dark") => {
  return AppColors[theme]["AppMain"];
};

export const reverseBackground = (theme: "light" | "dark") => {
  const reverseTheme = theme === "light" ? "dark" : "light";
  return AppColors[reverseTheme]["AppMain"];
};

export const mainText = (theme: "light" | "dark") => {
  return AppColors[theme]["AppText"];
};

export const reverseText = (theme: "light" | "dark") => {
  const reverseTheme = theme === "light" ? "dark" : "light";
  return AppColors[reverseTheme]["AppText"];
};

export const grayBackground = (theme: "light" | "dark") => {
  return AppColors[theme]["gray"];
};
