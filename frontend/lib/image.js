import { baseURL } from "./api";

const apiOrigin = baseURL;

export const toImageUrl = (imagePath) => {
  if (!imagePath) return "";

  return `${apiOrigin}${imagePath}`;
};
