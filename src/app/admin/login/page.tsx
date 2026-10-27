"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useAuth();

  const [email, setEmail] = useState("admin@janjisuci.com");
  const [password, setPassword] = useState("admin123456");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await adminLogin({ email: email.trim(), password });
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal masuk ke portal administrasi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@janjisuci.com");
    setPassword("admin123456");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Subtle Gradient & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-900 border border-stone-800 shadow-2xl text-amber-400 mb-4">
            <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-amber-400">
              Internal System
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800/60 text-[10px] font-bold">
              Staff Only
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Portal Administrasi
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-sm mx-auto">
            Akses terbatas khusus staf teknis dan pekerja JanjiSuci untuk manajemen template HTML.
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-stone-900/90 border border-stone-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-800 text-red-200 text-xs sm:text-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-[20px] text-red-400 shrink-0">error</span>
              <div>
                <strong className="block font-semibold mb-0.5">Akses Ditolak</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Email Pegawai / Admin
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-stone-500">
                  badge
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@janjisuci.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950/80 border border-stone-800 text-white placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Password Keamanan
                </label>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-stone-500">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950/80 border border-stone-800 text-white placeholder-stone-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
            >
              <span className={`material-symbols-outlined text-[18px] ${isSubmitting ? "animate-spin" : ""}`}>
                {isSubmitting ? "sync" : "verified_user"}
              </span>
              <span>{isSubmitting ? "Memverifikasi Akses..." : "Masuk ke Panel Admin"}</span>
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-stone-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-stone-400">Akun Pengujian Admin:</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                <span>Isi Otomatis</span>
              </button>
            </div>
            <div className="mt-2 p-2.5 rounded-xl bg-stone-950/60 border border-stone-800 font-mono text-[11px] text-stone-400 space-y-0.5">
              <div>Email: <span className="text-stone-200">admin@janjisuci.com</span></div>
              <div>Pass: <span className="text-stone-200">admin123456</span> (Role: Admin)</div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Link */}
        <div className="mt-6 text-center text-xs text-stone-500 flex items-center justify-center gap-4">
          <Link href="/login" className="hover:text-stone-300 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            <span>Kembali ke Login Client</span>
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-stone-300 transition-colors">
            Beranda JanjiSuci
          </Link>
        </div>
      </div>
    </div>
  );
}

