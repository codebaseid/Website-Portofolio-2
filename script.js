// --- KONFIGURASI BRAND DAN KONTAK ---
// Nama brand dan PNG mengikuti konfigurasi bersama agar semua halaman tetap seragam.
const LOGO_FILENAME = window.BRAND_ASSET_CONFIG.LOGO_FILENAME;
const LOGO_FOLDER = window.BRAND_ASSET_CONFIG.LOGO_FOLDER;
const WHATSAPP_NUMBER = "6285213538741";
const BRAND_NAME = window.BRAND_ASSET_CONFIG.BRAND_NAME;
const SERVICE_AREA = "Bandung, Jawa Barat";
const SITE_DESCRIPTION =
  "Jasa pembuatan website dan aplikasi praktis untuk UMKM, mahasiswa, dan organisasi. Konsultasi kebutuhan serta estimasi layanan melalui WhatsApp.";

// --- KONFIGURASI PROMO ---
const PROMO_SETTINGS = Object.freeze({
  active: true,
  heading: "Konsultasi kebutuhan tanpa biaya.",
  description:
    "Diskusikan kebutuhan digital Anda dan dapatkan arahan paket yang sesuai.",
  claimMessage:
    "Halo, saya ingin menggunakan promo konsultasi gratis untuk layanan digital.",
  delayMs: 9000,
  dismissalDays: 14,
});

// --- KONFIGURASI ESTIMASI HARGA ---
const ESTIMATE_PRICING = Object.freeze({
  projects: [
    {
      id: "landing",
      label: "Landing Page Profil Usaha",
      min: 350000,
      max: 1200000,
    },
    {
      id: "cashier",
      label: "Sistem Kasir Web",
      min: 750000,
      max: 2500000,
    },
    {
      id: "stock",
      label: "Aplikasi Stok Web/Android",
      min: 1200000,
      max: 3500000,
    },
    {
      id: "invitation",
      label: "Website Undangan Digital",
      min: 150000,
      max: 600000,
    },
  ],
  addOns: [
    {
      id: "domain-hosting",
      label: "Domain dan hosting untuk satu tahun",
      min: 250000,
      max: 650000,
    },
    {
      id: "photo-content",
      label: "Foto dan penulisan konten",
      min: 200000,
      max: 500000,
    },
    {
      id: "whatsapp-maps",
      label: "Integrasi lanjutan WhatsApp dan lokasi",
      min: 100000,
      max: 300000,
    },
  ],
});

// --- PENCATATAN INTERAKSI LOKAL ---
const interactionEvents = [];
window.portfolioTracking = { events: interactionEvents };

function trackInteraction(name, details = {}) {
  const event = {
    name,
    details,
    timestamp: new Date().toISOString(),
  };

  interactionEvents.push(event);
  window.dispatchEvent(
    new CustomEvent("portfolio:interaction", { detail: event }),
  );
}

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

// --- METADATA SEO DAN DATA LOKAL ---
function setMetaContent(selector, content) {
  const element = document.head.querySelector(selector);
  if (element) element.content = content;
}

function updateLocalSeo() {
  const pageTitle = `${BRAND_NAME} — Website dan Aplikasi Praktis`;
  const logoAbsoluteUrl = new URL(
    `${LOGO_FOLDER}/${LOGO_FILENAME}`,
    window.location.href,
  ).href;
  const canonicalUrl =
    window.location.protocol === "http:" ||
    window.location.protocol === "https:"
      ? window.location.href.split("#")[0]
      : "";

  document.title = pageTitle;
  setMetaContent('meta[name="description"]', SITE_DESCRIPTION);
  setMetaContent('meta[property="og:title"]', pageTitle);
  setMetaContent('meta[property="og:description"]', SITE_DESCRIPTION);
  setMetaContent('meta[property="og:image"]', logoAbsoluteUrl);
  setMetaContent('meta[property="og:url"]', canonicalUrl);

  const schema = document.querySelector("#business-schema");
  if (schema) {
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: BRAND_NAME,
      description: SITE_DESCRIPTION,
      telephone: `+${WHATSAPP_NUMBER}`,
      areaServed: {
        "@type": "AdministrativeArea",
        name: SERVICE_AREA,
      },
      image: logoAbsoluteUrl,
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
    });
  }
}

updateLocalSeo();

// --- SIAPKAN PESAN PROMO ---
const promoClaimLink = document.querySelector("#promo-claim");
if (promoClaimLink) {
  promoClaimLink.dataset.message = PROMO_SETTINGS.claimMessage;
}

