(function () {
  "use strict";

  /**
   * IMPORTANT: paste the "Web app URL" you get after deploying
   * google-apps-script/Code.gs (see README) here. Until then the
   * form will still validate but will show a friendly error on submit.
   */
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx76Q-HqaawnlUPX5yTzrBrizrdYRpOVLtdAe4Ow3HpzjZE4OoNBf8wnHa2c71m86_E/exec";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- Theme Toggle ---------------- */
  const themeToggleBtn = document.getElementById("themeToggle");
  if (themeToggleBtn) {
    // 1. Check if they previously chose a theme, OR if their OS is set to dark mode
    const currentTheme = localStorage.getItem("theme") || 
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    // 2. Apply that theme immediately on load
    if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggleBtn.textContent = "☀️"; 
    } else {
        themeToggleBtn.textContent = "🌙"; 
    }

    // 3. Listen for clicks to switch it
    themeToggleBtn.addEventListener("click", () => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        
        if (isDark) {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
            themeToggleBtn.textContent = "🌙";
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
            themeToggleBtn.textContent = "☀️";
        }
    });
  }

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.getElementById("navToggle");
  const catalogTabs = document.getElementById("catalogTabs");

  navToggle.addEventListener("click", () => {
    const isOpen = catalogTabs.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  catalogTabs.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      catalogTabs.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------- Scroll-spy active tab ---------------- */
  const sections = document.querySelectorAll(".section[id]");
  const tabs = document.querySelectorAll(".tab");

  const setActiveTab = (id) => {
    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.section === id);
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  /* ---------------- Contact form ---------------- */
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");

  const fieldErrorEls = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    message: document.getElementById("messageError"),
  };

  function showFieldErrors(errors) {
    Object.keys(errors).forEach((key) => {
      if (fieldErrorEls[key]) fieldErrorEls[key].textContent = errors[key];
    });
  }

  function clearFieldErrors() {
    Object.values(fieldErrorEls).forEach((el) => (el.textContent = ""));
  }

  ["name", "email", "message"].forEach((key) => {
    const input = document.getElementById(key);
    if (input) {
      input.addEventListener("blur", () => input.setAttribute("data-touched", "true"));
    }
  });

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      clearFieldErrors();
      formStatus.textContent = "";
      formStatus.removeAttribute("data-state");

      const payload = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value,
        company: form.company.value, // honeypot
      };

      // Ensure validateContactForm is defined in js/validate.js
      if (typeof validateContactForm === "function") {
        const result = validateContactForm(payload);

        if (result.spam) {
          // Silently "succeed" for bots so they don't learn to avoid the honeypot.
          formStatus.textContent = "Thanks! Your message has been sent.";
          formStatus.setAttribute("data-state", "success");
          form.reset();
          return;
        }

        if (!result.valid) {
          showFieldErrors(result.errors);
          formStatus.textContent = "Please fix the errors above.";
          formStatus.setAttribute("data-state", "error");
          return;
        }
      }

      if (GOOGLE_SCRIPT_URL.startsWith("PASTE_")) {
        formStatus.textContent =
          "Form looks good, but the backend isn't configured yet — see README for setup.";
        formStatus.setAttribute("data-state", "error");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      try {
        // FIX: Format the data as URLSearchParams so Google Apps Script can parse it
        const formData = new URLSearchParams();
        formData.append("name", payload.name);
        formData.append("email", payload.email);
        formData.append("message", payload.message);

        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors", // Apps Script web apps don't return CORS headers
          body: formData,  // Send the URLSearchParams directly without JSON.stringify
        });

        formStatus.textContent = "Thanks! Your message has been sent.";
        formStatus.setAttribute("data-state", "success");
        form.reset();
      } catch (err) {
        formStatus.textContent = "Something went wrong — please try again in a moment.";
        formStatus.setAttribute("data-state", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send message";
      }
    });
  }
})();
