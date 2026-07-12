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
    gsap.timeline()
      .to('.preloader__progress', { width: "100%", duration: 1.5, ease: "power2.inOut" })
      .to('.preloader__title', { opacity: 0, y: -20, duration: 0.5 }, "-=0.5")
      .to('.preloader', { yPercent: -100, duration: 1.2, ease: "power4.inOut" })
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

  // 3. Setup Hero Reveal
  const heroOverlay = document.querySelector(".glass-hero__overlay");
  const heroImg = document.querySelector(".glass-hero__img");

  // Ensure visibility is reset before animating
  gsap.set(heroOverlay, { opacity: 0, y: 30 });
  gsap.set(heroImg, { scale: 1.1 });

  // 4. Master Timeline (Hero Reveal)
  const masterTl = gsap.timeline({ delay: 0.2 });

  // Animate image zoom out
  masterTl
    .to(
      heroImg,
      {
        scale: 1,
        duration: 2,
        ease: "power2.out",
      },
      0,
    )
    // Fade and slide up the glass overlay (containing title and text)
    .to(
      heroOverlay,
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out",
      },
      0.3,
    )
    // Fade in nav instantly - no delay
    .to(".nav", { opacity: 1, duration: 0.01 }, 0);

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
