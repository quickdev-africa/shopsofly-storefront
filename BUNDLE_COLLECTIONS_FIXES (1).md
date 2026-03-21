# SHOPSOFLY — BUNDLE & COLLECTIONS FIXES
## For: GitHub Copilot Agent (VS Code Agent Mode)
### Working Directory: `/Users/user/Desktop/shopsofly-storefront`

---

## CRITICAL RULES
1. Use Node 18: `source ~/.nvm/nvm.sh && nvm use 18 && npm run build`
2. Read every file BEFORE editing it
3. Build must pass with zero errors before pushing
4. Do NOT touch: `next.config.js`, `src/lib/store.ts`, `src/app/providers.tsx`

---

## FOUR THINGS TO FIX

1. Collections section — redesign to horizontal scroll row with images
2. Bundle toggle — fix oversized width on desktop
3. "Better Living Bundles" heading — apply to both homepage bundle section AND /bundles page
4. Bundles page — remove double heading, remove unnecessary CTA buttons

---

## STEP 0 — READ CURRENT FILES FIRST

```bash
# Read homepage
cat src/app/page.tsx

# Read bundles page
cat src/app/bundles/page.tsx 2>/dev/null || find src -name "*.tsx" -path "*/bundles*" | head -5

# Read BundleBuilder component
cat src/components/BundleBuilder.tsx 2>/dev/null | head -60

# Find where collection/taxon section is in homepage
grep -n "collection\|taxon\|Collection\|Shop by" src/app/page.tsx | head -20
```

Paste results then continue.

---

## FIX 1 — COLLECTIONS SECTION REDESIGN (OPTION B — ICON GRID)

### What it currently looks like:
A 3-column grid of solid dark green tiles with just text — no images, uneven layout with 5 tiles (3 top, 2 bottom leaving a gap).

### What it should look like:
A clean 3-column icon grid. Each tile has:
- Small olive green rounded icon box with a relevant emoji
- Collection name in bold
- Product count in muted text below
- "Shop →" link in olive green
- Hover effect: border turns olive green, background turns light green

### Icon mapping for LaserStar Global collections:
```
Tableware & Cookware  → 🍽
Wearables & Accessories → ⌚
Wellness & Health → 💚
Personal Care → ✨
Eyewear → 👓
```
For any other collection names not listed, use `🛍` as default.

### Find the collections section in `src/app/page.tsx`

Look for a section that:
- Has heading "Shop by Collection" or maps over `taxons` or `collections`
- Has dark green tile cards

Replace the ENTIRE collections section with this:

```tsx
{/* Shop by Collection — icon grid Option B */}
{taxons && taxons.length > 0 && (
  <section className="py-14 px-4 bg-[#F8FAF8]">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A]">
            Shop by collection
          </h2>
          <p className="text-sm text-[#555] mt-1">
            Find exactly what you&apos;re looking for
          </p>
        </div>
        <Link
          href="/collections"
          className="text-sm font-semibold text-[#4A7C59] hover:underline whitespace-nowrap"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {taxons.map((taxon: any) => {
          const iconMap: Record<string, string> = {
            "tableware": "🍽",
            "cookware": "🍽",
            "wearables": "⌚",
            "accessories": "⌚",
            "wellness": "💚",
            "health": "💚",
            "personal": "✨",
            "care": "✨",
            "eyewear": "👓",
          };
          const icon = Object.entries(iconMap).find(([key]) =>
            taxon.name.toLowerCase().includes(key)
          )?.[1] ?? "🛍";

          return (
            <Link
              key={taxon.id}
              href={`/collections/${taxon.slug}`}
              className="group block"
            >
              <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#4A7C59] hover:bg-[#F8FAF8] transition-all duration-200 flex flex-col gap-3">
                <div className="w-11 h-11 bg-[#E8F0E9] rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A] text-sm leading-tight mb-1">
                    {taxon.name}
                  </p>
                  <p className="text-xs text-[#888]">
                    {taxon.products_count
                      ? `${taxon.products_count} products`
                      : "Explore range"}
                  </p>
                </div>
                <p className="text-xs font-semibold text-[#4A7C59] group-hover:underline mt-auto">
                  Shop →
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
)}
```

**Important:** The variable name for collections/taxons may differ in your homepage. Check what variable is currently used (could be `taxons`, `collections`, `categories`). Use whatever variable is already fetched. Do NOT add a new API call.

**Also check** if `Link` is already imported at the top of page.tsx. If not, add it. `Image` is NOT needed for this option.

---

## FIX 2 — BUNDLE TOGGLE WIDTH FIX

The bundle toggle (Bundle of 2 / Bundle of 4) stretches full width on desktop. It should be compact — only as wide as its content.

### Find the toggle in BundleBuilder.tsx:

