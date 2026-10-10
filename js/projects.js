// Loads projects from the database (GET /api/projects) and renders them with the
// existing .project-card markup/classes, so the design is unchanged.
// If the API is unreachable, the static card already in index.html stays visible.
(async function loadProjects() {
  const grid = document.querySelector(".projects-grid");
  if (!grid) return;

  try {
    const response = await fetch("/api/projects");
    if (!response.ok) return;
    const projects = await response.json();
    if (!Array.isArray(projects) || projects.length === 0) return;

    grid.textContent = "";

    projects.forEach((project, index) => {
      const card = document.createElement("article");
      card.className = "project-card reveal visible";

      const number = document.createElement("div");
      number.className = "project-number";
      number.textContent = String(index + 1).padStart(2, "0");

      const title = document.createElement("h3");
      title.textContent = project.title;

      const description = document.createElement("p");
      description.textContent = project.description;

      const tags = document.createElement("div");
      tags.className = "tags";
      (project.tags || []).forEach(tag => {
        const chip = document.createElement("span");
        chip.textContent = tag;
        tags.appendChild(chip);
      });

      const link = document.createElement("a");
      link.className = "project-link";
      link.textContent = "View project ↗";
      // only allow http(s) links from the database
      link.href = /^https?:\/\//i.test(project.link_url) ? project.link_url : "#";
      if (link.href !== "#" && !link.href.endsWith("#")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }

      card.append(number, title, description, tags, link);
      grid.appendChild(card);
    });
  } catch (err) {
    // keep the static fallback card
  }
})();
