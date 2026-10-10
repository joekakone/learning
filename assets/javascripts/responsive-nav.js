/**
 * Responsive Navigation & Recursive Drilldown Engine
 * Algo Jungle - Modern Responsive Multi-level Mobile Menu
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const mobileOverlay = document.getElementById('mobileNavOverlay');
    const mobileToggle = document.getElementById('mobileNavToggle');
    const mobileClose = document.getElementById('mobileNavClose');
    const drilldownContainer = document.getElementById('drilldownContainer');

    if (!mobileDrawer || !mobileToggle) {
      return;
    }

    // =========================================================================
    // 1. Gestion de l'Ouverture / Fermeture du Tiroir Mobile
    // =========================================================================

    function openMobileDrawer() {
      mobileDrawer.classList.add('is-open');
      if (mobileOverlay) {
        mobileOverlay.classList.add('is-open');
      }
      document.body.classList.add('mobile-nav-open');
      mobileDrawer.setAttribute('aria-hidden', 'false');

      // Auto-Focus sur la page active à l'ouverture
      autoFocusActivePage();
    }

    function closeMobileDrawer() {
      mobileDrawer.classList.remove('is-open');
      if (mobileOverlay) {
        mobileOverlay.classList.remove('is-open');
      }
      document.body.classList.remove('mobile-nav-open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
    }

    mobileToggle.addEventListener('click', function (e) {
      e.preventDefault();
      openMobileDrawer();
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', function (e) {
        e.preventDefault();
        closeMobileDrawer();
      });
    }

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', function (e) {
        e.preventDefault();
        closeMobileDrawer();
      });
    }

    // Fermeture avec la touche Échap
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        closeMobileDrawer();
      }
    });


    // =========================================================================
    // 2. Navigation Récursive Drilldown (Slide horizontal)
    // =========================================================================

    // Clic sur le chevron ">" pour ouvrir un sous-menu enfant
    mobileDrawer.addEventListener('click', function (e) {
      const nextBtn = e.target.closest('.drilldown-forward-btn');
      if (nextBtn) {
        e.preventDefault();
        e.stopPropagation();

        const targetPanelId = nextBtn.getAttribute('data-target');
        const nextPanel = document.getElementById(targetPanelId);
        const currentPanel = nextBtn.closest('.drilldown-panel');

        if (nextPanel && currentPanel) {
          // Le panneau courant glisse en arrière-plan à gauche (-30%)
          currentPanel.classList.remove('is-active');
          currentPanel.classList.add('is-ancestor');

          // Le sous-panneau glisse depuis la droite vers le centre (0)
          nextPanel.classList.remove('is-ancestor');
          nextPanel.classList.add('is-active');
          nextPanel.scrollTop = 0;
        }
        return;
      }

      // Clic sur "< Retour" pour remonter au niveau parent
      const backBtn = e.target.closest('.drilldown-back-btn');
      if (backBtn) {
        e.preventDefault();
        e.stopPropagation();

        const parentPanelId = backBtn.getAttribute('data-target');
        const parentPanel = document.getElementById(parentPanelId);
        const currentPanel = backBtn.closest('.drilldown-panel');

        if (parentPanel && currentPanel) {
          // Le panneau courant repart vers la droite (+100%)
          currentPanel.classList.remove('is-active', 'is-ancestor');

          // Le panneau parent revient depuis la gauche vers le centre (0)
          parentPanel.classList.remove('is-ancestor');
          parentPanel.classList.add('is-active');
        }
      }
    });


    // =========================================================================
    // 3. Gestion Contextuelle de la Page Active (Auto-Focus)
    // =========================================================================

    function normalizePath(urlPath) {
      if (!urlPath) return '';
      // Retirer query string et hash
      let clean = urlPath.split('?')[0].split('#')[0];
      // Normaliser index.html et slashes de fin
      clean = clean.replace(/\/index\.html$/, '/');
      if (clean.length > 1 && clean.endsWith('/')) {
        clean = clean.slice(0, -1);
      }
      return clean.toLowerCase();
    }

    function autoFocusActivePage() {
      const currentPath = normalizePath(window.location.pathname);
      const allLinks = Array.from(mobileDrawer.querySelectorAll('.drilldown-link'));

      let activeLink = null;

      // 1. Recherche par correspondance d'URL exacte
      for (const link of allLinks) {
        try {
          const linkUrl = new URL(link.getAttribute('href'), window.location.href);
          const linkPath = normalizePath(linkUrl.pathname);
          if (linkPath === currentPath) {
            activeLink = link;
            break;
          }
        } catch (err) {
          // Ignore parse errors
        }
      }

      // 2. Si pas trouvé par URL, chercher par classe active existante (le plus profond dans l'arborescence)
      if (!activeLink) {
        const activeElements = mobileDrawer.querySelectorAll('.drilldown-link.active');
        if (activeElements.length > 0) {
          activeLink = activeElements[activeElements.length - 1];
        }
      }

      // Réinitialiser tous les panneaux
      const allPanels = Array.from(mobileDrawer.querySelectorAll('.drilldown-panel'));
      allPanels.forEach(panel => {
        panel.classList.remove('is-active', 'is-ancestor');
      });

      const rootPanel = document.getElementById('panel-root');

      if (activeLink) {
        // Mettre en valeur l'élément actif en bleu (#3498db)
        allLinks.forEach(l => l.classList.remove('active'));
        mobileDrawer.querySelectorAll('.drilldown-row').forEach(r => r.classList.remove('is-active'));

        activeLink.classList.add('active');
        const parentRow = activeLink.closest('.drilldown-row');
        if (parentRow) {
          parentRow.classList.add('is-active');
        }

        // Identifier le panneau conteneur de la page active
        const targetPanel = activeLink.closest('.drilldown-panel');

        if (targetPanel && targetPanel !== rootPanel) {
          // Activer le panneau de la page
          targetPanel.classList.add('is-active');

          // Remonter toute la chaîne des parents jusqu'au root pour marquer les ancêtres
          let currentParentId = targetPanel.getAttribute('data-parent');
          while (currentParentId) {
            const parentPanel = document.getElementById(currentParentId);
            if (parentPanel) {
              parentPanel.classList.add('is-ancestor');
              currentParentId = parentPanel.getAttribute('data-parent');
            } else {
              break;
            }
          }

          // Centrer visuellement l'élément actif dans son panneau
          setTimeout(function () {
            activeLink.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }, 150);

          return;
        }
      }

      // Si aucun sous-panneau spécifique n'est actif, afficher le panneau racine
      if (rootPanel) {
        rootPanel.classList.add('is-active');
      }
    }

  });
})();
