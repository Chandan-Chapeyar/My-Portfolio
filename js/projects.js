// Keep the HTML fallback unless the API returns project data to display.
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

      // Use textContent for database values so they stay plain text in the page.
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
      // Only allow http(s) links from the database.
      link.href = /^https?:\/\//i.test(project.link_url) ? project.link_url : "#";
      if (link.href !== "#" && !link.href.endsWith("#")) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }

      card.append(number, title, description, tags, link);
      grid.appendChild(card);
    });
  } catch (err) {
    // If the request fails, leave the starter card in place.
  }
})();
