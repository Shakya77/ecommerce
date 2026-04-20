import { fetcher } from "@/constants";
import api from "@/lib/api";

export const getProducts = async () => {
  const query = `/products`;
  return fetcher(query);
};

export const getProductBySlug = async (slug) => {
  const query = `/products/${slug}`;
  try {
    const data = await fetcher(query);
    return data;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};

export const onAddToWishlist = async (productId) => {
  try {
    const data = await api.post("/wishlist", { productId });

    return data;
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return null;
  }
};

export const onRemoveFromWishlist = async (productId) => {
  try {
    const data = await api.delete(`/wishlist/${productId}`);

    return data;
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    return null;
  }
};

export const onAddToCart = async (productId, quantity = 1) => {
  try {
    const data = await api.post(`/cart`, { productId, quantity });

    return data;
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return null;
  }
};

export const getCartItems = async () => {
  try {
    const { data } = await api.get("/cart");

    return data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return null;
  }
};

export const onUpdateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    const data = await api.patch(`/cart/${cartItemId}`, { quantity });

    return data;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return null;
  }
};

export const onRemoveCartItem = async (cartItemId) => {
  try {
    const data = await api.delete(`/cart/${cartItemId}`);

    return data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    return null;
  }
};
