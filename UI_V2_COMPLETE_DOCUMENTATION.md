# SHOPSOFLY — UI V2 COMPLETE CHANGES DOCUMENTATION
## All Storefront Improvements Made After Batch 3
### Document Date: March 2026 | QuickDev Africa

---

## SECTION 1 — COMPLETE LIST OF UI CHANGES MADE

### 1.1 New Components Created

| Component | File | What It Does |
|---|---|---|
| ProductCard | `src/components/ProductCard.tsx` | Unified portrait card (3:4 ratio) used on every product grid. Quick Buy + always-visible Add to Cart button. Hover effect. Discount badge. Category label. |
| StarProduct | `src/components/StarProduct.tsx` | Hero product section. Thumbnails left, big image/video center, info right. Supports up to 3 images + YouTube video. Orange CTA buttons. Quantity stepper. |
| PopularSection | `src/components/PopularSection.tsx` | "Most Popular Products" — 3 portrait cards at a time, left/right arrow buttons navigate through up to 6 products. |
| ProductTestimonials | `src/components/ProductTestimonials.tsx` | Text, YouTube, and audio testimonials on product detail page. Shows only when data exists. |
| ProductFAQ | `src/components/ProductFAQ.tsx` | FAQ accordion on product detail page. Orange left panel with WhatsApp CTA. 5 default questions. Splits into 1/3 + 2/3 columns on desktop. |
| MobileMenu | `src/components/MobileMenu.tsx` | Slide-in drawer from right. Nav links, quick access links, Quick Shop strip (3 scrollable product cards with cart icon button), closes on route change. |
| ProductGallery | `src/components/product-page/ProductGallery.tsx` | Switchable image/video gallery on product detail page. Thumbnails left column, big main media right. Supports mix of images and YouTube video. |

### 1.2 Homepage Changes (`src/app/page.tsx`)

| Change | Details |
|---|---|
| Star Product section | Added after Shop by Collection section. Shows highest-priced product. |
| "Most Popular Products" | Replaced "New Arrivals" / "Fresh Drops". 3 portrait cards, arrow navigation. |
| Shop by Collection | Replaced solid green grid with icon grid (Option B). Olive icon boxes, collection name, product count, "Shop →". Cards use `#E8F0E9` green background. |
| Bundle section heading | Changed to "Better Living Bundles" |
| Featured Products | All product cards use unified ProductCard component with Add to Cart button. |

### 1.3 Product Detail Page Changes (`src/app/products/[slug]/page.tsx`)

| Change | Details |
|---|---|
| Image gallery | Replaced single image with ProductGallery — thumbnails left, switchable main image/video |
| Testimonials section | Added ProductTestimonials below description — shows text/YouTube/audio |
| FAQ section | Added ProductFAQ below testimonials — orange panel + accordion |

### 1.4 Collections Page Changes (`src/app/collections/page.tsx`)

| Change | Details |
|---|---|
| Collection icons | Added emoji icon boxes to each collection tile matching homepage style |

### 1.5 Bundles Page Changes (`src/app/bundles/page.tsx`)

| Change | Details |
|---|---|
| Single heading | "Better Living Bundles" — one heading only |
| Clean description | Generic description that works for any merchant's products |
| Removed duplicate heading | BundleBuilder internal heading removed |
| Removed CTA buttons | "Build Your Bundle" and "See All Products" buttons removed — page IS the bundler |

### 1.6 BundleBuilder Component Changes (`src/components/BundleBuilder.tsx`)

| Change | Details |
|---|---|
| Toggle width fix | Changed from `w-full` to `w-fit mx-auto` — toggle is now compact and centered on desktop |
| Heading removed | Internal "Better Living Bundles" heading removed to prevent duplication |

### 1.7 Account Section Changes

| Change | Details |
|---|---|
| Account layout | Sidebar nav (desktop) + top tabs (mobile). Auth guard using PersistGate. |
| Profile page | Pre-fills from API, email read-only, password change section |
| Orders page | Status badges, formatted dates/prices, View Details links |
| Addresses page | Add/delete addresses, Nigerian states dropdown |
| Login fix | `useRef` in Providers prevents new Redux store on every render — fixes PersistGate timing |

