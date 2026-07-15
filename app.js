const STORAGE_KEY = "riceprint-config-v1";

const defaults = {
  displayName: "AETHERELIC",
  handle: "@aetherelic",
  tagline: "LINUX // DESIGN // SYSTEMS",
  os: "NixOS",
  wm: "Hyprland",
  shell: "Bash",
  terminal: "Kitty",
  project: "Arcane Shell",
  status: "BUILDING SOMETHING STRANGE",
  accentA: "#8ba5ff",
  accentB: "#7cf6d5",
  surface: "#0c1020",
  frameStyle: "glass",
  motion: "on"
};

const presets = {
  arcane: { accentA: "#8ba5ff", accentB: "#7cf6d5", surface: "#0c1020" },
  void: { accentA: "#b794ff", accentB: "#ff7cb7", surface: "#100b1a" },
  sakura: { accentA: "#ff9fcf", accentB: "#ffd18c", surface: "#1a0d18" },
  terminal: { accentA: "#80ff72", accentB: "#d6ff72", surface: "#050905" }
};

const ids = [
  "displayName", "handle", "tagline", "os", "wm", "shell", "terminal",
  "project", "status", "accentA", "accentB", "surface", "frameStyle", "motion"
];

const fields = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));
const riceCard = document.getElementById("riceCard");
const actionStatus = document.getElementById("actionStatus");
const exportCanvas = document.getElementById("exportCanvas");

const outputMap = {
  displayName: "cardDisplayName",
  handle: "cardHandle",
  tagline: "cardTagline",
  os: "cardOs",
  wm: "cardWm",
  shell: "cardShell",
  terminal: "cardTerminal",
  project: "cardProject",
  status: "cardStatus"
};

const outputs = Object.fromEntries(
  Object.entries(outputMap).map(([key, id]) => [key, document.getElementById(id)])
);

function sanitise(value, fallback) {
  const trimmed = String(value ?? "").trim();
  return trimmed || fallback;
}

function getState() {
  return ids.reduce((state, id) => {
    state[id] = fields[id].value;
    return state;
  }, {});
}

function applyState(state, { save = true } = {}) {
  const merged = { ...defaults, ...state };
  ids.forEach((id) => {
    fields[id].value = merged[id];
  });
  render(merged);
  if (save) persist(merged);
}

function render(state = getState()) {
  Object.keys(outputs).forEach((key) => {
    outputs[key].textContent = sanitise(state[key], defaults[key]);
  });

  document.documentElement.style.setProperty("--accent-a", state.accentA);
  document.documentElement.style.setProperty("--accent-b", state.accentB);
  document.documentElement.style.setProperty("--surface", state.surface);
  riceCard.style.setProperty("--card-accent-a", state.accentA);
  riceCard.style.setProperty("--card-accent-b", state.accentB);
  riceCard.style.setProperty("--card-surface", state.surface);
  riceCard.dataset.frame = state.frameStyle;
  riceCard.dataset.motion = state.motion;

  updateActivePreset(state);
}

function persist(state = getState()) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    setStatus("Could not save in this browser");
  }
}

function loadSavedState() {
  const shared = readSharedState();
  if (shared) return shared;

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === "object" ? saved : defaults;
  } catch {
    return defaults;
  }
}

function updateActivePreset(state) {
  document.querySelectorAll(".preset").forEach((button) => {
    const preset = presets[button.dataset.preset];
    const active = preset && ["accentA", "accentB", "surface"].every((key) => preset[key].toLowerCase() === state[key].toLowerCase());
    button.classList.toggle("active", active);
  });
}

function setStatus(message) {
  actionStatus.textContent = message;
  actionStatus.classList.remove("toast");
  void actionStatus.offsetWidth;
  actionStatus.classList.add("toast");
}