// --- TAUTAN WHATSAPP ---
document.querySelectorAll(".whatsapp-link").forEach((link) => {
  const message =
    link.dataset.message ||
    `Halo, saya ingin bertanya mengenai layanan ${BRAND_NAME}.`;
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

// --- PELACAKAN KLIK ---
document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const target = event.target.closest("a, button");
  if (!target) return;

  if (target.dataset.trackEvent) {
    trackInteraction(target.dataset.trackEvent, {
      destination: target.getAttribute("href") || "",
    });
  }

  if (target.matches(".whatsapp-link")) {
    trackInteraction("whatsapp_click", {
      source: target.id || target.dataset.trackEvent || "portfolio",
    });
  }
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

// --- KALKULATOR ESTIMASI DAN FORM BRIEF ---
function initializeEstimateCalculator() {
  const form = document.querySelector("#estimate-form");
  const projectSelect = document.querySelector("#estimate-project");
  const addOnOptions = document.querySelector("#estimate-addon-options");
  const rangeOutput = document.querySelector("#estimate-range");
  const breakdownOutput = document.querySelector("#estimate-breakdown");
  const feedback = document.querySelector("#estimate-feedback");

  if (
    !form ||
    !projectSelect ||
    !addOnOptions ||
    !rangeOutput ||
    !breakdownOutput
  ) {
    return;
  }

  const formatPrice = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  ESTIMATE_PRICING.projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.label;
    projectSelect.append(option);
  });

  ESTIMATE_PRICING.addOns.forEach((addOn) => {
    const label = document.createElement("label");
    label.className = "estimate-option";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "addOns";
    input.value = addOn.id;

    const copy = document.createElement("span");
    copy.className = "estimate-option-copy";

    const title = document.createElement("strong");
    title.textContent = addOn.label;

    const amount = document.createElement("small");
    amount.textContent = `+ ${formatPrice(addOn.min)}–${formatPrice(addOn.max)}`;

    copy.append(title, amount);
    label.append(input, copy);
    addOnOptions.append(label);
  });

  function getCurrentEstimate() {
    const project = ESTIMATE_PRICING.projects.find(
      (item) => item.id === projectSelect.value,
    );

    if (!project) return null;

    const selectedAddOns = ESTIMATE_PRICING.addOns.filter(
      (addOn) =>
        form.querySelector(`input[name="addOns"][value="${addOn.id}"]`).checked,
    );

    return {
      project,
      selectedAddOns,
      min:
        project.min +
        selectedAddOns.reduce((total, addOn) => total + addOn.min, 0),
      max:
        project.max +
        selectedAddOns.reduce((total, addOn) => total + addOn.max, 0),
    };
  }

  function updateEstimate() {
    const estimate = getCurrentEstimate();
    breakdownOutput.replaceChildren();

    if (!estimate) {
      rangeOutput.textContent = "Pilih jenis proyek";
      return;
    }

    rangeOutput.textContent = `${formatPrice(estimate.min)} – ${formatPrice(estimate.max)}`;

    const breakdown = [
      `${estimate.project.label}: ${formatPrice(estimate.project.min)} – ${formatPrice(estimate.project.max)}`,
      ...estimate.selectedAddOns.map(
        (addOn) =>
          `${addOn.label}: ${formatPrice(addOn.min)} – ${formatPrice(addOn.max)}`,
      ),
    ];

    breakdown.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      breakdownOutput.append(listItem);
    });
  }

  form.addEventListener("change", updateEstimate);
  form.addEventListener("input", updateEstimate);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const estimate = getCurrentEstimate();
    if (!estimate) {
      projectSelect.focus();
      return;
    }

    const clientName = form.elements.client.value.trim() || "Belum diisi";
    const notes = form.elements.notes.value.trim() || "Belum ada catatan";
    const addOnSummary = estimate.selectedAddOns.length
      ? estimate.selectedAddOns.map((addOn) => addOn.label).join(", ")
      : "Tidak ada";
    const message = [
      `Halo ${BRAND_NAME}, saya ingin berkonsultasi mengenai proyek digital.`,
      "",
      `Jenis proyek: ${estimate.project.label}`,
      `Kebutuhan tambahan: ${addOnSummary}`,
      `Estimasi awal: ${formatPrice(estimate.min)} – ${formatPrice(estimate.max)}`,
      `Nama atau usaha: ${clientName}`,
      `Catatan kebutuhan: ${notes}`,
      `Area layanan: ${SERVICE_AREA}`,
    ].join("\n");
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    trackInteraction("calculator_submit", {
      project: estimate.project.id,
      addOnCount: estimate.selectedAddOns.length,
      min: estimate.min,
      max: estimate.max,
    });
    trackInteraction("whatsapp_click", { source: "calculator" });

    const whatsappWindow = window.open(whatsappUrl, "_blank");
    if (whatsappWindow) whatsappWindow.opener = null;

    if (!whatsappWindow && feedback) {
      feedback.textContent =
        "WhatsApp belum terbuka. Izinkan tab baru atau periksa pengaturan peramban Anda.";
    } else if (feedback) {
      feedback.textContent = "Brief siap dikirim melalui WhatsApp.";
    }
  });

  updateEstimate();
}

