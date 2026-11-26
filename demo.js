// --- KONFIGURASI DEMO DAN KONTAK ---
const LOGO_FILENAME = window.BRAND_ASSET_CONFIG.LOGO_FILENAME;
const LOGO_FOLDER = window.BRAND_ASSET_CONFIG.LOGO_FOLDER;
const WHATSAPP_NUMBER = "628xxxxxxxxxx";
const BRAND_NAME = window.BRAND_ASSET_CONFIG.BRAND_NAME;
const GOOGLE_MAPS_URL = "[LINK_GOOGLE_MAPS]";
const DEFAULT_MAP_SEARCH = "Bengkel Arus Motor, Jl. Anggrek No. 18, Bandung";
const DEFAULT_BUSINESS_MAP_URL = `https://maps.google.com/?q=${encodeURIComponent(DEFAULT_MAP_SEARCH)}`;
const DEFAULT_INVITATION_MAP_URL =
  "https://maps.google.com/?q=Balai+Asri+Bandung";

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

document.querySelectorAll(".year-now").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

document.querySelectorAll(".whatsapp-link").forEach((link) => {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(link.dataset.waMessage || "Halo, saya ingin bertanya tentang layanan ini.")}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

// --- PESAN STATUS DAN TAUTAN PETA ---
const toast = document.querySelector("#demo-toast");
let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(
    () => toast.classList.remove("is-visible"),
    2800,
  );
}

const mapLink = document.querySelector("#map-link");
const businessMap = document.querySelector("#business-map");
const invitationMapLink = document.querySelector("#invite-map-link");
const configuredMapUrl = GOOGLE_MAPS_URL.startsWith("http")
  ? GOOGLE_MAPS_URL
  : "";
const mapQuery =
  configuredMapUrl.match(/[?&](?:q|query)=([^&]+)/)?.[1] ||
  configuredMapUrl.match(/\/maps\/place\/([^/]+)/)?.[1];
const mapEmbedUrl =
  configuredMapUrl.includes("/maps/embed") ||
  configuredMapUrl.includes("output=embed")
    ? configuredMapUrl
    : mapQuery
      ? `https://maps.google.com/maps?q=${mapQuery}&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(DEFAULT_MAP_SEARCH)}&output=embed`;
if (mapLink) mapLink.href = configuredMapUrl || DEFAULT_BUSINESS_MAP_URL;
if (businessMap) businessMap.src = mapEmbedUrl;
if (invitationMapLink) invitationMapLink.href = DEFAULT_INVITATION_MAP_URL;

const money = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

