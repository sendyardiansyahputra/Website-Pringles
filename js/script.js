// Smooth scroll dan update active link pada navigasi
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  // Update active link saat scroll
  const updateActiveLink = () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  // Update active link on scroll
  window.addEventListener("scroll", updateActiveLink);

  // Smooth scroll pada klik link navigasi
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Update active class
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");

        // Smooth scroll ke section
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Inisialisasi active link saat halaman dimuat
  updateActiveLink();
});

// Modal untuk product
const modal = document.getElementById("productModal");
const closeModal = document.querySelector(".close-modal");

if (closeModal) {
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

if (modal) {
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Contact form
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const successMsg = document.querySelector(".form-success");
    if (successMsg) {
      successMsg.style.display = "block";
      contactForm.style.display = "none";
      setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = "block";
        successMsg.style.display = "none";
      }, 2000);
    }
  });
}

// Carousel variants data
const variants = [
  {
    id: 1,
    name: "Original",
    image: "ori.jpeg",
    price: "Rp 25.000",
    desc: "Rasa klasik yang nikmat dan renyah",
  },
  {
    id: 2,
    name: "Sour Cream & Onion",
    image: "sour.jpeg",
    price: "Rp 28.000",
    desc: "Perpaduan segar krim asam dan bawang",
  },
  {
    id: 3,
    name: "BBQ",
    image: "bbq.jpeg",
    price: "Rp 28.000",
    desc: "Rasa barbekyu yang gurih dan menggugah selera",
  },
  {
    id: 4,
    name: "Hot & Spicy",
    image: "spicy.jpeg",
    price: "Rp 28.000",
    desc: "Panas dan pedas untuk pencinta sensasi",
  },
  {
    id: 5,
    name: "Cheesy Cheese",
    image: "keju.jpeg",
    price: "Rp 28.000",
    desc: "Taburan keju yang kaya rasa",
  },
];

let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;

// Initialize carousel
function initCarousel() {
  const carouselTrack = document.querySelector(".carousel-track");
  const dotsContainer = document.querySelector(".dots-container");

  if (!carouselTrack || !dotsContainer) return;

  // Populate carousel cards
  variants.forEach((variant, index) => {
    const card = document.createElement("div");
    card.className = "variant-card";
    if (index === 0) card.classList.add("active");

    card.innerHTML = `
      <div class="variant-image">
        <img src="${variant.image}" alt="${variant.name}" />
      </div>
      <div class="variant-info">
        <h3 class="variant-title">${variant.name}</h3>
        <p class="variant-desc">${variant.desc}</p>
        <p class="variant-price">${variant.price}</p>
      </div>
      <div class="variant-buttons">
        <button class="btn-buy" data-variant="${variant.id}">
          <i class="fas fa-shopping-cart"></i> Beli
        </button>
        <button class="like-btn" data-variant="${variant.id}">
          <i class="far fa-heart"></i>
        </button>
      </div>
    `;

    carouselTrack.appendChild(card);
  });

  // Populate dots
  variants.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = "dot";
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  // Add event listeners for buttons
  setupCarouselButtons();
  setupLikeButtons();
  setupTouchEvents();
  setupBuyButtons();
}

function setupCarouselButtons() {
  const prevBtn = document.querySelector(".carousel-btn-prev");
  const nextBtn = document.querySelector(".carousel-btn-next");

  if (prevBtn) prevBtn.addEventListener("click", () => prevSlide());
  if (nextBtn) nextBtn.addEventListener("click", () => nextSlide());
}

function setupLikeButtons() {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".like-btn")) {
      const btn = e.target.closest(".like-btn");
      const icon = btn.querySelector("i");
      btn.classList.toggle("liked");
      icon.classList.toggle("far");
      icon.classList.toggle("fas");
    }
  });
}

function setupBuyButtons() {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".btn-buy")) {
      const btn = e.target.closest(".btn-buy");
      const variantId = btn.dataset.variant;
      const variant = variants.find((v) => v.id == variantId);
      alert(
        `Anda membeli ${variant.name} - ${variant.price}. Fungsi checkout akan ditambahkan nanti.`
      );
    }
  });
}

function setupTouchEvents() {
  const carouselWrapper = document.querySelector(".carousel-wrapper");
  if (!carouselWrapper) return;

  carouselWrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carouselWrapper.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
}

function updateCarousel() {
  const carouselTrack = document.querySelector(".carousel-track");
  const cards = document.querySelectorAll(".variant-card");
  const dots = document.querySelectorAll(".dot");

  cards.forEach((card, index) => {
    card.classList.remove("active");
    if (index === currentIndex) {
      card.classList.add("active");
    }
  });

  dots.forEach((dot, index) => {
    dot.classList.remove("active");
    if (index === currentIndex) {
      dot.classList.add("active");
    }
  });

  // Scroll to active card
  if (carouselTrack) {
    const cardWidth = cards[0].offsetWidth + 20; // Include gap
    carouselTrack.style.transform = `translateX(-${
      currentIndex * cardWidth
    }px)`;
  }
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + variants.length) % variants.length;
  updateCarousel();
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % variants.length;
  updateCarousel();
}

function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCarousel);
} else {
  initCarousel();
}
