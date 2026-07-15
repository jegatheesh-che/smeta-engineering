/* 
    INDUSTRIES SERVED PAGE ANIMATIONS
    Vibe: Editorial / Luxury 
    Easing: power2.out (general), power3.inOut (cinematic hero)
*/

document.addEventListener("DOMContentLoaded", () => {
  // 1. Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  // Preloader Logic
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    const preloaderTitle = document.querySelector('.preloader__title');
    const text = preloaderTitle.textContent.trim();
    
    // Wrap characters in an overflow hidden span for the "rise up" reveal
    preloaderTitle.innerHTML = text.split('').map(char => 
      `<span style="display:inline-block; overflow:hidden; vertical-align:top;">
         <span class="char" style="display:inline-block">${char}</span>
       </span>`
    ).join('');

    // Hide old progress bar
    const oldBar = document.querySelector('.preloader__bar');
    if (oldBar) oldBar.style.display = 'none';

    const content = document.querySelector('.preloader__content');
    content.style.position = 'relative';
    content.style.width = '280px';
    content.style.height = '280px';
    content.style.justifyContent = 'center';
    content.style.gap = '0.5rem';

    // Add a percentage counter
    const counter = document.createElement('div');
    counter.style.position = 'relative';
    counter.style.zIndex = '2';
    counter.style.fontFamily = 'var(--font-display)';
    counter.style.fontSize = '1rem';
    counter.style.letterSpacing = '2px';
    counter.style.color = 'var(--color-text)';
    counter.innerText = '0%';
    content.appendChild(counter);

    preloaderTitle.style.position = 'relative';
    preloaderTitle.style.zIndex = '2';

    // Create a large circle SVG that wraps the whole word and counter
    const svgHTML = `
      <svg class="progress-shape" width="280" height="280" viewBox="0 0 280 280" style="position:absolute; top:0; left:0; pointer-events:none; z-index:0;">
        <circle cx="140" cy="140" r="138" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="1"></circle>
        <circle class="progress-shape__path" cx="140" cy="140" r="138" fill="none" stroke="var(--color-text, #000)" stroke-width="2" stroke-dasharray="868" stroke-dashoffset="868" stroke-linecap="round" transform="rotate(-90 140 140)"></circle>
      </svg>
    `;
    content.insertAdjacentHTML('afterbegin', svgHTML);

    const shapePath = content.querySelector('.progress-shape__path');
    const shapeSvg = content.querySelector('.progress-shape');
    const obj = { count: 0 };
    const preloaderTl = gsap.timeline();
    
    preloaderTl
      .fromTo('.preloader__title .char', 
        { y: "100%" },
        { y: "0%", duration: 1, stagger: 0.08, ease: 'power3.out' }
      )
      .to(obj, { 
        count: 100, 
        duration: 1.5, 
        ease: "power2.inOut",
        onUpdate: () => {
          counter.innerText = Math.round(obj.count) + '%';
        }
      }, "<0.2")
      .to(shapePath, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, "<")
      .to(shapeSvg, { rotation: 90, duration: 1.5, ease: "power2.inOut" }, "<")
      .to('.preloader__title .char', { y: "-100%", duration: 0.6, stagger: 0.04, ease: 'power3.in' }, "+=0.3")
      .to(counter, { opacity: 0, y: -20, duration: 0.4 }, "<")
      .to(shapeSvg, { opacity: 0, scale: 0.8, duration: 0.4 }, "<")
      .to('.preloader', { clipPath: "inset(0% 0% 100% 0%)", duration: 1.2, ease: "power4.inOut" }, "-=0.2")
      .set('.preloader', { display: "none" });
  }

  // 2. Reduce motion check
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    // Fallback for accessibility
    gsap.set(".industries__title, .industries__intro, .ind-list li, .nav", {
      visibility: "visible",
      opacity: 1,
      y: 0,
    });
    return;
  }

  // 3. Master Timeline (Hero Reveal)
  const masterTl = gsap.timeline({ delay: 0.2, defaults: { ease: 'power3.out' } });

  // Animate the content-box elements
  masterTl
    /* Title words rise from clip */
    .to('.content-box__word', {
      y: '0%',
      duration: 1.1,
      stagger: 0.14,
      ease: 'power4.out'
    }, 0)
    /* Gold rule expands */
    .to('.content-box__rule', {
      scaleX: 1,
      duration: 0.7,
      ease: 'power2.inOut'
    }, 0.5)
    /* Description fades up */
    .to('.content-box__desc', {
      opacity: 1,
      y: 0,
      duration: 0.9
    }, 0.6)
    /* Image clips open upward */
    .to('.content-box__img-clip', {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.3,
      ease: 'power4.inOut'
    }, 0)
    /* Image settles (zoom out) */
    .to('.content-box__img', {
      scale: 1,
      duration: 2.2,
      ease: 'power2.out'
    }, 0.1)
    /* Fade in nav instantly */
    .to('.nav', { opacity: 1, duration: 0.01 }, 0);

  // 5. ScrollTrigger Stagger for Industry Lists
  const sections = document.querySelectorAll(".ind-section");

  sections.forEach((section) => {
    const listItems = section.querySelectorAll(".ind-list li");

    if (listItems.length > 0) {
      gsap.fromTo(
        listItems,
        {
          opacity: 0,
          y: 30,
        },
        {
          scrollTrigger: {
            trigger: section,
            start: "top 95%", // Trigger earlier
            toggleActions: "play none none none", // Play once and stay visible
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1, // Stagger each list item
        },
      );
    }

    // Optional: fade in the index number softly
    const indexNum = section.querySelector(".ind-section__index");
    if (indexNum) {
      gsap.fromTo(
        indexNum,
        {
          opacity: 0,
          x: -20,
        },
        {
          scrollTrigger: {
            trigger: section,
            start: "top 95%",
            toggleActions: "play none none none",
          },
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
        },
      );
    }
  });

  // Cleanup on unmount (best practice)
  window.addEventListener("unload", () => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
  });
});
