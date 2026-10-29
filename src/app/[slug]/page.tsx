"use client";

import { Suspense } from "react";
import WeddingInvitationView from "@/components/invitation/WeddingInvitationView";

export default function DynamicWeddingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-900 flex items-center justify-center text-white">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WeddingInvitationView />
    </Suspense>
  );
}
