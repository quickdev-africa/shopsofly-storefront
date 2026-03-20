# SHOPSOFLY — AGENT BRIEF: BATCH 3
## Cart, Checkout, Orders & Customer Account
### For: GitHub Copilot Agent (VS Code Agent Mode)

---

## CRITICAL RULES — READ BEFORE TOUCHING ANY FILE

1. **Working directory is `/Users/user/Desktop/shopsofly-storefront`** — NEVER work outside this folder
2. **Framework preset on Vercel is Next.js** — do NOT change any Vercel settings
3. **Config file is `next.config.js` using CommonJS `module.exports`** — do NOT convert to `.mjs` or `export default`
4. **Never add `target` to `next.config.js`** — this was the Batch 2 deployment killer
5. **Test the local build before pushing**: run `npm run build` locally and confirm it passes with zero errors before any `git push`
6. **One feature at a time** — complete and verify each step before moving to the next
7. **Never install packages without listing them first** — check if already in `package.json` before running `npm install`
8. **All API calls use the subdomain header** — every fetch must include `X-Store-Subdomain: laserstarglobal`
9. **DP2.0 brand colors only** — Primary: `#4A7C59`, CTA/Accent: `#F97316`, Success: `#22C55E`, Error: `#EF4444`
10. **Mobile-first** — all components must work perfectly on 375px screen width

---

## CONTEXT — WHAT EXISTS FROM BATCH 2

The storefront is live at Vercel. These already work:
- Homepage with all sections including BundleBuilder
- `/products` — product grid with filters
- `/products/[slug]` — product detail with image gallery, variants, add to cart (UI only — not wired to API yet)
- `/collections` and `/collections/[slug]`
- `/bundles`
- `/search`
- `/account/login` and `/account/register`
- Redux store is set up (`@reduxjs/toolkit` + `react-redux` + `redux-persist`)
- SWR is installed for data fetching
- Axios is installed
- `vaul` is installed (for drawers)
- `framer-motion` is installed

**What does NOT exist yet (Batch 3 scope):**
- Cart drawer (fully functional — connected to API)
- Checkout page
- Order confirmation page
- Order tracking page
- Customer account pages (orders list, order detail, addresses, profile)
- Wishlist page
- Payment integrations (Paystack, Stripe, PayPal, Bank Transfer, COD)

---

## RAILS API BASE URL

```
https://military-amandie-laserstarglobal-428c5069.koyeb.app
```

Every API request must include:
```
X-Store-Subdomain: laserstarglobal
```

For authenticated routes, also include:
```
Authorization: Bearer {jwt_token}
```

---

## WHAT BATCH 3 BUILDS — COMPLETE LIST

### Part A — Redux Cart State (wire up what Batch 2 built as UI only)
### Part B — Cart Drawer (fully functional)
### Part C — Wishlist Page (`/wishlist`)
### Part D — Checkout Page (`/checkout`)
### Part E — Payment Integrations (Paystack → Stripe → PayPal → Bank Transfer → COD)
### Part F — Order Confirmation Page (`/order-confirmation`)
### Part G — Order Tracking Page (`/pages/track-order`)
### Part H — Customer Account Pages
- `/account/orders` — order history
- `/account/orders/[number]` — order detail
- `/account/addresses` — saved addresses
- `/account/profile` — edit profile

---

## STEP-BY-STEP BUILD INSTRUCTIONS

Execute every step in order. Do not skip. Do not combine steps.

---

### STEP 1 — INSTALL REQUIRED PACKAGES

First check which are already installed:
```bash
cd /Users/user/Desktop/shopsofly-storefront
cat package.json | grep -E "paystack|stripe|paypal"
```

Then install only what is missing:
```bash
npm install @paystack/inline-js
npm install @stripe/react-stripe-js @stripe/stripe-js
npm install @paypal/react-paypal-js
```

Verify build still passes after install:
```bash
npm run build
```

If build passes, commit:
```bash
git add package.json package-lock.json
git commit -m "feat: batch 3 — install payment gateway packages"
git push origin main
```

---

### STEP 2 — VERIFY RAILS API ENDPOINTS

Before writing any frontend code, confirm these endpoints are live. Run each curl:

```bash
# Cart
curl -s -X GET \
  "https://military-amandie-laserstarglobal-428c5069.koyeb.app/api/v2/storefront/cart" \
  -H "X-Store-Subdomain: laserstarglobal" | head -200

# Promotions (for coupon validation)
curl -s -X GET \
  "https://military-amandie-laserstarglobal-428c5069.koyeb.app/api/v2/storefront/promotions" \
  -H "X-Store-Subdomain: laserstarglobal" | head -200

# Shipping methods
curl -s -X GET \
  "https://military-amandie-laserstarglobal-428c5069.koyeb.app/api/v2/storefront/shipping_methods" \
  -H "X-Store-Subdomain: laserstarglobal" | head -200

# Wishlist
curl -s -X GET \
  "https://military-amandie-laserstarglobal-428c5069.koyeb.app/api/v2/storefront/wishlist_items" \
  -H "X-Store-Subdomain: laserstarglobal" \
  -H "Authorization: Bearer TEST_TOKEN" | head -200
```

Paste the response status codes. If any endpoint returns 404, stop and report before continuing.

---

### STEP 3 — REDUX CART SLICE

**File to create:** `store/cartSlice.ts`

The cart state shape:
```typescript
interface CartItem {
  variantId: number;
  productId: number;
  name: string;
  variantLabel: string; // e.g. "Size: L / Color: Black"
  price: number; // in kobo
  imageUrl: string;
  quantity: number;
  slug: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  couponCode: string;
  couponDiscount: number;
  orderNotes: string;
  freeShippingThreshold: number; // in kobo, default 10000000 (₦10,000)
}
```

Actions to implement:
- `addItem(item: CartItem)` — if variantId already exists, increase quantity
- `removeItem(variantId: number)`
- `updateQuantity({ variantId, quantity })` — min 1, max stock
- `clearCart()`
- `openCart()`
- `closeCart()`
- `setCoupon({ code, discount })`
- `removeCoupon()`
- `setOrderNotes(notes: string)`

Selectors to export:
- `selectCartItems`
- `selectCartTotal` — sum of (price × quantity) in kobo
- `selectCartCount` — sum of all quantities
- `selectCartIsOpen`
- `selectCartSubtotal` — same as total before discount
- `selectCartDiscount`
- `selectCartFinalTotal` — subtotal minus discount

Register the slice in your existing Redux store file.

---

### STEP 4 — WIRE UP ADD TO CART ON PRODUCT PAGE

Open `app/products/[slug]/page.tsx` (or wherever the product detail page lives).

Find the "Add to Cart" button. It currently does nothing or shows a placeholder.

Wire it to dispatch `addItem` to Redux and `openCart()` immediately after so the drawer slides in.

The item payload must include:
- `variantId` — from selected variant
- `productId` — from product
- `name` — product name
- `variantLabel` — human-readable variant e.g. `"Size: L"` built from `variant.options`
- `price` — in kobo (price × 100)
- `imageUrl` — first product image
- `quantity` — from quantity stepper
- `slug` — for link back to product

Also wire up the "Quick Buy" buttons on `/products` grid using the same action (but with quantity: 1, first variant by default).

---

### STEP 5 — CART DRAWER COMPONENT

**File to create:** `components/CartDrawer.tsx`

This is a slide-in drawer from the right. Use `vaul` (already installed) for the slide animation.

The drawer must be rendered in the root layout so it is available on every page.

**Drawer structure:**

```
[Header]
  "Your Cart" title | item count badge | X close button

[Body — scrollable]
  If cart is empty:
    SVG empty cart illustration
    "Your cart is empty" text
    "Continue Shopping" button → closes drawer + links to /products

  If cart has items:
    For each item:
      [ Product Image 80×80px ]
      [ Product Name ]
      [ Variant Label ]
      [ Price ]
      [ Quantity stepper — + ]
      [ Remove button (trash icon) ]

  [Free Shipping Progress Bar]
    "₦X more for free shipping!" — fills green as total increases
    Uses freeShippingThreshold from cart state

  [Order Notes]
    Textarea: "Any special requests for your order?"
    Dispatches setOrderNotes on change

  [Coupon Code Field]
    Input + "Apply" button
    On apply: POST to /api/v2/storefront/promotions/validate (check API endpoint)
    On success: dispatch setCoupon({ code, discount })
    On fail: show inline error "Invalid or expired coupon"

  [Cart Upsell]
    "You might also like" — show 1 random product fetched from API
    Quick add button

[Footer — sticky]
  Subtotal: ₦XX,XXX
  Discount (if coupon applied): -₦X,XXX in green
  Total: ₦XX,XXX in bold
  [Proceed to Checkout] orange button → navigates to /checkout + closes drawer
```

