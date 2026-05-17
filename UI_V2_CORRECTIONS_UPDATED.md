# SHOPSOFLY — UI V2 CORRECTIONS (UPDATED)
## For: GitHub Copilot Agent (VS Code Agent Mode)
### Working Directory: `/Users/user/Desktop/shopsofly-storefront`

---

## CRITICAL RULES
1. Use Node 18 for build: `source ~/.nvm/nvm.sh && nvm use 18 && npm run build`
2. Read every file BEFORE editing it
3. Build must pass with zero errors before pushing
4. Do NOT touch: `next.config.js`, `src/lib/store.ts`, `src/app/providers.tsx`

---

## FOUR THINGS TO FIX

1. Product detail page — switchable image gallery not working
2. FAQ left panel color — must be `#F97316` (orange) — same orange used everywhere in the project
3. Star Product CTA buttons — must be `#F97316` (orange) not green
4. Star Product position on homepage — move it to AFTER the "Shop by Collection" section

---

## FIX 1 — PRODUCT DETAIL SWITCHABLE IMAGE GALLERY

### Step 1a — Read the current product detail page:
```bash
cat "src/app/products/[slug]/page.tsx" | head -5
```

Check if `"use client"` is line 1. If NOT, add it as the very first line — this is required for useState.

### Step 1b — Check where the image currently renders:
```bash
grep -n "image_url\|<Image\|product\.image" "src/app/products/[slug]/page.tsx" | head -20
```

### Step 1c — Add gallery state and logic at top of component:

Inside the component function, after product data is available, add:

```tsx
const [mediaIdx, setMediaIdx] = useState(0);

type GalleryItem =
  | { type: "image"; url: string; alt: string }
  | { type: "video"; videoId: string };

const galleryItems: GalleryItem[] = [
  { type: "image", url: product.image_url, alt: product.name }
];
if (product.product_images && product.product_images.length > 0) {
  product.product_images
    .filter((img: any) => img.url !== product.image_url)
    .slice(0, 1)
    .forEach((img: any) =>
      galleryItems.push({ type: "image", url: img.url, alt: img.alt_text || product.name })
    );
}
if (product.video_url) {
  const ytMatch = product.video_url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch?.[1]) galleryItems.push({ type: "video", videoId: ytMatch[1] });
}
const currentItem = galleryItems[mediaIdx] || galleryItems[0];
const navGallery = (dir: number) =>
  setMediaIdx((i) => (i + dir + galleryItems.length) % galleryItems.length);
```

### Step 1d — Replace single product image with gallery JSX:

Find the `<Image` tag that shows `product.image_url` as the main product image and replace its entire container with:

```tsx
<div className={`flex gap-3 items-start ${galleryItems.length > 1 ? "flex-row" : "flex-col"}`}>
  {galleryItems.length > 1 && (
    <div className="flex flex-col gap-2 flex-shrink-0">
      {galleryItems.map((item, i) => (
        <button key={i} onClick={() => setMediaIdx(i)}
          className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            mediaIdx === i ? "border-[#4A7C59] shadow-sm" : "border-gray-200 hover:border-gray-400"
          }`}>
          {item.type === "video" ? (
            <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center text-white text-xl">▶</div>
          ) : (
            <div className="relative w-full h-full">
              <Image src={item.url} alt={item.alt} fill className="object-cover" sizes="64px" />
            </div>
          )}
        </button>
      ))}
    </div>
  )}
  <div className="relative rounded-2xl overflow-hidden bg-gray-50 flex-1" style={{ aspectRatio: "1/1" }}>
    {currentItem.type === "video" ? (
      <iframe src={`https://www.youtube.com/embed/${currentItem.videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen className="absolute inset-0 w-full h-full border-none" />
    ) : (
      <Image src={currentItem.url} alt={currentItem.alt} fill
        className="object-cover transition-opacity duration-300"
        sizes="(max-width:768px) 100vw, 50vw" priority />
    )}
    {galleryItems.length > 1 && (
      <>
        <button onClick={() => navGallery(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow text-base font-bold">‹</button>
        <button onClick={() => navGallery(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center shadow text-base font-bold">›</button>
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {mediaIdx + 1} / {galleryItems.length}
        </div>
      </>
    )}
  </div>
</div>
```

---

## FIX 2 — FAQ LEFT PANEL COLOR → ORANGE

Open `src/components/ProductFAQ.tsx`:

```bash
cat src/components/ProductFAQ.tsx | grep -n "bg-\[" | head -10
```

Find the left panel div background color — whatever color it currently is — and change it to `#F97316` (orange).

Also change the Contact Us button to have a dark background so it's visible on orange:

Find the `<a>` tag that is the Contact button and ensure it has:
```
className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] font-semibold px-5 py-3 rounded-full text-sm hover:bg-gray-100 transition-colors w-fit"
```

The final left panel div must look like:
```tsx
<div className="bg-[#F97316] rounded-2xl p-7 flex flex-col justify-between min-h-[260px]">
  <div>
    <h3 className="text-xl font-bold text-white mb-3 leading-tight">Still need help?</h3>
    <p className="text-sm text-white/80 leading-relaxed mb-6">
      Shoot our team a message and we&apos;ll get back to you ASAP.
    </p>
  </div>
  <a href={waLink} target="_blank" rel="noopener noreferrer"
    className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] font-semibold px-5 py-3 rounded-full text-sm hover:bg-gray-100 transition-colors w-fit">
    Contact us <span>›</span>
  </a>
</div>
```

---

## FIX 3 — STAR PRODUCT CTA BUTTONS → ORANGE

Open `src/components/StarProduct.tsx`:

```bash
grep -n "btn-add\|btn-buy\|Add To Cart\|Buy It Now\|bg-\[#4A7C59\]\|bg-\[#2D4A32\]" src/components/StarProduct.tsx
```

Find the two CTA buttons at the bottom of the info column.

Replace them with:
```tsx
<div className="flex gap-3">
  <button
    onClick={handleAdd}
    className="flex-1 bg-[#F97316] hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-sm transition-colors shadow-md"
  >
    Add To Cart
  </button>
  <Link
    href={`/products/${star.slug}`}
    className="flex-1 text-center bg-[#1A1A1A] hover:bg-[#333] text-white font-bold py-4 rounded-xl text-sm transition-colors flex items-center justify-center"
  >
    Buy It Now
  </Link>
</div>
```

---

## FIX 4 — MOVE STAR PRODUCT AFTER COLLECTIONS SECTION

Open `src/app/page.tsx`:

```bash
cat src/app/page.tsx
```

Find where `<StarProduct products={products} />` currently is (it should be between hero and stats/trust bar).

Cut it from that position and paste it AFTER the collections/shop-by-collection section.

To identify the collections section, look for:
- A section with heading "Shop by Collection" or "Collections"
- Or a section that maps over `taxons` or `collections`
- Or a `<CollectionsGrid>` component

The new order in `page.tsx` should be:
```
1. Hero Banner
2. Stats / Trust Bar
3. Featured Products (or any existing section)
4. Collections / Shop by Collection   ← StarProduct goes AFTER this
5. <StarProduct products={products} />   ← HERE
6. <PopularSection products={products} />
7. Remaining sections...
```

---

## FIX 5 — WIRE MOBILE MENU TO HEADER

### Step 5a — Read Header:
```bash
cat src/components/Header.tsx
```

### Step 5b — Add import at top of Header.tsx:
```tsx
import MobileMenu from "@/components/MobileMenu";
```

### Step 5c — Add state (ensure useState is imported from react):
```tsx
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
```

### Step 5d — Find the hamburger button
Look for a button with a menu icon (☰ or 3 lines SVG). Add `onClick={() => setMobileMenuOpen(true)}` to it.

### Step 5e — Add MobileMenu just before closing `</header>` tag:
```tsx
<MobileMenu
  isOpen={mobileMenuOpen}
  onClose={() => setMobileMenuOpen(false)}
/>
```

### Step 5f — Remove any old inline mobile nav
If there is an existing `<div>` that shows/hides mobile nav, remove it to avoid double menus.

---

## STEP 6 — BUILD

```bash
source ~/.nvm/nvm.sh && nvm use 18 && cd /Users/user/Desktop/shopsofly-storefront && npm run build 2>&1 | tail -30
```

Fix every error before continuing. Build must show `✓ Compiled successfully`.

---

## STEP 7 — COMMIT AND PUSH

```bash
cd /Users/user/Desktop/shopsofly-storefront
git add \
  "src/app/products/[slug]/page.tsx" \
  src/components/ProductFAQ.tsx \
  src/components/StarProduct.tsx \
  src/components/Header.tsx \
  src/app/page.tsx
git commit -m "fix: gallery switching, FAQ orange, star product orange CTAs + moved after collections, mobile menu wired"
git push origin main
```

---

## VERIFY AFTER DEPLOYMENT

1. Product page → thumbnails on left, big image switchable with clicks and arrows
2. Product page → scroll down → FAQ left panel is ORANGE (#F97316)
3. Homepage → Star Product section has ORANGE Add To Cart and dark Buy It Now buttons
4. Homepage → Star Product appears AFTER the collections section, not after hero
5. Mobile → hamburger button opens slide-in drawer from right
