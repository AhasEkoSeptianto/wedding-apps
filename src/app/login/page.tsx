"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Email dan password wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      router.push("/dashboard");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal masuk ke dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("dimas.sarah@janjisuci.com");
    setPassword("password123");
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[680px] bg-gradient-to-b from-primary-fixed/30 via-secondary-container/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-tertiary-fixed-dim/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Logo JanjiSuci"
            className="h-9 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Wyr4h6Z3syVwA57Z6k-06bWVsXyZ9qSt30t4VY57-2tyIjyWF_HPQort7Pdl4UTAzhzAs8L0WDnnbjCkZ85VFrKEnMSOcPWQVN3LX_1195RCgup8xnL0-buDtS5ySW2hTdD3Uc9GUgf-VLR-DfeNozaEmWjfIobFpw6xOfVxtfLBfouCglBDV5jDqumNYWNtM1UQ0mZa7l1GFUZZ9IZleLBt4CUlKHbMXgq051cymoFh8qjnpLNaeMh4ye"
          />
          <span className="text-2xl text-primary font-bold tracking-tight font-serif">
            JanjiSuci
          </span>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
          Masuk ke Dashboard Pengantin
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-on-surface-variant">
          Kelola data tamu, konfirmasi RSVP, dan desain undangan Anda.
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5"
              >
                Email Akun
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3.5 top-3">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: dimas.sarah@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface rounded-xl text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
                >
                  Password
                </label>
                <a
                  href="https://api.whatsapp.com/send?phone=6285810217197&text=Halo%20Admin%20JanjiSuci,%20saya%20lupa%20password%20akun%20pengantin%20saya."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Bantuan Password?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3.5 top-3">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-full text-xs sm:text-sm font-semibold text-on-primary bg-primary hover:bg-primary-container shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Helper */}
          <div className="mt-6 pt-5 border-t border-outline-variant/20 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container text-primary hover:bg-surface-container-high text-xs font-semibold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">badge</span>
              <span>Gunakan Akun Demo (Dimas &amp; Sarah)</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-xs text-on-surface-variant">
            <span>Belum memiliki akun undangan? </span>
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary-container transition-colors"
            >
              Daftar Akun Baru
            </Link>
          </div>

          {/* Worker / Admin Portal Link */}
          <div className="mt-4 pt-4 border-t border-outline-variant/15 text-center text-[11px] text-on-surface-variant">
            <span>Staf atau pekerja JanjiSuci? </span>
            <Link
              href="/admin/login"
              className="font-bold text-amber-700 hover:text-amber-800 transition-colors inline-flex items-center gap-0.5"
            >
              <span className="material-symbols-outlined text-[13px]">admin_panel_settings</span>
              <span>Login Portal Administrasi</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

