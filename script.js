const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
  });
}

const memoryContent = {
  images: {
    title: "Immagini e Video",
    copy: "Carica foto e video ad alta risoluzione dei tuoi ricordi più preziosi, da una stampa ritrovata a un breve filmato di famiglia.",
  },
  audio: {
    title: "Audio e Musica",
    copy: "Salva dalle note vocali di chi ami alle canzoni che hanno il potere di riportarti indietro nel tempo.",
  },
  files: {
    title: "File",
    copy: "Carica documenti PDF, scansioni di vecchi ricordi o file digitali di ogni genere dentro lo stesso Atom.",
  },
  text: {
    title: "Testi e Messaggi",
    copy: "Scrivi una dedica, incolla una chat indimenticabile o annota una riflessione che dia contesto al ricordo.",
  },
  draw: {
    title: "Disegna a mano",
    copy: "Usa il tratto libero per schizzare un'idea, scarabocchiare un'emozione o personalizzare la tua box con un tocco unico.",
  },
};

const memoryButtons = document.querySelectorAll("[data-memory]");
const memoryTitle = document.querySelector("[data-memory-title]");
const memoryCopy = document.querySelector("[data-memory-copy]");

memoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.getAttribute("data-memory");
    const content = key ? memoryContent[key] : null;

    if (!content || !memoryTitle || !memoryCopy) {
      return;
    }

    memoryButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    memoryTitle.textContent = content.title;
    memoryCopy.textContent = content.copy;
  });
});

const bentoSurface = document.querySelector("[data-bento-surface]");
const shuffleButtons = document.querySelectorAll("[data-refresh-layout], [data-create-atom]");

shuffleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!bentoSurface) {
      return;
    }

    bentoSurface.classList.add("is-shuffling");
    bentoSurface.querySelectorAll(".tile").forEach((tile, index) => {
      tile.style.setProperty("--tilt", `${index % 2 === 0 ? -1 : 1}deg`);
    });
    window.setTimeout(() => bentoSurface.classList.remove("is-shuffling"), 420);
  });
});

const freezeState = {
  day: 2,
  month: 10,
  year: 20,
};

const freezeSummary = document.querySelector("[data-freeze-summary]");
const freezeFields = {
  day: document.querySelector("[data-freeze-day]"),
  month: document.querySelector("[data-freeze-month]"),
  year: document.querySelector("[data-freeze-year]"),
};

function formatNumber(value) {
  return String(value).padStart(2, "0");
}

function renderFreeze() {
  Object.entries(freezeFields).forEach(([key, element]) => {
    if (element) {
      element.textContent = formatNumber(freezeState[key]);
    }
  });

  if (freezeSummary) {
    freezeSummary.textContent = `Atom congelato fino al ${formatNumber(freezeState.day)}/${formatNumber(freezeState.month)}/${formatNumber(freezeState.year)}`;
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
  });
});

const aiCopy = {
  Ricordi: ["Generazione di Atom tematici", "Carica contenuti e lascia che l'AI costruisca per te raccolte coerenti e visivamente armoniche."],
  Paesaggi: ["Paesaggi della memoria", "L'AI riconosce luoghi, stagioni e atmosfere per collegare foto, note e oggetti a un contesto visivo."],
  Famiglia: ["Legami familiari", "Plasma suggerisce connessioni tra persone, date e storie per rendere più leggibile la memoria condivisa."],
  Hobby: ["Passioni e rituali", "Ricette, musica, disegni e piccoli archivi personali diventano Atom da rivivere e trasformare."],
};

const aiHeading = document.querySelector("[data-ai-heading]");
const aiDescription = document.querySelector("[data-ai-copy]");

document.querySelectorAll("[data-ai-tag]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.getAttribute("data-ai-tag");
    const content = key ? aiCopy[key] : null;

    if (!content || !aiHeading || !aiDescription) {
      return;
    }

    document.querySelectorAll("[data-ai-tag]").forEach((tag) => tag.classList.remove("is-active"));
    button.classList.add("is-active");
    aiHeading.textContent = content[0];
    aiDescription.textContent = content[1];
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
