const loader = document.querySelector("#loader");
const header = document.querySelector("#siteHeader");
const navLinks = [...document.querySelectorAll(".main-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = [...document.querySelectorAll(".reveal")];
const cursor = document.querySelector(".cursor");
const cursorTrail = [...document.querySelectorAll(".cursor-trail span")];
const stage = document.querySelector("#skillsStage");
const planets = [...document.querySelectorAll(".planet")];
const chips = [...document.querySelectorAll(".skill-chips button")];
const backSkill = document.querySelector("#backSkill");
const skillName = document.querySelector("#skillName");
const skillInfo = document.querySelector("#skillInfo");
const typeLines = [...document.querySelectorAll(".type-line")];
const skillTooltip = document.querySelector("#skillTooltip");

const skillCopy = {
  react: {
    name: "React",
    info:
      "My primary frontend framework. I have built multi-role web platforms and responsive interfaces using React across several real projects.",
  },
  reactnative: {
    name: "React Native",
    info:
      "Used to develop a cross-platform mobile app for campus news, with browsing, commenting, and a favourites system built for real student use.",
  },
  node: {
    name: "Node.js",
    info:
      "My go-to for backend logic. I have built REST APIs and server-side systems for booking platforms and content management tools.",
  },
  javascript: {
    name: "JavaScript",
    info:
      "The language underneath everything I build on the web. I use it daily across both frontend and backend environments.",
  },
  mysql: {
    name: "MySQL",
    info:
      "Used for structured data across booking and reservation systems. I design relational schemas and handle queries efficiently.",
  },
  figma: {
    name: "Figma",
    info:
      "My design tool of choice. I wireframe, prototype, and design the full UI before writing a single line of code.",
  },
  html: {
    name: "HTML/CSS",
    info:
      "The foundation of all my frontend work. I care deeply about responsive layouts, visual hierarchy, and clean presentation.",
  },
  kali: {
    name: "Kali Linux",
    info:
      "A foundational interest in cybersecurity tools and ethical hacking, explored through coursework and personal challenge.",
  },
};

function readCssNumber(element, property) {
  const rawValue = getComputedStyle(element).getPropertyValue(property).trim();
  return Number.parseFloat(rawValue) || 0;
}

function readSpeed(element) {
  const rawValue = getComputedStyle(element).getPropertyValue("--speed").trim();
  return Number.parseFloat(rawValue) || 12;
}

const orbitStates = planets.map((planet, index) => ({
  planet,
  shell: planet.closest(".orbit-shell"),
  orbitX: readCssNumber(planet, "--orbit-x"),
  orbitY: readCssNumber(planet, "--orbit-y"),
  speed: readSpeed(planet),
  phase: index * 0.86,
}));

let hoveredPlanet = null;
let chipHoveredPlanet = null;
let pointerInSkills = false;
let pointerPosition = { x: 0, y: 0 };

function showSkillTooltip(planet) {
  if (!planet || stage.classList.contains("is-detail") || !skillTooltip) return;
  hoveredPlanet = planet;
  skillTooltip.textContent = planet.textContent.trim();
  skillTooltip.classList.add("is-visible");
  skillTooltip.setAttribute("aria-hidden", "false");
}

function hideSkillTooltip(planet) {
  if (planet && hoveredPlanet !== planet) return;
  hoveredPlanet = null;
  if (!skillTooltip) return;
  skillTooltip.classList.remove("is-visible");
  skillTooltip.setAttribute("aria-hidden", "true");
}

function positionSkillTooltip() {
  if (!hoveredPlanet || !skillTooltip || stage.classList.contains("is-detail")) return;
  const rect = hoveredPlanet.getBoundingClientRect();
  skillTooltip.style.left = `${rect.left + rect.width / 2}px`;
  skillTooltip.style.top = `${rect.top}px`;
}

function planetAtPointer() {
  if (!pointerInSkills || stage.classList.contains("is-detail")) return null;

  return planets.find((planet) => {
    const rect = planet.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radius = rect.width / 2 + 6;
    const distance = Math.hypot(pointerPosition.x - centerX, pointerPosition.y - centerY);
    return distance <= radius;
  });
}

function syncPlanetHover() {
  const detectedPlanet = chipHoveredPlanet || planetAtPointer();

  if (detectedPlanet !== hoveredPlanet) {
    if (detectedPlanet) {
      showSkillTooltip(detectedPlanet);
    } else {
      hideSkillTooltip();
    }
  }
}

function animatePlanets(time) {
  const isDetail = stage.classList.contains("is-detail");

  if (!isDetail) {
    orbitStates.forEach((state) => {
      const angle = state.phase + (time / 1000) * ((Math.PI * 2) / state.speed);
      const x = Math.cos(angle) * state.orbitX;
      const y = Math.sin(angle) * state.orbitY;
      state.planet.style.transform = `translate(${x}px, ${y}px)`;
      state.planet.style.zIndex = y < 0 ? "2" : "4";
      if (state.shell) {
        state.shell.style.zIndex = y < 0 ? "2" : "4";
      }
    });
  }

  syncPlanetHover();
  positionSkillTooltip();
  requestAnimationFrame(animatePlanets);
}

requestAnimationFrame(animatePlanets);

window.addEventListener("load", () => {
  window.setTimeout(() => loader.classList.add("is-hidden"), 2350);
});

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
});

