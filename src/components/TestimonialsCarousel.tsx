'use client'
import { useState, useEffect } from 'react'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Amara Okonkwo',
    initials: 'AO',
    rating: 5,
    quote: 'Absolutely love the quality of the products. Delivery was fast and packaging was excellent. Will definitely be ordering again!',
  },
  {
    id: 2,
    name: 'Chidi Nwosu',
    initials: 'CN',
    rating: 5,
    quote: 'The wellness products have made a real difference to my daily routine. Great value for money and superb customer service.',
  },
  {
    id: 3,
    name: 'Fatima Bello',
    initials: 'FB',
    rating: 5,
    quote: 'Ordered twice now and both experiences were seamless. The products are exactly as described and arrive well packaged.',
  },
]

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const testimonial = TESTIMONIALS[current]

  return (
    <section className="py-16 px-4 bg-[#E8F0E9]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-10">
          What Our Customers Say
        </h2>

        <div className="bg-white rounded-2xl shadow-sm p-10 transition-all duration-500">
          {/* Stars */}
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <svg key={i} className="w-5 h-5 fill-[#F97316]" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Quote */}
          <p className="text-[#555555] text-lg leading-relaxed mb-8 italic">
            &ldquo;{testimonial.quote}&rdquo;
          </p>

          {/* Avatar + Name */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#4A7C59] flex items-center justify-center text-white font-heading font-bold text-sm">
              {testimonial.initials}
            </div>
            <span className="font-heading font-semibold text-[#1A1A1A]">{testimonial.name}</span>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === current ? 'bg-[#F97316]' : 'bg-[#4A7C59]/30'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
