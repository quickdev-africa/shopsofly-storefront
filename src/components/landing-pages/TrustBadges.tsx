export default function TrustBadges() {
  const badges = [
    { icon: "✅", text: "Genuine Product" },
    { icon: "🔒", text: "Secure Payment" },
    { icon: "🚚", text: "Fast Delivery" },
    { icon: "🔄", text: "Easy Returns" },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-4 py-4">
      {badges.map((b) => (
        <div key={b.text} className="flex items-center gap-2 text-sm text-gray-600">
          <span>{b.icon}</span>
          <span>{b.text}</span>
        </div>
      ))}
    </div>
  );
}

