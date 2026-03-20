"use client";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/redux";
import { selectToken, selectUser, updateUser } from "@/lib/features/auth/authSlice";
import { updateAccount } from "@/lib/api";

export default function AccountProfilePage() {
  const dispatch  = useAppDispatch();
  const token     = useAppSelector(selectToken);
  const user      = useAppSelector(selectUser);

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName,  setLastName]  = useState(user?.last_name ?? "");
  const [phone,     setPhone]     = useState(user?.phone ?? "");
  const [saving,    setSaving]    = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState("");

  // Password change
  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving,  setPwSaving]  = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError,   setPwError]   = useState("");

  const handleSaveProfile = async () => {
    if (!token) return;
    setSaving(true);
    setSuccess(false);
    setError("");
    try {
      await updateAccount(token, { first_name: firstName, last_name: lastName, phone });
      dispatch(updateUser({ first_name: firstName, last_name: lastName, phone }));
      setSuccess(true);
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!token) return;
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match.");
      return;
    }
    if (newPw.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    setPwSaving(true);
    setPwSuccess(false);
    setPwError("");
    try {
      await updateAccount(token, { current_password: currentPw, password: newPw, password_confirmation: confirmPw });
      setPwSuccess(true);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch {
      setPwError("Incorrect current password, or the update failed.");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-heading font-bold text-xl text-[#1A1A1A]">My Profile</h2>

      {/* Email (read-only) */}
      <section className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-base">Account Email</h3>
        <p className="text-sm text-[#555555] border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
          {user?.email ?? "—"}
        </p>
      </section>

      {/* Profile details */}
      <section className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-base">Personal Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block font-semibold mb-1">First Name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-semibold mb-1">Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none" />
          </div>
        </div>
        {success && <p className="text-sm text-[#22C55E] font-semibold">Profile updated ✓</p>}
        {error   && <p className="text-sm text-red-500">{error}</p>}
        <button onClick={handleSaveProfile} disabled={saving} className="bg-[#F97316] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg text-sm disabled:opacity-50 transition-colors">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </section>

      {/* Change Password */}
      <section className="bg-white border border-gray-100 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-base">Change Password</h3>
        <div className="space-y-3 text-sm">
          <div>
            <label className="block font-semibold mb-1">Current Password</label>
            <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none" />
          </div>
          <div>
            <label className="block font-semibold mb-1">New Password</label>
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Confirm New Password</label>
            <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="w-full border-2 border-gray-200 focus:border-[#4A7C59] rounded-lg px-4 py-3 focus:outline-none" />
          </div>
        </div>
        {pwSuccess && <p className="text-sm text-[#22C55E] font-semibold">Password changed ✓</p>}
        {pwError   && <p className="text-sm text-red-500">{pwError}</p>}
        <button onClick={handleChangePassword} disabled={pwSaving} className="bg-[#1A1A1A] hover:bg-gray-800 text-white font-bold px-6 py-3 rounded-lg text-sm disabled:opacity-50 transition-colors">
          {pwSaving ? "Updating…" : "Change Password"}
        </button>
      </section>
    </div>
  );
}
