document.addEventListener('DOMContentLoaded', () => {
  const timestamp = document.getElementById('timestamp');
  if (timestamp) {
    const now = new Date();

    const formatted = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');
    timestamp.value = formatted;
  }
});

function openModal(modal) {
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  modal._lastFocus = document.activeElement;
  const focusable = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) focusable[0].focus();
  modal.addEventListener('keydown', trapFocus);
}

function closeModal(modal) {
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  modal.removeEventListener('keydown', trapFocus);
  if (modal._lastFocus) modal._lastFocus.focus();
}

function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const modal = e.currentTarget;
  const focusable = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

document.querySelectorAll('.benefits-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const modalId = btn.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) openModal(modal);
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.querySelector('.close-modal').addEventListener('click', () => closeModal(modal));
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal(modal);
  });
  modal.addEventListener('mousedown', e => {
    if (e.target === modal) closeModal(modal);
  });
});

document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});