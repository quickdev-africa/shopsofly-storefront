import axios from "axios";

const API_URL   = process.env.NEXT_PUBLIC_API_URL;
const SUBDOMAIN = process.env.NEXT_PUBLIC_STORE_SUBDOMAIN;

const api = axios.create({
  baseURL: `${API_URL}/api/v2/storefront`,
  headers: {
    "Content-Type": "application/json",
    "X-Store-Subdomain": SUBDOMAIN,
  },
});

// Auth header helper
const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

export const getStore       = ()              => api.get("/store");
export const getProducts    = (params = {})   => api.get("/products", { params });
export const getProduct     = (slug: string)  => api.get(`/products/${slug}`);
export const getTaxons      = ()              => api.get("/taxons");
export const getTaxon       = (slug: string)  => api.get(`/taxons/${slug}`);
export const getBundles     = ()              => api.get("/bundles");
export const searchProducts = (q: string)     => api.get("/search", { params: { q } });
export const sendContact    = (data: object)  => api.post("/contact_messages", { contact_message: data });

// Auth
export const loginCustomer    = (data: object) => api.post("/customers/sessions", data);
export const registerCustomer = (data: object) => api.post("/customers", data);
export const getAccount       = (token: string) => api.get("/account/profile", { headers: authHeader(token) });
export const updateAccount    = (token: string, data: object) => api.patch("/account/profile", data, { headers: authHeader(token) });

// Orders
export const getOrders     = (token: string, params = {}) => api.get("/orders", { headers: authHeader(token), params });
export const getOrder      = (number: string, token?: string) => api.get(`/orders/${number}`, token ? { headers: authHeader(token) } : {});
export const createOrder   = (data: object, token?: string) => api.post("/orders", data, token ? { headers: authHeader(token) } : {});

// Shipping
export const getShippingMethods   = () => api.get("/shipping_methods");
export const getPickupLocations   = () => api.get("/pickup_locations");

// Wishlist
export const getWishlistItems     = (token: string)             => api.get("/wishlist_items", { headers: authHeader(token) });
export const addWishlistItem      = (token: string, product_id: number) => api.post("/wishlist_items", { product_id }, { headers: authHeader(token) });
export const removeWishlistItem   = (token: string, id: number) => api.delete(`/wishlist_items/${id}`, { headers: authHeader(token) });

// Addresses
export const getAddresses    = (token: string)              => api.get("/addresses", { headers: authHeader(token) });
export const createAddress   = (token: string, data: object) => api.post("/addresses", data, { headers: authHeader(token) });
export const updateAddress   = (token: string, id: number, data: object) => api.patch(`/addresses/${id}`, data, { headers: authHeader(token) });
export const deleteAddress   = (token: string, id: number)  => api.delete(`/addresses/${id}`, { headers: authHeader(token) });

// Promotions
export const validatePromotion = (code: string) => api.get(`/promotions/${code}`);

// Payments
export const createStripeIntent = (token: string | undefined, order_id: number) =>
  api.post("/payments/stripe_intent", { order_id }, token ? { headers: authHeader(token) } : {});
export const capturePaypal = (token: string | undefined, data: object) =>
  api.post("/payments/paypal_capture", data, token ? { headers: authHeader(token) } : {});

export default api;
