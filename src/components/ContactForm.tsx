"use client";
import { useState } from "react";
import { sendContact } from "@/lib/api";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      await sendContact(form);
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
      <div className="text-4xl mb-4">✅</div>
      <h3 className="font-heading font-bold text-xl text-[#1A1A1A] mb-2">Message Sent!</h3>
      <p className="text-[#555555]">Thank you for reaching out. We will get back to you within 24 hours.</p>
      <button onClick={() => setStatus("idle")} className="mt-6 text-[#4A7C59] font-semibold hover:underline">
        Send another message
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Name *</label>
          <input value={form.name} onChange={e => set("name", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C59]"
            placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Phone</label>
          <input value={form.phone} onChange={e => set("phone", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C59]"
            placeholder="08012345678" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Email *</label>
        <input value={form.email} onChange={e => set("email", e.target.value)}
          type="email"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C59]"
          placeholder="you@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Subject</label>
        <input value={form.subject} onChange={e => set("subject", e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C59]"
          placeholder="Order enquiry, product question..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Message *</label>
        <textarea value={form.message} onChange={e => set("message", e.target.value)}
          rows={5}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#4A7C59] resize-none"
          placeholder="How can we help you?" />
      </div>
      {status === "error" && (
        <p className="text-red-500 text-sm">Something went wrong. Please try again or contact us on WhatsApp.</p>
      )}
      <button
        onClick={handleSubmit}
        disabled={status === "sending"}
        className="w-full bg-[#F97316] hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
}
