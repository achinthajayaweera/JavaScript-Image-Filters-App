// ── DOM REFERENCES ───────────────────────────────────────────────
const saturate   = document.getElementById("saturate");
const contrast   = document.getElementById("contrast");
const brightness = document.getElementById("brightness");
const sepia      = document.getElementById("sepia");
const grayscale  = document.getElementById("grayscale");
const blurr      = document.getElementById("blur");
const hueRotate  = document.getElementById("hue-rotate");
const invert     = document.getElementById("invert");

const filters     = document.querySelectorAll(".filter");
const image       = document.getElementById("img");
const imgBox      = document.getElementById("img-box");
const dropZone    = document.getElementById("drop-zone");

const downloadBtn   = document.getElementById("download");
const uploadBtn     = document.getElementById("upload");
const resetBtn      = document.getElementById("reset");
const statusBadge   = document.getElementById("status-badge");

const flipHBtn      = document.getElementById("flip-h");
const flipVBtn      = document.getElementById("flip-v");
const rotateLeftBtn = document.getElementById("rotate-left");
const presetBtns    = document.querySelectorAll(".preset-btn");

const canvas = document.getElementById("canvas");
const ctx    = canvas.getContext("2d");

// ── STATE ─────────────────────────────────────────────────────────
let flippedH = false;
let flippedV = false;
let rotation = 0;
let imageLoaded = false;

// ── VALUE DISPLAY MAPPING ─────────────────────────────────────────
const valDisplays = {
    "brightness": { el: document.getElementById("brightness-val"), suffix: "" },
    "contrast":   { el: document.getElementById("contrast-val"),   suffix: "" },
    "saturate":   { el: document.getElementById("saturate-val"),   suffix: "" },
    "blur":       { el: document.getElementById("blur-val"),       suffix: "" },
    "sepia":      { el: document.getElementById("sepia-val"),      suffix: "" },
    "grayscale":  { el: document.getElementById("grayscale-val"),  suffix: "" },
    "hue-rotate": { el: document.getElementById("hue-rotate-val"), suffix: "°" },
    "invert":     { el: document.getElementById("invert-val"),     suffix: "" },
};

// ── PRESETS ───────────────────────────────────────────────────────
const presets = {
    vivid:   { brightness: 110, contrast: 120, saturate: 160, blur: 0, sepia: 0,   grayscale: 0,   "hue-rotate": 0,   invert: 0 },
    noir:    { brightness: 90,  contrast: 140, saturate: 0,   blur: 0, sepia: 0,   grayscale: 100, "hue-rotate": 0,   invert: 0 },
    vintage: { brightness: 95,  contrast: 90,  saturate: 80,  blur: 0, sepia: 60,  grayscale: 0,   "hue-rotate": 0,   invert: 0 },
    fade:    { brightness: 115, contrast: 80,  saturate: 70,  blur: 0, sepia: 20,  grayscale: 20,  "hue-rotate": 0,   invert: 0 },
    cold:    { brightness: 100, contrast: 105, saturate: 90,  blur: 0, sepia: 0,   grayscale: 0,   "hue-rotate": 180, invert: 0 },
    warm:    { brightness: 105, contrast: 100, saturate: 120, blur: 0, sepia: 30,  grayscale: 0,   "hue-rotate": 20,  invert: 0 },
};

// ── APPLY FILTERS + TRANSFORMS ────────────────────────────────────
const applyFiltersAndDraw = () => {
    if (!imageLoaded) return;

    const w = image.naturalWidth;
    const h = image.naturalHeight;
    const isRotated = rotation % 2 !== 0;

    canvas.width  = isRotated ? h : w;
    canvas.height = isRotated ? w : h;

    ctx.save();
    ctx.filter = `
        brightness(${brightness.value}%)
        contrast(${contrast.value}%)
        saturate(${saturate.value}%)
        blur(${blurr.value}px)
        sepia(${sepia.value}%)
        grayscale(${grayscale.value}%)
        hue-rotate(${hueRotate.value}deg)
        invert(${invert.value}%)
    `;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * 90 * Math.PI) / 180);
    ctx.scale(flippedH ? -1 : 1, flippedV ? -1 : 1);
    ctx.drawImage(image, -w / 2, -h / 2, w, h);
    ctx.restore();
};

