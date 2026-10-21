"use client";

export interface WeddingData {
  title: string;
  groom: {
    fullName: string;
    nickName: string;
    instagram: string;
    parents: string;
    photoUrl: string;
  };
  bride: {
    fullName: string;
    nickName: string;
    instagram: string;
    parents: string;
    photoUrl: string;
  };
  quote: {
    source: string;
    text: string;
  };
  events: {
    akad: {
      date: string;
      time: string;
      venue: string;
      address: string;
    };
    resepsi: {
      date: string;
      time: string;
      venue: string;
      address: string;
    };
  };
  music: {
    title: string;
    duration: string;
    enabled: boolean;
  };
  gift: {
    bca: string;
    mandiri: string;
  };
  rsvp: {
    deadline: string;
    maxGuests: string;
    waNotification: boolean;
  };
}

interface EditorStudioProps {
  data: WeddingData;
  onChange: (newData: WeddingData) => void;
  activeTab: "pasangan" | "acara" | "galeri" | "fitur" | "rsvp";
  onTabChange: (tab: "pasangan" | "acara" | "galeri" | "fitur" | "rsvp") => void;
}

export default function EditorStudio({
  data,
  onChange,
  activeTab,
  onTabChange,
}: EditorStudioProps) {
  const updateGroom = (field: string, val: string) => {
    onChange({
      ...data,
      groom: { ...data.groom, [field]: val },
    });
  };

  const updateBride = (field: string, val: string) => {
    onChange({
      ...data,
      bride: { ...data.bride, [field]: val },
    });
  };

  const updateQuote = (field: string, val: string) => {
    onChange({
      ...data,
      quote: { ...data.quote, [field]: val },
    });
  };

  const updateAkad = (field: string, val: string) => {
    onChange({
      ...data,
      events: {
        ...data.events,
        akad: { ...data.events.akad, [field]: val },
      },
    });
  };

  const updateResepsi = (field: string, val: string) => {
    onChange({
      ...data,
      events: {
        ...data.events,
        resepsi: { ...data.events.resepsi, [field]: val },
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tab Navigation */}
      <div className="bg-surface-container-lowest rounded-xl p-1.5 shadow-sm overflow-x-auto flex gap-1 border border-outline-variant/20 scrollbar-none">
        {[
          { id: "pasangan", label: "Mempelai", icon: "favorite" },
          { id: "acara", label: "Acara", icon: "event" },
          { id: "galeri", label: "Galeri", icon: "photo_library" },
          { id: "fitur", label: "Fitur", icon: "stars" },
          { id: "rsvp", label: "RSVP", icon: "how_to_reg" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as typeof activeTab)}
            className={`flex-1 min-w-[85px] py-2 px-2.5 rounded-lg text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Mempelai */}
      {activeTab === "pasangan" && (
        <div className="flex flex-col gap-4">
          {/* Groom Card */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <h2 className="text-base font-bold text-on-surface">Data Mempelai Pria</h2>
              </div>
              <span className="text-[11px] font-semibold text-secondary bg-secondary-container px-2.5 py-0.5 rounded-full">
                Groom
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-18 h-18 rounded-full overflow-hidden shrink-0 shadow-inner group ring-2 ring-primary/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover"
                  src={data.groom.photoUrl}
                  alt="Groom avatar"
                />
                <div className="absolute inset-0 bg-on-surface/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface">Foto Utama Pria</p>
                <p className="text-xs text-on-surface-variant">Rekomendasi rasio 1:1, maks 3MB</p>
                <button
                  type="button"
                  className="mt-1.5 text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">upload</span> Ganti Pasfoto
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                  Nama Lengkap &amp; Gelar
                </label>
                <input
                  type="text"
                  value={data.groom.fullName}
                  onChange={(e) => updateGroom("fullName", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    value={data.groom.nickName}
                    onChange={(e) => updateGroom("nickName", e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                    Instagram (@)
                  </label>
                  <input
                    type="text"
                    value={data.groom.instagram}
                    onChange={(e) => updateGroom("instagram", e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                  Nama Orang Tua
                </label>
                <input
                  type="text"
                  value={data.groom.parents}
                  onChange={(e) => updateGroom("parents", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Bride Card */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                <h2 className="text-base font-bold text-on-surface">Data Mempelai Wanita</h2>
              </div>
              <span className="text-[11px] font-semibold text-tertiary bg-tertiary-fixed px-2.5 py-0.5 rounded-full">
                Bride
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-18 h-18 rounded-full overflow-hidden shrink-0 shadow-inner group ring-2 ring-tertiary/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover"
                  src={data.bride.photoUrl}
                  alt="Bride avatar"
                />
                <div className="absolute inset-0 bg-on-surface/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface">Foto Utama Wanita</p>
                <p className="text-xs text-on-surface-variant">Rekomendasi rasio 1:1, maks 3MB</p>
                <button
                  type="button"
                  className="mt-1.5 text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">upload</span> Ganti Pasfoto
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                  Nama Lengkap &amp; Gelar
                </label>
                <input
                  type="text"
                  value={data.bride.fullName}
                  onChange={(e) => updateBride("fullName", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    value={data.bride.nickName}
                    onChange={(e) => updateBride("nickName", e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                    Instagram (@)
                  </label>
                  <input
                    type="text"
                    value={data.bride.instagram}
                    onChange={(e) => updateBride("instagram", e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                  Nama Orang Tua
                </label>
                <input
                  type="text"
                  value={data.bride.parents}
                  onChange={(e) => updateBride("parents", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all border border-transparent focus:border-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Quotes Card */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  format_quote
                </span>
                <span>Kutipan &amp; Quotes Romantis</span>
              </h3>
              <span className="text-xs text-on-surface-variant">Pilihan Religi / Universal</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                Sumber Kutipan
              </label>
              <input
                type="text"
                value={data.quote.source}
                onChange={(e) => updateQuote("source", e.target.value)}
                className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest transition-all border border-transparent focus:border-primary/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
                Isi Kutipan Ayat / Makna Cinta
              </label>
              <textarea
                rows={3}
                value={data.quote.text}
                onChange={(e) => updateQuote("text", e.target.value)}
                className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none focus:bg-surface-container-lowest transition-all resize-none border border-transparent focus:border-primary/40"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Acara */}
      {activeTab === "acara" && (
        <div className="flex flex-col gap-4">
          {/* Akad Nikah */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">church</span>
                <span>Sesi 1: Akad Nikah</span>
              </h3>
              <span className="text-[11px] font-semibold bg-secondary-fixed text-on-secondary-fixed px-2.5 py-0.5 rounded-full">
                Intimate
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                  Tanggal
                </label>
                <input
                  type="text"
                  value={data.events.akad.date}
                  onChange={(e) => updateAkad("date", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                  Waktu
                </label>
                <input
                  type="text"
                  value={data.events.akad.time}
                  onChange={(e) => updateAkad("time", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                Nama Gedung / Tempat
              </label>
              <input
                type="text"
                value={data.events.akad.venue}
                onChange={(e) => updateAkad("venue", e.target.value)}
                className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                Alamat Lengkap
              </label>
              <textarea
                rows={2}
                value={data.events.akad.address}
                onChange={(e) => updateAkad("address", e.target.value)}
                className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none resize-none border border-transparent focus:border-primary/40"
              />
            </div>
          </div>

          {/* Resepsi Pernikahan */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  celebration
                </span>
                <span>Sesi 2: Resepsi Mewah</span>
              </h3>
              <span className="text-[11px] font-semibold bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full">
                Grand Celebration
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                  Tanggal
                </label>
                <input
                  type="text"
                  value={data.events.resepsi.date}
                  onChange={(e) => updateResepsi("date", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                  Waktu
                </label>
                <input
                  type="text"
                  value={data.events.resepsi.time}
                  onChange={(e) => updateResepsi("time", e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                Nama Ballroom / Hotel
              </label>
              <input
                type="text"
                value={data.events.resepsi.venue}
                onChange={(e) => updateResepsi("venue", e.target.value)}
                className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-on-surface-variant mb-2 uppercase">
                Pratinjau Peta Lokasi
              </label>
              <div
                className="w-full h-36 bg-cover bg-center rounded-lg shadow-inner relative flex items-end p-3"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhuwZmJqkm9BTwSR7dyWOOpXRRUB94OWmtdDkBkpsUGVe2-U6qORawD0sS6CZ1a8YUyvuCyO1rJAVnlMZjXGDCs1o-9AVuJFC6VmiW41O6j6wB7PJKJ_x031PuFlM8CzvQDeWQrVVp7bh-w4QEgVM44OeZS6HZZSfcBtJSEXpt2A8rcbqsNJvLje4R6upU124UbmkbL_dQvxbE5ls1WaW34Q7uVyCcG1DioTv2J68MSjqYfgrk4mnH4A')",
                }}
              >
                <div className="bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-on-surface flex items-center gap-1.5 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    location_on
                  </span>
                  <span>The Dharmawangsa Jakarta, Kebayoran Baru</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Galeri */}
      {activeTab === "galeri" && (
        <div className="flex flex-col gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface">Galeri Foto Prewedding</h3>
              <button
                type="button"
                className="text-xs font-semibold text-primary flex items-center gap-1 cursor-pointer hover:underline"
              >
                <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                <span>Tambah Foto</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="aspect-square rounded-lg overflow-hidden relative group shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDLKO3OQLcd1UZ8eGfZ1L1B1H1SnWP9eG5YN3ebEfmIdBSqwYqHfNF_BjPha2tXgmRhb6HJSRomBW1ZdyfMhyeJetOR54PfRUIvjAqF-i0czp3zlFKg6mCQaAhALH55HyUmPqh0pGgLYUCY3pqbKCHjUetiqnhdlxtBXzinajCwjp-m3aCgfFUPjG6pq4hQdbGY2IV3vcVrVdLTLbn87xcrRc_1Ky5XKjaA6YZTjGwoadD7k4xuw85bw"
                  alt="Prewedding 1"
                />
                <div className="absolute inset-0 bg-on-surface/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </div>
              </div>

              <div className="aspect-square rounded-lg overflow-hidden relative group shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDbKmyP_yTMyxNS05FiXpV6Y0PYX4jBatVC9bpImSTjrLkZZlUVu3xyROb2zrTfMxDa_xSFe8wyYy0-woMopNk4s2UonOno1Rj9pMAxp9eYD8Uq4mCD7oID-8IJAtIKEq1Di_m_MdmoTTXd1PODBc_vVW2VGiewIYlApHBUJGYEQjAw_HFzUvQhAgnz4nCNxnuWF60Wcjy074vtcnqRTgh4DFTu9Iyv3sfRBxY-oUUSqfKVxivXJSQ8Q"
                  alt="Prewedding 2"
                />
                <div className="absolute inset-0 bg-on-surface/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </div>
              </div>

              <div className="aspect-square rounded-lg border-2 border-dashed border-outline-variant/50 bg-surface-container-low flex flex-col items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                <span className="text-xs font-medium mt-1">Upload</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <h3 className="text-base font-bold text-on-surface">Cerita Cinta (Love Journey)</h3>
            <div className="space-y-3">
              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-primary uppercase">
                    Pertama Bertemu • 2019
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[16px] cursor-pointer">
                    edit
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Bertemu tanpa sengaja di studio desain kreatif Jakarta saat mengerjakan proyek bersama.
                </p>
              </div>

              <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-primary uppercase">
                    Lamaran Romantis • 2024
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[16px] cursor-pointer">
                    edit
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Di bawah gemerlap senja Labuan Bajo, Dimas mengucap janji suci untuk melangkah ke jenjang pernikahan.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Fitur Spesial */}
      {activeTab === "fitur" && (
        <div className="flex flex-col gap-4">
          {/* Background Music */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  music_note
                </span>
                <span>Musik Latar (Auto-play saat dibuka)</span>
              </h3>
              <div
                onClick={() =>
                  onChange({
                    ...data,
                    music: { ...data.music, enabled: !data.music.enabled },
                  })
                }
                className={`w-9 h-5 rounded-full relative p-0.5 cursor-pointer transition-colors ${
                  data.music.enabled ? "bg-primary" : "bg-surface-container-highest"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${
                    data.music.enabled ? "right-0.5" : "left-0.5"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-surface-container-low p-3 rounded-lg border border-outline-variant/15">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-on-surface truncate">
                  {data.music.title}
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  Format MP3 • {data.music.duration}
                </p>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Ganti Lagu
              </button>
            </div>
          </div>

          {/* Amplop Digital */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">wallet</span>
              <span>Amplop Digital &amp; Kado Online</span>
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant/15">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-surface-container-lowest text-xs rounded font-bold text-on-surface shadow-xs">
                    BCA
                  </span>
                  <span className="text-xs sm:text-sm text-on-surface">{data.gift.bca}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant cursor-pointer">
                  content_copy
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant/15">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-surface-container-lowest text-xs rounded font-bold text-on-surface shadow-xs">
                    Mandiri
                  </span>
                  <span className="text-xs sm:text-sm text-on-surface">{data.gift.mandiri}</span>
                </div>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant cursor-pointer">
                  content_copy
                </span>
              </div>
            </div>
          </div>

          {/* Dresscode */}
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">
                checkroom
              </span>
              <span>Panduan Dresscode Tamu</span>
            </h3>
            <p className="text-xs text-on-surface-variant">
              Sentuhan warna busana yang disarankan untuk keharmonisan foto:
            </p>
            <div className="flex items-center gap-4">
              {[
                { color: "#EAD8C0", label: "Champagne" },
                { color: "#466554", label: "Sage" },
                { color: "#EFE9DF", label: "Ivory" },
                { color: "#C2A382", label: "Terracotta" },
              ].map((swatch, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-full shadow-sm ring-2 ring-primary/10"
                    style={{ backgroundColor: swatch.color }}
                  />
                  <span className="text-[11px] text-on-surface-variant">{swatch.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: RSVP Settings */}
      {activeTab === "rsvp" && (
        <div className="flex flex-col gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/20">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">tune</span>
              <span>Aturan Konfirmasi Tamu</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                  Batas Akhir RSVP
                </label>
                <input
                  type="date"
                  value={data.rsvp.deadline}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      rsvp: { ...data.rsvp, deadline: e.target.value },
                    })
                  }
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                  Maksimal Pendamping Per Tamu
                </label>
                <select
                  value={data.rsvp.maxGuests}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      rsvp: { ...data.rsvp, maxGuests: e.target.value },
                    })
                  }
                  className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-sm text-on-surface outline-none border border-transparent focus:border-primary/40"
                >
                  <option value="1">1 Orang (+1 Tamu)</option>
                  <option value="2">2 Orang (+2 Keluarga)</option>
                  <option value="0">Khusus Nama Tertera Saja</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-lg border border-outline-variant/15">
                <div>
                  <p className="text-xs font-semibold text-on-surface">Notifikasi WhatsApp</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Kirim alert instan saat tamu mengisi RSVP
                  </p>
                </div>
                <div
                  onClick={() =>
                    onChange({
                      ...data,
                      rsvp: {
                        ...data.rsvp,
                        waNotification: !data.rsvp.waNotification,
                      },
                    })
                  }
                  className={`w-9 h-5 rounded-full relative p-0.5 cursor-pointer transition-colors ${
                    data.rsvp.waNotification ? "bg-primary" : "bg-surface-container-highest"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${
                      data.rsvp.waNotification ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