function randomHex() {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`;
}

function randomPalette() {
  const hue = Math.floor(Math.random() * 360);
  const second = (hue + 45 + Math.floor(Math.random() * 90)) % 360;
  fields.accentA.value = hslToHex(hue, 82, 72);
  fields.accentB.value = hslToHex(second, 82, 70);
  fields.surface.value = hslToHex((hue + 12) % 360, 34, 8);
  render();
  persist();
  setStatus("New palette generated");
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return `#${[r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("")}`;
}

function encodeState(state) {
  const json = JSON.stringify(state);
  return btoa(unescape(encodeURIComponent(json)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeState(value) {
  try {
    const normalised = value.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalised + "=".repeat((4 - normalised.length % 4) % 4);
    return JSON.parse(decodeURIComponent(escape(atob(padded))));
  } catch {
    return null;
  }
}

function readSharedState() {
  const encoded = new URLSearchParams(window.location.search).get("card");
  return encoded ? decodeState(encoded) : null;
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    setStatus(successMessage);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    setStatus(successMessage);
  }
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  return { r: value >> 16, g: (value >> 8) & 255, b: value & 255 };
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawTextEllipsised(ctx, text, x, y, maxWidth) {
  let output = text;
  while (ctx.measureText(output).width > maxWidth && output.length > 1) {
    output = `${output.slice(0, -2)}…`;
  }
  ctx.fillText(output, x, y);
}

function drawCardToCanvas(state) {
  const canvas = exportCanvas;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  const accentA = state.accentA;
  const accentB = state.accentB;
  const surface = state.frameStyle === "terminal" ? "#050805" : state.surface;
  const radius = state.frameStyle === "terminal" ? 4 : state.frameStyle === "minimal" ? 22 : 34;

  ctx.clearRect(0, 0, W, H);

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, surface);
  bg.addColorStop(1, "#05070d");
  ctx.fillStyle = bg;
  roundedRect(ctx, 2, 2, W - 4, H - 4, radius);
  ctx.fill();

  if (state.frameStyle !== "minimal") {
    const glowA = ctx.createRadialGradient(115, 20, 0, 115, 20, 390);
    glowA.addColorStop(0, rgba(accentA, state.frameStyle === "terminal" ? 0.13 : 0.34));
    glowA.addColorStop(1, rgba(accentA, 0));
    ctx.fillStyle = glowA;
    roundedRect(ctx, 2, 2, W - 4, H - 4, radius);
    ctx.fill();

    const glowB = ctx.createRadialGradient(1090, 640, 0, 1090, 640, 360);
    glowB.addColorStop(0, rgba(accentB, state.frameStyle === "terminal" ? 0.1 : 0.27));
    glowB.addColorStop(1, rgba(accentB, 0));
    ctx.fillStyle = glowB;
    roundedRect(ctx, 2, 2, W - 4, H - 4, radius);
    ctx.fill();

    ctx.save();
    roundedRect(ctx, 2, 2, W - 4, H - 4, radius);
    ctx.clip();
    ctx.strokeStyle = "rgba(255,255,255,.045)";
    ctx.lineWidth = 1;
    const grid = state.frameStyle === "terminal" ? 32 : 54;
    for (let x = 0; x <= W; x += grid) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += grid) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();
  }

  ctx.strokeStyle = state.frameStyle === "terminal" ? rgba(accentB, 0.5) : "rgba(255,255,255,.18)";
  ctx.lineWidth = 2;
  roundedRect(ctx, 2, 2, W - 4, H - 4, radius);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.06)";
  ctx.lineWidth = 1;
  roundedRect(ctx, 9, 9, W - 18, H - 18, Math.max(1, radius - 7));
  ctx.stroke();

  const pad = 58;
  ctx.strokeStyle = "rgba(255,255,255,.12)";
  ctx.beginPath(); ctx.moveTo(pad, 98); ctx.lineTo(W - pad, 98); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(pad, H - 88); ctx.lineTo(W - pad, H - 88); ctx.stroke();

  // Micro logo
  const logoX = pad;
  const logoY = 54;
  const squares = [[0,0,accentA],[10,0,accentB],[0,10,accentB],[10,10,accentA]];
  squares.forEach(([x, y, colour]) => { ctx.fillStyle = colour; ctx.fillRect(logoX + x, logoY + y, 6, 6); });

  ctx.font = "600 12px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,.68)";
  ctx.letterSpacing = "2px";
  ctx.fillText("RICEPRINT / SYS-ID", pad + 34, 68);
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,.38)";
  ctx.fillText(document.getElementById("cardCode").textContent, W - pad, 68);
  ctx.textAlign = "left";

  const leftX = pad;
  const mainY = 160;
  const rightX = 760;
  const rightW = W - rightX - pad;

  ctx.font = "700 14px ui-monospace, monospace";
  ctx.fillStyle = accentB;
  drawTextEllipsised(ctx, sanitise(state.tagline, defaults.tagline), leftX, mainY, 620);

  let nameSize = 77;
  const name = sanitise(state.displayName, defaults.displayName).toUpperCase();
  do {
    ctx.font = `620 ${nameSize}px ui-sans-serif, sans-serif`;
    nameSize -= 2;
  } while (ctx.measureText(name).width > 650 && nameSize > 44);
  ctx.fillStyle = "#f6f8ff";
  ctx.fillText(name, leftX, mainY + 94);

  ctx.font = "500 16px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,.47)";
  drawTextEllipsised(ctx, sanitise(state.handle, defaults.handle), leftX, mainY + 135, 560);

  // Status chip
  const chipX = leftX;
  const chipY = 403;
  const chipW = 440;
  const chipH = 68;
  ctx.fillStyle = "rgba(255,255,255,.035)";
  roundedRect(ctx, chipX, chipY, chipW, chipH, 34);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.1)";
  ctx.stroke();
  ctx.strokeStyle = rgba(accentB, 0.45);
  ctx.beginPath(); ctx.arc(chipX + 35, chipY + 34, 17, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = accentB;
  ctx.beginPath(); ctx.arc(chipX + 35, chipY + 34, 4, 0, Math.PI * 2); ctx.fill();
  ctx.font = "500 8px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,.35)";
  ctx.fillText("CURRENT STATUS", chipX + 67, chipY + 26);
  ctx.font = "700 11px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,.78)";
  drawTextEllipsised(ctx, sanitise(state.status, defaults.status).toUpperCase(), chipX + 67, chipY + 45, chipW - 88);

  // System panel
  const panelY = 145;
  const panelH = 345;
  ctx.fillStyle = "rgba(4,6,11,.24)";
  roundedRect(ctx, rightX, panelY, rightW, panelH, state.frameStyle === "terminal" ? 2 : 20);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.11)";
  ctx.stroke();
  ctx.font = "500 8px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,.34)";
  ctx.fillText("SYSTEM MANIFEST", rightX + 22, panelY + 28);
  ctx.textAlign = "right";
  ctx.fillText("05 NODES", rightX + rightW - 22, panelY + 28);
  ctx.textAlign = "left";

  const rows = [
    ["OS", sanitise(state.os, defaults.os), "01"],
    ["WM", sanitise(state.wm, defaults.wm), "02"],
    ["SH", sanitise(state.shell, defaults.shell), "03"],
    ["TR", sanitise(state.terminal, defaults.terminal), "04"],
    ["PR", sanitise(state.project, defaults.project), "05"]
  ];

  rows.forEach(([label, value, num], index) => {
    const y = panelY + 58 + index * 54;
    ctx.strokeStyle = "rgba(255,255,255,.075)";
    ctx.beginPath(); ctx.moveTo(rightX + 20, y); ctx.lineTo(rightX + rightW - 20, y); ctx.stroke();
    ctx.font = "700 11px ui-monospace, monospace";
    ctx.fillStyle = accentA;
    ctx.fillText(label, rightX + 22, y + 33);
    ctx.font = "500 15px ui-monospace, monospace";
    ctx.fillStyle = "rgba(255,255,255,.82)";
    drawTextEllipsised(ctx, value, rightX + 70, y + 33, rightW - 135);
    ctx.textAlign = "right";
    ctx.font = "500 8px ui-monospace, monospace";
    ctx.fillStyle = "rgba(255,255,255,.22)";
    ctx.fillText(num, rightX + rightW - 22, y + 33);
    ctx.textAlign = "left";
  });

  // Palette stripe and footer
  const stripeY = H - 55;
  const widths = [120, 72, 48, 31, 20];
  const colours = [accentA, accentB, mixHex(accentA, accentB), "rgba(255,255,255,.42)", "rgba(255,255,255,.16)"];
  let stripeX = pad;
  widths.forEach((width, index) => {
    ctx.fillStyle = colours[index];
    roundedRect(ctx, stripeX, stripeY, width, 8, 4);
    ctx.fill();
    stripeX += width + 6;
  });

  ctx.textAlign = "right";
  ctx.font = "500 8px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,.3)";
  ctx.fillText(`PERSONAL SYSTEM SIGNATURE   ${document.getElementById("cardDate").textContent}`, W - pad, stripeY + 7);
  ctx.textAlign = "left";

  // Fine grain
  const image = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < image.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 5;
    image.data[i] = Math.max(0, Math.min(255, image.data[i] + noise));
    image.data[i + 1] = Math.max(0, Math.min(255, image.data[i + 1] + noise));
    image.data[i + 2] = Math.max(0, Math.min(255, image.data[i + 2] + noise));
  }
  ctx.putImageData(image, 0, 0);
}