### 1.8 Header Changes (`src/components/Header.tsx`)

| Change | Details |
|---|---|
| Mobile menu wired | Hamburger button now opens MobileMenu drawer |
| MobileMenu imported | Full improved mobile menu replaces old inline nav |

---

## SECTION 2 — MULTI-TENANT CONFIRMATION

### ✅ All UI changes automatically apply to every new merchant store

The DP2.0 storefront is built ONCE on Next.js and deployed ONCE on Vercel. Every merchant shares the same code. What makes each store look different is ONLY the data returned by the Rails API per subdomain.

This means:
- Every new merchant gets StarProduct, PopularSection, ProductFAQ, icon collections, mobile menu, gallery — everything — on Day 1 automatically
- No code changes needed per merchant
- Merchant Portal (Batch 4) will let merchants configure WHAT DATA appears in these sections

---

## SECTION 3 — ITEMS THAT NEED RAILS/DATABASE WORK BEFORE THEY FULLY FUNCTION

These UI components exist and render correctly but show empty/default content because the Rails API does not yet return the required data fields.

### 3.1 Product Images Gallery — NEEDS RAILS WORK

**Current situation:** `ProductGallery` checks for `product.product_images` array but the Rails `ProductsController` does not include `product_images` in its JSON response.

**Impact:** Gallery only shows 1 image (the main `image_url`). Thumbnail strip only appears if multiple images exist in the response.

**What needs to happen in Rails (Batch 4):**
```ruby
# In Api::V2::Storefront::ProductsController#show
# Add product_images to the JSON response:
render json: {
  ...product fields...,
  product_images: product.product_images.order(:position).map { |img|
    { id: img.id, url: img.url, position: img.position, alt_text: img.alt_text }
  },
  testimonials: product.testimonials.where(active: true).order(:position).map { |t|
    { id: t.id, kind: t.kind, body: t.body, media_url: t.media_url, author: t.author }
  },
  video_url: nil  # merchant sets this in Batch 4 portal
}
```

**Database:** `product_images` table already exists from Batch 1 ✅. No migration needed.

### 3.2 Product Testimonials — NEEDS RAILS WORK

**Current situation:** `ProductTestimonials` checks for `product.testimonials` array but Rails does not include testimonials in the product API response.

**Impact:** Testimonials section is invisible on all product pages (correct behaviour — it hides when empty). But merchants cannot add testimonials until the Merchant Portal is built.

**What needs to happen:**
- Rails: Include testimonials in product detail response (see 3.1 above)
- Merchant Portal (Batch 4): Build testimonials management UI
- Database: `product_testimonials` table already exists ✅

### 3.3 Star Product — PARTIAL

**Current situation:** StarProduct auto-selects the highest-priced product. This works. However it would be better if the merchant can choose which product is the star product.

**Impact:** Currently always shows the highest-priced product. Functional but not merchant-configurable.

**What needs to happen in Batch 4:**
- Add `is_featured: boolean` column to products table (new migration needed)
- Or use `store_theme_settings.settings` JSON to store `featured_product_id`
- Merchant Portal: Let merchant pick their star product
- Rails: Return `featured_product` in the store API response

**Recommended approach:** Store `featured_product_slug` in `store_theme_settings.settings` JSON — no new migration needed, just a new key in the existing JSONB column.

### 3.4 Mobile Menu Quick Shop Products — NEEDS DATA WIRING

**Current situation:** MobileMenu accepts `featuredProducts` prop but the Header currently passes an empty array `[]`.

**Impact:** Quick Shop strip in mobile menu shows nothing.

**What needs to happen:**
The Header is a server component that fetches store data. It needs to also fetch a small product list to pass to MobileMenu.

**Fix in Batch 4 (simple):**
In the Header or root layout, fetch 3 products and pass them down:
```tsx
// In Header or GlobalLayout
const productsRes = await getProducts({ per_page: 3, sort: 'popular' });
const featuredProducts = productsRes?.data?.products || [];
// Pass to MobileMenu
<MobileMenu featuredProducts={featuredProducts} />
```

No Rails or database change needed — just wiring existing API data to the component.

### 3.5 Product FAQ — HARDCODED DEFAULTS

