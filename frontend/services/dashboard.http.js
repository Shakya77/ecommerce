export const postProduct = async (FormData) => {
  const data = await api.post("/product", FormData);

  return data;
};
