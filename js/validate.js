/**
 * Pure validation functions for the contact form.
 * Kept free of DOM/browser APIs on purpose so they can be
 * unit tested directly with Node/Jest (see /tests/validate.test.js)
 * and also loaded as a plain <script> in the browser (see js/main.js).
 */

function validateName(name) {
  const trimmed = (name || "").trim();
  if (trimmed.length === 0) return "Please enter your name.";
  if (trimmed.length < 2) return "Name must be at least 2 characters.";
  if (trimmed.length > 80) return "Name is too long.";
  return "";
}

function validateEmail(email) {
  const trimmed = (email || "").trim();
  if (trimmed.length === 0) return "Please enter your email.";
  // Simple, readable RFC-5322-ish check: local@domain.tld
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(trimmed)) return "Please enter a valid email address.";
  return "";
}

function validateMessage(message) {
  const trimmed = (message || "").trim();
  if (trimmed.length === 0) return "Please enter a message.";
  if (trimmed.length < 10) return "Message should be at least 10 characters.";
  if (trimmed.length > 2000) return "Message is too long (max 2000 characters).";
  return "";
}

/**
 * Validates the whole contact form payload at once.
 * @param {{name: string, email: string, message: string, company?: string}} data
 * @returns {{valid: boolean, errors: {name: string, email: string, message: string}}}
 */
function validateContactForm(data) {
  const safeData = data || {};

  // Honeypot: if the hidden "company" field is filled, treat as spam
  // by returning a validation shape that flows through as "invalid"
  // without exposing the reason to the (bot) sender.
  if (safeData.company && safeData.company.trim().length > 0) {
    return {
      valid: false,
      errors: { name: "", email: "", message: "" },
      spam: true,
    };
  }

  const errors = {
    name: validateName(safeData.name),
    email: validateEmail(safeData.email),
    message: validateMessage(safeData.message),
  };

  const valid = Object.values(errors).every((e) => e === "");
  return { valid, errors, spam: false };
}

// Export for Node/Jest; in the browser these become plain globals.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { validateName, validateEmail, validateMessage, validateContactForm };
}
