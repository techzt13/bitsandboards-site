const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const dialog = document.querySelector('#join-dialog');
const form = document.querySelector('#join-form');
const formView = document.querySelector('#join-form-view');
const confirmation = document.querySelector('#join-confirmation');
const formError = document.querySelector('#join-error');
const submitButton = document.querySelector('.form-submit');
const closeButton = document.querySelector('.dialog-close');
let lastTrigger;
let submitting = false;

function closeMenu() {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}

menuToggle.addEventListener('click', () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
});

mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.querySelectorAll('.join-trigger').forEach((button) => {
  button.addEventListener('click', () => {
    lastTrigger = button.closest('#mobile-nav') ? menuToggle : button;
    closeMenu();
    form.reset();
    formView.hidden = false;
    confirmation.hidden = true;
    formError.hidden = true;
    dialog.setAttribute('aria-labelledby', 'join-title');
    dialog.showModal();
    document.querySelector('#join-name').focus();
  });
});

closeButton.addEventListener('click', () => dialog.close());
document.querySelector('.close-confirmation').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog && !submitting) dialog.close();
});
dialog.addEventListener('cancel', (event) => {
  if (submitting) event.preventDefault();
});
dialog.addEventListener('close', () => {
  if (dialog.open) return;
  form.reset();
  if (lastTrigger) lastTrigger.focus();
});
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submitting) return;
  submitting = true;
  formError.hidden = true;
  submitButton.disabled = true;
  closeButton.disabled = true;
  submitButton.textContent = 'Sending…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    let result;
    try {
      result = await response.json();
    } catch (error) {
      console.error('Invalid Formspree response:', error);
      throw new Error('Formspree returned an unexpected response. Your request may not have been received.');
    }
    const errors = Array.isArray(result?.errors)
      ? result.errors.map((item) => item?.message).filter((message) => typeof message === 'string')
      : [];
    if (typeof result?.error === 'string') errors.push(result.error);
    if (!response.ok || (Array.isArray(result?.errors) && result.errors.length) || typeof result?.error === 'string') {
      throw new Error(errors.join(' ') || `Formspree rejected the request (HTTP ${response.status}).`);
    }
    if (typeof result?.next !== 'string' && result?.ok !== true) {
      throw new Error('Formspree returned an unexpected response. Your request may not have been received.');
    }
    formView.hidden = true;
    confirmation.hidden = false;
    dialog.setAttribute('aria-labelledby', 'confirmation-title');
    document.querySelector('.close-confirmation').focus();
  } catch (error) {
    console.error('Join request failed:', error);
    formError.textContent = error instanceof Error && error.name !== 'AbortError' && !(error instanceof TypeError)
      ? error.message
      : 'We could not confirm your request was sent. Check your connection before trying again.';
    formError.hidden = false;
  } finally {
    clearTimeout(timeout);
    submitting = false;
    submitButton.disabled = false;
    closeButton.disabled = false;
    submitButton.textContent = 'Send join request ↗';
  }
});

const previews = {
  hardware: ['make something_cool', "→   curiosity detected. let's build."],
  code: ['deploy first_project', '→   ideas online. ready to share.'],
};
document.querySelectorAll('.spec-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('#terminal-command').textContent = previews[button.dataset.preview][0];
    document.querySelector('#terminal-result').textContent = previews[button.dataset.preview][1];
    document.querySelectorAll('.spec-toggle').forEach((toggle) => {
      const active = toggle === button;
      toggle.classList.toggle('active', active);
      toggle.setAttribute('aria-pressed', String(active));
    });
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.documentElement.classList.add('js-animations');
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}
