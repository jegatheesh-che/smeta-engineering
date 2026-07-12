// Initialize Lenis for Smooth Scrolling
if (typeof Lenis !== "undefined") {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

document.addEventListener("DOMContentLoaded", () => {
  // Preloader Logic
  if (document.querySelector('.preloader')) {
    const preloaderTl = gsap.timeline();
    preloaderTl
      .to('.preloader__progress', { width: "100%", duration: 1.5, ease: "power2.inOut" })
      .to('.preloader__title', { opacity: 0, y: -20, duration: 0.5 }, "-=0.5")
      .to('.preloader', { yPercent: -100, duration: 1.2, ease: "power4.inOut" })
      .set('.preloader', { display: "none" });
  }

  // The "Editorial/Luxury" Vibe: Slow, elegant easing, clip-path reveals, no bounces.
  const tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, delay: 2.2 });

  // 1. Reveal image via clip path (from bottom up)
  tl.to(
    ".hero__image-wrapper",
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 2,
    },
    0,
  );

  // 2. Subtle slow scale down on the image inside
  tl.to(
    ".carousel",
    {
      scale: 1,
      duration: 2.5,
    },
    0,
  );

  // 3. Reveal typography (staggered lines)
  // We didn't split text by character, luxury often works well with line-by-line reveals
  gsap.set(".hero__title", { y: "100%" }); // start hidden below

  tl.to(
    ".hero__title",
    {
      y: "0%",
      duration: 1.5,
      stagger: 0.15,
    },
    0.5,
  );

  // 4. Fade in supporting elements
  tl.fromTo(
    [".hero__eyebrow", ".hero__desc", ".hero__cta"],
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger: 0.1,
    },
    1.2,
  );

  // Carousel crossfade logic
  const slides = document.querySelectorAll(".carousel__slide");
  if (slides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add("active");
    }, 4000);
  }

  // Text carousel for description
  const descElement = document.querySelector(".hero__desc");
  if (descElement) {
    const descTexts = [
      "Forever your reliable engineering associate.",
      "Engineering process outsourcing is our business.",
      "Delivering precision and excellence in every project.",
      "Your trusted partner in industrial innovation.",
    ];
    let descIndex = 0;

    // Start cycling after the initial load animation completes
    setTimeout(() => {
      setInterval(() => {
        gsap.to(descElement, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            descIndex = (descIndex + 1) % descTexts.length;
            descElement.textContent = descTexts[descIndex];
            gsap.to(descElement, { opacity: 1, duration: 0.4 });
          },
        });
      }, 2800);
    }, 3000);
  }

  // Nav scrolling logic
  const navContainer = document.querySelector(".nav__links-container");
  const leftArrow = document.querySelector(".nav__arrow--left");
  const rightArrow = document.querySelector(".nav__arrow--right");

  if (navContainer && leftArrow && rightArrow) {
    leftArrow.addEventListener("click", () => {
      navContainer.scrollBy({ left: -200, behavior: "smooth" });
    });
    rightArrow.addEventListener("click", () => {
      navContainer.scrollBy({ left: 200, behavior: "smooth" });
    });
  }

  // ScrollTrigger for About Section
  gsap.registerPlugin(ScrollTrigger);

  const aboutTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".about",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    defaults: { ease: "power3.out" },
  });

  aboutTl
    .fromTo(
      ".about__title",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
    )
    .fromTo(
      ".about__lead",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.7",
    )
    .fromTo(
      ".about__column p",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 },
      "-=0.5",
    );

  // ScrollTrigger for Services Section
  const servicesTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".services",
      start: "top 60%",
      toggleActions: "play none none reverse",
    },
    defaults: { ease: "power3.out" },
  });

  servicesTl
    .fromTo(
      ".services__title",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 },
    )
    .fromTo(
      ".neo-box",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.3 },
      "-=0.8",
    );

  // ScrollTrigger for Values Section
  const valuesTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".values",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    defaults: { ease: "power3.out" },
  });

  valuesTl.fromTo(
    ".values__box",
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, stagger: 0.3 },
  );

  // ScrollTrigger for Gallery Section
  const galleryTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".gallery",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    defaults: { ease: "power3.out" },
  });

  galleryTl
    .fromTo(
      ".gallery__title",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
    )
    .fromTo(
      ".gallery__values-list li",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2 },
      "-=0.5",
    )
    .fromTo(
      ".gallery__track",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5 },
      "-=0.3",
    );

  // ScrollTrigger for Video Section
  const videoTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".video-section",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    defaults: { ease: "power3.out" },
  });

  videoTl.fromTo(
    ".video-wrapper",
    { y: 50, scale: 0.95, opacity: 0 },
    { y: 0, scale: 1, opacity: 1, duration: 1 },
  );

  // Performance Optimization: Hide the heavy hero iframe when it's out of view
  // This stops it from rendering in the background and destroying GPU performance
  ScrollTrigger.create({
    trigger: ".about",
    start: "top top", // When .about reaches the top of viewport, hero is gone
    onEnter: () => {
      const iframe = document.querySelector(".bg-iframe");
      if (iframe) iframe.style.visibility = "hidden";
    },
    onLeaveBack: () => {
      const iframe = document.querySelector(".bg-iframe");
      if (iframe) iframe.style.visibility = "visible";
    },
  });

  // --- LIGHTBOX LOGIC ---
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  const galleryItems = document.querySelectorAll(".gallery__item img");

  if (lightbox && lightboxImg && galleryItems) {
    galleryItems.forEach((img) => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightbox.classList.add("active");
      });
    });

    lightboxClose.addEventListener("click", () => {
      lightbox.classList.remove("active");
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target !== lightboxImg) {
        lightbox.classList.remove("active");
      }
    });
  }

  // --- DESIGN & ENGINEERING PAGE ANIMATIONS ---
  if (document.querySelector(".de-discipline-grid")) {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero clip-path reveal + Ken burns
    const deHeroImg = document.querySelector(".glass-hero__img");
    const deHeroTitle = document.querySelector(".glass-hero__title");
    const deHeroText = document.querySelector(".glass-hero__text");

    if (deHeroImg) {
      const deHeroTl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

      deHeroTl
        .fromTo(
          deHeroImg,
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.1 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 2 },
        )
        .fromTo(
          [deHeroTitle, deHeroText],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.2 },
          "-=1",
        );
    }

    // 2. Intro band fade in
    gsap.from(".de-intro-title, .de-intro-text", {
      scrollTrigger: {
        trigger: ".de-intro-section",
        start: "top 80%",
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
    });

    // 3. Discipline Cards
    const cards = document.querySelectorAll(".de-discipline-card");
    cards.forEach((card) => {
      const imgWrapper = card.querySelector(
        ".de-discipline-card__image-wrapper",
      );
      const title = card.querySelector(".de-discipline-card__title");
      const listItems = card.querySelectorAll(".de-discipline-card__list li");
      const contentPanel = card.querySelector(
        ".de-discipline-card__content-panel",
      );

      // Card panel enter reveal
      gsap.fromTo(
        contentPanel,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
          },
        },
      );

      // Text stagger
      gsap.fromTo(
        [title, ...listItems],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentPanel,
            start: "top 70%",
          },
        },
      );

      // Image Parallax (scrub)
      gsap.to(imgWrapper, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // 4. CTA Strip
    gsap.from(".de-cta-strip__content", {
      scrollTrigger: {
        trigger: ".de-cta-strip",
        start: "top 85%",
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }

  // --- PROJECTS PAGE ANIMATIONS ---
  if (document.querySelector(".pj-regions-section")) {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero clip-path reveal
    const pjHeroImg = document.querySelector(".pj-hero .glass-hero__img");
    const pjHeroTitle = document.querySelector(".pj-hero .glass-hero__title");
    const pjHeroText = document.querySelector(".pj-hero .glass-hero__text");

    if (pjHeroImg) {
      const pjHeroTl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
      pjHeroTl
        .fromTo(
          pjHeroImg,
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.1 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 2 },
        )
        .fromTo(
          [pjHeroTitle, pjHeroText],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.2 },
          "-=1",
        );
    }

    // 2. Stats Strip Counters
    const stats = document.querySelectorAll(".pj-stat__number");
    if (stats.length > 0) {
      ScrollTrigger.create({
        trigger: ".pj-stats-strip",
        start: "top 85%",
        once: true,
        onEnter: () => {
          stats.forEach((stat) => {
            const target = parseInt(stat.getAttribute("data-target"), 10);
            gsap.to(stat, {
              innerHTML: target,
              duration: 2,
              ease: "power2.out",
              snap: { innerHTML: 1 },
              onUpdate: function () {
                stat.innerHTML = Math.round(stat.innerHTML);
              },
            });
          });

          gsap.fromTo(
            ".pj-stat",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power2.out" },
          );
        },
      });
    }

    // 3. Accordion Logic
    const accordions = document.querySelectorAll(".pj-accordion");
    accordions.forEach((acc) => {
      const header = acc.querySelector(".pj-accordion-header");
      const body = acc.querySelector(".pj-accordion-body");
      const content = acc.querySelector(".pj-accordion-body__content");

      // Set initial state
      if (acc.classList.contains("expanded")) {
        gsap.set(body, { height: "auto" });
      }

      // Scroll reveal for headers
      gsap.fromTo(
        header,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: acc,
            start: "top 85%",
          },
        },
      );

      header.addEventListener("click", () => {
        const isExpanded = acc.classList.contains("expanded");

        // Close all others
        accordions.forEach((otherAcc) => {
          if (otherAcc !== acc && otherAcc.classList.contains("expanded")) {
            otherAcc.classList.remove("expanded");
            gsap.to(otherAcc.querySelector(".pj-accordion-body"), {
              height: 0,
              duration: 0.5,
              ease: "power3.inOut",
            });
          }
        });

        // Toggle current
        if (isExpanded) {
          acc.classList.remove("expanded");
          gsap.to(body, { height: 0, duration: 0.5, ease: "power3.inOut" });
        } else {
          acc.classList.add("expanded");
          gsap.to(body, {
            height: "auto",
            duration: 0.5,
            ease: "power3.inOut",
          });
        }
      });
    });

    // 4. Highlight Section
    gsap.fromTo(
      ".pj-highlight-title",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".pj-highlight-section",
          start: "top 75%",
        },
      },
    );

    // 5. CTA
    gsap.fromTo(
      [".de-cta-strip__title", ".de-cta-strip__btn"],
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".de-cta-strip",
          start: "top 85%",
        },
      },
    );
  }
});
