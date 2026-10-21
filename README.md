# 💍 Wedding Apps - Digital Wedding Invitation

A modern, elegant, and responsive single-page digital wedding invitation website built with HTML5, CSS3, and JavaScript.

## ✨ Features

- **Cover & Envelope Reveal**: Interactive "Open Invitation" screen with smooth entrance transition.
- **Background Music**: Autoplay on open with floating disc toggle button.
- **Couple Introduction**: Photos, bios, parents' names, and social media handles.
- **Countdown Timer**: Real-time days, hours, minutes, and seconds countdown to the wedding ceremony.
- **Event Schedule & Maps**: Holy Matrimony & Reception details with direct links to Google Maps.
- **Photo Gallery**: Responsive photo grid showcasing moments.
- **Interactive RSVP & Guest Wishes**: Interactive RSVP form storing congratulations in browser `localStorage`.
- **Digital Gift & Angpao**: Bank account numbers with one-click copy to clipboard and toast notification.
- **Personalized Guest Links**: Append `?to=Guest+Name` in the URL (e.g. `index.html?to=John+Doe`) to dynamically personalize the recipient name on the cover.

## 📁 Project Structure

```text
wedding-apps/
├── index.html       # Main webpage and layout
├── css/
│   └── style.css    # Responsive styles and typography
├── js/
│   └── script.js    # Interactive logic (countdown, audio, RSVP, copy)
├── .gitignore       # Git ignore rules
└── README.md        # Documentation
```

## 🚀 How to Customize

1. **Couple & Event Details**: Edit the texts, names, dates, and locations inside [index.html](file:///c:/Users/NoName/Documents/Project/wedding-apps/index.html).
2. **Countdown Date**: In [js/script.js](file:///c:/Users/NoName/Documents/Project/wedding-apps/js/script.js), modify `targetDate = new Date('2026-10-24T09:00:00')`.
3. **Background Audio**: Update the `<source src="...">` in [index.html](file:///c:/Users/NoName/Documents/Project/wedding-apps/index.html) to your desired mp3 file.
4. **Bank Accounts**: Modify the bank numbers in the digital gift section of [index.html](file:///c:/Users/NoName/Documents/Project/wedding-apps/index.html).

## 🌐 Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`, then click **Save**.
4. Your wedding invitation will be live at `https://<your-username>.github.io/<repo-name>/`.

