// Set timestamp field on page load
document.addEventListener('DOMContentLoaded', () => {
  const timestamp = document.getElementById('timestamp');
  if (timestamp) {
    const now = new Date();
    // Format: YYYY-MM-DD HH:MM:SS
    const formatted = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');
    timestamp.value = formatted;
  }
});

// Modal logic
function openModal(modal) {
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  // Save last focused element
  modal._lastFocus = document.activeElement;
  // Focus first focusable element in modal
  const focusable = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) focusable[0].focus();
  // Trap focus
  modal.addEventListener('keydown', trapFocus);
}

function closeModal(modal) {
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  modal.removeEventListener('keydown', trapFocus);
  // Restore focus
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

// Open modal on button click
document.querySelectorAll('.benefits-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const modalId = btn.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) openModal(modal);
  });
});

// Close modal on close button or ESC
document.querySelectorAll('.modal').forEach(modal => {
  // Close on close button
  modal.querySelector('.close-modal').addEventListener('click', () => closeModal(modal));
  // Close on ESC
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal(modal);
  });
  // Prevent click outside modal-content from closing (optional)
  modal.addEventListener('mousedown', e => {
    if (e.target === modal) closeModal(modal);
  });
});