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

export const getStore       = ()              => api.get("/store");
export const getProducts    = (params = {})   => api.get("/products", { params });
export const getProduct     = (slug: string)  => api.get(`/products/${slug}`);
export const getTaxons      = ()              => api.get("/taxons");
export const getTaxon       = (slug: string)  => api.get(`/taxons/${slug}`);
export const getBundles     = ()              => api.get("/bundles");
export const searchProducts = (q: string)     => api.get("/search", { params: { q } });
export const sendContact    = (data: object)  => api.post("/contact_messages", { contact_message: data });

export default api;
