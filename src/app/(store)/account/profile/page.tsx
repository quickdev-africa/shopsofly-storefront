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
