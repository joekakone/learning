(function () {
  const ITEMS_PER_PAGE = 5; // Modifiez cette valeur selon vos besoins

  function setupPagination() {
    // Sécurité demandée : s'exécute uniquement sur la section blog
    if (!window.location.pathname.includes('/blog/')) return;

    // Récupère chaque élément d'article généré par mkdocs-blogging-plugin
    const items = Array.from(document.querySelectorAll(".blog-post"));
    if (items.length <= ITEMS_PER_PAGE) return;

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    let currentPage = 1;

    // Supprime un ancien conteneur de pagination s'il existe déjà
    const existingNav = document.getElementById("blog-pagination-nav");
    if (existingNav) existingNav.remove();

    // Crée le conteneur de navigation
    const nav = document.createElement("nav");
    nav.id = "blog-pagination-nav";
    nav.className = "pagination-nav";

    function showPage(page) {
      currentPage = page;
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;

      items.forEach((item, index) => {
        if (index >= start && index < end) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });

      renderControls();
    }

    function renderControls() {
      nav.innerHTML = "";

      // Bouton Précédent
      const prevBtn = document.createElement("button");
      prevBtn.textContent = "« Précédent";
      prevBtn.className = "pagination-btn";
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener("click", () => {
        showPage(currentPage - 1);
        if (items[0]) {
            window.scrollTo({ top: items[0].offsetTop - 80, behavior: "smooth" });
        }
      });
      nav.appendChild(prevBtn);

      // Boutons numérotés
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.className = "pagination-btn" + (i === currentPage ? " active" : "");
        pageBtn.addEventListener("click", () => {
          showPage(i);
          if (items[0]) {
              window.scrollTo({ top: items[0].offsetTop - 80, behavior: "smooth" });
          }
        });
        nav.appendChild(pageBtn);
      }

      // Bouton Suivant
      const nextBtn = document.createElement("button");
      nextBtn.textContent = "Suivant »";
      nextBtn.className = "pagination-btn";
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener("click", () => {
        showPage(currentPage + 1);
        if (items[0]) {
            window.scrollTo({ top: items[0].offsetTop - 80, behavior: "smooth" });
        }
      });
      nav.appendChild(nextBtn);
    }

    // Insère les boutons directement après le dernier article
    const lastItem = items[items.length - 1];
    if (lastItem && lastItem.parentNode) {
        lastItem.parentNode.insertBefore(nav, lastItem.nextSibling);
    }

    // Initialise l'affichage sur la première page
    showPage(1);
  }

  // Initialisation au chargement de la page
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupPagination);
  } else {
    setupPagination();
  }

  // Compatibilité navigation instantanée (instant loading) de MkDocs Material
  if (typeof document$ !== "undefined") {
    document$.subscribe(setupPagination);
  }
})();