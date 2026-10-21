"use client";

interface ReceptionQRWidgetProps {
  onShowToast: (msg: string) => void;
}

export default function ReceptionQRWidget({ onShowToast }: ReceptionQRWidgetProps) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/20 space-y-3 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">
            qr_code_scanner
          </span>
          <h3 className="text-base font-bold text-on-surface">Meja Penerima Tamu</h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-secondary-container/60 text-secondary text-[11px] font-semibold uppercase">
          Live Sync
        </span>
      </div>

      <p className="text-xs text-on-surface-variant leading-relaxed">
        Scan QR dari undangan digital tamu di pintu resepsi untuk check-in instan dan cetak kartu suvenir.
      </p>

      {/* QR Display Preview Frame */}
      <div className="p-4 rounded-xl bg-surface flex flex-col items-center justify-center text-center space-y-3 border border-outline-variant/15">
        <div className="p-3 bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/10">
          <svg className="w-28 h-28 text-on-surface" fill="currentColor" viewBox="0 0 100 100">
            <rect className="text-primary" height="24" rx="4" width="24" x="10" y="10" />
            <rect fill="white" height="16" rx="2" width="16" x="14" y="14" />
            <rect className="text-primary" height="8" rx="1" width="8" x="18" y="18" />
            <rect className="text-primary" height="24" rx="4" width="24" x="66" y="10" />
            <rect fill="white" height="16" rx="2" width="16" x="70" y="14" />
            <rect className="text-primary" height="8" rx="1" width="8" x="74" y="18" />
            <rect className="text-primary" height="24" rx="4" width="24" x="10" y="66" />
            <rect fill="white" height="16" rx="2" width="16" x="14" y="70" />
            <rect className="text-primary" height="8" rx="1" width="8" x="18" y="74" />
            <rect className="text-secondary" height="12" rx="2" width="6" x="42" y="12" />
            <rect className="text-secondary" height="6" rx="2" width="12" x="42" y="30" />
            <rect className="text-primary" height="8" rx="2" width="14" x="58" y="42" />
            <rect className="text-secondary" height="14" rx="2" width="8" x="42" y="58" />
            <rect className="text-secondary" height="18" rx="3" width="18" x="68" y="68" />
            <circle className="text-primary" cx="50" cy="50" r="5" />
          </svg>
        </div>

        <div>
          <div className="text-xs font-semibold text-on-surface">Scanner Petugas Resepsi</div>
          <div className="text-[11px] text-on-surface-variant">Kamera terhubung ke tablet panitia</div>
        </div>

        <button
          onClick={() => onShowToast("Membuka modul kamera scanner QR resepsi...")}
          className="w-full py-2.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-outline-variant/15"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">photo_camera</span>
          <span>Buka Kamera Check-In</span>
        </button>
      </div>
    </div>
  );
}
