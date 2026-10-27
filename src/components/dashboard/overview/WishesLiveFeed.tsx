"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Wish, GiftItem } from "@/types";
import { api } from "@/lib/api";

interface WishesLiveFeedProps {
  onShowToast: (msg: string) => void;
  slug?: string;
}

export default function WishesLiveFeed({ onShowToast, slug = "dimas-sarah" }: WishesLiveFeedProps) {
  const [activeTab, setActiveTab] = useState<"wishes" | "gifts">("wishes");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [totalGiftAmount, setTotalGiftAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, startTransition] = useTransition();

  const loadData = () => {
    setIsLoading(true);
    Promise.all([
      api.getWishes(slug).catch((err) => {
        console.warn("Could not fetch wishes:", err);
        return { success: false, data: [] };
      }),
      api.getGifts({ slug }).catch((err) => {
        console.warn("Could not fetch gifts:", err);
        return { success: false, data: [], summary: { totalAmount: 0 } };
      }),
    ])
      .then(([wishesRes, giftsRes]) => {
        startTransition(() => {
          if (wishesRes.data) {
            setWishes(wishesRes.data);
          }
          if (giftsRes.data) {
            setGifts(giftsRes.data);
            setTotalGiftAmount(giftsRes.summary?.totalAmount || 0);
          }
          setIsLoading(false);
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleToggleLike = async (id: string) => {
    try {
      const res = await api.toggleLikeWish(id);
      if (res.success && res.data) {
        setWishes((prev) =>
          prev.map((item) => (item.id === id ? { ...item, isLiked: res.data.isLiked } : item))
        );
        onShowToast(res.data.isLiked ? "Menyukai ucapan ❤️" : "Batal menyukai ucapan");
      }
    } catch {
      onShowToast("Gagal memperbarui status suka.");
    }
  };

  const handleToggleGiftStatus = async (gift: GiftItem) => {
    const nextStatus = gift.status === "confirmed" ? "pending" : "confirmed";
    try {
      const res = await api.updateGiftStatus(gift.id, nextStatus);
      if (res.success) {
        setGifts((prev) =>
          prev.map((item) => (item.id === gift.id ? { ...item, status: nextStatus } : item))
        );
        onShowToast(
          nextStatus === "confirmed"
            ? "Amplop diverifikasi terkonfirmasi!"
            : "Status diubah ke menunggu verifikasi."
        );
      }
    } catch {
      onShowToast("Gagal mengubah status verifikasi amplop.");
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Baru saja";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      id="amplop-ucapan"
      className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/20 space-y-4"
    >
      {/* Header with Live Ping & Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            mark_chat_read
          </span>
          <h3 className="text-base font-bold text-on-surface">Ucapan &amp; Amplop Live</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            title="Muat ulang data live dari MongoDB"
            className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[18px] ${isLoading ? "animate-spin" : ""}`}>
              refresh
            </span>
          </button>
          <span className="flex h-2 w-2 relative" title="Koneksi Live MongoDB Aktif">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </div>
      </div>

      {/* Segmented Tab Switcher */}
      <div className="bg-surface-container p-1 rounded-xl flex items-center gap-1 border border-outline-variant/20">
        <button
          type="button"
          onClick={() => setActiveTab("wishes")}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "wishes"
              ? "bg-surface-container-lowest text-on-surface shadow-xs"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">chat</span>
          <span>Ucapan ({wishes.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("gifts")}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "gifts"
              ? "bg-surface-container-lowest text-on-surface shadow-xs"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">payments</span>
          <span>Amplop ({gifts.length})</span>
        </button>
      </div>

      {/* Tab 1: Wishes List */}
      {activeTab === "wishes" && (
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {isLoading && wishes.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant text-xs space-y-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Memuat ucapan dari database...</p>
            </div>
          ) : wishes.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant text-xs bg-surface rounded-xl border border-outline-variant/15 p-4">
              <span className="material-symbols-outlined text-3xl opacity-40 mb-1">sentiment_satisfied</span>
              <p>Belum ada doa dan ucapan dari tamu.</p>
              <p className="text-[11px] text-on-surface-variant/70 mt-1">
                Ucapan yang dikirim melalui link undangan akan otomatis masuk ke sini secara real-time.
              </p>
            </div>
          ) : (
            wishes.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-surface space-y-2 border border-outline-variant/15 hover:border-outline-variant/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-on-surface leading-tight">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                            item.attendance === "attending"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {item.attendance === "attending" ? "Hadir" : "Berhalangan"}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleLike(item.id)}
                    className={`p-1 rounded-full transition-colors cursor-pointer ${
                      item.isLiked
                        ? "text-red-500 hover:text-red-600"
                        : "text-on-surface-variant hover:text-red-500"
                    }`}
                    type="button"
                    title={item.isLiked ? "Batal menyukai" : "Sukai ucapan"}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        item.isLiked ? "filled" : ""
                      }`}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed italic bg-surface-container/30 p-2 rounded-lg">
                  &ldquo;{item.message}&rdquo;
                </p>

                {Boolean(item.amount && item.amount > 0) && (
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-outline-variant/10">
                    <span className="text-on-surface-variant">Amplop Digital:</span>
                    <span className="font-bold text-primary font-mono">
                      {formatRupiah(item.amount || 0)}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Gifts List */}
      {activeTab === "gifts" && (
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {/* Quick Gift Stats Bar */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
            <span className="text-amber-950 font-medium">Total Dana Masuk:</span>
            <span className="font-bold text-amber-900 font-mono text-sm">
              {formatRupiah(totalGiftAmount)}
            </span>
          </div>

          {isLoading && gifts.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant text-xs space-y-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Memuat transaksi amplop...</p>
            </div>
          ) : gifts.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant text-xs bg-surface rounded-xl border border-outline-variant/15 p-4">
              <span className="material-symbols-outlined text-3xl opacity-40 mb-1">wallet</span>
              <p>Belum ada amplop digital yang masuk.</p>
            </div>
          ) : (
            gifts.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-surface space-y-2 border border-outline-variant/15 hover:border-outline-variant/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-semibold text-on-surface leading-tight">
                      {item.senderName}
                    </h4>
                    <span className="text-[10px] text-on-surface-variant">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <span className="font-mono font-bold text-primary text-xs">
                    {formatRupiah(item.amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-[11px] pt-1">
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface text-[10px] font-bold">
                    {item.bankTarget} {item.bankSender ? `← ${item.bankSender}` : ""}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleGiftStatus(item)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${
                      item.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-amber-100 text-amber-900 hover:bg-amber-200"
                    }`}
                    title="Klik untuk mengubah status verifikasi"
                  >
                    {item.status === "confirmed" ? "✓ Terkonfirmasi" : "⏳ Menunggu"}
                  </button>
                </div>

                {item.message && (
                  <p className="text-[11px] text-on-surface-variant italic bg-surface-container/30 p-1.5 rounded">
                    &ldquo;{item.message}&rdquo;
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer Navigation Link */}
      <Link
        href="/dashboard/amplop-ucapan"
        className="w-full py-2.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-outline-variant/15"
      >
        <span>Kelola Seluruh Amplop &amp; Ucapan</span>
        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
      </Link>
    </div>
  );
}
