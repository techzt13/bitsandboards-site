const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const dialog = document.querySelector('#join-dialog');
const form = document.querySelector('#join-form');
const formView = document.querySelector('#join-form-view');
const confirmation = document.querySelector('#join-confirmation');
let lastTrigger;

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
    dialog.showModal();
    document.querySelector('#join-name').focus();
  });
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
document.querySelector('.close-confirmation').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  form.reset();
  if (lastTrigger) lastTrigger.focus();
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  formView.hidden = true;
  confirmation.hidden = false;
  document.querySelector('.close-confirmation').focus();
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
