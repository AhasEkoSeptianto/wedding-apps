document.addEventListener('DOMContentLoaded', () => {
  // 1. Guest Name from URL Parameter (e.g. ?to=John+Doe or ?guest=Jane)
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('to') || urlParams.get('guest');
  if (guestParam) {
    const guestElem = document.getElementById('guest-name');
    if (guestElem) {
      guestElem.textContent = guestParam;
    }
  }

  // 2. Audio & Invitation Opening
  const cover = document.getElementById('cover');
  const openBtn = document.getElementById('open-invitation-btn');
  const music = document.getElementById('wedding-music');
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = musicBtn ? musicBtn.querySelector('i') : null;
  let isPlaying = false;

  function toggleMusic() {
    if (!music) return;
    if (isPlaying) {
      music.pause();
      isPlaying = false;
      if (musicIcon) musicIcon.classList.remove('spin');
    } else {
      music.play().then(() => {
        isPlaying = true;
        if (musicIcon) musicIcon.classList.add('spin');
      }).catch(err => {
        console.warn('Audio autoplay blocked or failed:', err);
      });
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      if (cover) {
        cover.classList.add('opened');
      }
      if (musicBtn) {
        musicBtn.classList.remove('hidden');
      }
      toggleMusic();
    });
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusic);
  }

  // 3. Countdown Timer (Target Date: October 24, 2026 09:00:00)
  const targetDate = new Date('2026-10-24T09:00:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      const daysEl = document.getElementById('days');
      if (daysEl) daysEl.textContent = '00';
      const hoursEl = document.getElementById('hours');
      if (hoursEl) hoursEl.textContent = '00';
      const minsEl = document.getElementById('minutes');
      if (minsEl) minsEl.textContent = '00';
      const secsEl = document.getElementById('seconds');
      if (secsEl) secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (num) => String(num).padStart(2, '0');

    const daysEl = document.getElementById('days');
    if (daysEl) daysEl.textContent = pad(days);
    const hoursEl = document.getElementById('hours');
    if (hoursEl) hoursEl.textContent = pad(hours);
    const minsEl = document.getElementById('minutes');
    if (minsEl) minsEl.textContent = pad(minutes);
    const secsEl = document.getElementById('seconds');
    if (secsEl) secsEl.textContent = pad(seconds);
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 4. RSVP & Wishes system with LocalStorage
  const rsvpForm = document.getElementById('rsvp-form');
  const wishesList = document.getElementById('wishes-list');
  const wishesCount = document.getElementById('wishes-count');

  const defaultWishes = [
    {
      name: 'Michael & Claire',
      attendance: 'Yes, Joyfully Attending',
      message: 'Warmest congratulations to the wonderful couple! Wishing you a lifetime of love and joy.',
      date: 'Just now'
    },
    {
      name: 'David Wijaya',
      attendance: 'Yes, Joyfully Attending',
      message: 'So happy for both of you! May your love grow stronger each passing year.',
      date: '1 hour ago'
    }
  ];

  function getStoredWishes() {
    try {
      const stored = localStorage.getItem('wedding_wishes');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return defaultWishes;
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem('wedding_wishes', JSON.stringify(wishes));
    } catch (e) {
      console.error(e);
    }
  }

  function renderWishes() {
    if (!wishesList) return;
    const wishes = getStoredWishes();
    if (wishesCount) {
      wishesCount.textContent = wishes.length;
    }

    wishesList.innerHTML = wishes.map((item) => {
      const isNotAttending = item.attendance && item.attendance.includes('Unable');
      const badgeClass = isNotAttending ? 'wish-attendance not-attending' : 'wish-attendance';
      return `
        <div class="wish-item">
          <div class="wish-header">
            <span class="wish-author">${escapeHtml(item.name)}</span>
            <span class="${badgeClass}">${escapeHtml(item.attendance)}</span>
          </div>
          <p class="wish-text">${escapeHtml(item.message)}</p>
          <div class="wish-date">${escapeHtml(item.date || 'Recent')}</div>
        </div>
      `;
    }).join('');
  }

  function escapeHtml(string) {
    if (!string) return '';
    return String(string)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('rsvp-name');
      const attendanceInput = document.getElementById('rsvp-attendance');
      const guestsInput = document.getElementById('rsvp-guests');
      const messageInput = document.getElementById('rsvp-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const attendance = attendanceInput ? attendanceInput.value : '';
      const guests = guestsInput ? guestsInput.value : '1';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !attendance || !message) {
        showToast('Please fill all required fields');
        return;
      }

      const newWish = {
        name: name,
        attendance: attendance,
        guests: guests,
        message: message,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      const wishes = getStoredWishes();
      wishes.unshift(newWish);
      saveWishes(wishes);
      renderWishes();

      rsvpForm.reset();
      showToast('Thank you! Your RSVP and wishes have been sent.');
    });
  }

  renderWishes();

  // 5. Copy Account Number with Toast Feedback
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        const textToCopy = targetElem.textContent.trim();
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Account number ${textToCopy} copied to clipboard!`);
        }).catch(() => {
          showToast('Failed to copy. Please copy manually.');
        });
      }
    });
  });

  // 6. Toast Notification Helper
  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
});
