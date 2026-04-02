"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks/redux";
import { selectToken } from "@/lib/features/auth/authSlice";
import { getAddresses, createAddress, deleteAddress } from "@/lib/api";

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara"
];

const emptyForm = {
  firstname: "", lastname: "", address1: "", address2: "",
  city: "", state_name: "", lga: "", phone: "", country: "Nigeria"
};

export default function AddressesPage() {
  const token = useAppSelector(selectToken);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getAddresses(token)
      .then((res) => setAddresses(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError("");
    setSaving(true);
    try {
      const res = await createAddress(token, form);
      setAddresses((prev) => [res.data, ...prev]);
      setForm(emptyForm);
      setShowForm(false);
    } catch (err: any) {
      setError(err?.response?.data?.errors?.join(", ") || "Failed to save address.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm("Delete this address?")) return;
    try {
      await deleteAddress(token, id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete address.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#1A1A1A]">Saved Addresses</h2>
          <p className="text-sm text-[#555555]">{addresses.length} address{addresses.length !== 1 ? "es" : ""} saved</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#4A7C59] hover:bg-[#2D4A32] text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Address"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-[#1A1A1A] mb-5">New Address</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "First Name", key: "firstname", placeholder: "First name" },
                { label: "Last Name", key: "lastname", placeholder: "Last name" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">{label}</label>
                  <input
                    type="text"
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    required
                    placeholder={placeholder}
                    className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Address Line 1</label>
              <input
                type="text"
                value={form.address1}
                onChange={(e) => setForm((f) => ({ ...f, address1: e.target.value }))}
                required
                placeholder="Street address"
                className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Address Line 2 <span className="font-normal text-[#555555]">(optional)</span></label>
              <input
                type="text"
                value={form.address2}
                onChange={(e) => setForm((f) => ({ ...f, address2: e.target.value }))}
                placeholder="Apartment, suite, etc."
                className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  required
                  placeholder="City"
                  className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">State</label>
                <select
                  value={form.state_name}
                  onChange={(e) => setForm((f) => ({ ...f, state_name: e.target.value }))}
                  required
                  className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors bg-white"
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">LGA</label>
                <input
                  type="text"
                  value={form.lga}
                  onChange={(e) => setForm((f) => ({ ...f, lga: e.target.value }))}
                  placeholder="LGA"
                  className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
                placeholder="080XXXXXXXX"
                className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Address"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm(emptyForm); setError(""); }}
                className="bg-gray-100 hover:bg-gray-200 text-[#555555] font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address list */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#4A7C59] border-t-transparent rounded-full mx-auto" />
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">📍</div>
          <h3 className="font-bold text-[#1A1A1A] mb-2">No saved addresses</h3>
          <p className="text-[#555555] text-sm">Add an address to speed up checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr: any) => (
            <div key={addr.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              {addr.is_default && (
                <span className="inline-block text-xs font-semibold bg-[#E8F0E9] text-[#4A7C59] px-2 py-0.5 rounded-full mb-3">
                  Default
                </span>
              )}
              <p className="font-semibold text-[#1A1A1A]">{addr.firstname} {addr.lastname}</p>
              <p className="text-sm text-[#555555] mt-1">{addr.address1}</p>
              {addr.address2 && <p className="text-sm text-[#555555]">{addr.address2}</p>}
              <p className="text-sm text-[#555555]">{addr.city}, {addr.state_name}</p>
              {addr.lga && <p className="text-sm text-[#555555]">{addr.lga}</p>}
              <p className="text-sm text-[#555555]">{addr.phone}</p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
