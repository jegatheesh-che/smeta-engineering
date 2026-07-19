// Initialize Lenis for Smooth Scrolling
if (typeof Lenis !== "undefined" && window.innerWidth > 900) {
  const lenis = new Lenis({
    duration: 0.6,
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
  // Fix 11: Mark body as JS-ready so CSS fallback states don't apply
  document.body.classList.add('js-ready');

  // "See More" Card Expansion Logic
  document.querySelectorAll('.neo-box__read-more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.neo-box, .values__box');
      if (card) {
        card.classList.add('is-expanded');
      }
    });
  });

  document.querySelectorAll('.neo-box__close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.neo-box, .values__box');
      if (card) {
        card.classList.remove('is-expanded');
      }
    });
  });

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
        { y: "0%", duration: 0.5, stagger: 0.04, ease: 'power3.out' }
      )
      .to(obj, { 
        count: 100, 
        duration: 0.75, 
        ease: "power2.inOut",
        onUpdate: () => {
          counter.innerText = Math.round(obj.count) + '%';
        }
      }, "<0.2")
      .to(shapePath, { strokeDashoffset: 0, duration: 0.75, ease: "power2.inOut" }, "<")
      .to(shapeSvg, { rotation: 90, duration: 0.75, ease: "power2.inOut" }, "<")
      .to('.preloader__title .char', { y: "-100%", duration: 0.3, stagger: 0.02, ease: 'power3.in' }, "+=0.3")
      .to(counter, { opacity: 0, y: -20, duration: 0.2 }, "<")
      .to(shapeSvg, { opacity: 0, scale: 0.8, duration: 0.2 }, "<")
      .to('.preloader', { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6, ease: "power4.inOut" }, "-=0.2")
      .set('.preloader', { display: "none" });
  }

  // Mobile Nav Toggle Logic
  const navHamburger = document.querySelector('.nav__hamburger');
  const nav = document.querySelector('.nav');
  
  if (navHamburger) {
    navHamburger.addEventListener('click', () => {
      nav.classList.toggle('is-active');
      
      if (nav.classList.contains('is-active')) {
        document.body.style.overflow = 'hidden';
        
        // Elegant staggered reveal for links
        gsap.fromTo('.nav__links-container .nav__link', 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out', overwrite: true }
        );
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  // The "Editorial/Luxury" Vibe: Slow, elegant easing, clip-path reveals, no bounces.
  const tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, delay: 2.2 });

  // 1. Reveal image via clip path (from bottom up)
  tl.to(
    ".hero__image-wrapper",
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1,
    },
    0,
  );

  // 2. Subtle slow scale down on the image inside
  tl.to(
    ".carousel",
    {
      scale: 1,
      duration: 1.25,
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
      duration: 0.75,
      stagger: 0.07,
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
      duration: 0.75,
      stagger: 0.05,
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
          duration: 0.2,
          onComplete: () => {
            descIndex = (descIndex + 1) % descTexts.length;
            descElement.textContent = descTexts[descIndex];
            gsap.to(descElement, { opacity: 1, duration: 0.2 });
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
      { y: 0, opacity: 1, duration: 0.5 },
    )
    .fromTo(
      ".about__lead",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.7",
    )
    .fromTo(
      ".about__column p",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.07 },
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
      { y: 0, opacity: 1, duration: 0.6 },
    )
    .fromTo(
      ".neo-box",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.15 },
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
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
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
      { y: 0, opacity: 1, duration: 0.5 },
    )
    .fromTo(
      ".gallery__values-list li",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
      "-=0.5",
    )
    .fromTo(
      ".gallery__track",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75 },
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
    { y: 0, scale: 1, opacity: 1, duration: 0.5 },
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
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1 },
        )
        .fromTo(
          [deHeroTitle, deHeroText],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
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
      duration: 0.5,
      stagger: 0.1,
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
          duration: 0.75,
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
          duration: 0.4,
          stagger: 0.03,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentPanel,
            start: "top 70%",
          },
        },
      );

      const img = card.querySelector(".de-discipline-card__image-wrapper img");

      // Image Zoom-Out (Enter Animation)
      gsap.fromTo(
        img,
        { scale: 1.25 },
        {
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
          },
        }
      );

      // Image Parallax (scrub) - Apply to ALL cards
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

      if (img.id === "plumbing-img") {
        // Special top-to-bottom pan for the tall plumbing image
        gsap.set(img, { objectPosition: "50% 0%" });
        gsap.to(img, {
          objectPosition: "50% 100%",
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    // 4. CTA Strip
    gsap.from(".de-cta-strip__content", {
      scrollTrigger: {
        trigger: ".de-cta-strip",
        start: "top 85%",
      },
      y: 50,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out",
    });
  }

  // --- PROJECTS PAGE ANIMATIONS ---
  if (document.querySelector(".pj-regions-section")) {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero clip-path reveal (content-box UI)
    const contentBoxImgClip = document.querySelector('.content-box__img-clip');
    if (contentBoxImgClip) {
      // Calculate delay based on preloader existence, same as global
      const delay = document.querySelector('.preloader') ? 2.6 : 0.3;
      const pjHeroTl = gsap.timeline({ delay: delay, defaults: { ease: 'power3.out' } });

      pjHeroTl
        /* Title words rise from clip */
        .to('.content-box__word', {
          y: '0%',
          duration: 0.55,
          stagger: 0.07,
          ease: 'power4.out'
        })
        /* Gold rule expands */
        .to('.content-box__rule', {
          scaleX: 1,
          duration: 0.35,
          ease: 'power2.inOut'
        }, '-=0.6')
        /* Description fades up */
        .to('.content-box__desc', {
          opacity: 1,
          y: 0,
          duration: 0.45
        }, '-=0.5')
        /* Image clips open upward */
        .to('.content-box__img-clip', {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.65,
          ease: 'power4.inOut'
        }, '-=1.3')
        /* Image settles (zoom out) */
        .to('.content-box__img', {
          scale: 1,
          duration: 1.1,
          ease: 'power2.out'
        }, '-=1.2');
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
              duration: 1,
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
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
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
          duration: 0.4,
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
              duration: 0.1,
              ease: "power3.inOut",
            });
          }
        });

        // Toggle current
        if (isExpanded) {
          acc.classList.remove("expanded");
          gsap.to(body, { height: 0, duration: 0.1, ease: "power3.inOut" });
        } else {
          acc.classList.add("expanded");
          gsap.to(body, {
            height: "auto",
            duration: 0.1,
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
        duration: 0.6,
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
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".de-cta-strip",
          start: "top 85%",
        },
      },
    );
  }

  // Footer Animated Line
  const footerLine = document.querySelector(".footer__animated-line");
  if (footerLine) {
    gsap.to(footerLine, {
      width: "100%",
      duration: 0.75,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: ".footer",
        start: "top 95%",
      },
    });
  }

  // Contact Page Animations
  const contactHero = document.querySelector(".contact-hero__overlay");
  if (contactHero) {
    gsap.from(contactHero.children, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.2
    });
  }

  const contactForm = document.querySelector(".contact-form-container");
  if (contactForm) {
    gsap.from(contactForm.children, {
      scrollTrigger: {
        trigger: contactForm,
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: "power3.out"
    });
  }

  const contactDetails = document.querySelector(".contact-details-container");
  if (contactDetails) {
    gsap.from(contactDetails.children, {
      scrollTrigger: {
        trigger: contactDetails,
        start: "top 80%",
      },
      x: 40,
      opacity: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: "power3.out"
    });
  }

  // Premium Corporate Hero Logic (Vanilla JS)
  const premiumHero = document.querySelector(".premium-hero");
  if (premiumHero) {
    const animItems = premiumHero.querySelectorAll(".anim-item, .anim-image");
    const statNums = premiumHero.querySelectorAll(".stat-num");

    // Number counting animation
    const animateValue = (obj, start, end, duration) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          obj.innerHTML = end;
        }
      };
      window.requestAnimationFrame(step);
    };

    const heroObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger reveal animations
          animItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add("is-visible");
            }, index * 200); // 200ms stagger
          });

          // Animate statistics numbers
          statNums.forEach(stat => {
            const target = parseInt(stat.getAttribute("data-target") || 0, 10);
            animateValue(stat, 0, target, 2000);
          });

          // Unobserve after animating once
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    heroObserver.observe(premiumHero);
  }

});

