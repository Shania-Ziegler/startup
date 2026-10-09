import { useEffect, useRef } from 'react';

const MAX_SHIFT = 4;
const FULL_REACH = 200;

/**
 * Makes one element's eyes follow the pointer by setting the --look-x and
 * --look-y custom properties that app.css reads.
 *
 * Returns a ref to attach to the element that should watch.
 * 
 * we will update this hook accordingly.
 */
export function useLookAtPointer() {
  const ref = useRef(null);

  useEffect(() => {
    const lumi = ref.current;
    if (!lumi) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function lookAt(event) {
      if (reduceMotion.matches) return;

      const box = lumi.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      const shift = MAX_SHIFT * Math.min(1, distance / FULL_REACH);

      lumi.style.setProperty('--look-x', `${(dx / distance) * shift}px`);
      lumi.style.setProperty('--look-y', `${(dy / distance) * shift}px`);
      lumi.classList.add('is-watching');
    }

    function lookAhead() {
      lumi.style.removeProperty('--look-x');
      lumi.style.removeProperty('--look-y');
      lumi.classList.remove('is-watching');
    }

    window.addEventListener('pointermove', lookAt, { passive: true });
    document.documentElement.addEventListener('pointerleave', lookAhead);
//clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener('pointermove', lookAt);
      document.documentElement.removeEventListener('pointerleave', lookAhead);
    };
  }, []);

  return ref;
}