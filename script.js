const root = document.documentElement;
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = document.querySelectorAll(".nav-links a");
const themeToggle = document.querySelector(".theme-toggle");
const scrollTopButton = document.querySelector(".scroll-top");

const savedTheme = localStorage.getItem("shakti-theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
}

menuToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navPanel.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  });
});

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("shakti-theme", nextTheme);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

window.addEventListener("scroll", () => {
  scrollTopButton.classList.toggle("visible", window.scrollY > 550);
}, { passive: true });

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const counters = document.querySelectorAll("[data-count]");
let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
  if (countersStarted || !entries.some((entry) => entry.isIntersecting)) return;
  countersStarted = true;
  counters.forEach((counter) => {
    const target = Number(counter.dataset.count);
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      counter.textContent = target === 24 ? `${value}/7` : `${value}+`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}, { threshold: 0.4 });

const statsSection = document.querySelector(".stats-section");
if (statsSection) counterObserver.observe(statsSection);

const quotes = document.querySelectorAll(".quote");
const dotsContainer = document.querySelector(".slider-dots");
let quoteIndex = 0;

quotes.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Show quote ${index + 1}`);
  dot.addEventListener("click", () => showQuote(index));
  dotsContainer.appendChild(dot);
});

function showQuote(index) {
  quoteIndex = index;
  quotes.forEach((quote, quotePosition) => quote.classList.toggle("active", quotePosition === index));
  dotsContainer.querySelectorAll("button").forEach((dot, dotPosition) => {
    dot.classList.toggle("active", dotPosition === index);
  });
}

showQuote(0);
setInterval(() => showQuote((quoteIndex + 1) % quotes.length), 5200);

document.querySelectorAll(".right-card").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("active"));
});

const resourceSearch = document.querySelector("#resource-search");
const categoryButtons = document.querySelectorAll(".category-filters button");
const resourceCards = document.querySelectorAll(".resource-card");
let activeCategory = "all";

function filterResources() {
  const query = resourceSearch.value.trim().toLowerCase();
  resourceCards.forEach((card) => {
    const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
    const matchesQuery = !query || card.textContent.toLowerCase().includes(query) || card.dataset.category.includes(query);
    card.classList.toggle("hidden", !(matchesCategory && matchesQuery));
  });
}

resourceSearch.addEventListener("input", filterResources);
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    filterResources();
  });
});