// Certificate Pro Lightbox Functions
window.openLightbox = function(src) {
  const lightbox = document.getElementById('certificateLightbox');
  const img = document.getElementById('lightboxImage');
  const wrapper = document.querySelector('.lightbox__content-wrapper');
  
  if (lightbox && img && wrapper) {
    img.src = src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock scrolling
    
    // GSAP Animate in
    gsap.to(lightbox, { opacity: 1, duration: 0.2, ease: "power2.out" });
    gsap.to(wrapper, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(1.5)", delay: 0.1 });
    
    // Add Esc key listener
    document.addEventListener('keydown', handleEsc);
  }
};

window.closeLightbox = function() {
  const lightbox = document.getElementById('certificateLightbox');
  const wrapper = document.querySelector('.lightbox__content-wrapper');
  
  if (lightbox && wrapper) {
    // GSAP Animate out
    gsap.to(wrapper, { opacity: 0, scale: 0.9, duration: 0.15, ease: "power2.in" });
    gsap.to(lightbox, { 
      opacity: 0, 
      duration: 0.2, 
      ease: "power2.in", 
      onComplete: () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = ''; // Unlock scrolling
        document.removeEventListener('keydown', handleEsc);
      }
    });
  }
};

function handleEsc(e) {
  if (e.key === "Escape") {
    closeLightbox();
  }
}