// --- SIMULASI KASIR ---
function initCashier() {
  const productCatalog = [
    { id: "kopi-susu", name: "Kopi susu", price: 18000 },
    { id: "kopi-hitam", name: "Kopi hitam", price: 14000 },
    { id: "teh-lemon", name: "Teh lemon", price: 12000 },
    { id: "roti-panggang", name: "Roti panggang", price: 16000 },
    { id: "pisang-goreng", name: "Pisang goreng", price: 13000 },
    { id: "air-mineral", name: "Air mineral", price: 6000 },
  ];
  const products = new Map(
    productCatalog.map((product) => [product.id, product]),
  );
  const cart = new Map();
  const cartItems = document.querySelector("#cart-items");
  const subtotalElement = document.querySelector("#subtotal");
  const totalElement = document.querySelector("#total");
  const cartItemCount = document.querySelector("#cart-item-count");
  const cashInput = document.querySelector("#cash-input");
  const changeDue = document.querySelector("#change-due");
  const paymentMessage = document.querySelector("#payment-message");
  const completeSale = document.querySelector("#complete-sale");
  const receiptContent = document.querySelector("#receipt-content");
  let lastReceipt = null;

  if (
    !cartItems ||
    !subtotalElement ||
    !totalElement ||
    !cashInput ||
    !completeSale ||
    !receiptContent
  )
    return;

  const cartQuantity = () =>
    Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = () =>
    Array.from(cart.values()).reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

  function getReceiptText(receipt) {
    const lines = [
      "RASA PAGI",
      "Tempat singgah dan menikmati hari",
      `Waktu: ${receipt.date}`,
      "--------------------------------",
      ...receipt.items.map(
        (item) =>
          `${item.name} x${item.quantity}  ${money(item.price * item.quantity)}`,
      ),
      "--------------------------------",
      `Total: ${money(receipt.total)}`,
      `Dibayar: ${money(receipt.paid)}`,
      `Kembalian: ${money(receipt.change)}`,
      "Terima kasih. Semoga hari Anda menyenangkan.",
    ];
    return lines.join("\n");
  }

  function renderReceipt() {
    const currentItems = Array.from(cart.values()).map(
      ({ product, quantity }) => ({
        name: product.name,
        price: product.price,
        quantity,
      }),
    );
    const activeReceipt =
      currentItems.length > 0
        ? {
            items: currentItems,
            total: cartTotal(),
            paid: Number(cashInput.value) || 0,
            change: Math.max(0, (Number(cashInput.value) || 0) - cartTotal()),
            date: new Date().toLocaleString("id-ID"),
          }
        : lastReceipt;

    if (!activeReceipt) {
      receiptContent.innerHTML =
        '<div class="receipt-brand">RASA PAGI<small>Tempat singgah dan menikmati hari</small></div><div class="receipt-divider"></div><p>Tambahkan produk untuk melihat ringkasan pembayaran.</p><div class="receipt-divider"></div><div class="receipt-footer">Terima kasih. Semoga hari Anda menyenangkan.</div>';
      return;
    }

    const itemMarkup = activeReceipt.items
      .map(
        (item) =>
          `<div class="receipt-row"><span>${item.name} × ${item.quantity}</span><b>${money(item.price * item.quantity)}</b></div>`,
      )
      .join("");
    receiptContent.innerHTML = `<div class="receipt-brand">RASA PAGI<small>Tempat singgah dan menikmati hari</small></div><div class="receipt-divider"></div><div class="receipt-row muted-row"><span>Waktu</span><span>${activeReceipt.date}</span></div>${itemMarkup}<div class="receipt-divider"></div><div class="receipt-row receipt-total"><span>Total</span><b>${money(activeReceipt.total)}</b></div><div class="receipt-row"><span>Dibayar</span><b>${money(activeReceipt.paid)}</b></div><div class="receipt-row"><span>Kembalian</span><b>${money(activeReceipt.change)}</b></div><div class="receipt-divider"></div><div class="receipt-footer">Terima kasih. Semoga hari Anda menyenangkan.</div>`;
  }

  function renderCart() {
    const count = cartQuantity();
    const total = cartTotal();
    const paid = Number(cashInput.value) || 0;
    const change = paid - total;
    subtotalElement.textContent = money(total);
    totalElement.textContent = money(total);
    changeDue.textContent = money(Math.max(0, change));
    if (cartItemCount)
      cartItemCount.textContent = count
        ? `${count} item dalam keranjang`
        : "Belum ada produk";
    completeSale.disabled = !count || paid < total;
    paymentMessage.textContent =
      count && paid > 0 && paid < total
        ? `Uang diterima kurang ${money(total - paid)}.`
        : "";

    if (!count) {
      cartItems.innerHTML =
        '<div class="empty-cart"><span aria-hidden="true">＋</span><b>Keranjang masih kosong</b><small>Pilih produk di sebelah kiri untuk memulai.</small></div>';
    } else {
      cartItems.innerHTML = Array.from(cart.entries())
        .map(
          ([id, item]) =>
            `<div class="cart-line"><div class="cart-line-name"><b>${item.product.name}</b><small>${money(item.product.price)} · ${money(item.product.price * item.quantity)}</small></div><div class="quantity-controls"><button type="button" data-quantity="${id}" data-step="-1" aria-label="Kurangi ${item.product.name}">−</button><span>${item.quantity}</span><button type="button" data-quantity="${id}" data-step="1" aria-label="Tambah ${item.product.name}">+</button></div></div>`,
        )
        .join("");
    }
    renderReceipt();
  }

  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = products.get(button.dataset.add);
      if (!product) return;
      const existing = cart.get(product.id);
      cart.set(product.id, {
        product,
        quantity: (existing ? existing.quantity : 0) + 1,
      });
      renderCart();
    });
  });

  cartItems.addEventListener("click", (event) => {
    const button = event.target.closest("[data-quantity]");
    if (!button) return;
    const id = button.dataset.quantity;
    const existing = cart.get(id);
    if (!existing) return;
    const nextQuantity = existing.quantity + Number(button.dataset.step);
    if (nextQuantity <= 0) cart.delete(id);
    else cart.set(id, { ...existing, quantity: nextQuantity });
    renderCart();
  });

  cashInput.addEventListener("input", renderCart);
  document.querySelector("#clear-cart")?.addEventListener("click", () => {
    cart.clear();
    cashInput.value = "";
    renderCart();
    showToast("Keranjang transaksi telah dikosongkan.");
  });

  completeSale.addEventListener("click", () => {
    const paid = Number(cashInput.value) || 0;
    const total = cartTotal();
    if (!cart.size || paid < total) {
      paymentMessage.textContent = "Periksa kembali jumlah uang yang diterima.";
      return;
    }
    lastReceipt = {
      items: Array.from(cart.values()).map(({ product, quantity }) => ({
        name: product.name,
        price: product.price,
        quantity,
      })),
      total,
      paid,
      change: paid - total,
      date: new Date().toLocaleString("id-ID"),
    };
    cart.clear();
    cashInput.value = "";
    renderCart();
    showToast("Transaksi selesai. Struk siap dicetak atau disalin.");
  });

  document.querySelector("#print-receipt")?.addEventListener("click", () => {
    if (!cart.size && !lastReceipt) {
      showToast("Tambahkan produk sebelum mencetak struk.");
      return;
    }
    if (cart.size && (Number(cashInput.value) || 0) < cartTotal()) {
      showToast("Masukkan uang diterima yang cukup sebelum mencetak struk.");
      return;
    }
    window.print();
  });

  document
    .querySelector("#copy-receipt")
    ?.addEventListener("click", async () => {
      if (!cart.size && !lastReceipt) {
        showToast("Tambahkan produk sebelum menyalin struk.");
        return;
      }
      const receipt =
        lastReceipt && !cart.size
          ? lastReceipt
          : {
              items: Array.from(cart.values()).map(({ product, quantity }) => ({
                name: product.name,
                price: product.price,
                quantity,
              })),
              total: cartTotal(),
              paid: Number(cashInput.value) || 0,
              change: Math.max(0, (Number(cashInput.value) || 0) - cartTotal()),
              date: new Date().toLocaleString("id-ID"),
            };
      if (cart.size && receipt.paid < receipt.total) {
        showToast("Masukkan uang diterima yang cukup sebelum menyalin struk.");
        return;
      }
      try {
        await navigator.clipboard.writeText(getReceiptText(receipt));
        showToast("Ringkasan struk berhasil disalin.");
      } catch (error) {
        const temporaryField = document.createElement("textarea");
        temporaryField.value = getReceiptText(receipt);
        temporaryField.setAttribute("readonly", "");
        temporaryField.style.position = "fixed";
        temporaryField.style.opacity = "0";
        document.body.append(temporaryField);
        temporaryField.select();
        const copied = document.execCommand("copy");
        temporaryField.remove();
        if (!copied) {
          console.error("Tidak dapat menyalin struk.", error);
          showToast("Struk belum dapat disalin. Silakan gunakan fitur cetak.");
          return;
        }
        showToast("Ringkasan struk berhasil disalin.");
      }
    });

  const catalogCount = document.querySelector("#catalog-count");
  if (catalogCount)
    catalogCount.textContent = `${productCatalog.length} produk`;
  renderCart();
}

