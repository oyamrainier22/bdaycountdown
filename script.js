const CONFIG = {
  personName: "My Love",
  // Change this birthday date anytime. Use your local timezone offset.
  birthdayDate: "2026-07-27T00:00:00+08:00",
  countdownStartDate: "2026-07-26T00:00:00+08:00",
  profilePhoto: "images/profile.jpg",
  featuredPhoto: "images/11596bb5-5676-4d99-a2cc-54e361f3d515.jpg",
  birthdaySongVideoId: "5u4xTa3LR2U",
  slideshowSpeed: 4200,
  photos: [
    {
      src: "images/11596bb5-5676-4d99-a2cc-54e361f3d515.jpg",
      caption: "Every smile of yours becomes my favorite memory."
    },
    {
      src: "images/247dc48b-01fd-42f7-b15c-678dce779cf7.jpg",
      caption: "The world feels softer when I am with you."
    },
    {
      src: "images/3079bc79-cd91-4827-8983-2a485469b276.jpg",
      caption: "You are the sweetest part of every ordinary day."
    },
    {
      src: "images/5426cfdb-7e56-42d9-863d-b9a10b244b18.jpg",
      caption: "Counting down to another year of loving you."
    },
    {
      src: "images/618f9e78-87cc-46aa-a2da-53e41a38e20c.jpg",
      caption: "You make love feel gentle, bright, and real."
    },
    {
      src: "images/6a210e56-9a39-4ceb-96d5-5d0075550e28.jpg",
      caption: "Another moment I never want to forget."
    },
    {
      src: "images/91c53e7c-b5cc-4764-a39f-b511f1a5786c.jpg",
      caption: "You are my favorite reason to smile."
    },
    {
      src: "images/dc929da6-02e0-43de-b295-660422ebc3ae.jpg",
      caption: "This countdown is really just my heart getting excited."
    },
    {
      src: "images/ea85444c-46fa-4519-b045-081e7d99597e.jpg",
      caption: "Happy birthday soon, my beautiful love."
    }
  ]
};

const LOVE_LETTER = [
  "Happy birthday, my love. I made this little countdown because every second before your special day feels worth remembering.",
  "You are my favorite smile, my soft place, and the person who makes ordinary days feel warm and beautiful. I hope today reminds you how loved, cherished, and special you are.",
  "Thank you for being you: sweet, strong, caring, and unforgettable. I am so lucky to love you, and I hope this birthday gives you the happiness you always give to me.",
  "I love you so much. Happy birthday, my beautiful girlfriend."
];

const els = {
  personName: document.getElementById("personName"),
  celebrationName: document.getElementById("celebrationName"),
  profilePhoto: document.getElementById("profilePhoto"),
  featuredPhoto: document.getElementById("featuredPhoto"),
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  birthdayDateText: document.getElementById("birthdayDateText"),
  progressFill: document.getElementById("progressFill"),
  progressLabel: document.getElementById("progressLabel"),
  slideImage: document.getElementById("slideImage"),
  slideCaption: document.getElementById("slideCaption"),
  slideDots: document.getElementById("slideDots"),
  slideshow: document.getElementById("slideshow"),
  photoModal: document.getElementById("photoModal"),
  openedPhoto: document.getElementById("openedPhoto"),
  openedPhotoCaption: document.getElementById("openedPhotoCaption"),
  closePhotoModal: document.getElementById("closePhotoModal"),
  loveLetterCard: document.getElementById("loveLetterCard"),
  letterStatus: document.getElementById("letterStatus"),
  prevSlide: document.getElementById("prevSlide"),
  nextSlide: document.getElementById("nextSlide"),
  noteModal: document.getElementById("noteModal"),
  modalMessage: document.getElementById("modalMessage"),
  closeModal: document.getElementById("closeModal"),
  celebration: document.getElementById("celebration"),
  celebrationPhoto: document.getElementById("celebrationPhoto"),
  birthdayPlayer: document.getElementById("birthdayPlayer"),
  floatingLayer: document.querySelector(".floating-layer")
};

let slideIndex = 0;
let slideshowTimer;
let hasCelebrated = false;
let birthdaySongStarted = false;
let visitorInteracted = false;
let birthdayUnlocked = false;

