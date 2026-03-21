# SHOPSOFLY — ACCOUNT LAYOUT FIX
## For: GitHub Copilot Agent (VS Code Agent Mode)
### Working Directory: `/Users/user/Desktop/shopsofly-storefront`

---

## CRITICAL RULES

1. Only edit files listed in this brief — do not touch anything else
2. Run `npm run build` after ALL changes are made — fix every error before pushing
3. Do not install any new packages — use only what is already installed
4. Do not change `next.config.js`
5. Push only after build passes with zero errors

---

## WHAT TO BUILD

Replace the account section with a fully designed layout that includes:
- Sidebar navigation on desktop
- Top tabs on mobile
- All account pages pre-filling data from the API
- Proper auth guards on protected pages
- DP2.0 brand colors throughout

---

## STEP 1 — REPLACE `src/app/account/layout.tsx`

Replace the entire file with this exact content:

```tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { logout, selectIsAuthenticated, selectUser } from "@/lib/features/auth/authSlice";
import { clearCart } from "@/lib/features/carts/cartsSlice";

const navLinks = [
  { href: "/account/profile", label: "My Profile", icon: "👤" },
  { href: "/account/orders", label: "My Orders", icon: "📦" },
  { href: "/account/addresses", label: "My Addresses", icon: "📍" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    router.push("/");
  };

  // Don't apply auth guard to login and register pages
  const isAuthPage = pathname === "/account/login" || pathname === "/account/register";
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Redirect unauthenticated users from protected pages
  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      router.push("/account/login");
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">
            My Account
          </h1>
          {user && (
            <p className="text-[#555555] text-sm mt-1">
              Welcome back, {user.first_name || user.email}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <nav className="flex flex-col">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href ||
                    (link.href === "/account/orders" && pathname.startsWith("/account/orders"));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-b border-gray-50 last:border-0 ${
                        isActive
                          ? "bg-[#E8F0E9] text-[#4A7C59] border-l-4 border-l-[#4A7C59]"
                          : "text-[#555555] hover:bg-gray-50 hover:text-[#1A1A1A]"
                      }`}
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <span>🚪</span>
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Top tabs — mobile */}
          <div className="lg:hidden">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-1 overflow-x-auto">
              {navLinks.map((link) => {
                const isActive = pathname === link.href ||
                  (link.href === "/account/orders" && pathname.startsWith("/account/orders"));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-[#4A7C59] text-white"
                        : "text-[#555555] hover:bg-gray-100"
                    }`}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 whitespace-nowrap transition-colors ml-auto"
              >
                <span>🚪</span>
                Logout
              </button>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
```

---

## STEP 2 — REPLACE `src/app/account/profile/page.tsx`

Replace the entire file with this exact content:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { selectToken, selectUser, updateUser } from "@/lib/features/auth/authSlice";
import { getAccount, updateAccount } from "@/lib/api";

export default function ProfilePage() {
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getAccount(token)
      .then((res) => {
        const data = res.data;
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setPhone(data.phone || "");
      })
      .catch(() => {});
  }, [token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError("");
    setSuccess("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, string> = {
        first_name: firstName,
        last_name: lastName,
        phone,
      };
      if (newPassword) {
        payload.password = newPassword;
        payload.current_password = currentPassword;
      }

      await updateAccount(token, payload);
      dispatch(updateUser({ first_name: firstName, last_name: lastName, phone }));
      setSuccess("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err?.response?.data?.errors?.join(", ") || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Personal Details</h2>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Email — read only */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full border-2 border-gray-100 bg-gray-50 rounded-lg px-4 py-3 text-[#555555] cursor-not-allowed"
            />
            <p className="text-xs text-[#555555] mt-1">Email cannot be changed.</p>
          </div>

          {/* Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
                placeholder="Last name"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
              placeholder="080XXXXXXXX"
            />
          </div>

          {success && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              ✅ {success}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-[#1A1A1A] mb-6">Change Password</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving || !currentPassword || !newPassword}
            className="bg-[#4A7C59] hover:bg-[#2D4A32] text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-40"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## STEP 3 — REPLACE `src/app/account/orders/page.tsx`

Replace the entire file with this exact content:

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks/redux";
import { selectToken } from "@/lib/features/auth/authSlice";
import { getOrders } from "@/lib/api";

const STATUS_STYLES: Record<string, string> = {
  pending:           "bg-amber-100 text-amber-700",
  payment_confirmed: "bg-blue-100 text-blue-700",
  processing:        "bg-blue-100 text-blue-700",
  shipped:           "bg-purple-100 text-purple-700",
  ready_for_pickup:  "bg-purple-100 text-purple-700",
  delivered:         "bg-green-100 text-green-700",
  picked_up:         "bg-green-100 text-green-700",
  completed:         "bg-green-100 text-green-700",
  cancelled:         "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  pending:           "Pending",
  payment_confirmed: "Payment Confirmed",
  processing:        "Processing",
  shipped:           "Shipped",
  ready_for_pickup:  "Ready for Pickup",
  delivered:         "Delivered",
  picked_up:         "Picked Up",
  completed:         "Completed",
  cancelled:         "Cancelled",
};

function formatPrice(amount: number | string) {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `₦${num.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric", month: "short", year: "numeric"
  });
}

export default function OrdersPage() {
  const token = useAppSelector(selectToken);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getOrders(token)
      .then((res) => {
        const data = res.data;
        setOrders(data.orders || data || []);
      })
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#4A7C59] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-[#555555]">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">No orders yet</h3>
        <p className="text-[#555555] mb-6">When you place an order, it will appear here.</p>
        <Link
          href="/products"
          className="bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#1A1A1A]">Order History</h2>
        <p className="text-sm text-[#555555]">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="divide-y divide-gray-50">
        {orders.map((order: any) => (
          <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.state] || "bg-gray-100 text-gray-600"}`}>
                  {STATUS_LABELS[order.state] || order.state}
                </span>
                <span className="font-mono text-sm font-semibold text-[#1A1A1A]">
                  #{order.number}
                </span>
                <span className="text-sm text-[#555555]">
                  {order.item_count} item{order.item_count !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-[#1A1A1A]">{formatPrice(order.total)}</p>
                  <p className="text-xs text-[#555555]">{formatDate(order.created_at)}</p>
                </div>
                <Link
                  href={`/account/orders/${order.number}`}
                  className="text-sm font-semibold text-[#4A7C59] hover:underline whitespace-nowrap"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## STEP 4 — REPLACE `src/app/account/addresses/page.tsx`

Replace the entire file with this exact content:

```tsx
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
```

---

## STEP 5 — VERIFY `src/lib/features/auth/authSlice.ts` HAS `updateUser`

Run:
```bash
grep "updateUser" src/lib/features/auth/authSlice.ts
```

If `updateUser` is NOT exported, add it to the reducers in that file:
```typescript
updateUser: (state, action: PayloadAction<Partial<User>>) => {
  if (state.user) {
    state.user = { ...state.user, ...action.payload };
  }
},
```
And add it to the exports line:
```typescript
export const { setCredentials, logout, updateUser } = authSlice.actions;
```

---

## STEP 6 — VERIFY `src/lib/features/carts/cartsSlice.ts` HAS `clearCart`

Run:
```bash
grep "clearCart" src/lib/features/carts/cartsSlice.ts
```

If `clearCart` is NOT exported, add it to the reducers and exports in that file.

---

## STEP 7 — BUILD AND PUSH

```bash
cd /Users/user/Desktop/shopsofly-storefront
npm run build
```

Fix every TypeScript error before proceeding. Common fixes:
- If `updateUser` import fails → check Step 5
- If `clearCart` import fails → check Step 6
- If `getOrders` type error → check the function signature in `src/lib/api.ts`

Once build passes with zero errors:

```bash
git add src/app/account/layout.tsx \
        src/app/account/profile/page.tsx \
        src/app/account/orders/page.tsx \
        src/app/account/addresses/page.tsx
git commit -m "feat: improved account layout with sidebar nav and styled pages"
git push origin main
```

---

## EXPECTED RESULT AFTER DEPLOYMENT

- `/account/login` — renders login form (no auth guard, no sidebar)
- `/account/register` — renders register form (no auth guard, no sidebar)  
- `/account/profile` — sidebar + profile form pre-filled with user data
- `/account/orders` — sidebar + order list with status badges
- `/account/addresses` — sidebar + address cards + add new form
- All pages redirect to `/account/login` if not authenticated
- Logout clears Redux state and redirects to homepage
- Mobile: top tabs instead of sidebar
- Desktop: left sidebar with active link highlighted in olive green
