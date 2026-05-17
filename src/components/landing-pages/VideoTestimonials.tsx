interface Testimonial {
  youtube_url?: string;
  customer_name: string;
  location?: string;
  rating?: number;
  quote?: string;
}
function YoutubeEmbed({ url }: { url: string }) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  const id = match ? match[1] : "";
  if (!id) return null;
  return (
    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
      <iframe
        src={"https://www.youtube.com/embed/" + id}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
export default function VideoTestimonials({ testimonials, title }: { testimonials?: Testimonial[]; title?: string }) {
  const defaults: Testimonial[] = Array(4).fill({
    customer_name: "Happy Customer", location: "Lagos", rating: 5,
    quote: "Amazing product! Highly recommended."
  });
  const items = testimonials && testimonials.length > 0 ? testimonials : defaults;
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading text-3xl font-bold text-center text-[#1A1A1A] mb-10">
          {title || "What Our Customers Say"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.slice(0, 4).map((t, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {t.youtube_url ? (
                <YoutubeEmbed url={t.youtube_url} />
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Video testimonial
                </div>
              )}
              <div className="p-4">
                <div className="flex text-yellow-400 text-sm mb-1">
                  {"★".repeat(t.rating || 5)}{"☆".repeat(5 - (t.rating || 5))}
                </div>
                {t.quote && <p className="text-sm text-gray-600 italic mb-2">&quot;{t.quote}&quot;</p>}
                <p className="text-sm font-semibold text-[#1A1A1A]">{t.customer_name}</p>
                {t.location && <p className="text-xs text-gray-400">{t.location}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