// ── UPDATE VALUE DISPLAY ──────────────────────────────────────────
const updateDisplay = (id, value) => {
    const d = valDisplays[id];
    if (d) d.el.textContent = value + d.suffix;
};

const refreshAllDisplays = () => {
    Object.keys(valDisplays).forEach(id => {
        const el = document.getElementById(id);
        if (el) updateDisplay(id, el.value);
    });
};

// ── RESET ─────────────────────────────────────────────────────────
const resetValues = () => {
    brightness.value = "100";
    contrast.value   = "100";
    saturate.value   = "100";
    blurr.value      = "0";
    sepia.value      = "0";
    grayscale.value  = "0";
    hueRotate.value  = "0";
    invert.value     = "0";

    flippedH = false;
    flippedV = false;
    rotation = 0;

    flipHBtn.classList.remove("active");
    flipVBtn.classList.remove("active");
    presetBtns.forEach(b => b.classList.remove("active"));

    refreshAllDisplays();
    applyFiltersAndDraw();
};

// ── LOAD IMAGE ────────────────────────────────────────────────────
const loadImage = (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    imageLoaded = false;

    const reader = new FileReader();
    reader.onload = (e) => {
        image.onload = () => {
            imageLoaded = true;
            dropZone.style.display = "none";
            imgBox.style.display   = "block";
            imgBox.classList.add("visible");
            downloadBtn.style.opacity       = "1";
            downloadBtn.style.pointerEvents = "all";
            statusBadge.textContent = `${image.naturalWidth} × ${image.naturalHeight}px`;
            statusBadge.classList.add("active");
            resetValues();
        };
        image.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

// ── FILTER SLIDERS ────────────────────────────────────────────────
filters.forEach((filter) => {
    filter.addEventListener("input", () => {
        updateDisplay(filter.id, filter.value);
        presetBtns.forEach(b => b.classList.remove("active"));
        applyFiltersAndDraw();
    });
});

// ── PRESETS ───────────────────────────────────────────────────────
presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const preset = presets[btn.dataset.preset];
        if (!preset) return;

        Object.keys(preset).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.value = preset[id];
                updateDisplay(id, preset[id]);
            }
        });

        presetBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        applyFiltersAndDraw();
    });
});

// ── TRANSFORMS ───────────────────────────────────────────────────
flipHBtn.addEventListener("click", () => {
    flippedH = !flippedH;
    flipHBtn.classList.toggle("active", flippedH);
    applyFiltersAndDraw();
});

flipVBtn.addEventListener("click", () => {
    flippedV = !flippedV;
    flipVBtn.classList.toggle("active", flippedV);
    applyFiltersAndDraw();
});

rotateLeftBtn.addEventListener("click", () => {
    rotation = (rotation + 1) % 4;
    applyFiltersAndDraw();
});

// ── UPLOAD ────────────────────────────────────────────────────────
uploadBtn.addEventListener("change", () => {
    if (uploadBtn.files[0]) loadImage(uploadBtn.files[0]);
});

// ── DRAG & DROP ───────────────────────────────────────────────────
dropZone.addEventListener("click", () => uploadBtn.click());

["dragenter", "dragover"].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });
});

["dragleave", "drop"].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
    });
});

dropZone.addEventListener("drop", (e) => {
    loadImage(e.dataTransfer.files[0]);
});

// ── DOWNLOAD ─────────────────────────────────────────────────────
downloadBtn.addEventListener("click", () => {
    downloadBtn.href = canvas.toDataURL("image/png");
});

// ── RESET BUTTON ──────────────────────────────────────────────────
resetBtn.addEventListener("click", resetValues);

// ── INITIAL STATE ─────────────────────────────────────────────────
window.onload = () => {
    downloadBtn.style.opacity       = "0.4";
    downloadBtn.style.pointerEvents = "none";
    refreshAllDisplays();
};