```bash
grep -n "Bundle of\|toggle\|flex.*border\|border.*flex" src/components/BundleBuilder.tsx | head -20
```

Find the wrapper div that contains the two "Bundle of 2" and "Bundle of 4" buttons.

It likely looks something like:
```tsx
<div className="flex border border-[#4A7C59] rounded-xl overflow-hidden w-full">
```

Change `w-full` to `w-fit` and add `mx-auto` to center it:
```tsx
<div className="flex border border-[#4A7C59] rounded-xl overflow-hidden w-fit mx-auto">
```

If it uses a different width class (like `flex-1` on children stretching it), find the outermost wrapper and add:
```tsx
style={{ maxWidth: "fit-content", margin: "0 auto" }}
```

Verify the fix:
```bash
grep -n "Bundle of 2\|Bundle of 4\|bundleSize\|bundle.*toggle" src/components/BundleBuilder.tsx | head -10
```

---

## FIX 3 — "BETTER LIVING BUNDLES" HEADING ON HOMEPAGE

Find the bundle section on the homepage. Look for:
```bash
grep -n "Bundle\|bundle\|Curated\|curated" src/app/page.tsx | head -20
```

Find the heading of the bundle section — it might say "Curated for Better Living", "Product Bundles", or similar.

Change that heading to:
```tsx
<h2 className="...existing classes...">Better Living Bundles</h2>
```

Keep all existing classes — only change the text content.

---

## FIX 4 — BUNDLES PAGE CLEANUP

### Step 4a — Read the bundles page:
```bash
cat src/app/bundles/page.tsx
```

### Step 4b — What to fix:

The bundles page currently has:
- Two headings (e.g. "Product Bundles" AND "Curated for Better Living")
- A description
- Possibly CTA buttons ("Build Your Bundle", "See All Products")

### Step 4c — The new bundles page header should look like this:

Find the top section of the bundles page (above the BundleBuilder component) and replace it with:

```tsx
{/* Page header — single heading, no CTA buttons */}
<div className="max-w-6xl mx-auto px-4 pt-12 pb-8 text-center">
  <h1 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4">
    Better Living Bundles
  </h1>
  <p className="text-base text-[#555] max-w-xl mx-auto leading-relaxed">
    Pick your favourite products, bundle them together and save. 
    The more you bundle, the more you save — mix and match any combination.
  </p>
</div>
```

**Remove completely:**
- Any second heading (like "Curated for Better Living" or "Product Bundles" if it appears as a secondary h2)
- Any CTA buttons in the header area ("Build Your Bundle", "See All Products", etc.)
- The BundleBuilder component itself stays exactly as it is — do NOT touch it

### Step 4d — Also update the heading inside BundleBuilder if it has one:

```bash
grep -n "Curated for Better Living\|Product Bundles\|h1\|h2\|heading" src/components/BundleBuilder.tsx | head -10
```

If BundleBuilder.tsx contains its own heading like "Curated for Better Living", change it to "Better Living Bundles" too.

---

## STEP 5 — ADD scrollbar-hide TO globals.css IF MISSING

```bash
grep "scrollbar-hide" src/app/globals.css
```

If not found, add at the bottom of `src/app/globals.css`:
```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

---

## STEP 6 — BUILD

```bash
source ~/.nvm/nvm.sh && nvm use 18 && cd /Users/user/Desktop/shopsofly-storefront && npm run build 2>&1 | tail -30
```

Fix every error. Common issues:

| Error | Fix |
|---|---|
| `taxons is not defined` | Use whatever variable name holds collections in page.tsx |
| `Image is not imported` | Add `import Image from "next/image"` |
| `Link is not imported` | Add `import Link from "next/link"` |
| `gradient CSS error` | Remove `bg-gradient-to-br` if Tailwind JIT doesn't support it — use inline style instead |
| `scrollbar-hide not found` | Add to globals.css (Step 5) |

Build must show `✓ Compiled successfully`.

---

## STEP 7 — COMMIT AND PUSH

```bash
cd /Users/user/Desktop/shopsofly-storefront
git add \
  src/app/page.tsx \
  src/app/bundles/page.tsx \
  src/components/BundleBuilder.tsx \
  src/app/globals.css
git commit -m "feat: collections horizontal scroll, bundle heading, toggle width fix, bundles page cleanup"
git push origin main
```

---

## VERIFY AFTER DEPLOYMENT

1. **Homepage collections** → 3-column icon grid, each tile has olive icon box, collection name, product count, "Shop →" link. Hover turns border olive green.
2. **Homepage bundle section** → heading says "Better Living Bundles"
3. **Homepage bundle section** → toggle is compact width, centered, not full-width
4. **/bundles page** → single heading "Better Living Bundles", clean description, NO duplicate heading, NO CTA buttons above the bundler
5. **Mobile** → collections scroll horizontally without wrapping