function init() {
  els.personName.textContent = CONFIG.personName;
  els.celebrationName.textContent = CONFIG.personName;
  els.profilePhoto.src = CONFIG.profilePhoto;
  els.celebrationPhoto.src = CONFIG.profilePhoto;
  els.featuredPhoto.src = CONFIG.featuredPhoto;
  els.birthdayDateText.textContent = formatBirthdayDate(new Date(CONFIG.birthdayDate));

  setupImageFallbacks();
  createFloatingSymbols();
  setupSlideshow();
  setupNotes();
  setupBirthdayAudioUnlock();
  updateCountdown();
  setInterval(updateCountdown, 1000);

  if (new URLSearchParams(window.location.search).has("celebrate")) {
    window.setTimeout(showCelebration, 500);
  }
}

function setupImageFallbacks() {
  [els.profilePhoto, els.celebrationPhoto, els.featuredPhoto, els.slideImage].forEach((image) => {
    image.addEventListener("error", () => {
      image.style.opacity = "0";
      image.alt = "Add your local photo in the images folder";
    });
  });
}

function formatBirthdayDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function updateCountdown() {
  const now = new Date();
  const birthday = new Date(CONFIG.birthdayDate);
  const start = new Date(CONFIG.countdownStartDate);
  const remaining = new URLSearchParams(window.location.search).has("birthday") ? 0 : birthday - now;

  if (remaining <= 0) {
    renderTime(0, 0, 0, 0);
    updateProgress(100);
    unlockLoveLetter();
    if (!new URLSearchParams(window.location.search).has("nocelebration")) {
      showCelebration();
    }
    return;
  }

  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  renderTime(days, hours, minutes, seconds);

  const totalWindow = birthday - start;
  const elapsed = now - start;
  const progress = totalWindow > 0 ? Math.min(100, Math.max(0, (elapsed / totalWindow) * 100)) : 0;
  updateProgress(progress);
  lockLoveLetter();
}

function renderTime(days, hours, minutes, seconds) {
  els.days.textContent = String(days).padStart(2, "0");
  els.hours.textContent = String(hours).padStart(2, "0");
  els.minutes.textContent = String(minutes).padStart(2, "0");
  els.seconds.textContent = String(seconds).padStart(2, "0");
}

function updateProgress(progress) {
  els.progressFill.style.width = `${progress}%`;
  els.progressLabel.textContent = `${Math.round(progress)}%`;
}

function setupSlideshow() {
  renderDots();
  showSlide(0, true);
  startSlideshow();

  els.prevSlide.addEventListener("click", () => showSlide(slideIndex - 1));
  els.nextSlide.addEventListener("click", () => showSlide(slideIndex + 1));
  els.slideImage.addEventListener("click", openCurrentPhoto);
  els.slideshow.addEventListener("mouseenter", stopSlideshow);
  els.slideshow.addEventListener("mouseleave", startSlideshow);
  els.closePhotoModal.addEventListener("click", closePhoto);
  els.photoModal.addEventListener("click", (event) => {
    if (event.target === els.photoModal) closePhoto();
  });
}

function renderDots() {
  els.slideDots.innerHTML = "";
  CONFIG.photos.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to photo ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    els.slideDots.appendChild(dot);
  });
}

function showSlide(nextIndex, instant = false) {
  const total = CONFIG.photos.length;
  slideIndex = (nextIndex + total) % total;
  const photo = CONFIG.photos[slideIndex];

  const swap = () => {
    els.slideImage.src = photo.src;
    els.slideCaption.textContent = photo.caption;
    document.querySelectorAll(".dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === slideIndex);
    });
    els.slideImage.classList.remove("is-changing");
  };

  if (instant) {
    swap();
    return;
  }

  els.slideImage.classList.add("is-changing");
  window.setTimeout(swap, 260);
  restartSlideshow();
}

function startSlideshow() {
  stopSlideshow();
  slideshowTimer = window.setInterval(() => showSlide(slideIndex + 1), CONFIG.slideshowSpeed);
}

function stopSlideshow() {
  window.clearInterval(slideshowTimer);
}

function restartSlideshow() {
  stopSlideshow();
  startSlideshow();
}

function openCurrentPhoto() {
  const photo = CONFIG.photos[slideIndex];
  stopSlideshow();
  els.openedPhoto.src = photo.src;
  els.openedPhotoCaption.textContent = photo.caption;
  els.photoModal.classList.add("show");
}

function closePhoto() {
  els.photoModal.classList.remove("show");
  startSlideshow();
}

