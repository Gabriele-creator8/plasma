const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));

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
  document.body.classList.remove("nav-open");
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
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
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-38% 0px -55% 0px", threshold: 0.01 }
  );

  navSections.forEach((section) => navObserver.observe(section));
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

  memoryButtons.forEach((item) => item.classList.toggle("is-active", item.getAttribute("data-memory") === key));
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
  button.addEventListener("click", () => renderMemory(button.getAttribute("data-memory")));
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
const activeAtomLabel = document.querySelector("[data-active-atom]");
const atomStatus = document.querySelector("[data-atom-status]");
const canvasStatus = document.querySelector("[data-canvas-status]");
const bentoSurface = document.querySelector("[data-bento-surface]");
const bentoTiles = bentoSurface ? Array.from(bentoSurface.querySelectorAll(".tile")) : [];
let activeAtomKey = "famiglia";

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

function shuffleBento(toggleLayout) {
  if (!bentoSurface) {
    return;
  }

  if (toggleLayout) {
    bentoSurface.classList.toggle("layout-alt");
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
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
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

  bentoTiles.forEach((tile, index) => {
    tile.textContent = data.tiles[index] || tile.textContent;
  });

  renderMemory(data.memory);
  shuffleBento(false);
  renderFreeze();
  updateShareSummary();
}

atomButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
  button.addEventListener("click", () => selectAtom(button.getAttribute("data-atom")));
});

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
      contactButton.setAttribute("aria-pressed", String(nextState));
      contactButton.textContent = nextState ? "✓" : "+";

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

    document.querySelectorAll("[data-ai-tag]").forEach((tag) => tag.classList.remove("is-active"));
    button.classList.add("is-active");
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

renderMemory("images");
renderFreeze();
updateShareSummary();
