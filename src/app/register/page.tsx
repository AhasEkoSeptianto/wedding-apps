"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [weddingSlug, setWeddingSlug] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-slugify when couple name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!weddingSlug || weddingSlug === slugify(name)) {
      setWeddingSlug(slugify(val));
    }
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Nama mempelai wajib diisi.");
      return;
    }

    if (!email.trim() || !password) {
      setErrorMsg("Email dan password wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi password tidak cocok.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        weddingSlug: weddingSlug.trim() || slugify(name),
      });
      router.push("/dashboard");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Pendaftaran gagal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[720px] bg-gradient-to-b from-primary-fixed/30 via-secondary-container/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-tertiary-fixed-dim/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Logo JanjiSuci"
            className="h-11 w-auto object-contain group-hover:scale-105 transition-transform"
            src="/images/brand-logo.png"
          />
          <span className="text-2xl text-primary font-bold tracking-tight font-serif">
            JanjiSuci
          </span>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
          Daftar Akun Pengantin Baru
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-on-surface-variant">
          Hadirkan undangan digital mewah berkelas untuk hari bahagia Anda.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-surface-container-lowest py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-outline-variant/30">
          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-error-container text-on-error-container text-xs sm:text-sm flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Pasangan */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1"
              >
                Nama Pasangan / Mempelai
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3.5 top-2.5">
                  favorite
                </span>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="contoh: Dimas & Sarah"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Custom Link Undangan Preview */}
            <div>
              <label
                htmlFor="slug"
                className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1"
              >
                Link Undangan Pribadi
              </label>
              <div className="flex items-center rounded-xl bg-surface border border-outline-variant/30 overflow-hidden text-xs sm:text-sm">
                <span className="pl-3.5 pr-1 text-on-surface-variant/70 text-xs">
                  janjisuci.com/
                </span>
                <input
                  id="slug"
                  type="text"
                  value={weddingSlug}
                  onChange={(e) => setWeddingSlug(slugify(e.target.value))}
                  placeholder="dimas-sarah"
                  className="w-full py-2.5 pr-3 bg-transparent text-primary font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1"
              >
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3.5 top-2.5">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@anda.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* WhatsApp Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1"
              >
                Nomor WhatsApp <span className="text-on-surface-variant/60 font-normal">(opsional)</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3.5 top-2.5">
                  phone_iphone
                </span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1"
              >
                Password <span className="text-on-surface-variant/60 font-normal">(min. 6 karakter)</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3.5 top-2.5">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-surface rounded-xl text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1"
              >
                Konfirmasi Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3.5 top-2.5">
                  lock_reset
                </span>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3 px-4 rounded-full text-xs sm:text-sm font-semibold text-on-primary bg-primary hover:bg-primary-container shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Mendaftarkan akun...</span>
                </>
              ) : (
                <>
                  <span>Daftar &amp; Buka Dashboard</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-xs text-on-surface-variant border-t border-outline-variant/20 pt-5">
            <span>Sudah memiliki akun pengantin? </span>
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary-container transition-colors"
            >
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