function setupNotes() {
  els.loveLetterCard.addEventListener("click", () => {
    if (!birthdayUnlocked) {
      els.letterStatus.textContent = "Not yet, my love. Open this on your birthday.";
      els.loveLetterCard.classList.remove("shake");
      void els.loveLetterCard.offsetWidth;
      els.loveLetterCard.classList.add("shake");
      return;
    }

    els.modalMessage.innerHTML = LOVE_LETTER.map((paragraph) => `<p>${paragraph}</p>`).join("");
    els.noteModal.classList.add("show");
  });

  els.closeModal.addEventListener("click", closeNote);
  els.noteModal.addEventListener("click", (event) => {
    if (event.target === els.noteModal) closeNote();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNote();
      closePhoto();
    }
  });
}

function unlockLoveLetter() {
  if (birthdayUnlocked) return;
  birthdayUnlocked = true;
  els.loveLetterCard.classList.remove("locked");
  els.loveLetterCard.classList.add("unlocked");
  els.letterStatus.textContent = "It is your birthday. Open me.";
}

function lockLoveLetter() {
  if (birthdayUnlocked) return;
  els.loveLetterCard.classList.add("locked");
}

function closeNote() {
  els.noteModal.classList.remove("show");
}

function setupBirthdayAudioUnlock() {
  ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
    document.addEventListener(eventName, () => {
      visitorInteracted = true;
    }, { once: true });
  });
}

function playBirthdayTune() {
  if (birthdaySongStarted) return;

  const videoId = CONFIG.birthdaySongVideoId;
  const params = new URLSearchParams({
    autoplay: "1",
    controls: "0",
    loop: "1",
    playlist: videoId,
    rel: "0",
    modestbranding: "1",
    playsinline: "1"
  });

  els.birthdayPlayer.innerHTML = `
    <iframe
      title="Happy Birthday song"
      src="https://www.youtube.com/embed/${videoId}?${params.toString()}"
      allow="autoplay; encrypted-media"
      referrerpolicy="strict-origin-when-cross-origin">
    </iframe>
  `;
  birthdaySongStarted = true;
}

function showCelebration() {
  if (hasCelebrated) return;
  hasCelebrated = true;
  document.body.classList.add("birthday-mode");
  stopSlideshow();
  els.celebration.classList.add("show");
  launchConfetti();
  showerBirthdaySymbols();
  if (!new URLSearchParams(window.location.search).has("silent")) {
    try {
      playBirthdayTune();
    } catch (error) {
      birthdaySongStarted = false;
    }
  }
}

function launchConfetti() {
  const colors = ["#e86c94", "#6f3faa", "#b58aff", "#ffd3df", "#fff8ec"];

  for (let i = 0; i < 90; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 1.2}s`;
    piece.style.setProperty("--fallX", `${Math.random() * 220 - 110}px`);
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 4600);
  }
}

function showerBirthdaySymbols() {
  const symbols = ["\u2665", "\u2726", "\u22C6", "\u273D"];

  for (let i = 0; i < 42; i += 1) {
    window.setTimeout(() => {
      const burst = document.createElement("span");
      burst.className = "birthday-symbol";
      burst.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      burst.style.left = `${Math.random() * 100}vw`;
      burst.style.top = `${Math.random() * 100}vh`;
      burst.style.fontSize = `${Math.random() * 26 + 16}px`;
      burst.style.setProperty("--burstX", `${Math.random() * 180 - 90}px`);
      burst.style.setProperty("--burstY", `${Math.random() * 180 - 120}px`);
      document.body.appendChild(burst);
      window.setTimeout(() => burst.remove(), 2200);
    }, i * 95);
  }
}

function createFloatingSymbols() {
  const symbols = ["heart", "sparkle", "star", "petal"];
  const glyphs = {
    heart: "\u2665",
    sparkle: "\u2726",
    star: "\u22C6",
    petal: "\u273D"
  };

  for (let i = 0; i < 34; i += 1) {
    const type = symbols[Math.floor(Math.random() * symbols.length)];
    const float = document.createElement("span");
    float.className = "float";
    float.textContent = glyphs[type];
    float.style.left = `${Math.random() * 100}vw`;
    float.style.fontSize = `${Math.random() * 18 + 12}px`;
    float.style.animationDuration = `${Math.random() * 10 + 12}s`;
    float.style.animationDelay = `${Math.random() * -18}s`;
    float.style.setProperty("--drift", `${Math.random() * 160 - 80}px`);
    els.floatingLayer.appendChild(float);
  }
}

init();
