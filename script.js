const header = document.querySelector('.site-header');
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
});

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// Paddle Checkout. Only a Paddle client-side token is exposed in the browser.
const paddleConfig = window.STALYSTECH_PADDLE || {};
let paddleReady = false;

try {
  if (window.Paddle && paddleConfig.clientToken && !paddleConfig.clientToken.startsWith('PASTE_')) {
    if (paddleConfig.environment === 'sandbox') Paddle.Environment.set('sandbox');
    Paddle.Initialize({
      token: paddleConfig.clientToken,
      eventCallback: (event) => {
        if (event?.name === 'checkout.completed') {
          window.location.href = '/purchase-success.html';
        }
      }
    });
    paddleReady = true;
  }
} catch (error) {
  console.error('Paddle initialization failed', error);
}

document.querySelectorAll('.purchase-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const productKey = button.dataset.product;
    const priceId = paddleConfig.prices?.[productKey];

    if (!paddleReady || !priceId || priceId.startsWith('PASTE_')) {
      alert('Checkout is being configured. Please check back shortly.');
      return;
    }

    Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: {
        stalystech_product: productKey,
        source: 'stalystech.com'
      },
      settings: {
        displayMode: 'overlay',
        theme: 'dark'
      }
    });
  });
});

// Keep a copy in Netlify Forms and optionally forward the same message to n8n.
const contactForm = document.querySelector('.contact-form');
const contactStatus = document.getElementById('contact-status');
if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());
    submit.disabled = true;
    submit.textContent = 'Sending…';
    contactStatus.textContent = '';

    try {
      // Netlify Forms capture.
      const encoded = new URLSearchParams();
      for (const [key, value] of formData.entries()) encoded.append(key, value);
      const netlifyResponse = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encoded.toString(),
      });
      if (!netlifyResponse.ok) throw new Error('Unable to submit the form.');

      // Optional n8n forwarding. Failure here does not lose the Netlify submission.
      fetch('/.netlify/functions/contact-forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});

      contactForm.reset();
      contactStatus.textContent = 'Message sent. We’ll get back to you soon.';
    } catch (error) {
      contactStatus.textContent = error.message || 'Something went wrong. Please try again.';
    } finally {
      submit.disabled = false;
      submit.textContent = 'Send message';
    }
  });
}
