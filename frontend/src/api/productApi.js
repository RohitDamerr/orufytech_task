import api from "./api";

export const getProducts = async (search = "", published = null) => {
  const params = {};
  if (search) params.search = search;
  if (published !== null) params.published = published.toString();
  const res = await api.get("/products", { params });
  return res.data;
};

export const createProduct = async (productData) => {
  const res = await api.post("/products", productData);
  return res.data;
};

export const updateProduct = async (id, productData) => {
  const res = await api.put(`/products/${id}`, productData);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const togglePublishProduct = async (id) => {
  const res = await api.patch(`/products/${id}/publish`);
  return res.data;
};