function mixHex(a, b) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const mixed = ["r", "g", "b"].map((key) => Math.round((A[key] + B[key]) / 2).toString(16).padStart(2, "0")).join("");
  return `#${mixed}`;
}

function exportPng() {
  const state = getState();
  drawCardToCanvas(state);
  const link = document.createElement("a");
  const slug = sanitise(state.displayName, "riceprint").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  link.download = `${slug || "riceprint"}-system-card.png`;
  link.href = exportCanvas.toDataURL("image/png");
  link.click();
  setStatus("PNG exported at 1200 × 675");
}

ids.forEach((id) => {
  fields[id].addEventListener("input", () => {
    render();
    persist();
  });
  fields[id].addEventListener("change", () => {
    render();
    persist();
  });
});

document.querySelectorAll(".preset").forEach((button) => {
  button.addEventListener("click", () => {
    const preset = presets[button.dataset.preset];
    Object.entries(preset).forEach(([key, value]) => { fields[key].value = value; });
    render();
    persist();
    setStatus(`${button.textContent} palette applied`);
  });
});

document.getElementById("resetButton").addEventListener("click", () => {
  applyState(defaults);
  history.replaceState(null, "", window.location.pathname);
  setStatus("Card reset to defaults");
});

document.getElementById("randomiseButton").addEventListener("click", randomPalette);
document.getElementById("exportButton").addEventListener("click", exportPng);

document.getElementById("copyMarkdownButton").addEventListener("click", () => {
  const state = getState();
  const alt = `${sanitise(state.displayName, "My")} Linux setup card`;
  copyText(`![${alt}](./assets/riceprint-card.png)`, "Markdown copied");
});

document.getElementById("shareButton").addEventListener("click", () => {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("card", encodeState(getState()));
  copyText(url.toString(), "Share link copied");
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "Enter") {
    event.preventDefault();
    exportPng();
  }
});

const now = new Date();
document.getElementById("cardDate").textContent = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit", month: "2-digit", year: "numeric"
}).format(now).replaceAll("/", ".");

const randomCode = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0");
document.getElementById("sessionCode").textContent = `PRINT ${randomCode.slice(0, 2)}-${randomCode.slice(2)}`;
document.getElementById("cardCode").textContent = `RP-${randomCode.slice(0, 2)}${randomCode.slice(2)}-${String(now.getFullYear()).slice(-2)}`;

applyState(loadSavedState(), { save: false });