**Important cart rules:**
- Quantities cannot go below 1
- Cart persists via redux-persist (already configured) — survives page refresh
- Cart icon in header shows item count badge — update this too

---

### STEP 6 — WISHLIST PAGE

**File to create:** `app/wishlist/page.tsx`

This is a server-rendered page with client interactivity.

**API calls needed:**
```
GET /api/v2/storefront/wishlist_items
Header: X-Store-Subdomain: laserstarglobal
Header: Authorization: Bearer {token}  ← only for logged-in users

DELETE /api/v2/storefront/wishlist_items/:id
POST /api/v2/storefront/wishlist_items
Body: { product_id: number }
```

**Page behaviour:**
- If user is NOT logged in: show "Please login to view your wishlist" with login button
- If user IS logged in: fetch wishlist items and display product cards
- Each card shows: image, name, price, "Remove from Wishlist" button, "Add to Cart" button
- "Add to Cart" adds item to Redux cart + opens cart drawer
- "Remove" calls DELETE endpoint + removes from local state immediately (optimistic update)
- Empty state: SVG illustration + "Your wishlist is empty" + "Browse Products" button

**The wishlist heart button on product pages:**
- Wired to `POST /api/v2/storefront/wishlist_items` when clicked
- Turns red/filled when product is in wishlist
- Shows "Login to save" tooltip if not authenticated

---

### STEP 7 — CHECKOUT PAGE

**File to create:** `app/checkout/page.tsx`

This is a single-page checkout — all sections visible at once, no wizard steps.

**Before building, define the state:**
```typescript
interface CheckoutState {
  // Contact
  email: string;
  phone: string;

  // Delivery method
  deliveryMethod: 'delivery' | 'pickup';

  // Delivery address
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string; // Nigerian state
  lga: string;

  // Pickup
  pickupLocationId: number | null;

  // Shipping
  shippingMethodId: number | null;

  // Payment
  paymentMethod: 'paystack' | 'stripe' | 'paypal' | 'bank_transfer' | 'cod';

  // Coupon (carried from cart)
  couponCode: string;
  couponDiscount: number;
}
```

**Page layout (top to bottom):**

```
[Section 1 — Contact Information]
  Email field (required)
  Phone field (required, Nigerian format)

[Section 2 — Delivery Method]
  Radio toggle: [🚚 Delivery] [📍 Pickup]

  If Delivery selected:
    [Delivery Address Form]
      First Name | Last Name (side by side)
      Address Line 1
      Address Line 2 (optional)
      City
      State (dropdown — all 36 Nigerian states + FCT, alphabetical)
      LGA (dropdown — updates based on state selected)
      Phone

  If Pickup selected:
    [Pickup Location Selector]
      Dropdown of pickup_locations from API
      Shows: name, address, available dates

[Section 3 — Shipping Method]
  Only shown if Delivery is selected
  List of shipping_methods from API
  Radio buttons with price
  Auto-selects cheapest on load

[Section 4 — Order Summary]
  List of cart items (image, name, variant, qty, price)
  Subtotal
  Shipping cost
  Discount (if coupon applied)
  Total in bold orange

[Section 5 — Coupon Code]
  Input + Apply button (same logic as cart drawer)

[Section 6 — Payment Method]
  Tab/radio buttons:
    Paystack | Stripe | PayPal | Bank Transfer | Cash on Delivery

  [If Paystack selected]
    "Pay ₦XX,XXX securely with Paystack"
    [Pay Now] button → triggers Paystack popup

  [If Stripe selected]
    Stripe Elements card input
    [Pay ₦XX,XXX] button

  [If PayPal selected]
    PayPal button (renders @paypal/react-paypal-js button)

  [If Bank Transfer selected]
    Show merchant bank details:
      Bank Name, Account Name, Account Number
    "Transfer ₦XX,XXX and upload proof" — note
    [I Have Transferred] button → creates order with payment pending

  [If COD selected]
    "Pay when your order arrives"
    [Place Order — Pay on Delivery] button

[Security badge row]
  🔒 Secured by Paystack | 256-bit SSL | Your payment is safe
```

