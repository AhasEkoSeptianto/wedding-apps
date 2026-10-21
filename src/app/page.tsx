"use client";

import { useState } from "react";
import HeaderNav from "@/components/catalog/HeaderNav";
import HeroCatalog from "@/components/catalog/HeroCatalog";
import TemplateCatalog from "@/components/catalog/TemplateCatalog";
import DeviceExperienceSection from "@/components/catalog/DeviceExperienceSection";
import NewsletterSection from "@/components/catalog/NewsletterSection";
import StickyPromoBanner from "@/components/catalog/StickyPromoBanner";
import FooterCatalog from "@/components/catalog/FooterCatalog";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      {/* Fixed Navigation Header */}
      <HeaderNav />

      {/* Main Content Area */}
      <main className="w-full pt-20 flex-grow">
        <HeroCatalog
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div id="katalog">
          <TemplateCatalog searchQuery={searchQuery} />
        </div>
        <DeviceExperienceSection />
        <NewsletterSection />
      </main>

      {/* Footer */}
      <FooterCatalog />

      {/* Sticky Bottom Promo Banner */}
      <StickyPromoBanner />
    </div>
  );
}