// --- PENCATATAN PERSEDIAAN ---
function initInventory() {
  const inventory = [
    {
      id: 1,
      name: "Kopi Arabika",
      category: "Bahan baku",
      quantity: 24,
      threshold: 8,
    },
    {
      id: 2,
      name: "Gelas 12 oz",
      category: "Kemasan",
      quantity: 8,
      threshold: 10,
    },
    {
      id: 3,
      name: "Susu segar",
      category: "Bahan baku",
      quantity: 18,
      threshold: 6,
    },
    {
      id: 4,
      name: "Sirup vanila",
      category: "Bahan baku",
      quantity: 5,
      threshold: 6,
    },
  ];
  const rows = document.querySelector("#stock-rows");
  const search = document.querySelector("#stock-search");
  const emptyState = document.querySelector("#empty-stock");
  const summaryItems = document.querySelector("#summary-items");
  const summaryQuantity = document.querySelector("#summary-quantity");
  const summaryLow = document.querySelector("#summary-low");
  if (!rows || !search || !emptyState) return;

  function renderInventory() {
    const query = search.value.trim().toLocaleLowerCase("id");
    const filteredItems = inventory.filter((item) =>
      `${item.name} ${item.category}`.toLocaleLowerCase("id").includes(query),
    );
    const tableRows = filteredItems.map((item) => {
      const low = item.quantity <= item.threshold;
      const row = document.createElement("tr");
      row.dataset.stockId = String(item.id);
      const nameCell = document.createElement("td");
      nameCell.textContent = item.name;
      const categoryCell = document.createElement("td");
      const category = document.createElement("span");
      category.className = "category-tag";
      category.textContent = item.category;
      categoryCell.append(category);
      const quantityCell = document.createElement("td");
      const quantity = document.createElement("span");
      quantity.className = "stock-amount";
      quantity.textContent = `${item.quantity} unit`;
      quantityCell.append(quantity);
      const thresholdCell = document.createElement("td");
      thresholdCell.textContent = `${item.threshold} unit`;
      const statusCell = document.createElement("td");
      const status = document.createElement("span");
      status.className = `stock-status${low ? " is-low" : ""}`;
      status.textContent = low ? "Menipis" : "Aman";
      statusCell.append(status);
      const controlsCell = document.createElement("td");
      const controls = document.createElement("div");
      controls.className = "stock-controls";
      const amountInput = document.createElement("input");
      amountInput.type = "number";
      amountInput.min = "1";
      amountInput.step = "1";
      amountInput.value = "1";
      amountInput.inputMode = "numeric";
      amountInput.setAttribute(
        "aria-label",
        `Jumlah perubahan stok ${item.name}`,
      );
      const incomingButton = document.createElement("button");
      incomingButton.type = "button";
      incomingButton.dataset.stockAction = "in";
      incomingButton.dataset.stockId = String(item.id);
      incomingButton.textContent = "＋ Stok masuk";
      const outgoingButton = document.createElement("button");
      outgoingButton.type = "button";
      outgoingButton.className = "stock-out";
      outgoingButton.dataset.stockAction = "out";
      outgoingButton.dataset.stockId = String(item.id);
      outgoingButton.textContent = "− Stok keluar";
      controls.append(amountInput, incomingButton, outgoingButton);
      controlsCell.append(controls);
      row.append(
        nameCell,
        categoryCell,
        quantityCell,
        thresholdCell,
        statusCell,
        controlsCell,
      );
      return row;
    });
    rows.replaceChildren(...tableRows);
    emptyState.hidden = filteredItems.length > 0;
    if (summaryItems) summaryItems.textContent = String(inventory.length);
    if (summaryQuantity)
      summaryQuantity.textContent = String(
        inventory.reduce((sum, item) => sum + item.quantity, 0),
      );
    if (summaryLow)
      summaryLow.textContent = `${inventory.filter((item) => item.quantity <= item.threshold).length} barang`;
  }

  rows.addEventListener("click", (event) => {
    const button = event.target.closest("[data-stock-action]");
    if (!button) return;
    const item = inventory.find(
      (entry) => entry.id === Number(button.dataset.stockId),
    );
    const amountInput = button
      .closest(".stock-controls")
      ?.querySelector("input");
    const amount = Number(amountInput?.value);
    if (!item || !Number.isInteger(amount) || amount < 1) {
      showToast(
        "Masukkan jumlah perubahan stok berupa bilangan bulat lebih dari nol.",
      );
      amountInput?.focus();
      return;
    }
    if (button.dataset.stockAction === "out" && item.quantity < amount) {
      showToast(
        `Stok ${item.name} hanya ${item.quantity} unit. Jumlah keluar melebihi persediaan.`,
      );
      amountInput.focus();
      return;
    }
    item.quantity += button.dataset.stockAction === "in" ? amount : -amount;
    renderInventory();
    showToast(`Stok ${item.name} berhasil diperbarui.`);
  });

  search.addEventListener("input", renderInventory);
  document
    .querySelector("#add-stock-form")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const category = String(formData.get("category") || "").trim();
      const quantity = Number(formData.get("quantity"));
      const threshold = Number(formData.get("threshold"));
      const feedback = document.querySelector("#stock-feedback");
      if (
        !name ||
        !category ||
        !Number.isInteger(quantity) ||
        quantity < 0 ||
        !Number.isInteger(threshold) ||
        threshold < 0
      ) {
        if (feedback)
          feedback.textContent =
            "Lengkapi semua kolom dengan jumlah berupa bilangan bulat nol atau lebih.";
        return;
      }
      if (
        inventory.some(
          (item) =>
            item.name.toLocaleLowerCase("id") === name.toLocaleLowerCase("id"),
        )
      ) {
        if (feedback)
          feedback.textContent = `Barang "${name}" sudah tercatat. Gunakan pencatatan stok untuk memperbarui jumlah.`;
        return;
      }
      inventory.push({ id: Date.now(), name, category, quantity, threshold });
      form.reset();
      renderInventory();
      if (feedback)
        feedback.textContent = `${name} berhasil ditambahkan ke daftar barang.`;
      search.value = "";
    });

  renderInventory();
}

