import api from "@/lib/api";

export const ROLES = {
  admin: "Admin",
  customer: "Customer",
};

export const fetcher = (url) => api.get(url).then((res) => res.data);
