'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

interface Variant {
  id: number
  price: number
  stock_count: number
  options: Record<string, string>
}

interface Product {
  id: number
  name: string
  slug: string
  price: number | null
  compare_at_price?: number | null
  image_url?: string
  variants?: Variant[]
}

interface BundleItem {
  product_id: number
  quantity: number
  unit_price: number | null
  product_name?: string
  image_url?: string
}

interface Bundle {
  id: number
  name: string
  slug: string
  description?: string
  discount_percent: number
  items: BundleItem[]
}

interface Props {
  bundles: Bundle[]
  storeProducts: Product[]
}

const BUNDLE_SIZES = [2, 4] as const
type BundleSize = typeof BUNDLE_SIZES[number]

function ProductImage({ src, alt, size = 64 }: { src?: string; alt: string; size?: number }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="w-full h-full object-cover"
      />
    )
  }
  return (
    <div className="w-full h-full bg-[#E8F0E9] flex items-center justify-center">
      <span className="text-[#4A7C59] text-xs font-semibold text-center px-1 line-clamp-2">{alt}</span>
    </div>
  )
}

function fmt(price: number | null | undefined): string {
  if (price == null || isNaN(price)) return '₦—'
  return `₦${price.toLocaleString()}`
}

export default function BundleBuilder({ bundles, storeProducts }: Props) {
  const firstBundle = bundles[0]

  // If storeProducts not yet returned by API, derive products from bundle items
  const effectiveProducts: Product[] =
    storeProducts.length > 0
      ? storeProducts
      : (firstBundle?.items ?? []).map((item) => ({
          id:        item.product_id,
          name:      item.product_name ?? 'Product',
          slug:      '',
          price:     item.unit_price,
          image_url: item.image_url,
          variants:  [],
        }))

  const anchorProduct: Product | undefined =
    firstBundle?.items[0]?.product_id
      ? effectiveProducts.find((p) => p.id === firstBundle.items[0].product_id) ??
        ({
          id:        firstBundle.items[0].product_id,
          name:      firstBundle.items[0].product_name ?? 'Anchor Product',
          slug:      '',
          price:     firstBundle.items[0].unit_price,
          image_url: firstBundle.items[0].image_url,
        } as Product)
      : effectiveProducts[0]

  const carouselProducts = effectiveProducts.filter((p) => p.id !== anchorProduct?.id)

  const [bundleSize, setBundleSize] = useState<BundleSize>(2)
  // selected = products chosen by customer (not counting anchor)
  const [selected, setSelected] = useState<Product[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [variantSelections, setVariantSelections] = useState<Record<number, number>>({})

  const scrollRef = useRef<HTMLDivElement>(null)

  if (!bundles.length || !anchorProduct) return null

  const discountPercent =
    bundleSize === 2
      ? firstBundle?.discount_percent ?? 6
      : (firstBundle?.discount_percent ?? 6) * 2 > 100
      ? 12
      : (firstBundle?.discount_percent ?? 6) * 2

  const slotsNeeded = bundleSize - 1 // anchor fills 1 slot
  const bundleComplete = selected.length === slotsNeeded

  const allSelected = [anchorProduct, ...selected]
  const subtotal = allSelected.reduce((sum, p) => sum + (p.price ?? 0), 0)
  const savingsAmount = Math.round(subtotal * (discountPercent / 100))
  const totalAfterDiscount = subtotal - savingsAmount

  function toggleProduct(product: Product) {
    setSelected((prev) => {
      const already = prev.find((p) => p.id === product.id)
      if (already) return prev.filter((p) => p.id !== product.id)
      if (prev.length >= slotsNeeded) return prev
      return [...prev, product]
    })
  }

  function scroll(dir: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  function setVariant(productId: number, variantId: number) {
    setVariantSelections((prev) => ({ ...prev, [productId]: variantId }))
  }

  function handleAddToCart() {
    setDrawerOpen(false)
    setTimeout(() => setCartOpen(true), 300)
  }

  const sidebarVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 260 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <section className="py-12 md:py-20 px-4 bg-[#F8FAF8]">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-8 md:mb-10">
          <h2 className="font-heading text-2xl md:text-4xl font-bold text-[#1A1A1A]">
            Better Living Bundles
          </h2>
          <p className="text-[#555555] mt-2 text-sm md:text-base">
            Pick {slotsNeeded} more product{slotsNeeded !== 1 ? 's' : ''} to complete your bundle and save {discountPercent}%
          </p>
        </div>

        {/* Bundle Size Toggle */}
        <div className="flex w-fit mx-auto mb-8 border-2 border-[#4A7C59] rounded-lg overflow-hidden">
          {BUNDLE_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => { setBundleSize(size); setSelected([]) }}
              className={`flex-1 md:flex-none md:px-8 py-3 text-sm font-semibold transition-colors min-h-[44px] ${
                bundleSize === size
                  ? 'bg-[#4A7C59] text-white'
                  : 'bg-white text-[#4A7C59] hover:bg-[#E8F0E9]'
              }`}
            >
              Bundle of {size} — Save {size === 2 ? (firstBundle?.discount_percent ?? 6) : Math.min((firstBundle?.discount_percent ?? 6) * 2, 12)}%
            </button>
          ))}
        </div>

        {/* Main layout */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">

          {/* Anchor Product */}
          <div className="w-full md:w-64 shrink-0">
            <p className="text-xs font-semibold text-[#4A7C59] uppercase tracking-widest mb-3">Your Anchor Product</p>
            <div className="border-2 border-[#4A7C59] rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="aspect-square w-full bg-gray-100">
                <ProductImage src={anchorProduct.image_url} alt={anchorProduct.name} size={256} />
              </div>
              <div className="p-4">
                <p className="font-semibold text-[#1A1A1A] text-sm line-clamp-2">{anchorProduct.name}</p>
                <p className="font-bold text-[#1A1A1A] mt-1">{fmt(anchorProduct.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#4A7C59] flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs text-[#4A7C59] font-semibold">Included</span>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#555555] uppercase tracking-widest">
                Choose {slotsNeeded - selected.length} more ({selected.length}/{slotsNeeded} selected)
              </p>
              {/* Arrow buttons — hidden on mobile */}
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => scroll('left')}
                  className="w-9 h-9 rounded-full border-2 border-[#4A7C59] text-[#4A7C59] flex items-center justify-center hover:bg-[#4A7C59] hover:text-white transition-colors"
                  aria-label="Scroll left"
                >
                  ←
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="w-9 h-9 rounded-full border-2 border-[#4A7C59] text-[#4A7C59] flex items-center justify-center hover:bg-[#4A7C59] hover:text-white transition-colors"
                  aria-label="Scroll right"
                >
                  →
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto pb-2 touch-pan-x"
              style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
            >
              {carouselProducts.map((product) => {
                const isSelected = selected.some((p) => p.id === product.id)
                const isDisabled = !isSelected && selected.length >= slotsNeeded
                return (
                  <button
                    key={product.id}
                    onClick={() => !isDisabled && toggleProduct(product)}
                    disabled={isDisabled}
                    className={`shrink-0 w-[200px] md:w-[220px] rounded-xl overflow-hidden border-2 text-left transition-all min-h-[44px] ${
                      isSelected
                        ? 'border-[#4A7C59] bg-white shadow-md'
                        : isDisabled
                        ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                        : 'border-gray-200 bg-white hover:border-[#4A7C59] hover:shadow-sm'
                    }`}
                  >
                    <div className="aspect-square w-full bg-gray-100 relative">
                      <ProductImage src={product.image_url} alt={product.name} size={220} />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#4A7C59] flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-[#1A1A1A] line-clamp-2 leading-snug">{product.name}</p>
                      <p className="text-xs font-bold text-[#1A1A1A] mt-1">{fmt(product.price)}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Savings Bar */}
        <div className={`mt-8 rounded-xl border-2 p-4 md:p-6 transition-all ${bundleComplete ? 'border-[#4A7C59] bg-white shadow-md' : 'border-gray-200 bg-white'}`}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Product avatars */}
            <div className="flex flex-wrap items-center gap-2">
              {allSelected.map((p, i) => (
                <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[#4A7C59] bg-gray-100 shrink-0">
                  <ProductImage src={p.image_url} alt={p.name} size={48} />
                </div>
              ))}
              {Array.from({ length: Math.max(0, slotsNeeded - selected.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center shrink-0">
                  <span className="text-gray-300 text-lg font-bold">+</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="flex flex-col gap-1 md:text-right">
              <div className="flex items-center gap-3 md:justify-end flex-wrap">
                <span className="text-gray-400 line-through text-sm">{fmt(subtotal)}</span>
                {bundleComplete && (
                  <span className="bg-[#F97316] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    Save {fmt(savingsAmount)} ({discountPercent}%)
                  </span>
                )}
              </div>
              <span className="font-heading font-bold text-xl md:text-2xl text-[#1A1A1A]">
                {bundleComplete ? fmt(totalAfterDiscount) : fmt(subtotal)}
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => bundleComplete && setDrawerOpen(true)}
              disabled={!bundleComplete}
              className={`w-full md:w-auto min-h-[44px] px-8 py-3 rounded-lg font-semibold text-sm transition-all ${
                bundleComplete
                  ? 'bg-[#4A7C59] text-white hover:bg-[#2D4A32] shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {bundleComplete ? 'View Bundle →' : `Select ${slotsNeeded - selected.length} more`}
            </button>
          </div>
        </div>
      </div>

      {/* Bundle Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="bundle-overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              key="bundle-drawer"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-full md:max-w-[520px] bg-white z-50 flex flex-col shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                  Your Bundle ({bundleSize} items)
                </h3>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[#555555] hover:bg-gray-200 transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                {allSelected.map((product) => {
                  const variants = product.variants ?? []
                  const selectedVariantId = variantSelections[product.id]
                  return (
                    <div key={product.id} className="flex gap-4 border border-gray-100 rounded-xl p-3">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <ProductImage src={product.image_url} alt={product.name} size={80} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1A1A1A] text-sm line-clamp-2">{product.name}</p>
                        <p className="text-sm font-bold text-[#1A1A1A] mt-0.5">{fmt(product.price)}</p>
                        {variants.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-[#555555] mb-1">Variant</p>
                            <div className="flex flex-wrap gap-1.5">
                              {variants.map((v) => (
                                <button
                                  key={v.id}
                                  onClick={() => setVariant(product.id, v.id)}
                                  className={`px-2.5 py-1 text-xs rounded-md border transition-colors min-h-[36px] ${
                                    selectedVariantId === v.id
                                      ? 'border-[#4A7C59] bg-[#E8F0E9] text-[#4A7C59] font-semibold'
                                      : 'border-gray-200 text-[#555555] hover:border-[#4A7C59]'
                                  }`}
                                >
                                  {Object.values(v.options ?? {}).join(' / ') || `Option ${v.id}`}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Drawer Footer */}
              <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 space-y-3">
                <div className="flex justify-between text-sm text-[#555555]">
                  <span>Original total</span>
                  <span className="line-through">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#22C55E] font-semibold">
                  <span>Bundle discount ({discountPercent}%)</span>
                  <span>- {fmt(savingsAmount)}</span>
                </div>
                <div className="flex justify-between font-heading font-bold text-lg text-[#1A1A1A]">
                  <span>Total</span>
                  <span>{fmt(totalAfterDiscount)}</span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full min-h-[48px] bg-[#F97316] hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
                >
                  Add Bundle to Cart
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Confirmation Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              key="cart-overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              key="cart-drawer"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-full w-full md:max-w-[400px] bg-white z-50 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">Added to Cart!</h3>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[#555555] hover:bg-gray-200 transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-[#E8F0E9] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#4A7C59]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-heading font-bold text-xl text-[#1A1A1A] mb-1">Bundle of {bundleSize} added</p>
                  <p className="text-[#555555] text-sm">
                    You saved {fmt(savingsAmount)} ({discountPercent}% off)
                  </p>
                </div>
                <div className="w-full space-y-3">
                  <a
                    href="/cart"
                    className="block w-full min-h-[48px] bg-[#F97316] hover:bg-orange-600 text-white font-bold rounded-lg flex items-center justify-center transition-colors"
                  >
                    View Cart
                  </a>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="block w-full min-h-[48px] border-2 border-[#4A7C59] text-[#4A7C59] font-semibold rounded-lg hover:bg-[#E8F0E9] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