**Nigerian states list** (hardcoded array — do not use an API for this):
```
Abia, Adamawa, Akwa Ibom, Anambra, Bauchi, Bayelsa, Benue, Borno, Cross River,
Delta, Ebonyi, Edo, Ekiti, Enugu, FCT, Gombe, Imo, Jigawa, Kaduna, Kano, Katsina,
Kebbi, Kogi, Kwara, Lagos, Nasarawa, Niger, Ogun, Ondo, Osun, Oyo, Plateau,
Rivers, Sokoto, Taraba, Yobe, Zamfara
```

**Express checkout for logged-in users:**
- Pre-fill contact fields from user account
- Pre-fill address from user's default saved address
- Show "Change address" link

---

### STEP 8 — PAYSTACK INTEGRATION

**How Paystack works in this project:**

1. Frontend creates order via Rails API first
2. Rails returns order with `paystack_reference`
3. Frontend triggers Paystack popup using that reference
4. Paystack calls the merchant's webhook on success
5. Rails verifies payment and updates order state
6. Frontend polls for order status or uses callback

**Implementation:**

```typescript
// Create order first
const createOrder = async (checkoutData) => {
  const response = await axios.post(
    `${API_BASE}/api/v2/storefront/orders`,
    {
      order: {
        email: checkoutData.email,
        phone: checkoutData.phone,
        delivery_method: checkoutData.deliveryMethod,
        notes: cartState.orderNotes,
        // ... address fields
      },
      line_items: cartItems.map(item => ({
        variant_id: item.variantId,
        quantity: item.quantity,
      })),
      shipping_method_id: checkoutData.shippingMethodId,
      promotion_code: cartState.couponCode,
    },
    { headers: { 'X-Store-Subdomain': 'laserstarglobal' } }
  );
  return response.data;
};

// Then trigger Paystack
const handlePaystack = async () => {
  const order = await createOrder(checkoutState);

  const handler = PaystackPop.setup({
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email: checkoutState.email,
    amount: order.total, // already in kobo
    ref: order.paystack_reference,
    currency: 'NGN',
    onSuccess: (transaction) => {
      // Navigate to order confirmation
      router.push(`/order-confirmation?order=${order.number}`);
      dispatch(clearCart());
    },
    onCancel: () => {
      // Show "Payment cancelled" toast — do NOT clear cart
    },
  });
  handler.openIframe();
};
```

**Environment variable needed:**
Add to `.env.local` and `.env.production`:
```
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
```

NOTE: Use LaserStar Global's actual Paystack public key. Ask the user for this key before this step.

---

### STEP 9 — STRIPE INTEGRATION

Only shown if merchant has Stripe enabled (check store settings from API).

```typescript
// Stripe setup
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Create payment intent via Rails API
const createPaymentIntent = async (orderId: number) => {
  const response = await axios.post(
    `${API_BASE}/api/v2/storefront/payments/stripe_intent`,
    { order_id: orderId },
    { headers: { 'X-Store-Subdomain': 'laserstarglobal' } }
  );
  return response.data.client_secret;
};
```

Wrap the Stripe section in `<Elements stripe={stripePromise}>`.

**Environment variable:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

---

### STEP 10 — PAYPAL INTEGRATION

Only shown if merchant has PayPal enabled.

```typescript
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

<PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
  <PayPalButtons
    createOrder={async (data, actions) => {
      // Create order in Rails first, get paypal_order_id back
      const order = await createRailsOrder(checkoutState);
      return order.paypal_order_id;
    }}
    onApprove={async (data, actions) => {
      // Capture payment
      await axios.post(
        `${API_BASE}/api/v2/storefront/payments/paypal_capture`,
        { order_id: railsOrderId, paypal_order_id: data.orderID },
        { headers: { 'X-Store-Subdomain': 'laserstarglobal' } }
      );
      router.push(`/order-confirmation?order=${orderNumber}`);
      dispatch(clearCart());
    }}
  />
</PayPalScriptProvider>
```

