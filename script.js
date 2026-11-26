// --- KONFIGURASI BRAND DAN KONTAK ---
const LOGO_FILENAME = window.BRAND_ASSET_CONFIG.LOGO_FILENAME;
const LOGO_FOLDER = window.BRAND_ASSET_CONFIG.LOGO_FOLDER;
const WHATSAPP_NUMBER = "6285213538741";
const BRAND_NAME = window.BRAND_ASSET_CONFIG.BRAND_NAME;

// --- LOGO DAN FAVICON ---
const executingScriptUrl = document.currentScript?.src || document.baseURI;
const logoUrl = new URL(
  `${LOGO_FOLDER}/${LOGO_FILENAME}`,
  new URL(".", executingScriptUrl),
).href;

function setBrandLink(rel, type) {
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.append(link);
  }
  link.type = type;
  link.href = logoUrl;
}

function installBrandAssets() {
  setBrandLink("icon", "image/png");
  setBrandLink("apple-touch-icon", "image/png");

  document.querySelectorAll(".brand-logo").forEach((container) => {
    let image = container.querySelector(".brand-logo-img");
    if (!image) {
      image = document.createElement("img");
      image.className = "brand-logo-img";
      container.prepend(image);
    }
    image.src = logoUrl;
    image.alt = BRAND_NAME;
    image.decoding = "async";
  });
}

installBrandAssets();

document.querySelectorAll("[data-brand]").forEach((element) => {
  element.textContent = BRAND_NAME;
});

document.title = `${BRAND_NAME} — Solusi Digital Praktis`;

// --- TAUTAN WHATSAPP ---
document.querySelectorAll(".whatsapp-link").forEach((link) => {
  const message =
    link.dataset.message ||
    `Halo, saya ingin bertanya mengenai layanan ${BRAND_NAME}.`;
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");

// --- NAVIGASI UTAMA ---
if (menuToggle && primaryNavigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute(
      "aria-label",
      isExpanded ? "Buka menu navigasi" : "Tutup menu navigasi",
    );
    primaryNavigation.classList.toggle("is-open", !isExpanded);
  });

  primaryNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Buka menu navigasi");
      primaryNavigation.classList.remove("is-open");
    });
  });
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

// --- FILTER PAMERAN UI ---
const styleFilterButtons = Array.from(
  document.querySelectorAll("[data-style-filter]"),
);
const styleCards = Array.from(document.querySelectorAll("[data-style-card]"));
const styleFilterStatus = document.querySelector("#style-filter-status");

function filterStyleCards(category) {
  let visibleCount = 0;
  styleCards.forEach((card) => {
    const isVisible = category === "all" || card.dataset.category === category;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });
  if (styleFilterStatus) {
    styleFilterStatus.textContent = `Menampilkan ${visibleCount} gaya antarmuka.`;
  }
}

styleFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    styleFilterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    filterStyleCards(button.dataset.styleFilter);
  });
});

const applyStyleButtons = Array.from(
  document.querySelectorAll("[data-apply-style]"),
);
const resetStyleButton = document.querySelector("#reset-ui-style");

// --- PENERAPAN GAYA UI ---
function setUiStyle(styleName) {
  if (styleName) document.body.dataset.uiStyle = styleName;
  else delete document.body.dataset.uiStyle;

  applyStyleButtons.forEach((button) => {
    const isActive = button.dataset.applyStyle === styleName;
    button.setAttribute("aria-pressed", String(isActive));
    button
      .closest("[data-style-card]")
      ?.classList.toggle("is-current", isActive);
  });

  if (styleFilterStatus) {
    styleFilterStatus.textContent = styleName
      ? `Tampilan halaman kini menggunakan gaya ${styleName.replace(/-/g, " ")}.`
      : "Gaya awal dipulihkan.";
  }
}

applyStyleButtons.forEach((button) => {
  button.addEventListener("click", () => setUiStyle(button.dataset.applyStyle));
});

resetStyleButton?.addEventListener("click", () => setUiStyle(""));
