// --- PENGATURAN ANIMASI ---
(function initializeSiteAnimations() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion) {
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const motion = window.Motion;
  const Lenis = window.Lenis;

  if (!gsap || !ScrollTrigger) {
    console.warn(
      "GSAP atau ScrollTrigger tidak tersedia; judul tetap ditampilkan tanpa animasi.",
    );
  }

  if (!motion) {
    console.warn(
      "Motion tidak tersedia; animasi kartu dan respons hover dinonaktifkan.",
    );
  }

  if (!Lenis) {
    console.warn(
      "Lenis tidak tersedia; halaman memakai pengguliran bawaan peramban.",
    );
  }

  // --- GSAP SCROLLTRIGGER ---
  if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const headings = document.querySelectorAll("main h1, main section h2");

    headings.forEach((heading) => {
      if (!heading.textContent.trim()) {
        return;
      }

      heading.setAttribute(
        "aria-label",
        heading.textContent.trim().replace(/\s+/g, " "),
      );

      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      const textNodes = [];

      while (walker.nextNode()) {
        if (walker.currentNode.textContent.trim()) {
          textNodes.push(walker.currentNode);
        }
      }

      textNodes.forEach((textNode) => {
        const fragment = document.createDocumentFragment();
        const parts = textNode.textContent.split(/(\s+)/);

        parts.forEach((part) => {
          if (!part || /^\s+$/.test(part)) {
            fragment.append(document.createTextNode(part));
            return;
          }

          const word = document.createElement("span");
          word.className = "animated-word";
          word.setAttribute("aria-hidden", "true");
          word.textContent = part;
          fragment.append(word);
        });

        textNode.replaceWith(fragment);
      });

      const words = heading.querySelectorAll(".animated-word");

      if (words.length === 0) {
        return;
      }

      gsap.fromTo(
        words,
        {
          autoAlpha: 0,
          y: 14,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.045,
          ease: "power2.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: {
            trigger: heading,
            start: "top 88%",
            once: true,
          },
          immediateRender: false,
        },
      );
    });

    ScrollTrigger.refresh();
  }

  // --- MOTION: KARTU MASUK DAN RESPONS HOVER ---
  if (motion) {
    const cards = document.querySelectorAll(
      [
        ".audience-card",
        ".service-item",
        ".project-card",
        ".process-step",
        ".style-exhibit-card",
        ".service-card",
        ".review-card",
        ".event-card",
        ".moment-card",
        ".rsvp-card",
        ".product-tile",
        ".cart-panel",
        ".receipt-panel",
        ".inventory-summary article",
        ".inventory-panel",
        ".add-stock-panel",
      ].join(", "),
    );

    cards.forEach((card) => {
      motion.inView(
        card,
        (element) => {
          const entrance = motion.animate(
            element,
            {
              opacity: [0, 1],
              y: [18, 0],
            },
            {
              duration: 0.52,
              ease: [0.22, 1, 0.36, 1],
            },
          );

          return () => entrance.stop();
        },
        {
          once: true,
          amount: 0.12,
        },
      );
    });

    const interactiveElements = document.querySelectorAll(
      [
        ".audience-card",
        ".project-card",
        ".process-step",
        ".style-exhibit-card",
        ".service-card",
        ".review-card",
        ".event-card",
        ".moment-card",
        ".product-tile",
        ".button",
        ".style-filter",
        ".add-product",
        ".stock-controls button",
        ".quantity-controls button",
      ].join(", "),
    );

    interactiveElements.forEach((element) => {
      motion.hover(element, () => {
        const entrance = motion.animate(
          element,
          {
            scale: 1.015,
            y: -3,
          },
          {
            duration: 0.18,
            ease: "easeOut",
          },
        );

        return () => {
          entrance.stop();
          motion.animate(
            element,
            {
              scale: 1,
              y: 0,
            },
            {
              duration: 0.2,
              ease: "easeOut",
            },
          );
        };
      });
    });
  }

  // --- LENIS SMOOTH SCROLL ---
  if (Lenis) {
    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      smoothWheel: true,
    });

    if (gsap) {
      lenis.on("scroll", () => {
        if (ScrollTrigger) {
          ScrollTrigger.update();
        }
      });

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      const updateLenis = (time) => {
        lenis.raf(time);
        window.requestAnimationFrame(updateLenis);
      };

      window.requestAnimationFrame(updateLenis);
    }

    window.siteLenis = lenis;
  }
})();
