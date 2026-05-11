const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const navToggleLabel = navToggle ? navToggle.querySelector(".sr-only") : null;
const heroAtomField = document.querySelector("[data-hero-atom-field]");

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
    }
  });
}

const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && navSections.length > 0) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", isActive);
          if (isActive) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-38% 0px -55% 0px", threshold: 0.01 }
  );

  navSections.forEach((section) => navObserver.observe(section));
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createRandomMemoryImage() {
  const hue = Math.floor(randomBetween(170, 310));
  const accent = Math.floor(randomBetween(10, 42));
  const circles = Array.from({ length: 8 }, () => {
    const cx = randomBetween(0, 100).toFixed(1);
    const cy = randomBetween(0, 100).toFixed(1);
    const radius = randomBetween(8, 34).toFixed(1);
    const opacity = randomBetween(0.18, 0.58).toFixed(2);
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="hsla(${hue + randomBetween(-45, 45)}, 70%, 72%, ${opacity})"/>`;
  }).join("");
  const strokes = Array.from({ length: 5 }, () => {
    const x1 = randomBetween(0, 100).toFixed(1);
    const y1 = randomBetween(0, 100).toFixed(1);
    const x2 = randomBetween(0, 100).toFixed(1);
    const y2 = randomBetween(0, 100).toFixed(1);
    return `<path d="M ${x1} ${y1} C ${randomBetween(0, 100).toFixed(1)} ${randomBetween(0, 100).toFixed(1)}, ${randomBetween(0, 100).toFixed(1)} ${randomBetween(0, 100).toFixed(1)}, ${x2} ${y2}" stroke="rgba(255,255,255,.42)" stroke-width="${randomBetween(0.7, 2.2).toFixed(1)}" fill="none"/>`;
  }).join("");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="hsl(${hue}, 48%, 28%)"/>
          <stop offset="0.55" stop-color="hsl(${hue + accent}, 52%, 38%)"/>
          <stop offset="1" stop-color="hsl(${hue - 80}, 46%, 16%)"/>
        </linearGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer><feFuncA type="table" tableValues="0 .16"/></feComponentTransfer>
        </filter>
      </defs>
      <rect width="220" height="220" fill="url(#bg)"/>
      ${circles}
      ${strokes}
      <rect width="220" height="220" filter="url(#grain)" opacity=".35"/>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function initHeroAtoms() {
  if (!heroAtomField) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bodies = [];
  const initialAtoms = window.innerWidth < 700 ? 8 : 15;
  const atomSpeed = 0.32;
  const maxAtomSpeed = 0.5;

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
    image.src = createRandomMemoryImage();
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
    status: "Atom Viaggio selezionato: foto, ticket e coordinate sono pronti nel Canvas.",
    canvas: "Canvas Viaggio: 5 frammenti selezionati",
    memory: "images",
    tiles: ["Foto", "Ticket", "Voce", "Milano", "Mappa"],
  },
  famiglia: {
    hero: "Famiglia / Nonni",
    status: "Atom Famiglia selezionato: ricetta, foto e voce sono pronti nel Canvas.",
    canvas: "Canvas Famiglia: 5 frammenti selezionati",
    memory: "text",
    tiles: ["Foto", "Ricetta", "Voce", "Nonni", "Lettera"],
  },
  lettere: {
    hero: "Lettere / Archivio",
    status: "Atom Lettere selezionato: scansioni, testi e note emotive sono pronti nel Canvas.",
    canvas: "Canvas Lettere: 4 frammenti selezionati",
    memory: "files",
    tiles: ["Scansione", "Testo", "Firma", "Data", "Busta"],
  },
  audio: {
    hero: "Audio / Voci",
    status: "Atom Audio selezionato: voce, musica e contesto sono pronti nel Canvas.",
    canvas: "Canvas Audio: 3 frammenti selezionati",
    memory: "audio",
    tiles: ["Voce", "Playlist", "Nota", "Persona", "Luogo"],
  },
  ticket: {
    hero: "Ticket / Eventi",
    status: "Atom Ticket selezionato: biglietto, foto e data sono pronti nel Canvas.",
    canvas: "Canvas Ticket: 5 frammenti selezionati",
    memory: "draw",
    tiles: ["Ticket", "Foto", "Sketch", "Data", "Evento"],
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
  atomButtons.forEach((button) => {
    const isActive = button.getAttribute("data-atom") === key;
    const atomName = button.textContent.trim();
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.setAttribute("aria-label", isActive ? `Atom ${atomName} selezionato` : `Seleziona Atom ${atomName}`);
  });

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
  const isActive = button.classList.contains("is-active");
  const atomName = button.textContent.trim();
  button.setAttribute("aria-pressed", String(isActive));
  button.setAttribute("aria-label", isActive ? `Atom ${atomName} selezionato` : `Seleziona Atom ${atomName}`);
  button.addEventListener("click", () => selectAtom(button.getAttribute("data-atom")));
});

function initAtomPhysics() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!atomOrbit || atomButtons.length === 0 || prefersReducedMotion) {
    return;
  }

  atomOrbit.classList.add("is-physics");
  const createButton = atomOrbit.querySelector("[data-create-atom]");

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
  });
});

if (freezeButton) {
  freezeButton.addEventListener("click", () => {
    freezeState.active = !freezeState.active;
    renderFreeze();
    flash(freezePanel, "is-changing", 220);
    updateShareSummary(freezeState.active ? `Capsula temporale attiva fino al ${getFreezeDate()}` : "Freeze disattivato");
  });
}

const sharePanel = document.querySelector("[data-share-panel]");
const addContactButton = document.querySelector("[data-add-contact]");
const shareAction = document.querySelector("[data-share-action]");

function createContact(name) {
  const row = document.createElement("div");
  const avatar = document.createElement("span");
  const label = document.createElement("strong");
  const button = document.createElement("button");

  row.className = "contact is-selected";
  row.setAttribute("data-contact-row", "");
  avatar.className = "avatar avatar-two";
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
    if (!document.querySelector("[data-contact='Cugini']")) {
      sharePanel.insertBefore(createContact("Cugini"), addContactButton);
    }

    addContactButton.classList.add("is-added");
    addContactButton.setAttribute("aria-label", "Gruppo Cugini aggiunto alla condivisione");
    updateShareSummary("Nuovo gruppo aggiunto");
  });
}

if (shareAction) {
  shareAction.addEventListener("click", () => {
    const action = freezeState.active ? `Share programmato per il ${getFreezeDate()}` : "Share pronto ora";
    updateShareSummary(action);
  });
}

const aiCopy = {
  Ricordi: {
    heading: "Generazione di Atom tematici",
    copy: "Carica contenuti e lascia che l'AI costruisca per te raccolte coerenti e visivamente armoniche.",
    preview: "5 Atom suggeriti",
  },
  Paesaggi: {
    heading: "Paesaggi della memoria",
    copy: "L'AI riconosce luoghi, stagioni e atmosfere per collegare foto, note e oggetti a un contesto visivo.",
    preview: "3 luoghi collegati",
  },
  Famiglia: {
    heading: "Legami familiari",
    copy: "Plasma suggerisce connessioni tra persone, date e storie per rendere più leggibile la memoria condivisa.",
    preview: "4 persone connesse",
  },
  Hobby: {
    heading: "Passioni e rituali",
    copy: "Ricette, musica, disegni e piccoli archivi personali diventano Atom da rivivere e trasformare.",
    preview: "6 contenuti ordinati",
  },
};

const aiGrid = document.querySelector(".ai-grid");
const aiPhone = document.querySelector("[data-ai-phone]");
const aiHeading = document.querySelector("[data-ai-heading]");
const aiDescription = document.querySelector("[data-ai-copy]");
const aiPreviewLabel = document.querySelector("[data-ai-preview-label]");
const aiPreviewTitle = document.querySelector("[data-ai-preview-title]");

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

    if (aiPreviewLabel) {
      aiPreviewLabel.textContent = key;
    }

    if (aiPreviewTitle) {
      aiPreviewTitle.textContent = content.preview;
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
initHeroAtoms();
