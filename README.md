# 💍 Wedding Apps - Digital Wedding Invitation (Next.js)

A modern, responsive, and elegant digital wedding invitation web app built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

## ✨ Features

- **Cover & Guest Personalization**: Interactive opening screen reading personalized recipient names via URL parameters (`?to=Guest+Name` or `?guest=Guest+Name`).
- **Floating Ambient Music Player**: Plays background romantic acoustics on open, with rotating disc vinyl animation and play/pause controls.
- **Hero & Live Countdown**: Real-time days, hours, minutes, and seconds countdown to the wedding ceremony date.
- **Couple Presentation**: Groom & Bride profiles with parents' names and social links.
- **Event Schedule & Maps**: Holy Matrimony & Reception details with direct links to Google Maps.
- **Photo Gallery**: Responsive grid showcasing memorable moments.
- **Interactive RSVP & Wishes**: Form allowing guests to confirm attendance and submit blessings (saved locally in browser `localStorage`).
- **Digital Gift / Virtual Angpao**: Bank account numbers with one-click copy to clipboard and toast feedback.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Typography**: `Playfair Display`, `Cormorant Garamond`, `Montserrat` (via `next/font/google`)

---

## 🚀 Getting Started

### 1. Development Server

Run the development server locally:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.  
Test personalized guest invitations by appending a query:  
`http://localhost:3000?to=Budi+%26+Partner`

### 2. Production Build

To build the project for production:

```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```text
wedding-apps/
├── src/
│   ├── app/
│   │   ├── globals.css        # Global CSS & Tailwind configuration
│   │   ├── layout.tsx         # Root layout with Google Fonts
│   │   └── page.tsx           # Main page orchestrator
│   ├── components/
│   │   ├── CoverOverlay.tsx   # Welcome cover & personalized guest name
│   │   ├── MusicPlayer.tsx    # Audio background player & toggle button
│   │   ├── HeroSection.tsx    # Hero title & real-time countdown timer
│   │   ├── QuoteSection.tsx   # Verse / blessing quote
│   │   ├── CoupleSection.tsx  # Groom & Bride introduction cards
│   │   ├── EventSection.tsx   # Holy Matrimony & Reception cards
│   │   ├── GallerySection.tsx # Photo gallery grid
│   │   ├── RsvpSection.tsx    # RSVP form & wishes list
│   │   ├── GiftSection.tsx    # Digital gift bank accounts & copy button
│   │   ├── Footer.tsx         # Footer copyright & thank you
│   │   └── Toast.tsx          # Notification toast
│   └── types/
│       └── index.ts           # TypeScript interfaces
├── public/                    # Static assets
├── package.json
└── tsconfig.json
```

---

## ☁️ Deployment

- **Vercel (Recommended for Next.js)**: Connect your GitHub repository to [Vercel](https://vercel.com) for zero-config automatic deployment.
- **Static Export**: To export as pure static HTML for GitHub Pages, add `output: 'export'` to `next.config.ts` and run `npm run build`.