**Environment variable:**
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxxxxxxxxxxxx
```

---

### STEP 11 — BANK TRANSFER FLOW

No external library needed.

1. Customer selects "Bank Transfer"
2. Show merchant bank details (fetched from store settings API)
3. Customer clicks "I Have Transferred"
4. Creates order via Rails API with `payment_method: 'bank_transfer'`
5. Order state = `pending` (awaiting merchant to confirm transfer)
6. Navigate to order confirmation with "Awaiting transfer confirmation" message

---

### STEP 12 — CASH ON DELIVERY FLOW

Simplest flow:
1. Customer selects COD
2. Clicks "Place Order"
3. Creates order via Rails API with `payment_method: 'cod'`
4. Navigate to order confirmation
5. Merchant fulfils and collects cash on delivery

---

### STEP 13 — ORDER CONFIRMATION PAGE

**File to create:** `app/order-confirmation/page.tsx`

URL: `/order-confirmation?order=SHF-123456`

**API call:**
```
GET /api/v2/storefront/orders/SHF-123456
Header: X-Store-Subdomain: laserstarglobal
```

**Page layout:**
```
[Success Icon — large green checkmark animation]

"Order Confirmed! 🎉"
Order #SHF-123456

[What Happens Next — timeline]
  ✅ Order received
  ⏳ Payment confirmed (or "Awaiting bank transfer")
  ⏳ Being prepared
  ⏳ Out for delivery
  ⏳ Delivered

[Order Summary Box]
  Each item: image, name, variant, qty, price
  Subtotal | Shipping | Discount | Total

[Delivery Details Box]
  Name, address, city, state
  Estimated delivery: 2-5 business days

[Action Buttons]
  [Track My Order] → /pages/track-order?order=SHF-123456
  [Share on WhatsApp] → wa.me link with order summary
  [Continue Shopping] → /products

[Payment Method Info]
  If bank transfer: "We'll confirm your payment within 2 hours"
  If Paystack/Stripe/PayPal: "Payment confirmed ✓"
  If COD: "You'll pay ₦XX,XXX on delivery"
```

Clear the cart (`dispatch(clearCart())`) when this page loads if not already cleared.

---

### STEP 14 — ORDER TRACKING PAGE

**File to create:** `app/pages/track-order/page.tsx`

URL: `/pages/track-order` (also accepts `?order=SHF-123456` to pre-fill)

**Page layout:**
```
[Search Form]
  "Enter your order number"
  Input field (pre-filled if ?order= param exists)
  [Track Order] button

[Results — shown after search]
  Order #SHF-123456
  Status badge (e.g. "Processing" in amber, "Delivered" in green)

  [Visual Status Timeline]
    Each step has: icon, label, timestamp (if completed)

    ✅ Order Placed — 20 Mar 2026, 9:41am
    ✅ Payment Confirmed — 20 Mar 2026, 9:45am
    🔄 Being Prepared — In progress
    ⏳ Out for Delivery
    ⏳ Delivered

  [Order Summary]
    Items list, total, delivery address

  [Need help?]
    WhatsApp button with order number pre-filled
```

**API call:**
```
GET /api/v2/storefront/orders/{order_number}
Header: X-Store-Subdomain: laserstarglobal
```

No auth required — order number is the customer's lookup key.

---

### STEP 15 — CUSTOMER ACCOUNT: ORDERS LIST

**File:** `app/account/orders/page.tsx`

**API call:**
```
GET /api/v2/storefront/orders?page=1&per_page=20
Header: X-Store-Subdomain: laserstarglobal
Header: Authorization: Bearer {token}
```

**Page layout:**
```
[Account Layout — sidebar with nav links]
  Orders (active)
  Addresses
  Profile
  Logout

