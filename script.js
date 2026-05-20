const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const siteHeader = document.querySelector("[data-header]");
const heroSection = document.querySelector(".hero");
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const navToggleLabel = navToggle ? navToggle.querySelector(".sr-only") : null;
const heroAtomFields = Array.from(document.querySelectorAll("[data-hero-atom-field]"));
const heroLogo3d = document.querySelector("[data-hero-logo-3d]");
const heroAtomImages = [
  "assets/Atoms/Image_01.png",
  "assets/Atoms/Image_02.png",
  "assets/Atoms/Image_03.png",
  "assets/Atoms/Image_04.png",
  "assets/Atoms/Image_05.png",
  "assets/Atoms/Image_06.png",
  "assets/Atoms/Image_07.png",
  "assets/Atoms/Image_08.png",
  "assets/Atoms/Image_09.png",
  "assets/Atoms/Image_10.png",
  "assets/Atoms/Image_11.png",
  "assets/Atoms/Image_12.png",
  "assets/Atoms/Image_13.png",
  "assets/Atoms/Image_14.png",
  "assets/Atoms/Image_15.png",
  "assets/Atoms/Image_16.png",
  "assets/Atoms/Image_17.png",
  "assets/Atoms/Image_18.png",
  "assets/Atoms/Image_19.png",
  "assets/Atoms/Image_20.png",
  "assets/Atoms/Image_21.png",
  "assets/Atoms/Image_22.png",
  "assets/Atoms/Image_23.png",
  "assets/Atoms/Image_24.png",
  "assets/Atoms/Image_25.png",
  "assets/Atoms/Image_26.png",
  "assets/Atoms/Image_27.png",
  "assets/Atoms/Image_28.png",
  "assets/Atoms/Image_29.png",
  "assets/Atoms/Image_30.png",
  "assets/Atoms/Image_31.png",
  "assets/Atoms/Image_32.png",
  "assets/Atoms/Image_33.png",
  "assets/Atoms/Image_34.png",
  "assets/Atoms/Image_35.png",
  "assets/Atoms/Image_36.png",
  "assets/Atoms/Image_37.png",
  "assets/Atoms/Image_38.png",
  "assets/Atoms/Image_39.png",
  "assets/Atoms/Image_40.png",
  "assets/Atoms/Image_41.png",
  "assets/Atoms/Image_42.png",
  "assets/Atoms/Image_43.png",
  "assets/Atoms/Image_44.png",
  "assets/Atoms/Image_45.png",
  "assets/Atoms/Image_46.png",
  "assets/Atoms/Image_47.png",
  "assets/Atoms/Image_49.png",
  "assets/Atoms/Image_50.png",
  "assets/Atoms/Image_51.png",
  "assets/Atoms/Image_52.png",
  "assets/Atoms/Image_53.png",
  "assets/Atoms/Image_54.png",
  "assets/Atoms/Image_55.png",
  "assets/Atoms/Image_56.png",
  "assets/Atoms/Image_57.png",
  "assets/Atoms/Image_58.png",
  "assets/Atoms/Image_59.png",
  "assets/Atoms/Image_60.png",
  "assets/Atoms/Image_61.png",
  "assets/Atoms/Image_62.png",
  "assets/Atoms/Image_63.png",
  "assets/Atoms/Image_64.png",
  "assets/Atoms/Image_65.png",
  "assets/Atoms/Image_66.png",
  "assets/Atoms/Image_67.png",
  "assets/Atoms/Image_68.png",
  "assets/Atoms/Image_69.png",
  "assets/Atoms/Image_70.png",
  "assets/Atoms/Image_71.png",
  "assets/Atoms/Image_72.png",
  "assets/Atoms/Image_73.png",
  "assets/Atoms/Image_74.png",
  "assets/Atoms/Image_75.png",
  "assets/Atoms/Image_76.png",
  "assets/Atoms/Image_77.png",
  "assets/Atoms/Image_78.png",
  "assets/Atoms/Image_79.png",
  "assets/Atoms/Image_80.png",
  "assets/Atoms/Image_81.png",
  "assets/Atoms/Image_82.png",
  "assets/Atoms/Image_83.png",
  "assets/Atoms/Image_84.png",
  "assets/Atoms/Image_85.png",
];

function flash(element, className, duration) {
  if (!element) {
    return;
  }

  element.classList.add(className);
  window.setTimeout(() => element.classList.remove(className), duration || 260);
}

function closeNav() {
  if (!nav || !navToggle) {
    return;
  }

  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  if (navToggleLabel) {
    navToggleLabel.textContent = "Apri menu";
  }
  document.body.classList.remove("nav-open");
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    if (navToggleLabel) {
      navToggleLabel.textContent = isOpen ? "Chiudi menu" : "Apri menu";
    }
    document.body.classList.toggle("nav-open", isOpen);
  });

  nav.addEventListener("click", (event) => {
    const target = event.target;

    if (target instanceof HTMLAnchorElement) {
      closeNav();
      scheduleHashTargetSync(target.getAttribute("href"));
    }
  });
}

const navTargets = navLinks
  .map((link) => {
    const hash = link.getAttribute("href");
    return { hash, link, section: hash ? document.querySelector(hash) : null };
  })
  .filter((item) => item.hash && item.section);
let pendingNavHash = "";
let pendingNavUntil = 0;

