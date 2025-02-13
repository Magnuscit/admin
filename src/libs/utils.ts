import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { REPO_OWNER, REPO_NAME } from "./types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const INFO_URL = (ID: string) => {
  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/master/events/${ID}/info.json`;
};

export const API_URL = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:6969";
export const USERNAME = process.env.NEXT_PUBLIC_USERNAME || "";
export const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD || "";

export const FOLDER_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}/tree/master/events`;
export const FOLDER_INFO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}/tree/master/info.json?raw=true`;

export const PARSE = (data: Array<string>): Record<string, any> => {
  const jsonString: string = data
    .join("")
    .replace(/\s*(\{|\}|\[|\]|,|:)\s*/g, "$1");
  const jsonObject: Record<string, any> = JSON.parse(jsonString);
  return jsonObject;
};
