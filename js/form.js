/**
 * Contacts form — validation + submit to Cloudflare Worker (Resend).
 */

const CONTACT_API_URL = "https://aximatrix-contact.armenfin97.workers.dev/";

const SELECTORS = {
  form: ".contacts__form",
  input: ".contacts__input",
  submit: ".contacts__submit",
};

const CLASSES = {
  filled: "is-filled",
  valid: "is-valid",
  invalid: "is-invalid",
  submitting: "is-submitting",
  messageVisible: "is-visible",
  messageSuccess: "is-success",
};

const MESSAGES = {
  required: "This field is required.",
  email: "Enter a valid email address.",
  sendError: "Could not send. Please try again.",
  sendSuccess: "Sent. We'll get back to you.",
};

/**
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function validateField(input) {
  const value = input.value.trim();
  let isValid = true;
  let message = "";

  if (!value) {
    isValid = false;
    message = MESSAGES.required;
  } else if (input.type === "email" && !input.checkValidity()) {
    isValid = false;
    message = MESSAGES.email;
  }

  input.classList.toggle(CLASSES.filled, value.length > 0);
  input.classList.toggle(CLASSES.valid, isValid && value.length > 0);
  input.classList.toggle(CLASSES.invalid, !isValid);
  input.setAttribute("aria-invalid", String(!isValid));

  const messageEl = input
    .closest(".contacts__field")
    ?.querySelector(".contacts__field-message");

  if (messageEl) {
    messageEl.textContent = isValid ? "" : message;
    messageEl.classList.toggle(CLASSES.messageVisible, !isValid);
    messageEl.classList.remove(CLASSES.messageSuccess);
  }

  return isValid;
}

/**
 * @param {HTMLInputElement} input
 */
function updateFilledState(input) {
  const hasValue = input.value.trim().length > 0;
  input.classList.toggle(CLASSES.filled, hasValue);

  if (hasValue && input.classList.contains(CLASSES.invalid)) {
    validateField(input);
  }
}

/**
 * @param {HTMLFormElement} form
 * @param {string} text
 * @param {boolean} success
 */
function showFormStatus(form, text, success) {
  const messageEl = form.querySelector("#contacts-message-message");

  if (!messageEl) {
    return;
  }

  messageEl.textContent = text;
  messageEl.classList.add(CLASSES.messageVisible);
  messageEl.classList.toggle(CLASSES.messageSuccess, success);
}

/**
 * @param {HTMLFormElement} form
 * @param {NodeListOf<HTMLInputElement>} inputs
 */
function resetFormState(form, inputs) {
  form.reset();
  inputs.forEach((input) => {
    input.classList.remove(CLASSES.filled, CLASSES.valid, CLASSES.invalid);
    input.removeAttribute("aria-invalid");
  });
}

/**
 * Initialize contacts form interactions.
 */
export function initForm() {
  const form = document.querySelector(SELECTORS.form);

  if (!form) {
    return;
  }

  const inputs = form.querySelectorAll(SELECTORS.input);
  const submitButton = form.querySelector(SELECTORS.submit);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      updateFilledState(input);
    });

    input.addEventListener("blur", () => {
      if (input.value.trim() || input.classList.contains(CLASSES.invalid)) {
        validateField(input);
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let isFormValid = true;

    inputs.forEach((input) => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      const firstInvalid = form.querySelector(`.${CLASSES.invalid}`);

      if (firstInvalid instanceof HTMLInputElement) {
        firstInvalid.focus();
      }

      return;
    }

    if (submitButton) {
      submitButton.classList.add(CLASSES.submitting);
      submitButton.disabled = true;
    }

    const payload = {
      name: form.name?.value?.trim() || "",
      email: form.email?.value?.trim() || "",
      message: form.message?.value?.trim() || "",
      company: form.company?.value?.trim() || "",
    };

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(data.error || MESSAGES.sendError);
      }

      resetFormState(form, inputs);
      showFormStatus(form, MESSAGES.sendSuccess, true);
    } catch {
      showFormStatus(form, MESSAGES.sendError, false);
    } finally {
      if (submitButton) {
        submitButton.classList.remove(CLASSES.submitting);
        submitButton.disabled = false;
      }
    }
  });
}
