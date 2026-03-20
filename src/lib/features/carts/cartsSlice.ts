import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

export type CartItem = {
  variantId: number;
  productId: number;
  name: string;
  variantLabel: string;
  price: number; // in kobo
  imageUrl: string;
  quantity: number;
  slug: string;
};

interface CartsState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  couponDiscount: number;
  orderNotes: string;
  freeShippingThreshold: number; // in kobo, default ₦10,000
}

const initialState: CartsState = {
  items: [],
  isOpen: false,
  couponCode: "",
  couponDiscount: 0,
  orderNotes: "",
  freeShippingThreshold: 1000000, // ₦10,000 in kobo
};

export const cartsSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (i) => i.variantId === action.payload.variantId
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.variantId !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ variantId: number; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) => i.variantId === action.payload.variantId
      );
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.couponCode = "";
      state.couponDiscount = 0;
      state.orderNotes = "";
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    setCoupon: (
      state,
      action: PayloadAction<{ code: string; discount: number }>
    ) => {
      state.couponCode = action.payload.code;
      state.couponDiscount = action.payload.discount;
    },
    removeCoupon: (state) => {
      state.couponCode = "";
      state.couponDiscount = 0;
    },
    setOrderNotes: (state, action: PayloadAction<string>) => {
      state.orderNotes = action.payload;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  openCart,
  closeCart,
  setCoupon,
  removeCoupon,
  setOrderNotes,
} = cartsSlice.actions;

// Selectors
export const selectCartItems = (state: RootState) => state.carts.items;
export const selectCartIsOpen = (state: RootState) => state.carts.isOpen;
export const selectCartCount = (state: RootState) =>
  state.carts.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state: RootState) =>
  state.carts.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartTotal = selectCartSubtotal;
export const selectCartDiscount = (state: RootState) =>
  state.carts.couponDiscount;
export const selectCartFinalTotal = (state: RootState) =>
  Math.max(
    0,
    state.carts.items.reduce((sum, i) => sum + i.price * i.quantity, 0) -
      state.carts.couponDiscount
  );
export const selectCouponCode = (state: RootState) => state.carts.couponCode;
export const selectOrderNotes = (state: RootState) => state.carts.orderNotes;
export const selectFreeShippingThreshold = (state: RootState) =>
  state.carts.freeShippingThreshold;

export default cartsSlice.reducer;
