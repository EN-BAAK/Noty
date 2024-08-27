import React from "react";

export type Props = {
  children: React.ReactNode;
};

export type AppSettings = {
  theme: "light" | "dark";
  search: string;
  setTheme: () => Promise<void>;
  setSearch: (text: string) => void;
  setToast: (text: string) => void;
};

export type AudioService = {
  audioURI: string;
  isPlaying: boolean;
  handleAudioToggle: (
    newAudioURI: string,
    newAudioName: string
  ) => Promise<void>;
  handleDelete: () => Promise<void>;
  isAudioExist: boolean;
  progress: any;
  seekTo: (position: number) => Promise<void>;
  stopAudio: () => Promise<void>;
  playAudio: () => Promise<void>;
  increaseSpeed: () => Promise<void>;
  speedIndex: number;
};

export type folderType = {
  _id: number;
  title: string;
  color: string;
  icon: string;
};

export type fileType = {
  _id: number;
  title: string;
  desc: string;
  color: string;
};

export type infoType = {
  _id: number;
  title: string;
  info: string;
  withBorder: boolean;
};

export type audioType = {
  _id: number;
  uri: string;
  filename: string;
  withBorder: boolean;
};

export type imageType = {
  _id: number;
  uri: string;
  info: string;
  title: string;
  withBorder: boolean;
};

export type todoType = {
  _id: number;
  title: string;
  checked: boolean;
};

export type documentType = {
  _id: number;
  title: string;
  uri: string;
  type: string;
};
