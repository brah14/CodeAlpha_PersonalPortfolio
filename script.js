// Enable one-time hero animations after JavaScript is available.
document.body.classList.add('js-enabled');

window.addEventListener(
  'load',
  () => {
    requestAnimationFrame(() => document.body.classList.add('page-ready'));
  },
  { once: true },
);

// Reveal sections as they enter the viewport.
const fadeElements = document.querySelectorAll('.fade');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  fadeElements.forEach((element) => observer.observe(element));
} else {
  fadeElements.forEach((element) => element.classList.add('visible'));
}

// Replace Lucide icon placeholders after the page loads.
lucide.createIcons();

// Toggle the navigation menu on smaller screens.
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');

  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute(
    'aria-label',
    isOpen ? 'Close navigation menu' : 'Open navigation menu',
  );
});

navLinks?.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    navLinks.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation menu');
  }
});

// Submit the contact form to Formspree.
async function sendMessage(event) {
  event.preventDefault();

  const name = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const message = document.getElementById('f-message').value.trim();
  const button = document.getElementById('send-btn');
  const successMessage = document.getElementById('form-success');
  const errorMessage = document.getElementById('form-error');

  successMessage.hidden = true;

  if (!name || !email || !message || !email.includes('@')) {
    errorMessage.textContent =
      'Please enter your name, a valid email address, and a message.';
    errorMessage.hidden = false;
    return;
  }

  button.textContent = 'Sending...';
  button.disabled = true;
  errorMessage.hidden = true;

  try {
    const response = await fetch('https://formspree.io/f/xqenvgzz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (response.ok) {
      successMessage.hidden = false;
      document.getElementById('contact-form').reset();
    } else {
      errorMessage.hidden = false;
    }
  } catch (error) {
    errorMessage.hidden = false;
  } finally {
    button.innerHTML = `
      <span>
        <i data-lucide="send" aria-hidden="true"></i>
        Send Message
      </span>
    `;
    button.disabled = false;
    lucide.createIcons();
  }
}

document
  .getElementById('contact-form')
  ?.addEventListener('submit', sendMessage);