**Current situation:** ProductFAQ shows 5 hardcoded default questions that are the same for every product on every store.

**Impact:** Functional and looks good, but questions are not product-specific or merchant-customisable.

**What needs to happen in Batch 5:**
- Add FAQ management to Merchant Portal
- Store FAQs in `store_pages` table or a new `product_faqs` table
- Rails: Return FAQs in product or store response
- Storefront: Replace defaults with merchant FAQs when available

**Database:** No migration needed yet — defaults work fine for now.

### 3.6 Collections — Product Count Shows "Explore range"

**Current situation:** Collection tiles show "Explore range" instead of actual product count because `taxon.products_count` is not returned by the Rails taxons API.

**Impact:** Minor — tiles look fine but product count is missing.

**Fix in Batch 4:**
```ruby
# In Api::V2::Storefront::TaxonsController
render json: taxons.map { |t|
  {
    id: t.id, name: t.name, slug: t.slug, image_url: t.image_url,
    products_count: t.products.where(status: 'active').count  # ADD THIS
  }
}
```

No migration needed ✅

### 3.7 Bundle Toggle — Save Percentage Shows "12.0%"

**Current situation:** Bundle toggle shows "Save 12.0%" with decimal — should be "Save 12%".

**Fix:** Simple JavaScript formatting in BundleBuilder:
```tsx
// Change:
`Save ${bundle.discount_percent}%`
// To:
`Save ${Math.round(bundle.discount_percent)}%`
```

No Rails or database change needed.

---

## SECTION 4 — SUMMARY: WHAT NEEDS ACTION BEFORE/DURING BATCH 4

### Must do in Batch 4 Rails API:
| Item | Work Required | Migration? |
|---|---|---|
| Product images in API response | Add `product_images` to products#show | No ✅ |
| Testimonials in API response | Add `testimonials` to products#show | No ✅ |
| Products count on taxons | Add `products_count` to taxons response | No ✅ |
| Featured product for Star section | Add `featured_product_slug` to theme_settings | No ✅ |

### Must do in Batch 4 Merchant Portal:
| Item | Details |
|---|---|
| Product images upload | Merchant uploads up to 6 images per product |
| Testimonials management | Add text/YouTube/audio testimonials per product |
| Star Product picker | Merchant selects which product is featured |
| Product video URL | Merchant adds YouTube URL to product |

### Simple code fixes (can do now, before Batch 4):
| Item | File | Fix |
|---|---|---|
| Bundle percentage decimal | `BundleBuilder.tsx` | `Math.round(discount_percent)` |
| Mobile menu products | `Header.tsx` | Fetch and pass 3 products to MobileMenu |
| Collections product count | `TaxonsController` | Add `products_count` to response |

---

## SECTION 5 — ARCHITECTURE CONFIRMATION

All UI changes follow the correct DP2.0 multi-tenant architecture:

```
New merchant signs up
        ↓
Rails seeds DefaultCatalogService (10 products, 5 collections)
        ↓
Next.js storefront fetches from API using merchant subdomain
        ↓
ALL UI components render with merchant's data automatically:
  ✅ StarProduct → shows their highest-priced product
  ✅ PopularSection → shows their products
  ✅ Collection icons → maps to their collection names
  ✅ Mobile menu → shows their products (once wired)
  ✅ ProductGallery → shows their images (once API returns them)
  ✅ ProductFAQ → shows default questions (merchant edits in Batch 5)
  ✅ ProductTestimonials → hidden until merchant adds them
  ✅ BundleBuilder → shows their bundles (once merchant creates them)
```

**Zero code changes needed per merchant. Everything is data-driven.**

---

## SECTION 6 — RECOMMENDATION BEFORE BATCH 4

Do these 3 quick fixes NOW (30 minutes total) before starting Batch 4:

**Fix A** — Bundle percentage decimal (1 line in BundleBuilder.tsx)
**Fix B** — Collections product count (1 line in TaxonsController on Rails)
**Fix C** — Mobile menu products (wire Header to pass products to MobileMenu)

Then Batch 4 can focus on building the full Merchant Portal knowing the storefront is 100% clean.

---

*Document compiled: March 2026 | Shopsofly Platform v4.0 | QuickDev Africa*
