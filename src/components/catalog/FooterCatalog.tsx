import Link from "next/link";

export default function FooterCatalog() {
  return (
    <footer id="paket" className="w-full bg-surface-container-low border-t border-outline-variant/30 mt-16">
      <div className="max-w-[1360px] mx-auto px-4 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Logo JanjiSuci"
                className="h-9 w-auto object-contain"
                src="/images/brand-logo.png"
              />
              <span className="text-xl text-primary font-serif font-bold">
                JanjiSuci
              </span>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
              Platform undangan pernikahan digital mewah nan elegan untuk momen sakral terindah Anda dan pasangan.
            </p>
            <p className="text-xs text-on-surface-variant/80">
              &copy; 2026 JanjiSuci. Hak Cipta Dilindungi.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm text-on-surface mb-4 font-semibold">
              Eksplorasi
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Tema Minimalis Modern
              </li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Adat &amp; Tradisional Nusantara
              </li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Botanical &amp; Flora
              </li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Classic Royal Gold
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm text-on-surface mb-4 font-semibold">
              Fitur SaaS
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Buku Tamu &amp; QR Check-in
              </li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Manajemen RSVP Real-time
              </li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Amplop Digital &amp; Kado Fisik
              </li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Kirim Undangan WhatsApp Blast
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm text-on-surface mb-4 font-semibold">
              Bantuan &amp; Kebijakan
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Pusat Panduan &amp; FAQ
              </li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Kontak Dukungan Pengantin
              </li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Kebijakan Privasi
              </li>
              <li className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Syarat &amp; Ketentuan
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between text-on-surface-variant text-xs gap-2">
          <span>Diciptakan dengan penuh cinta di Indonesia.</span>
          <div className="flex items-center gap-4">
            <span>Elegan, Abadi, &amp; Tanpa Batas.</span>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-primary transition-colors inline-flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[13px]">admin_panel_settings</span>
              <span>Portal Pekerja / Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

