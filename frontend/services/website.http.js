import { fetcher } from "@/constants";

export const getProducts = async () => {
  const query = `/products`;
  return fetcher(query);
};
