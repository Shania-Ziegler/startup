// Lumi's eyes follow the pointer. Placeholder behavior until the React deliverable.

const lumis = document.querySelectorAll('.lumi:not(.lumi-target)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Largest eye shift in pixels, reached once the pointer is this far away
const maxShift = 4;
const fullReach = 200;

function lookAt(event) {
  if (reduceMotion.matches) return;

  for (const lumi of lumis) {
    const box = lumi.getBoundingClientRect();
    const dx = event.clientX - (box.left + box.width / 2);
    const dy = event.clientY - (box.top + box.height / 2);
    const distance = Math.hypot(dx, dy) || 1;
    const shift = maxShift * Math.min(1, distance / fullReach);

    lumi.style.setProperty('--look-x', `${(dx / distance) * shift}px`);
    lumi.style.setProperty('--look-y', `${(dy / distance) * shift}px`);
    lumi.classList.add('is-watching');
  }
}

function lookAhead() {
  for (const lumi of lumis) {
    lumi.style.removeProperty('--look-x');
    lumi.style.removeProperty('--look-y');
    lumi.classList.remove('is-watching');
  }
}

window.addEventListener('pointermove', lookAt, { passive: true });
document.documentElement.addEventListener('pointerleave', lookAhead);
