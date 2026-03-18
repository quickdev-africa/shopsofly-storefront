import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-lg">
        <div className="text-9xl font-heading font-bold text-[#4A7C59] opacity-20 leading-none">404</div>
        <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] mt-4">Page Not Found</h1>
        <p className="text-[#555555] mt-3 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/"
            className="bg-[#4A7C59] hover:bg-[#2D4A32] text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="bg-[#F97316] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Shop Now →
          </Link>
        </div>
        <div className="mt-10">
          <form action="/search" method="GET" className="flex gap-2 max-w-sm mx-auto">
            <input
              type="text"
              name="q"
              placeholder="Search for a product..."
              className="flex-1 border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none"
            />
            <button type="submit" className="bg-[#1A1A1A] text-white font-semibold px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