if (cursor) {
  let cursorTarget = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let cursorPosition = { ...cursorTarget };
  const trailPoints = cursorTrail.map(() => ({ ...cursorTarget }));

  window.addEventListener("pointermove", (event) => {
    cursorTarget = { x: event.clientX, y: event.clientY };
    cursorTrail.forEach((dot) => {
      dot.style.opacity = "1";
    });
  });

  function animateCursor() {
    cursorPosition.x += (cursorTarget.x - cursorPosition.x) * 0.32;
    cursorPosition.y += (cursorTarget.y - cursorPosition.y) * 0.32;
    cursor.style.left = `${cursorPosition.x}px`;
    cursor.style.top = `${cursorPosition.y}px`;

    let followX = cursorPosition.x;
    let followY = cursorPosition.y;
    cursorTrail.forEach((dot, index) => {
      const point = trailPoints[index];
      point.x += (followX - point.x) * (0.22 - index * 0.025);
      point.y += (followY - point.y) * (0.22 - index * 0.025);
      dot.style.left = `${point.x}px`;
      dot.style.top = `${point.y}px`;
      dot.style.opacity = `${0.28 - index * 0.04}`;
      followX = point.x;
      followY = point.y;
    });

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  document.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("pointerenter", () => cursor.classList.add("is-hovering"));
    item.addEventListener("pointerleave", () => cursor.classList.remove("is-hovering"));
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeId = entry.target.id;
      navLinks.forEach((link) => {
        const linkTarget = link.getAttribute("href").replace("#", "");
        link.classList.toggle("active", linkTarget === activeId);
      });
    });
  },
  { rootMargin: "-42% 0px -52% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

function selectSkill(skill) {
  const selectedPlanet = planets.find((planet) => planet.dataset.skill === skill);
  const selectedCopy = skillCopy[skill];

  if (!selectedPlanet || !selectedCopy) return;
  hideSkillTooltip();

  planets.forEach((planet) => {
    planet.classList.remove("is-chip-hover");
    planet.classList.toggle("is-selected", planet === selectedPlanet);
  });
  planets.forEach((planet) => {
    planet.closest(".orbit-shell")?.classList.toggle("is-selected-orbit", planet === selectedPlanet);
  });
  chips.forEach((chip) => chip.classList.toggle("active", chip.dataset.skill === skill));
  skillName.textContent = selectedCopy.name;
  skillInfo.textContent = selectedCopy.info;
  stage.classList.add("is-detail");
  selectedPlanet.style.transform = "";
  selectedPlanet.style.zIndex = "4";
}

function resetSkills() {
  stage.classList.remove("is-detail");
  chipHoveredPlanet = null;
  planets.forEach((planet) => planet.classList.remove("is-selected", "is-chip-hover"));
  document.querySelectorAll(".orbit-shell").forEach((shell) => shell.classList.remove("is-selected-orbit"));
  chips.forEach((chip) => chip.classList.remove("active"));
}

stage.addEventListener("pointerenter", (event) => {
  pointerInSkills = true;
  pointerPosition = { x: event.clientX, y: event.clientY };
});

stage.addEventListener("pointermove", (event) => {
  pointerInSkills = true;
  pointerPosition = { x: event.clientX, y: event.clientY };
});

stage.addEventListener("pointerleave", () => {
  pointerInSkills = false;
  if (!chipHoveredPlanet) {
    hideSkillTooltip();
  }
});

planets.forEach((planet) => {
  planet.addEventListener("click", () => selectSkill(planet.dataset.skill));
});

chips.forEach((chip) => {
  chip.addEventListener("mouseenter", () => {
    chipHoveredPlanet = planets.find((planet) => planet.dataset.skill === chip.dataset.skill);
    if (!chipHoveredPlanet || stage.classList.contains("is-detail")) return;
    chipHoveredPlanet.classList.add("is-chip-hover");
    showSkillTooltip(chipHoveredPlanet);
  });

  chip.addEventListener("mouseleave", () => {
    chipHoveredPlanet?.classList.remove("is-chip-hover");
    chipHoveredPlanet = null;
    hideSkillTooltip();
  });

  chip.addEventListener("click", () => {
    document.querySelector("#skills").scrollIntoView({ behavior: "smooth" });
    selectSkill(chip.dataset.skill);
  });
});

backSkill.addEventListener("click", resetSkills);

function typeTransmission(line, delay) {
  const text = line.dataset.type || "";
  window.setTimeout(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      line.textContent = text.slice(0, index);
      index += 1;
      if (index > text.length) {
        window.clearInterval(timer);
        line.classList.add("is-done");
      }
    }, 34);
  }, delay);
}

const contactObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      typeLines.forEach((line, index) => typeTransmission(line, index * 600));
      contactObserver.disconnect();
    });
  },
  { threshold: 0.35 }
);

const contactSection = document.querySelector("#contact");
if (contactSection) {
  contactObserver.observe(contactSection);
}

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    card.style.setProperty("--tilt-x", `${y / -30}deg`);
    card.style.setProperty("--tilt-y", `${x / 30}deg`);
  });
});