initializeEstimateCalculator();

// --- POP-UP PROMO TERUKUR ---
function initializePromo() {
  const layer = document.querySelector("#promo-layer");
  const trigger = document.querySelector("#promo-trigger");
  const closeButton = document.querySelector("#promo-close");
  const heading = document.querySelector("#promo-heading");
  const description = document.querySelector("#promo-description");
  const claimLink = document.querySelector("#promo-claim");
  const storageKey = "nuansa-digital-promo-dismissed-until";
  const sessionKey = "nuansa-digital-promo-shown";
  let dismissedForThisSession = false;
  let shownThisPage = false;
  let previousFocus = null;
  let previousOverflow = "";

  if (!layer || !trigger || !closeButton || !claimLink) return;

  if (heading) heading.textContent = PROMO_SETTINGS.heading;
  if (description) description.textContent = PROMO_SETTINGS.description;

  function readStoredValue(storageName, key) {
    try {
      return window[storageName].getItem(key);
    } catch (error) {
      console.warn("Penyimpanan promo tidak tersedia di peramban ini.", error);
      return null;
    }
  }

  function writeStoredValue(storageName, key, value) {
    try {
      window[storageName].setItem(key, value);
      return true;
    } catch (error) {
      console.warn("Status promo tidak dapat disimpan di peramban ini.", error);
      return false;
    }
  }

  function isDismissed() {
    if (dismissedForThisSession) return true;

    const expiresAt = Number(readStoredValue("localStorage", storageKey));
    return Number.isFinite(expiresAt) && expiresAt > Date.now();
  }

  function updateTriggerVisibility() {
    trigger.hidden = !PROMO_SETTINGS.active || isDismissed();
  }

  function closePromo(saveDismissal = true) {
    if (layer.hidden) return;

    layer.hidden = true;
    document.body.classList.remove("promo-open");

    if (window.siteLenis) {
      window.siteLenis.start();
    } else {
      document.body.style.overflow = previousOverflow;
    }

    if (saveDismissal) {
      const expiresAt =
        Date.now() + PROMO_SETTINGS.dismissalDays * 24 * 60 * 60 * 1000;
      dismissedForThisSession = !writeStoredValue(
        "localStorage",
        storageKey,
        String(expiresAt),
      );
      updateTriggerVisibility();
    }

    previousFocus?.focus();
  }

  function openPromo(source) {
    if (!PROMO_SETTINGS.active || isDismissed() || layer.hidden === false) {
      return;
    }

    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    layer.hidden = false;
    document.body.classList.add("promo-open");

    if (window.siteLenis) {
      window.siteLenis.stop();
    } else {
      document.body.style.overflow = "hidden";
    }

    shownThisPage = true;
    writeStoredValue("sessionStorage", sessionKey, "true");
    trackInteraction("promo_open", { source });
    closeButton.focus();
  }

  trigger.addEventListener("click", () => openPromo("button"));
  closeButton.addEventListener("click", () => closePromo());
  claimLink.addEventListener("click", () => {
    trackInteraction("promo_claim");
    closePromo();
  });

  layer.addEventListener("click", (event) => {
    if (event.target === layer) closePromo();
  });

  document.addEventListener("keydown", (event) => {
    if (layer.hidden) return;

    if (event.key === "Escape") {
      closePromo();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = Array.from(
      layer.querySelectorAll("a[href], button:not([disabled])"),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  updateTriggerVisibility();

  if (!PROMO_SETTINGS.active || isDismissed()) return;

  const alreadyShown = readStoredValue("sessionStorage", sessionKey);
  if (alreadyShown) return;

  window.setTimeout(() => {
    if (!shownThisPage && !isDismissed()) {
      openPromo("automatic");
    }
  }, PROMO_SETTINGS.delayMs);
}

initializePromo();
