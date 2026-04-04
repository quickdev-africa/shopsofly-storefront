"use client";
import { useEffect, useState } from "react";

export default function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const target = new Date(endDate).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) { setExpired(true); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (expired) return (
    <div className="text-center py-4">
      <p className="text-2xl font-bold text-red-500">Sale Ended</p>
    </div>
  );

  return (
    <div className="flex gap-3 justify-center">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Mins", value: timeLeft.minutes },
        { label: "Secs", value: timeLeft.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="bg-white text-[#1A1A1A] rounded-xl w-20 h-20 flex items-center justify-center text-3xl font-bold font-heading shadow-lg" style={{ backgroundColor: "#F97316", color: "white" }}>
            {String(value).padStart(2, "0")}
          </div>
          <p className="text-xs mt-1 uppercase tracking-wide font-semibold" style={{ color: "#1A1A1A" }}>{label}</p>
        </div>
      ))}
    </div>
  );
}
