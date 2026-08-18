import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Fade + translate-up reveal for section elements */
export function revealSection(
  elements: HTMLElement | HTMLElement[] | string,
  trigger: HTMLElement | string,
  options?: { delay?: number; stagger?: number; y?: number }
) {
  const { delay = 0, stagger = 0.12, y = 28 } = options ?? {};

  return gsap.fromTo(
    elements,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration: 0.85,
      delay,
      stagger,
      ease: 'power2.out',
      scrollTrigger: {
        trigger,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    }
  );
}

/** Count-up animation — animates a number from 0 to end */
export function countUp(
  element: HTMLElement,
  end: number,
  suffix: string,
  trigger: HTMLElement,
  decimals = 0
) {
  const proxy = { val: 0 };
  return gsap.to(proxy, {
    val: end,
    duration: 1.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger,
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
    onUpdate: () => {
      element.textContent = proxy.val.toFixed(decimals) + suffix;
    },
    onComplete: () => {
      element.textContent = end.toFixed(decimals) + suffix;
    },
  });
}

/** Horizontal line draw animation */
export function drawLine(
  element: HTMLElement,
  trigger: HTMLElement,
  delay = 0
) {
  return gsap.fromTo(
    element,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1,
      duration: 0.9,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
}

/** Clip reveal — unmasks element from bottom */
export function clipReveal(element: HTMLElement, trigger: HTMLElement, delay = 0) {
  return gsap.fromTo(
    element,
    { clipPath: 'inset(100% 0 0 0)' },
    {
      clipPath: 'inset(0% 0 0 0)',
      duration: 0.9,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    }
  );
}