[Orders list]
  If no orders: "No orders yet" + "Start Shopping" button

  For each order:
    [ Status badge ] [ #SHF-123456 ] [ 20 Mar 2026 ]
    [ 3 items ]      [ ₦45,000 ]    [ View Details → ]

  Pagination at bottom
```

Status badge colours:
- `pending` → amber
- `payment_confirmed` / `processing` → blue
- `shipped` / `ready_for_pickup` → purple
- `delivered` / `picked_up` / `completed` → green
- `cancelled` → red

---

### STEP 16 — CUSTOMER ACCOUNT: ORDER DETAIL

**File:** `app/account/orders/[number]/page.tsx`

**API call:**
```
GET /api/v2/storefront/orders/{number}
Header: X-Store-Subdomain: laserstarglobal
Header: Authorization: Bearer {token}
```

**Page layout:**
```
← Back to Orders

Order #SHF-123456 | [Status badge]
Placed: 20 Mar 2026

[Status Timeline] — same as tracking page

[Items]
  Each line item: image, name, variant, qty × price = total

[Order Totals]
  Subtotal | Shipping | Discount | Total

[Delivery Information]
  Name, address, phone
  Delivery method + shipping method

[Payment Information]
  Method: Paystack
  Reference: xxx
  Status: Paid ✓

[Need Help?]
  WhatsApp button
```

---

### STEP 17 — CUSTOMER ACCOUNT: ADDRESSES

**File:** `app/account/addresses/page.tsx`

**API calls:**
```
GET    /api/v2/storefront/addresses
POST   /api/v2/storefront/addresses
PATCH  /api/v2/storefront/addresses/:id
DELETE /api/v2/storefront/addresses/:id
```

All require `Authorization: Bearer {token}`.

**Page layout:**
```
"Saved Addresses"
[+ Add New Address] button (opens modal/inline form)

For each address:
  [Default badge if is_default]
  Name, address line 1, city, state, phone
  [Edit] [Delete] [Set as Default]
```

The add/edit form uses the same Nigerian states dropdown as checkout.

---

### STEP 18 — CUSTOMER ACCOUNT: PROFILE

**File:** `app/account/profile/page.tsx`

**API calls:**
```
GET   /api/v2/storefront/account
PATCH /api/v2/storefront/account
```

**Form fields:**
- First Name
- Last Name
- Email
- Phone
- Change Password (current password, new password, confirm new password)
- [Save Changes] button

Show success toast on save. Show error if current password is wrong.

---

### STEP 19 — ACCOUNT LAYOUT WRAPPER

**File:** `app/account/layout.tsx`

Shared layout for all `/account/*` pages.

```
[Header — same as rest of site]

[Account Layout]
  Left sidebar (desktop) / Top tabs (mobile):
    👤 Profile
    📦 My Orders
    📍 My Addresses
    🚪 Logout

  Right content area:
    {children}
```

If user is NOT logged in and tries to access any `/account/*` page, redirect to `/account/login`.

Use `useEffect` + `router.push('/account/login')` for this — do not use Next.js middleware for now.

---

### STEP 20 — VERIFY LOCAL BUILD

After completing all components:

```bash
cd /Users/user/Desktop/shopsofly-storefront
npm run build
```

Fix every TypeScript error and every missing import before proceeding.

Common errors to watch for:
- Missing `'use client'` directive on components that use hooks
- `window is not defined` — wrap in `useEffect` or check `typeof window !== 'undefined'`
- Unresolved dynamic imports — use `next/dynamic` with `{ ssr: false }` for Paystack/Stripe/PayPal
- Missing environment variables — add to `.env.local` with placeholder values for build

The build MUST pass with zero errors before Step 21.

---

### STEP 21 — COMMIT AND PUSH

```bash
cd /Users/user/Desktop/shopsofly-storefront
git add .
git commit -m "feat: batch 3 — cart, checkout, payments, orders, account pages"
git push origin main
```

Then watch Vercel deployment. The build should complete in 60-120 seconds (not 14 seconds — 14 seconds means it failed at config).

---

### STEP 22 — BROWSER TESTS AFTER BATCH 3

After Vercel shows "Ready", test every flow:

**Cart tests:**
1. Go to `/products` → click a product → click "Add to Cart" → confirm cart drawer opens with item
2. Change quantity in drawer → confirm subtotal updates
3. Remove item → confirm it disappears
4. Add 2 different products → confirm both show in drawer
5. Apply coupon code → confirm discount shows
6. Refresh page → confirm cart persists (redux-persist)

**Checkout tests:**
7. Click "Proceed to Checkout" → confirm you land on `/checkout`
8. Fill in all fields → select Paystack → click Pay → confirm Paystack popup appears
9. Complete a test payment using Paystack test card: `4084 0840 8408 4081`, CVV: `408`, Expiry: any future date
10. Confirm redirect to `/order-confirmation` with order number
11. Confirm cart is cleared after successful payment

**Account tests:**
12. Go to `/account/orders` → confirm order from test appears
13. Click order → confirm `/account/orders/SHF-XXXXXX` shows details
14. Go to `/account/addresses` → add a new address → confirm it saves
15. Go to `/account/profile` → update phone number → confirm save works

**Tracking tests:**
16. Go to `/pages/track-order` → enter order number from test → confirm timeline shows

**Wishlist tests:**
17. Go to a product page → click wishlist heart → confirm it fills red
18. Go to `/wishlist` → confirm product appears
19. Remove from wishlist → confirm it disappears

---

## IMPORTANT NOTES FOR THIS BATCH

### On Paystack
- Use `@paystack/inline-js` as a dynamic import with `{ ssr: false }` — it uses `window`
- Never import PaystackPop at the top level — always inside `useEffect` or event handlers
- Test cards: `4084 0840 8408 4081` (success), `4084 0840 8408 4084` (failed)

### On Stripe
- Wrap Stripe Elements in `<Elements>` provider
- Use `loadStripe()` outside the component — call it once at module level
- Test card: `4242 4242 4242 4242`, any future date, any CVV

### On PayPal
- Use sandbox credentials for now — merchant will switch to live in Batch 4 settings
- Wrap with `<PayPalScriptProvider>` at the checkout page level

### On redux-persist
- Cart is already persisted — do NOT reset it on every page load
- Only call `clearCart()` after successful order confirmation

### On Authentication
- JWT token is stored wherever Batch 2 put it (check the auth slice)
- If no auth slice exists, create one with: `token`, `user`, `isAuthenticated`
- All account pages check `isAuthenticated` and redirect to login if false

### On Nigerian LGA Data
- Use a hardcoded JSON file of states + LGAs — do not call an API for this
- Create `lib/nigeria-locations.ts` with the full list
- There are 774 LGAs across 37 states/FCT — use a reliable public dataset

### On Mobile
- Cart drawer must work on mobile — test at 375px width
- Checkout form must be usable on mobile keyboard — avoid tiny inputs
- Payment buttons must be full width on mobile

---

## FILE STRUCTURE FOR BATCH 3

```
shopsofly-storefront/
├── app/
│   ├── checkout/
│   │   └── page.tsx           ← NEW
│   ├── order-confirmation/
│   │   └── page.tsx           ← NEW
│   ├── wishlist/
│   │   └── page.tsx           ← NEW
│   ├── account/
│   │   ├── layout.tsx         ← NEW
│   │   ├── orders/
│   │   │   ├── page.tsx       ← NEW
│   │   │   └── [number]/
│   │   │       └── page.tsx   ← NEW
│   │   ├── addresses/
│   │   │   └── page.tsx       ← NEW
│   │   └── profile/
│   │       └── page.tsx       ← NEW
│   └── pages/
│       └── track-order/
│           └── page.tsx       ← NEW
├── components/
│   └── CartDrawer.tsx         ← NEW
├── store/
│   └── cartSlice.ts           ← NEW (or update existing)
└── lib/
    └── nigeria-locations.ts   ← NEW
```

---

## ENVIRONMENT VARIABLES NEEDED

Add these to `.env.local` before starting:
```
NEXT_PUBLIC_API_URL=https://military-amandie-laserstarglobal-428c5069.koyeb.app
NEXT_PUBLIC_STORE_SUBDOMAIN=laserstarglobal
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxxxxxxxxxxxxxxx
```

Also add these same keys to Vercel → Environment Variables before deploying.

---

## DONE — BATCH 3 COMPLETE

When all 22 steps pass and all browser tests succeed, report back with:
- Screenshot of a completed test order on `/order-confirmation`
- Screenshot of `/account/orders` showing the test order
- Screenshot of Vercel showing "Ready" status

Then we begin Batch 4 — the Merchant Portal.
