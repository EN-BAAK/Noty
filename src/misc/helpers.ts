import { ImageSourcePropType } from "react-native";

export const formatText = (
  text: string,
  max: number,
  emptyText: string = ""
) => {
  if (!text.length) return emptyText;
  if (text.length > max) return text.slice(0, max) + "...";

  return text;
};

export const searchText = (search: string, text: string): boolean => {
  const re = new RegExp("\\w*" + search + "\\w*", "ig");
  return re.test(text);
};

export const isToggle = (
  uri: string,
  secondUri: string,
  isPlaying: boolean
): boolean => {
  if (!uri) return false;
  return secondUri === uri ? (isPlaying ? true : false) : false;
};

export const poster = (type: string): ImageSourcePropType => {
  if (type === "application/pdf") return require("../images/pdf.png");
  if (
    type === "application/vnd.ms-powerpoint" ||
    type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  )
    return require("../images/ppt.png");
  if (
    type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return require("../images/word.png");

  return require("../images/unknown.png");
};

export const handleDelete = (
  context: any[],
  setContext: (data: any[]) => any,
  index: number
) => {
  const newArray = [...context];
  newArray.splice(index, 1);

  setContext(newArray);
};

export const convertSecToMinSec = (sec: number) => {
  let minutes = Math.floor(sec / 60).toFixed(0);
  let seconds = (sec % 60).toFixed(0);
  return minutes + ":" + (+seconds < 10 ? "0" : "") + seconds;
};
