(() => {
  const body = document.body;
  const toggle = document.querySelector(".menu-toggle");
  const drawer = document.getElementById("drawer");
  if (!toggle || !drawer) return;

  const focusable = () =>
    drawer.querySelectorAll("a[href], button:not([disabled])");

  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    drawer.setAttribute("aria-hidden", String(!open));
    if (open) {
      const first = drawer.querySelector(".drawer-close");
      if (first) first.focus({ preventScroll: true });
    } else if (document.activeElement && drawer.contains(document.activeElement)) {
      toggle.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener("click", () =>
    setMenu(!body.classList.contains("menu-open"))
  );

  document.querySelectorAll("[data-menu-close]").forEach((el) =>
    el.addEventListener("click", () => setMenu(false))
  );

  document.addEventListener("keydown", (e) => {
    if (!body.classList.contains("menu-open")) return;
    if (e.key === "Escape") return setMenu(false);
    if (e.key === "Tab") {
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Ao voltar para o layout desktop, garante que o menu fique fechado.
  window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });
})();
