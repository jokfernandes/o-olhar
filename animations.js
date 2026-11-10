/* Animações do hotsite O OLHAR — GSAP + ScrollTrigger.
   Só anima transform/opacity/clip-path/filter, toca cada entrada uma vez e
   respeita prefers-reduced-motion (nesse caso nada é animado). */
(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => [...r.querySelectorAll(s)];
  const visible = (el) => el && el.offsetParent !== null;
  const reveal = { duration: 0.8, ease: "power3.out", clearProps: "clipPath,transform,opacity,filter" };

  const mm = gsap.matchMedia();

  mm.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 861px)",
    },
    (ctx) => {
      const { motion, desktop } = ctx.conditions;
      if (!motion) return;

      /* ---------- HERO ---------- */
      const hero = q(".hero");
      const squares = qa(".hero .sq, .hero .hero-deco").filter(visible);
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.from(q(".hero-img"), {
        scale: 1.08, filter: "blur(14px)", duration: 1.2, clearProps: "transform,filter",
      }, 0)
        .from(squares, {
          opacity: 0, y: 28, duration: 0.6, stagger: 0.15, clearProps: "transform,opacity",
        }, 0.1)
        .from([q(".hero-brand"), q(".hero-message")], {
          clipPath: "inset(100% 0% 0% 0%)", duration: 0.75, stagger: 0.18,
          ease: "power3.out", clearProps: "clipPath",
        }, ">-0.15");

      /* ---------- LIVRO ---------- */
      const cover = q(".book-cover");
      gsap.from(cover, {
        rotation: -7, y: 40, opacity: 0, duration: 1.1, ease: "power3.out",
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: ".book", start: "top 75%", once: true },
      });
      gsap.from(q("img", cover), {
        filter: "drop-shadow(0 0 0 rgba(0,11,54,0))", duration: 1.2, ease: "power2.out",
        scrollTrigger: { trigger: ".book", start: "top 75%", once: true },
      });
      // sombra final suave após a entrada
      gsap.to(q("img", cover), {
        filter: "drop-shadow(0 16px 22px rgba(0,11,54,.22))", duration: 1.2, delay: 0.1,
        scrollTrigger: { trigger: ".book", start: "top 75%", once: true },
      });

      if (desktop) {
        gsap.fromTo(q("img", cover), { y: 22 }, {
          y: -22, ease: "none",
          scrollTrigger: { trigger: ".book", start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
      }

      const k = desktop ? 1 : 0.6;
      const depth = [
        [".book .sq-mint", 25], [".book .sq-blue", 40],
        [".book .sq-lime", 18], [".book .sq-navy", 50],
        [".book-extra-lime", 22], [".book-extra-blue", 34], [".book-extra-mint", 30],
      ];
      depth.forEach(([sel, d]) => {
        const el = q(sel);
        if (!visible(el)) return;
        gsap.fromTo(el, { y: d * k }, {
          y: -d * k, ease: "none",
          scrollTrigger: { trigger: ".book", start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
      });

      /* ---------- AUTOR ---------- */
      const nameBox = q(".author-name");
      const nameTl = gsap.timeline({
        scrollTrigger: { trigger: ".author", start: "top 65%", once: true },
        defaults: { ease: "power3.out" },
      });
      nameTl
        .from(nameBox, { clipPath: "inset(0% 100% 0% 0%)", duration: 0.8, clearProps: "clipPath" })
        .from(q("h2", nameBox), { clipPath: "inset(0% 100% 0% 0%)", x: -16, duration: 0.7, clearProps: "clipPath,transform" }, "-=0.3");

      const order = desktop ? [".sq-blue", ".sq-paper", ".sq-lime"] : [".sq-lime", ".sq-blue", ".sq-paper"];
      gsap.from(order.map((s) => q(".author " + s)), {
        opacity: 0, x: -34, y: -34, duration: 0.6, stagger: 0.18, ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: ".author", start: "top 55%", once: true },
      });

      /* ---------- COMPRA ---------- */
      const photos = [
        [q(".buy .ph-eye"), "inset(0% 100% 0% 0%)"],     // da esquerda
        [q(".buy .ph-woman"), "inset(0% 0% 100% 0%)"],   // de cima
        [q(".buy .ph-old"), "inset(0% 0% 0% 100%)"],     // da direita
        [q(".buy .ph-eye-dark"), "inset(100% 0% 0% 0%)"] // de baixo (mobile)
      ].filter(([el]) => visible(el));
      const buyTl = gsap.timeline({ scrollTrigger: { trigger: ".buy", start: "top 60%", once: true } });
      photos.forEach(([el, from], i) => {
        buyTl.from(el, { clipPath: from, duration: 0.9, ease: "power3.inOut", clearProps: "clipPath" }, i * 0.2);
        buyTl.from(q("img", el), { scale: 1.2, duration: 1.1, ease: "power2.out", clearProps: "transform" }, i * 0.2);
      });
      buyTl.from(qa(".buy .sq").filter(visible), {
        opacity: 0, scale: 0.6, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)", clearProps: "transform,opacity",
      }, 0.5);
      buyTl.from(q(".buy-sub"), { opacity: 0, y: 14, duration: 0.6, clearProps: "all" }, 0);
    }
  );
})();
