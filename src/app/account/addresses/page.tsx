"use client";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks/redux";
import { selectToken } from "@/lib/features/auth/authSlice";
import { getAddresses, createAddress, updateAddress, deleteAddress } from "@/lib/api";
import { STATE_NAMES, getLGAs } from "@/lib/nigeria-locations";

interface Address {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state_name: string;
  lga: string;
  is_default?: boolean;
}

const blank = (): Omit<Address, "id"> => ({
  first_name: "", last_name: "", phone: "", address1: "", address2: "",
  city: "", state_name: "", lga: "", is_default: false,
});

export default function AccountAddressesPage() {
  const token = useAppSelector(selectToken);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [editing,   setEditing]   = useState<Address | null>(null);
  const [form,      setForm]      = useState(blank());
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");

  const lgas = getLGAs(form.state_name);

  useEffect(() => {
    if (!token) return;
    getAddresses(token)
      .then((r) => setAddresses(r.data.addresses ?? r.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const openNew = () => {
    setEditing(null);
    setForm(blank());
    setShowForm(true);
    setError("");
  };

  const openEdit = (addr: Address) => {
    setEditing(addr);
    setForm({ ...addr });
    setShowForm(true);
    setError("");
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      if (editing) {
      const res = await updateAddress(token, editing.id, form);
        const updated = res.data.address ?? res.data;
        setAddresses((prev) => prev.map((a) => (a.id === editing.id ? updated : a)));
      } else {
      const res = await createAddress(token, form);
        const created = res.data.address ?? res.data;
        setAddresses((prev) => [...prev, created]);
      }
      setShowForm(false);
    } catch {
      setError("Could not save address. Please check all fields.");
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
      alert("Could not delete address.");
    }
  };

  if (loading) return <div className="animate-pulse text-[#4A7C59] font-semibold">Loading addresses…</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-xl text-[#1A1A1A]">Saved Addresses</h2>
        {!showForm && (
          <button onClick={openNew} className="bg-[#4A7C59] hover:bg-green-800 text-white font-bold px-5 py-2 rounded-lg text-sm transition-colors">
            + Add New
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
          <h3 className="font-bold">{editing ? "Edit Address" : "New Address"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {([["first_name","First Name"],["last_name","Last Name"],["phone","Phone"],["address1","Address Line 1"],["address2","Address Line 2 (optional)"],["city","City"]] as [keyof typeof form, string][]).map(([key, label]) => (
              <div key={key} className={key === "address1" ? "sm:col-span-2" : ""}>
                <label className="block font-semibold mb-1">{label}</label>
                <input
                  type="text"
                  value={(form as any)[key] as string}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-2.5 focus:outline-none"
                />
              </div>
            ))}
            <div>
              <label className="block font-semibold mb-1">State</label>
              <select
                value={form.state_name}
                onChange={(e) => setForm((f) => ({ ...f, state_name: e.target.value, lga: "" }))}
                className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-2.5 focus:outline-none bg-white"
              >
                <option value="">Select state</option>
                {STATE_NAMES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">LGA</label>
              <select
                value={form.lga}
                onChange={(e) => setForm((f) => ({ ...f, lga: e.target.value }))}
                disabled={!form.state_name}
                className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-2.5 focus:outline-none bg-white"
              >
                <option value="">Select LGA</option>
                {lgas.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="bg-[#F97316] hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm disabled:opacity-50 transition-colors">
              {saving ? "Saving…" : "Save Address"}
            </button>
            <button onClick={() => setShowForm(false)} className="border-2 border-gray-200 hover:border-gray-400 text-[#555555] font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address cards */}
      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-12 space-y-3">
          <p className="text-4xl">📍</p>
          <p className="text-[#555555]">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white border border-gray-100 rounded-xl p-5 text-sm space-y-1 relative">
              {addr.is_default && (
                <span className="absolute top-3 right-3 bg-[#E8F0E9] text-[#4A7C59] text-xs font-bold px-2 py-0.5 rounded-full">Default</span>
              )}
              <p className="font-bold">{addr.first_name} {addr.last_name}</p>
              <p className="text-[#555555]">{addr.address1}{addr.address2 ? `, ${addr.address2}` : ""}</p>
              <p className="text-[#555555]">{addr.city}, {addr.state_name} — {addr.lga}</p>
              <p className="text-[#555555]">{addr.phone}</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => openEdit(addr)} className="text-[#4A7C59] font-semibold hover:underline text-xs">Edit</button>
                <button onClick={() => handleDelete(addr.id)} className="text-red-500 font-semibold hover:underline text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