// --- UNDANGAN DIGITAL DAN RSVP ---
function initInvitation() {
  const countdown = document.querySelector("#countdown");
  if (countdown) {
    const eventTime = new Date(countdown.dataset.date).getTime();
    const updateCountdown = () => {
      const remaining = Math.max(0, eventTime - Date.now());
      const values = {
        "#count-days": Math.floor(remaining / 86400000),
        "#count-hours": Math.floor((remaining / 3600000) % 24),
        "#count-minutes": Math.floor((remaining / 60000) % 60),
        "#count-seconds": Math.floor((remaining / 1000) % 60),
      };
      Object.entries(values).forEach(([selector, value]) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = String(value).padStart(2, "0");
      });
    };
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }

  const form = document.querySelector("#rsvp-form");
  const messages = document.querySelector("#guest-messages");
  const count = document.querySelector("#guest-count");
  const feedback = document.querySelector("#rsvp-feedback");
  if (!form || !messages || !count) return;
  let guestCount = 0;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const attendance = String(formData.get("attendance") || "");
    const message = String(formData.get("message") || "").trim();
    if (!name || !message) return;
    messages.querySelector(".guest-empty")?.remove();

    const card = document.createElement("article");
    card.className = "guest-message";
    const topLine = document.createElement("div");
    topLine.className = "guest-message-top";
    const guestName = document.createElement("b");
    guestName.textContent = name;
    const attendanceLabel = document.createElement("span");
    attendanceLabel.className = "attendance-tag";
    attendanceLabel.textContent = attendance;
    const guestMessage = document.createElement("p");
    guestMessage.textContent = message;
    topLine.append(guestName, attendanceLabel);
    card.append(topLine, guestMessage);
    messages.prepend(card);
    guestCount += 1;
    count.textContent = `${guestCount} ucapan`;
    if (feedback)
      feedback.textContent = `Terima kasih, ${name}. Konfirmasi dan ucapan Anda telah ditambahkan.`;
    form.reset();
    document.querySelector("#guest-name")?.focus();
  });
}

// --- INISIALISASI HALAMAN AKTIF ---
const demoType = document.body.dataset.demo;
if (demoType === "kasir") initCashier();
if (demoType === "stok") initInventory();
if (demoType === "undangan") initInvitation();