function setActiveNavLink(activeHash) {
  navTargets.forEach(({ hash, link }) => {
    const isActive = hash === activeHash;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function getHeaderProbeY() {
  const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
  return headerHeight + 16;
}

function isHeroUnderHeader() {
  if (!siteHeader || !heroSection) {
    return false;
  }

  const heroRect = heroSection.getBoundingClientRect();
  return heroRect.top <= getHeaderProbeY() && heroRect.bottom > getHeaderProbeY();
}

function holdNavHash(hash) {
  const target = navTargets.find((item) => item.hash === hash);

  if (!target) {
    pendingNavHash = "";
    pendingNavUntil = 0;
    setActiveNavLink("");
    return;
  }

  pendingNavHash = hash;
  pendingNavUntil = Date.now() + 2000;
  setActiveNavLink(hash);
}

function scrollToPageY(targetY) {
  const y = Math.max(0, targetY);
  const scrollRoot = document.scrollingElement || document.documentElement;

  if (scrollRoot) {
    scrollRoot.scrollTop = y;
  }

  document.body.scrollTop = y;

  if (typeof window.scrollTo === "function") {
    window.scrollTo({ top: y, behavior: "auto" });
  }
}

function alignHashTarget(hash) {
  if (hash === "#top") {
    scrollToPageY(0);
    return;
  }

  const target = navTargets.find((item) => item.hash === hash);

  if (!target) {
    return;
  }

  const headerOffset = siteHeader ? siteHeader.offsetHeight + 14 : 0;
  const targetTop = target.section.getBoundingClientRect().top + window.scrollY - headerOffset;
  scrollToPageY(targetTop);
}

function updateActiveNavLink() {
  if (navTargets.length === 0) {
    return;
  }

  const headerProbeY = getHeaderProbeY();
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const downloadTarget = navTargets.find(({ hash }) => hash === "#download");

  if (pendingNavHash && Date.now() < pendingNavUntil) {
    setActiveNavLink(pendingNavHash);
    return;
  }

  pendingNavHash = "";
  pendingNavUntil = 0;

  const hashTarget = navTargets.find(({ hash }) => hash === window.location.hash);
  if (hashTarget) {
    const hashRect = hashTarget.section.getBoundingClientRect();
    if (hashRect.top < window.innerHeight && hashRect.bottom > headerProbeY) {
      setActiveNavLink(hashTarget.hash);
      return;
    }
  }

  if (isHeroUnderHeader()) {
    setActiveNavLink("");
    return;
  }

  if (downloadTarget) {
    const downloadRect = downloadTarget.section.getBoundingClientRect();
    if (downloadRect.top <= window.innerHeight * 0.72 && downloadRect.bottom >= headerProbeY) {
      setActiveNavLink("#download");
      return;
    }
  }

  if (window.scrollY >= maxScroll - 2) {
    setActiveNavLink("#download");
    return;
  }

  const targetAtHeader = navTargets.find(({ section }) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= headerProbeY && rect.bottom > headerProbeY;
  });

  if (targetAtHeader) {
    setActiveNavLink(targetAtHeader.hash);
    return;
  }

  const probeY = window.scrollY + headerProbeY;
  const activeTarget = navTargets
    .filter(({ section }) => section.offsetTop <= probeY)
    .sort((a, b) => a.section.offsetTop - b.section.offsetTop)
    .pop();

  setActiveNavLink(activeTarget ? activeTarget.hash : "");
}

function scheduleHashTargetSync(hash) {
  if (!hash || !hash.startsWith("#")) {
    return;
  }

  holdNavHash(hash);

  [0, 80, 280, 700, 1400].forEach((delay) => {
    window.setTimeout(() => {
      alignHashTarget(hash);
      updateHeaderBrandVisibility();
      updateActiveNavLink();
    }, delay);
  });
}

function updateHeaderBrandVisibility() {
  if (!siteHeader || !heroSection) {
    return;
  }

  siteHeader.classList.toggle("is-past-hero", !isHeroUnderHeader());
}

updateHeaderBrandVisibility();
updateActiveNavLink();
window.addEventListener("scroll", () => {
  updateHeaderBrandVisibility();
  updateActiveNavLink();
}, { passive: true });
window.addEventListener("resize", () => {
  updateHeaderBrandVisibility();
  updateActiveNavLink();
});
window.addEventListener("hashchange", () => scheduleHashTargetSync(window.location.hash));
window.addEventListener("load", () => scheduleHashTargetSync(window.location.hash));

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function shuffleItems(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function initHeroLogo3d() {
  if (!heroLogo3d || !heroSection || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const orbitStrength = 0.5;
  let targetRotateX = 0;
  let targetRotateY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;
  let animationFrame = 0;

  function updateLogoOrbit() {
    currentRotateX += (targetRotateX - currentRotateX) * 0.16;
    currentRotateY += (targetRotateY - currentRotateY) * 0.16;
    heroLogo3d.style.setProperty("--logo-rotate-x", `${currentRotateX.toFixed(2)}deg`);
    heroLogo3d.style.setProperty("--logo-rotate-y", `${currentRotateY.toFixed(2)}deg`);

    const isSettled = Math.abs(targetRotateX - currentRotateX) < 0.02 && Math.abs(targetRotateY - currentRotateY) < 0.02;

    if (isSettled) {
      animationFrame = 0;
      return;
    }

    animationFrame = window.requestAnimationFrame(updateLogoOrbit);
  }

  function requestLogoOrbitFrame() {
    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(updateLogoOrbit);
    }
  }

  heroSection.addEventListener("mousemove", (event) => {
    const rect = heroLogo3d.getBoundingClientRect();
    const logoCenterX = rect.left + rect.width / 2;
    const logoCenterY = rect.top + rect.height / 2;
    const offsetX = Math.max(-1, Math.min(1, (event.clientX - logoCenterX) / (rect.width / 2 || 1)));
    const offsetY = Math.max(-1, Math.min(1, (event.clientY - logoCenterY) / (rect.height / 2 || 1)));

    targetRotateX = offsetY * -10 * orbitStrength;
    targetRotateY = offsetX * 14 * orbitStrength;
    requestLogoOrbitFrame();
  });

  heroSection.addEventListener("mouseleave", () => {
    targetRotateX = 0;
    targetRotateY = 0;
    requestLogoOrbitFrame();
  });
}

function initHeroAtoms(heroAtomField) {
  if (!heroAtomField) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bodies = [];
  let heroAtomImageQueue = [];
  let lastHeroAtomImage = "";
  const initialAtoms = window.innerWidth < 700 ? 8 : 15;
  const atomSpeed = 0.32;
  const maxAtomSpeed = 0.5;

  function refillHeroAtomImages() {
    heroAtomImageQueue = shuffleItems(heroAtomImages);

    if (heroAtomImageQueue.length > 1 && heroAtomImageQueue[0] === lastHeroAtomImage) {
      const swapIndex = heroAtomImageQueue.findIndex((image) => image !== lastHeroAtomImage);
      [heroAtomImageQueue[0], heroAtomImageQueue[swapIndex]] = [heroAtomImageQueue[swapIndex], heroAtomImageQueue[0]];
    }
  }

  function getNextHeroAtomImage() {
    if (heroAtomImageQueue.length === 0) {
      refillHeroAtomImages();
    }

    const nextImage = heroAtomImageQueue.shift() || heroAtomImages[0];
    lastHeroAtomImage = nextImage;
    return nextImage;
  }

  function getBounds() {
    return {
      width: heroAtomField.clientWidth,
      height: heroAtomField.clientHeight,
    };
  }

  function overlapsAny(x, y, radius, exceptBody) {
    return bodies.some((body) => {
      if (body === exceptBody) {
        return false;
      }

      const dx = body.x - x;
      const dy = body.y - y;
      return Math.hypot(dx, dy) < body.radius + radius + 14;
    });
  }

  function findFreePosition(radius, preferredX, preferredY) {
    const bounds = getBounds();
    const minX = radius;
    const maxX = Math.max(radius, bounds.width - radius);
    const minY = radius;
    const maxY = Math.max(radius, bounds.height - radius);

    if (typeof preferredX === "number" && typeof preferredY === "number") {
      const x = Math.min(Math.max(preferredX, minX), maxX);
      const y = Math.min(Math.max(preferredY, minY), maxY);

      if (!overlapsAny(x, y, radius)) {
        return { x, y };
      }
    }

    for (let attempt = 0; attempt < 120; attempt += 1) {
      const x = randomBetween(minX, maxX);
      const y = randomBetween(minY, maxY);

      if (!overlapsAny(x, y, radius)) {
        return { x, y };
      }
    }

    return {
      x: randomBetween(minX, maxX),
      y: randomBetween(minY, maxY),
    };
  }

  function draw() {
    bodies.forEach((body) => {
      body.element.style.setProperty("--atom-x", `${body.x - body.radius}px`);
      body.element.style.setProperty("--atom-y", `${body.y - body.radius}px`);
    });
  }

  function addHeroAtom(x, y) {
    const atom = document.createElement("span");
    const image = document.createElement("img");
    const size = randomBetween(78, 160);
    const radius = size / 2;
    const position = findFreePosition(radius, x, y);
    const angle = randomBetween(0, Math.PI * 2);
    const body = {
      element: atom,
      radius,
      x: position.x,
      y: position.y,
      vx: Math.cos(angle) * atomSpeed,
      vy: Math.sin(angle) * atomSpeed,
    };

    atom.className = "hero-glass-atom";
    atom.style.setProperty("--atom-size", `${size}px`);
    atom.style.setProperty("--atom-rotate", `${randomBetween(-14, 14).toFixed(1)}deg`);
    image.src = getNextHeroAtomImage();
    image.decoding = "async";
    image.alt = "";
    atom.append(image);
    heroAtomField.append(atom);
    bodies.push(body);
    draw();
  }

  function limitHeroSpeed(body) {
    const speed = Math.hypot(body.vx, body.vy);

    if (speed > maxAtomSpeed) {
      const ratio = maxAtomSpeed / speed;
      body.vx *= ratio;
      body.vy *= ratio;
    }
  }

  function resolveHeroCollisions() {
    for (let i = 0; i < bodies.length; i += 1) {
      for (let j = i + 1; j < bodies.length; j += 1) {
        const a = bodies[i];
        const b = bodies[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const minDistance = a.radius + b.radius + 10;
        const distance = Math.hypot(dx, dy) || 1;

        if (distance >= minDistance) {
          continue;
        }

        const nx = dx / distance;
        const ny = dy / distance;
        const overlap = (minDistance - distance) / 2;
        a.x -= nx * overlap;
        a.y -= ny * overlap;
        b.x += nx * overlap;
        b.y += ny * overlap;

        const relativeVelocityX = a.vx - b.vx;
        const relativeVelocityY = a.vy - b.vy;
        const impact = relativeVelocityX * nx + relativeVelocityY * ny;

        if (impact > 0) {
          continue;
        }

        const impulse = -impact * 0.94;
        a.vx += impulse * nx;
        a.vy += impulse * ny;
        b.vx -= impulse * nx;
        b.vy -= impulse * ny;
      }
    }
  }

  function clampHeroBodies() {
    const bounds = getBounds();

    bodies.forEach((body) => {
      body.x = Math.min(Math.max(body.x, body.radius), Math.max(body.radius, bounds.width - body.radius));
      body.y = Math.min(Math.max(body.y, body.radius), Math.max(body.radius, bounds.height - body.radius));
    });
  }

  for (let index = 0; index < initialAtoms; index += 1) {
    addHeroAtom();
  }

  if (!prefersReducedMotion) {
    let lastFrame = performance.now();

    function tick(now) {
      const bounds = getBounds();
      const delta = Math.min(2, (now - lastFrame) / 16.67 || 1);
      lastFrame = now;

      bodies.forEach((body) => {
        body.x += body.vx * delta;
        body.y += body.vy * delta;

        if (body.x <= body.radius || body.x >= bounds.width - body.radius) {
          body.x = Math.min(Math.max(body.x, body.radius), bounds.width - body.radius);
          body.vx *= -0.98;
        }

        if (body.y <= body.radius || body.y >= bounds.height - body.radius) {
          body.y = Math.min(Math.max(body.y, body.radius), bounds.height - body.radius);
          body.vy *= -0.98;
        }

        body.vx *= 0.999;
        body.vy *= 0.999;
      });

      resolveHeroCollisions();
      bodies.forEach(limitHeroSpeed);
      clampHeroBodies();
      draw();
      window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
  }

  heroAtomField.addEventListener("click", (event) => {
    const rect = heroAtomField.getBoundingClientRect();
    addHeroAtom(event.clientX - rect.left, event.clientY - rect.top);
  });

  window.addEventListener("resize", () => {
    clampHeroBodies();
    resolveHeroCollisions();
    draw();
  });
}

const memoryContent = {
  images: {
    title: "Immagini e Video",
    copy: "Carica foto e video ad alta risoluzione dei tuoi ricordi più preziosi, da una stampa ritrovata a un breve filmato di famiglia.",
    files: ["foto.jpg", "scansione.png", "clip.mov"],
  },
  audio: {
    title: "Audio e Musica",
    copy: "Salva dalle note vocali di chi ami alle canzoni che hanno il potere di riportarti indietro nel tempo.",
    files: ["nota-vocale.m4a", "playlist.url", "canzone.mp3"],
  },
  files: {
    title: "File",
    copy: "Carica documenti PDF, scansioni di vecchi ricordi o file digitali di ogni genere dentro lo stesso Atom.",
    files: ["lettera.pdf", "ricevuta.pdf", "archivio.zip"],
  },
  text: {
    title: "Testi e Messaggi",
    copy: "Scrivi una dedica, incolla una chat indimenticabile o annota una riflessione che dia contesto al ricordo.",
    files: ["dedica.txt", "chat.txt", "appunti.md"],
  },
  draw: {
    title: "Disegna a mano",
    copy: "Usa il tratto libero per schizzare un'idea, scarabocchiare un'emozione o personalizzare la tua box con un tocco unico.",
    files: ["schizzo.svg", "firma.png", "mappa.png"],
  },
};

const memoryButtons = Array.from(document.querySelectorAll("[data-memory]"));
const memoryPanel = document.querySelector("[data-memory-panel]");
const memoryTitle = document.querySelector("[data-memory-title]");
const memoryCopy = document.querySelector("[data-memory-copy]");
const memoryStack = document.querySelector("[data-memory-stack]");

function renderMemory(key) {
  const content = memoryContent[key];

  if (!content || !memoryTitle || !memoryCopy) {
    return;
  }

  memoryButtons.forEach((item) => {
    const isActive = item.getAttribute("data-memory") === key;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  memoryTitle.textContent = content.title;
  memoryCopy.textContent = content.copy;

  if (memoryStack) {
    memoryStack.replaceChildren(...content.files.map((fileName) => {
      const item = document.createElement("span");
      item.textContent = fileName;
      return item;
    }));
  }

  flash(memoryPanel, "is-updating", 220);
}

memoryButtons.forEach((button) => {
  const showMemory = () => renderMemory(button.getAttribute("data-memory"));

  button.addEventListener("pointerenter", showMemory);
  button.addEventListener("focus", showMemory);
  button.addEventListener("click", showMemory);
});

const atomData = {
  viaggio: {
    hero: "Viaggio / Milano",
    status: "Atom Viaggio selezionato: foto, ticket e coordinate sono pronti nell'Atom Bento Box.",
    canvas: "Atom Bento Box Viaggio: 5 frammenti selezionati",
    memory: "images",
    tiles: ["Foto", "Ticket", "Voce", "Milano", "Mappa"],
  },
  famiglia: {
    hero: "Famiglia / Nonni",
    status: "Atom Famiglia selezionato: ricetta, foto e voce sono pronti nell'Atom Bento Box.",
    canvas: "Atom Bento Box Famiglia: 5 frammenti selezionati",
    memory: "text",
    tiles: ["Foto", "Ricetta", "Voce", "Nonni", "Lettera"],
  },
  lettere: {
    hero: "Lettere / Archivio",
    status: "Atom Lettere selezionato: scansioni, testi e note emotive sono pronti nell'Atom Bento Box.",
    canvas: "Atom Bento Box Lettere: 4 frammenti selezionati",
    memory: "files",
    tiles: ["Scansione", "Testo", "Firma", "Data", "Busta"],
  },
  audio: {
    hero: "Audio / Voci",
    status: "Atom Audio selezionato: voce, musica e contesto sono pronti nell'Atom Bento Box.",
    canvas: "Atom Bento Box Audio: 3 frammenti selezionati",
    memory: "audio",
    tiles: ["Voce", "Playlist", "Nota", "Persona", "Luogo"],
  },
  ticket: {
    hero: "Ticket / Eventi",
    status: "Atom Ticket selezionato: biglietto, foto e data sono pronti nell'Atom Bento Box.",
    canvas: "Atom Bento Box Ticket: 5 frammenti selezionati",
    memory: "draw",
    tiles: ["Ticket", "Foto", "Sketch", "Data", "Evento"],
  },
  sguardi: {
    hero: "Sguardi / Dettagli",
    status: "Atom Sguardi selezionato: dettagli visivi e immagini sono pronti nell'Atom Bento Box.",
    canvas: "Atom Bento Box Sguardi: 4 frammenti selezionati",
    memory: "images",
    tiles: ["Dettaglio", "Foto", "Colore", "Nota", "Ricordo"],
  },
  riflessi: {
    hero: "Riflessi / Momenti",
    status: "Atom Riflessi selezionato: foto, sensazioni e contesto sono pronti nell'Atom Bento Box.",
    canvas: "Atom Bento Box Riflessi: 4 frammenti selezionati",
    memory: "images",
    tiles: ["Foto", "Luce", "Luogo", "Nota", "Data"],
  },
  voci: {
    hero: "Voci / Ascolto",
    status: "Atom Voci selezionato: ascolti, note vocali e persone sono pronti nell'Atom Bento Box.",
    canvas: "Atom Bento Box Voci: 3 frammenti selezionati",
    memory: "audio",
    tiles: ["Voce", "Ascolto", "Persona", "Nota", "Momento"],
  },
};

const atomButtons = Array.from(document.querySelectorAll("[data-atom]"));
const atomOrder = atomButtons.map((button) => button.getAttribute("data-atom"));
const atomOrbit = document.querySelector("[data-atom-orbit]");
const activeAtomLabel = document.querySelector("[data-active-atom]");
const atomStatus = document.querySelector("[data-atom-status]");
const canvasStatus = document.querySelector("[data-canvas-status]");
const bentoSurface = document.querySelector("[data-bento-surface]");
const bentoTiles = bentoSurface ? Array.from(bentoSurface.querySelectorAll(".tile")) : [];
const bentoLayoutClasses = [
  "layout-base",
  "layout-wide",
  "layout-stack",
  "layout-mosaic",
  "layout-focus",
  "layout-columns",
  "layout-ribbon",
  "layout-archive",
  "layout-split",
];
const bentoLayoutNames = ["classica", "panoramica", "verticale", "mosaico", "focus", "colonne", "ribbon", "archivio", "split"];
let activeAtomKey = "famiglia";
let bentoLayoutIndex = 0;

function updateShareSummary(prefix) {
  const shareSummary = document.querySelector("[data-share-summary]");

  if (!shareSummary) {
    return;
  }

  const selected = Array.from(document.querySelectorAll("[data-contact][aria-pressed='true']"))
    .map((button) => button.getAttribute("data-contact"));
  const names = selected.length > 0 ? selected.join(", ") : "nessun contatto";
  const action = prefix || `${selected.length} persone selezionate per questo Atom`;
  shareSummary.textContent = `${action}: ${names}.`;
}

function applyBentoLayout(index) {
  if (!bentoSurface) {
    return;
  }

  bentoSurface.classList.remove(...bentoLayoutClasses);
  bentoSurface.classList.add(bentoLayoutClasses[index]);
}

function renderBentoTiles(tiles, offset) {
  const safeOffset = offset || 0;
  const orderedTiles = tiles.map((_, index) => tiles[(index + safeOffset) % tiles.length]);

  bentoTiles.forEach((tile, index) => {
    tile.textContent = orderedTiles[index] || tile.textContent;
  });
}

function shuffleBento(advanceLayout) {
  if (!bentoSurface) {
    return;
  }

  if (advanceLayout) {
    bentoLayoutIndex = (bentoLayoutIndex + 1) % bentoLayoutClasses.length;
  }

  applyBentoLayout(bentoLayoutIndex);

  const data = atomData[activeAtomKey];

  if (data) {
    renderBentoTiles(data.tiles, advanceLayout ? bentoLayoutIndex : 0);

    if (canvasStatus) {
      canvasStatus.textContent = `${data.canvas} · combinazione ${bentoLayoutNames[bentoLayoutIndex]}`;
    }
  }

  bentoSurface.classList.add("is-shuffling");
  bentoTiles.forEach((tile, index) => {
    tile.style.setProperty("--tilt", `${index % 2 === 0 ? -1 : 1}deg`);
  });
  window.setTimeout(() => bentoSurface.classList.remove("is-shuffling"), 420);
}

function selectAtom(key) {
  const data = atomData[key];

  if (!data) {
    return;
  }

  activeAtomKey = key;

  if (activeAtomLabel) {
    activeAtomLabel.textContent = data.hero;
  }

  if (atomStatus) {
    atomStatus.textContent = data.status;
  }

  if (canvasStatus) {
    canvasStatus.textContent = data.canvas;
  }

  renderMemory(data.memory);
  shuffleBento(false);
  renderFreeze();
  updateShareSummary();
}

atomButtons.forEach((button) => {
  button.classList.remove("is-active");
  button.removeAttribute("aria-pressed");
  button.removeAttribute("aria-label");
});

function initAtomPhysics() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!atomOrbit || atomButtons.length === 0 || prefersReducedMotion) {
    return;
  }

  atomOrbit.classList.add("is-physics");
  const createButton = atomOrbit.querySelector(".create-atom");

  const bodies = atomButtons.map((element, index) => {
    const size = element.offsetWidth || 100;
    const xPercent = parseFloat(element.style.getPropertyValue("--x")) || 10 + index * 12;
    const yPercent = parseFloat(element.style.getPropertyValue("--y")) || 12 + index * 10;
    const angle = (Math.PI * 2 * index) / atomButtons.length;

    return {
      element,
      radius: size / 2,
      x: 0,
      y: 0,
      initialX: xPercent / 100,
      initialY: yPercent / 100,
      vx: Math.cos(angle) * (0.18 + index * 0.025),
      vy: Math.sin(angle) * (0.16 + index * 0.022),
    };
  });

  bodies.forEach((body) => {
    body.element.addEventListener("pointerenter", (event) => {
      const rect = body.element.getBoundingClientRect();
      let dx = rect.left + rect.width / 2 - event.clientX;
      let dy = rect.top + rect.height / 2 - event.clientY;
      let distance = Math.hypot(dx, dy);

      if (distance === 0) {
        const angle = Math.random() * Math.PI * 2;
        dx = Math.cos(angle);
        dy = Math.sin(angle);
        distance = 1;
      }

      body.vx += (dx / distance) * 2.2;
      body.vy += (dy / distance) * 2.2;
      body.element.classList.add("is-boosted");
      window.setTimeout(() => body.element.classList.remove("is-boosted"), 260);
    });
  });

  function getBounds() {
    const statusHeight = atomStatus ? atomStatus.offsetHeight + 28 : 0;
    return {
      width: atomOrbit.clientWidth,
      height: Math.max(240, atomOrbit.clientHeight - statusHeight),
    };
  }

  function getCreateObstacle() {
    if (!createButton) {
      return null;
    }

    const orbitRect = atomOrbit.getBoundingClientRect();
    const buttonRect = createButton.getBoundingClientRect();

    return {
      x: buttonRect.left - orbitRect.left + buttonRect.width / 2,
      y: buttonRect.top - orbitRect.top + buttonRect.height / 2,
      radius: Math.max(buttonRect.width, buttonRect.height) / 2 + 14,
    };
  }

  function clampBodies() {
    const bounds = getBounds();

    bodies.forEach((body) => {
      body.radius = (body.element.offsetWidth || body.radius * 2) / 2;
      const maxX = Math.max(0, bounds.width - body.radius * 2);
      const maxY = Math.max(0, bounds.height - body.radius * 2);
      body.x = Math.min(Math.max(body.x || bounds.width * body.initialX, 0), maxX);
      body.y = Math.min(Math.max(body.y || bounds.height * body.initialY, 0), maxY);
    });
  }

  function resolveCollisions() {
    const createObstacle = getCreateObstacle();

    for (let i = 0; i < bodies.length; i += 1) {
      for (let j = i + 1; j < bodies.length; j += 1) {
        const a = bodies[i];
        const b = bodies[j];
        const ax = a.x + a.radius;
        const ay = a.y + a.radius;
        const bx = b.x + b.radius;
        const by = b.y + b.radius;
        const dx = bx - ax;
        const dy = by - ay;
        const minDistance = a.radius + b.radius + 6;
        const distance = Math.hypot(dx, dy) || 1;

        if (distance >= minDistance) {
          continue;
        }

        const nx = dx / distance;
        const ny = dy / distance;
        const overlap = (minDistance - distance) / 2;
        a.x -= nx * overlap;
        a.y -= ny * overlap;
        b.x += nx * overlap;
        b.y += ny * overlap;

        const relativeVelocityX = a.vx - b.vx;
        const relativeVelocityY = a.vy - b.vy;
        const impact = relativeVelocityX * nx + relativeVelocityY * ny;

        if (impact > 0) {
          continue;
        }

        const impulse = -impact * 0.92;
        a.vx += impulse * nx;
        a.vy += impulse * ny;
        b.vx -= impulse * nx;
        b.vy -= impulse * ny;
      }

      if (createObstacle) {
        const body = bodies[i];
        const centerX = body.x + body.radius;
        const centerY = body.y + body.radius;
        let dx = centerX - createObstacle.x;
        let dy = centerY - createObstacle.y;
        let distance = Math.hypot(dx, dy);
        const minDistance = body.radius + createObstacle.radius;

        if (distance === 0) {
          const angle = Math.random() * Math.PI * 2;
          dx = Math.cos(angle);
          dy = Math.sin(angle);
          distance = 1;
        }

        if (distance < minDistance) {
          const nx = dx / distance;
          const ny = dy / distance;
          const overlap = minDistance - distance;
          body.x += nx * overlap;
          body.y += ny * overlap;

          const impact = body.vx * nx + body.vy * ny;

          if (impact < 0) {
            body.vx -= impact * 1.9 * nx;
            body.vy -= impact * 1.9 * ny;
          }
        }
      }
    }
  }

  function draw() {
    bodies.forEach((body) => {
      body.element.style.setProperty("--px", `${body.x}px`);
      body.element.style.setProperty("--py", `${body.y}px`);
    });
  }

  let lastFrame = performance.now();

  function tick(now) {
    const bounds = getBounds();
    const delta = Math.min(2, (now - lastFrame) / 16.67 || 1);
    lastFrame = now;

    bodies.forEach((body) => {
      body.x += body.vx * delta;
      body.y += body.vy * delta;

      const maxX = Math.max(0, bounds.width - body.radius * 2);
      const maxY = Math.max(0, bounds.height - body.radius * 2);

      if (body.x <= 0 || body.x >= maxX) {
        body.x = Math.min(Math.max(body.x, 0), maxX);
        body.vx *= -0.96;
      }

      if (body.y <= 0 || body.y >= maxY) {
        body.y = Math.min(Math.max(body.y, 0), maxY);
        body.vy *= -0.96;
      }

      body.vx *= 0.9995;
      body.vy *= 0.9995;
    });

    resolveCollisions();
    clampBodies();
    draw();
    window.requestAnimationFrame(tick);
  }

  clampBodies();
  draw();
  window.addEventListener("resize", clampBodies);
  window.requestAnimationFrame(tick);
}

document.querySelectorAll("[data-create-atom]").forEach((button) => {
  button.addEventListener("click", () => {
    const currentIndex = Math.max(0, atomOrder.indexOf(activeAtomKey));
    const nextKey = atomOrder[(currentIndex + 1) % atomOrder.length];
    flash(button, "is-pulsing", 420);
    selectAtom(nextKey);
  });
});

document.querySelectorAll("[data-refresh-layout]").forEach((button) => {
  button.addEventListener("click", () => {
    flash(button, "is-pulsing", 420);
    shuffleBento(true);
  });
});

const sharePanel = document.querySelector("[data-share-panel]");
const shareViews = sharePanel ? Array.from(sharePanel.querySelectorAll("[data-share-view]")) : [];
const shareContactList = document.querySelector("[data-contact-list]");
const addContactButton = document.querySelector("[data-add-contact]");
const shareAction = document.querySelector("[data-share-action]");
const freezeState = {
  day: 2,
  month: 10,
  year: 20,
  active: false,
};

const freezePanel = document.querySelector(".freeze-panel");
const freezeButton = document.querySelector("[data-freeze-action]");
const freezeSummary = document.querySelector("[data-freeze-summary]");
const freezeFields = {
  day: document.querySelector("[data-freeze-day]"),
  month: document.querySelector("[data-freeze-month]"),
  year: document.querySelector("[data-freeze-year]"),
};

function setShareMode(mode) {
  if (!sharePanel) {
    return;
  }

  sharePanel.setAttribute("data-share-mode", mode);
  sharePanel.classList.toggle("is-freeze-mode", mode === "freeze");
  shareViews.forEach((view) => {
    const isActive = view.getAttribute("data-share-view") === mode;
    view.hidden = !isActive;
    view.setAttribute("aria-hidden", String(!isActive));
  });
}

function formatNumber(value) {
  return String(value).padStart(2, "0");
}

function getFreezeDate() {
  return `${formatNumber(freezeState.day)}/${formatNumber(freezeState.month)}/${formatNumber(freezeState.year)}`;
}

function renderFreeze() {
  Object.entries(freezeFields).forEach(([key, element]) => {
    if (element) {
      element.textContent = formatNumber(freezeState[key]);
    }
  });

  if (freezePanel) {
    freezePanel.classList.toggle("is-frozen", freezeState.active);
  }

  if (freezeButton) {
    freezeButton.textContent = freezeState.active ? "Frozen" : "Freeze";
    freezeButton.setAttribute("aria-pressed", String(freezeState.active));
    freezeButton.setAttribute("aria-label", freezeState.active ? "Disattiva Freeze per questo Atom" : "Attiva Freeze per questo Atom");
  }

  if (freezeSummary) {
    const atomName = atomData[activeAtomKey] ? atomData[activeAtomKey].hero.split(" / ")[0] : "Atom";
    freezeSummary.textContent = freezeState.active
      ? `${atomName} si sblocca il ${getFreezeDate()}`
      : `Atom congelabile fino al ${getFreezeDate()}`;
  }
}

setShareMode("contacts");

document.querySelectorAll("[data-step]").forEach((button) => {
  button.addEventListener("click", () => {
    const field = button.getAttribute("data-step");
    const delta = Number(button.getAttribute("data-delta") || 0);

    if (!field || !(field in freezeState)) {
      return;
    }

    const max = field === "day" ? 31 : field === "month" ? 12 : 99;
    const min = 1;
    const next = freezeState[field] + delta;
    freezeState[field] = next > max ? min : next < min ? max : next;
    renderFreeze();
    flash(freezePanel, "is-changing", 180);
    if (freezeState.active) {
      updateShareSummary(`Capsula temporale attiva fino al ${getFreezeDate()}`);
    }
  });
});

if (freezeButton) {
  freezeButton.addEventListener("click", () => {
    setShareMode("freeze");
    freezeState.active = !freezeState.active;
    renderFreeze();
    flash(freezePanel, "is-changing", 220);
    updateShareSummary(freezeState.active ? `Capsula temporale attiva fino al ${getFreezeDate()}` : "Freeze disattivato");
  });
}

function createContact(name) {
  const familyIcons = {
    Mamma: "assets/Icons_Family/Mamma.png",
    Nonno: "assets/Icons_Family/Nonno.png",
    "Papà": "assets/Icons_Family/Papa.png",
    Zia: "assets/Icons_Family/Zia.png",
  };
  const row = document.createElement("div");
  const avatar = document.createElement("span");
  const image = document.createElement("img");
  const label = document.createElement("strong");
  const button = document.createElement("button");

  row.className = "contact is-selected";
  row.setAttribute("data-contact-row", "");
  avatar.className = "avatar";
  avatar.setAttribute("aria-hidden", "true");
  image.src = familyIcons[name] || familyIcons.Mamma;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  avatar.append(image);
  label.textContent = name;
  button.type = "button";
  button.textContent = "✓";
  button.setAttribute("data-contact", name);
  button.setAttribute("aria-pressed", "true");
  button.setAttribute("aria-label", `Rimuovi ${name} dalla condivisione`);
  row.append(avatar, label, button);
  return row;
}

if (sharePanel) {
  sharePanel.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const contactButton = target.closest("[data-contact]");

    if (contactButton) {
      const row = contactButton.closest("[data-contact-row]");
      const nextState = contactButton.getAttribute("aria-pressed") !== "true";
      const contactName = contactButton.getAttribute("data-contact") || "contatto";
      contactButton.setAttribute("aria-pressed", String(nextState));
      contactButton.textContent = nextState ? "✓" : "+";
      contactButton.setAttribute("aria-label", nextState ? `Rimuovi ${contactName} dalla condivisione` : `Aggiungi ${contactName} alla condivisione`);

      if (row) {
        row.classList.toggle("is-selected", nextState);
      }

      updateShareSummary();
    }
  });
}

if (addContactButton && sharePanel) {
  addContactButton.addEventListener("click", () => {
    const contactName = "Mamma";

    if (!document.querySelector(`[data-contact='${contactName}']`)) {
      const contactTarget = shareContactList || addContactButton.parentElement || sharePanel;
      contactTarget.insertBefore(createContact(contactName), addContactButton);
    }

    addContactButton.classList.add("is-added");
    addContactButton.disabled = true;
    addContactButton.hidden = true;
    addContactButton.setAttribute("aria-label", `${contactName} aggiunta alla condivisione`);
    updateShareSummary("Nuovo contatto aggiunto");
  });
}

if (shareAction) {
  shareAction.addEventListener("click", () => {
    setShareMode("contacts");
    const action = freezeState.active ? `Share programmato per il ${getFreezeDate()}` : "Share pronto ora";
    updateShareSummary(action);
  });
}

const aiCopy = {
  vinili: {
    heading: "Collezione Vinili",
    copy: "Plasma ricompone foto, titoli e persone attorno a una collezione musicale personale.",
    image: "assets/Mockup_mobile/Collezione%20vinili.png",
    alt: "Mockup mobile Plasma per Collezione Vinili",
  },
  milano: {
    heading: "Milano",
    copy: "L'AI riconosce luoghi, stagioni e atmosfere per collegare ricordi urbani a un contesto visivo.",
    image: "assets/Mockup_mobile/Milano.png",
    alt: "Mockup mobile Plasma per Milano",
  },
  nonni: {
    heading: "Nonni",
    copy: "Plasma suggerisce connessioni tra persone, date e storie per rendere più leggibile la memoria familiare.",
    image: "assets/Mockup_mobile/Nonni.png",
    alt: "Mockup mobile Plasma per Nonni",
  },
  salone: {
    heading: "Salone del Mobile",
    copy: "Materiali, scatti e appunti diventano un Atom narrativo per conservare un evento creativo.",
    image: "assets/Mockup_mobile/Salone%20del%20Mobile.png",
    alt: "Mockup mobile Plasma per Salone del Mobile",
  },
};

const aiGrid = document.querySelector(".ai-grid");
const aiPhone = document.querySelector("[data-ai-phone]");
const aiPhoneImage = aiPhone ? aiPhone.querySelector("img") : null;
const aiHeading = document.querySelector("[data-ai-heading]");
const aiDescription = document.querySelector("[data-ai-copy]");
const designPhone = document.querySelector("[data-design-phone]");

if (designPhone && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const designLayouts = ["1", "2", "3", "4"];
  let designLayoutIndex = 0;

  window.setInterval(() => {
    designLayoutIndex = (designLayoutIndex + 1) % designLayouts.length;
    designPhone.setAttribute("data-layout", designLayouts[designLayoutIndex]);
  }, 2000);
}

document.querySelectorAll("[data-ai-tag]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.getAttribute("data-ai-tag");
    const content = aiCopy[key];

    if (!content || !aiHeading || !aiDescription) {
      return;
    }

    document.querySelectorAll("[data-ai-tag]").forEach((tag) => {
      const isActive = tag === button;
      tag.classList.toggle("is-active", isActive);
      tag.setAttribute("aria-pressed", String(isActive));
    });
    aiHeading.textContent = content.heading;
    aiDescription.textContent = content.copy;

    if (aiPhoneImage) {
      aiPhoneImage.src = content.image;
      aiPhoneImage.alt = content.alt;
    }

    flash(aiGrid, "is-updating", 240);
    flash(aiPhone, "is-changing", 240);
  });
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

selectAtom(activeAtomKey);
initAtomPhysics();
initHeroLogo3d();
heroAtomFields.forEach(initHeroAtoms);
