const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

// Keep the mobile menu state in sync with the navigation button.
navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

function closeMenu() {
  navLinks.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

// Let visitors dismiss the mobile menu without choosing a page first.
document.addEventListener("click", event => {
  if (!navLinks.classList.contains("open")) return;
  if (navLinks.contains(event.target) || navToggle.contains(event.target)) return;
  closeMenu();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

// Switch the page between its dark and light color themes.
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "☀" : "☾";
});

// Reveal each item once as it enters the viewport, then stop observing it.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Validate the contact form, then send it to the API.
function setError(id, message) {
  document.getElementById(id).textContent = message;
}

contactForm.addEventListener("submit", async event => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  setError("nameError", "");
  setError("emailError", "");
  setError("messageError", "");
  formStatus.textContent = "";
  formStatus.className = "form-status";

  // Catch incomplete entries here; the API repeats these checks before saving.
  let valid = true;

  if (name.length < 2) {
    setError("nameError", "Please enter at least 2 characters.");
    valid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    setError("emailError", "Please enter a valid email address.");
    valid = false;
  }

  if (message.length < 10) {
    setError("messageError", "Message must be at least 10 characters.");
    valid = false;
  }

  if (!valid) return;

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  formStatus.textContent = "Sending...";

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message })
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      formStatus.textContent = "Thank you! Your message has been sent.";
      formStatus.classList.add("success");
      contactForm.reset();
    } else {
      // Show server-side validation errors next to the matching fields.
      if (data.errors) {
        if (data.errors.name) setError("nameError", data.errors.name);
        if (data.errors.email) setError("emailError", data.errors.email);
        if (data.errors.message) setError("messageError", data.errors.message);
      }
      formStatus.textContent = data.error || "Something went wrong. Please try again.";
    }
  } catch (err) {
    formStatus.textContent = "Could not reach the server. Please try again.";
  } finally {
    submitBtn.disabled = false;
  }
});

// Keep the copyright year current without editing the page each January.
document.getElementById("year").textContent =
  new Date().getFullYear();
