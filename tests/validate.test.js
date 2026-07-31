const {
  validateName,
  validateEmail,
  validateMessage,
  validateContactForm,
} = require("../js/validate.js");

describe("validateName", () => {
  test("rejects empty name", () => {
    expect(validateName("")).toMatch(/enter your name/i);
  });

  test("rejects name shorter than 2 characters", () => {
    expect(validateName("A")).toMatch(/at least 2 characters/i);
  });

  test("accepts a normal name", () => {
    expect(validateName("Alex Rivera")).toBe("");
  });

  test("trims whitespace before validating", () => {
    expect(validateName("   ")).toMatch(/enter your name/i);
    expect(validateName("  Alex  ")).toBe("");
  });
});

describe("validateEmail", () => {
  test("rejects empty email", () => {
    expect(validateEmail("")).toMatch(/enter your email/i);
  });

  test.each([
    "not-an-email",
    "missing-at-sign.com",
    "missing-domain@",
    "@missing-local.com",
    "spaces in@email.com",
  ])("rejects malformed email: %s", (bad) => {
    expect(validateEmail(bad)).toMatch(/valid email/i);
  });

  test.each(["a@b.com", "alex.rivera@example.co.uk", "a+tag@sub.example.com"])(
    "accepts valid email: %s",
    (good) => {
      expect(validateEmail(good)).toBe("");
    }
  );
});

describe("validateMessage", () => {
  test("rejects empty message", () => {
    expect(validateMessage("")).toMatch(/enter a message/i);
  });

  test("rejects message shorter than 10 characters", () => {
    expect(validateMessage("too short")).toMatch(/at least 10 characters/i);
  });

  test("accepts a normal message", () => {
    expect(validateMessage("Hello, I would like to get in touch about a role.")).toBe("");
  });

  test("rejects message over 2000 characters", () => {
    expect(validateMessage("a".repeat(2001))).toMatch(/too long/i);
  });
});

describe("validateContactForm", () => {
  test("returns valid: true for a fully correct submission", () => {
    const result = validateContactForm({
      name: "Alex Rivera",
      email: "alex@example.com",
      message: "Hi, I saw your portfolio and would love to connect!",
      company: "",
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({ name: "", email: "", message: "" });
    expect(result.spam).toBe(false);
  });

  test("returns valid: false and collects all field errors", () => {
    const result = validateContactForm({ name: "", email: "bad-email", message: "short" });
    expect(result.valid).toBe(false);
    expect(result.errors.name).not.toBe("");
    expect(result.errors.email).not.toBe("");
    expect(result.errors.message).not.toBe("");
  });

  test("flags submission as spam when honeypot field is filled", () => {
    const result = validateContactForm({
      name: "Bot",
      email: "bot@example.com",
      message: "This is a spam message from a bot.",
      company: "I am a bot",
    });
    expect(result.spam).toBe(true);
    expect(result.valid).toBe(false);
  });

  test("handles missing fields gracefully without throwing", () => {
    expect(() => validateContactForm({})).not.toThrow();
    expect(() => validateContactForm(undefined)).not.toThrow();
  });
});
