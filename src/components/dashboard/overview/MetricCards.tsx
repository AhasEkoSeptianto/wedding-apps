"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface GuestStats {
  total: number;
  hadir: number;
  totalHadirPax: number;
  ragu: number;
  belumRespon: number;
  tidakHadir: number;
  checkedIn: number;
  attendanceRatePercent: number;
}

export default function MetricCards() {
  const [stats, setStats] = useState<GuestStats>({
    total: 342,
    hadir: 268,
    totalHadirPax: 412,
    ragu: 44,
    belumRespon: 20,
    tidakHadir: 10,
    checkedIn: 180,
    attendanceRatePercent: 78,
  });
  const [wishesCount, setWishesCount] = useState<number>(198);

  useEffect(() => {
    api
      .getGuestStats()
      .then((res) => {
        if (res.success && res.data) {
          setStats((prev) => ({
            ...prev,
            ...res.data,
            total: res.data.total > 0 ? res.data.total : prev.total,
            hadir: res.data.total > 0 ? res.data.hadir : prev.hadir,
            totalHadirPax: res.data.totalHadirPax > 0 ? res.data.totalHadirPax : prev.totalHadirPax,
            ragu: res.data.total > 0 ? res.data.ragu : prev.ragu,
            belumRespon: res.data.total > 0 ? res.data.belumRespon : prev.belumRespon,
            tidakHadir: res.data.total > 0 ? res.data.tidakHadir : prev.tidakHadir,
          }));
        }
      })
      .catch(() => {});

    api
      .getWishes()
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setWishesCount(res.data.length);
        }
      })
      .catch(() => {});
  }, []);

  const totalGuests = stats.total;
  const hadirRate = totalGuests > 0 ? Math.round((stats.hadir / totalGuests) * 100) : 0;
  const raguRate = totalGuests > 0 ? Math.round((stats.ragu / totalGuests) * 100) : 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Undangan */}
      <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm border border-outline-variant/20 hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
              Undangan Tersebar
            </span>
            <div className="w-9 h-9 rounded-full bg-primary-fixed/40 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-on-surface">{stats.total}</span>
            <span className="text-xs text-on-surface-variant">Tamu Terdata</span>
          </div>

          <p className="mt-1 text-xs text-secondary flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>{hadirRate}% Terkonfirmasi Hadir</span>
          </p>
        </div>

        <div className="mt-4 pt-1">
          <div className="flex justify-between text-xs text-on-surface-variant mb-1.5">
            <span>{stats.hadir} Hadir</span>
            <span>{stats.belumRespon} Belum Respon</span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 flex overflow-hidden">
            <div className="bg-primary h-1.5" style={{ width: `${hadirRate}%` }} />
            <div className="bg-inverse-primary h-1.5" style={{ width: `${100 - hadirRate}%` }} />
          </div>
        </div>
      </div>

      {/* Card 2: Konfirmasi RSVP */}
      <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm border border-outline-variant/20 hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
              Konfirmasi RSVP
            </span>
            <div className="w-9 h-9 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-on-surface">{stats.hadir}</span>
            <span className="text-xs text-on-surface-variant">Hadir ({hadirRate}%)</span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            {/* Donut SVG Chart */}
            <svg className="w-9 h-9 -rotate-90 transform shrink-0" viewBox="0 0 36 36">
              <path
                className="text-surface-container"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="text-secondary"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${hadirRate}, 100`}
                strokeLinecap="round"
                strokeWidth="4"
              />
              <path
                className="text-primary"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${raguRate}, 100`}
                strokeDashoffset={`-${hadirRate}`}
                strokeWidth="4"
              />
            </svg>

            <div className="text-[11px] leading-tight text-on-surface-variant space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span>{stats.hadir} Hadir</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>{stats.ragu} Ragu-ragu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-outline" />
                <span>{stats.tidakHadir} Berhalangan</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-1 text-xs text-on-surface-variant">
          Estimasi Kursi: <strong className="text-on-surface font-semibold">{stats.totalHadirPax} Pax</strong>
        </div>
      </div>

      {/* Card 3: Amplop Digital */}
      <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm border border-outline-variant/20 hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
              Amplop Digital
            </span>
            <div className="w-9 h-9 rounded-full bg-tertiary-fixed/40 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[20px]">
                account_balance_wallet
              </span>
            </div>
          </div>

          <div className="mt-2">
            <span className="font-serif text-2xl font-bold text-on-surface">
              Rp 48.650.000
            </span>
          </div>

          <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            <span>Transfer Bank &amp; E-Wallet</span>
          </div>
        </div>

        <div className="mt-4 pt-1 flex items-center justify-between text-xs text-on-surface-variant">
          <span>Rekening Aktif</span>
          <span className="font-semibold text-primary">BCA, Mandiri</span>
        </div>
      </div>

      {/* Card 4: Ucapan & Doa */}
      <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm border border-outline-variant/20 hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
              Ucapan &amp; Doa Restu
            </span>
            <div className="w-9 h-9 rounded-full bg-primary-fixed-dim/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">favorite</span>
            </div>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-on-surface">{wishesCount}</span>
            <span className="text-xs text-on-surface-variant">Pesan Masuk</span>
          </div>

          <div className="mt-2 flex -space-x-2 overflow-hidden py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8NII3qjaWM1IDwhDaB_dtzMGc2mC6tv_F2kGaeHf1OX2AX2QlKm7PgVYTVReqkNVbWebd82oWTNUPuYlwYIGFS4GFnUlaJG1o1Y4Nx5iMBy-vlGUEK79gv8fvrqn2BXnsbmBXWAh7DPU7pFwsLQVi69vEgRAtYpn0nChS8jLlo8pxeRx9my0SdHGnYKTTnxACz5sy6CfLKDtD1toXyAMEGsbsyeukb9FRi5pN54xmMfE9VONtfl_yuA"
              alt="Avatar 1"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTmwomkLXA3e3m_pItlALHPYuDDM65wunErtjPbwzAqIYYskpw0KFzMzQI_SlGCIbdYPPpnNg9U1WxkkwQACPH-8iC3U42MIa9LmEAaaeGnRFHHssQt_wmZHg2CIsy9XKRRuMkgzG4KWNXjmarky2xjgx7cFeHbs-rSWsRWGH_jVTGT5PysC0EIuRLqpA-vS-hjnLDBXFawH1raXa7iL2JZLZi1Xy8TJRhPy1fbV12OekF-KyIaivmwA"
              alt="Avatar 2"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDT2vQqh7w2xjApmTv0vmzBU--shzUizZFA5L0c6tmdEOk-12W_PCUsHfhpRltGSaYCfWEqBYkRt6eNTxHbSV3xsmSRrI5vuykRuzhS1FIZsyGoSkqElCg9mzc1FiIm3bv7JT0NhCEXgZJOwSEgG1xXsi1vOdC1S53x5Rf-7uinMy-OhT_d-1HSQYccATmWKnGntz178NLGVqObPcQgl4KrEuE2KTpk6Uv-8xElZZx4xYqOL9SSdB4Ug"
              alt="Avatar 3"
            />
            <div className="h-7 w-7 rounded-full ring-2 ring-surface-container-lowest bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
              +{wishesCount}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-1 flex items-center justify-between text-xs text-on-surface-variant">
          <span>Live Sync</span>
          <span className="text-secondary font-semibold">Terkoneksi</span>
        </div>
      </div>
    </section>
  );
}

