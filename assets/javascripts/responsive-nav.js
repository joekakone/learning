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
    // 0. Verrouillage absolu du défilement horizontal (anti-décalage)
    // =========================================================================

    function enforceZeroHorizontalScroll() {
      if (drilldownContainer && drilldownContainer.scrollLeft !== 0) {
        drilldownContainer.scrollLeft = 0;
      }
      if (mobileDrawer && mobileDrawer.scrollLeft !== 0) {
        mobileDrawer.scrollLeft = 0;
      }
    }

    if (drilldownContainer) {
      drilldownContainer.addEventListener('scroll', enforceZeroHorizontalScroll, { passive: true });
    }
    if (mobileDrawer) {
      mobileDrawer.addEventListener('scroll', enforceZeroHorizontalScroll, { passive: true });
    }

    // =========================================================================
    // 1. Gestion de l'Ouverture / Fermeture du Tiroir Mobile
    // =========================================================================

    function openMobileDrawer() {
      enforceZeroHorizontalScroll();
      mobileDrawer.classList.add('is-open');
      if (mobileOverlay) {
        mobileOverlay.classList.add('is-open');
      }
      document.body.classList.add('mobile-nav-open');
      mobileDrawer.setAttribute('aria-hidden', 'false');

      // Caler le panneau actif et le scroll vertical sans animation parasite
      setupNavState(true);
      enforceZeroHorizontalScroll();
    }

    function closeMobileDrawer() {
      mobileDrawer.classList.remove('is-open');
      if (mobileOverlay) {
        mobileOverlay.classList.remove('is-open');
      }
      document.body.classList.remove('mobile-nav-open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      enforceZeroHorizontalScroll();
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
          nextPanel.scrollLeft = 0;
          enforceZeroHorizontalScroll();
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
          parentPanel.scrollLeft = 0;
          enforceZeroHorizontalScroll();
        }
      }
    });


    // =========================================================================
    // 3. Gestion Contextuelle de la Page Active & Positionnement Initial
    // =========================================================================

    function normalizePath(urlPath) {
      if (!urlPath) return '';
      let clean = urlPath.split('?')[0].split('#')[0];
      clean = clean.replace(/\/index\.html$/, '/');
      if (clean.length > 1 && clean.endsWith('/')) {
        clean = clean.slice(0, -1);
      }
      return clean.toLowerCase();
    }

    function scrollToActiveLink(panel, link) {
      if (!panel || !link) return;
      
      // Calcul précis du défilement vertical uniquement, sans impacter l'axe X
      let offsetTop = 0;
      let curr = link;
      while (curr && curr !== panel) {
        offsetTop += curr.offsetTop;
        curr = curr.offsetParent;
      }

      const targetScrollTop = offsetTop - (panel.clientHeight / 2) + (link.clientHeight / 2);
      panel.scrollTop = Math.max(0, targetScrollTop);

      // Verrouillage de sécurité horizontal
      panel.scrollLeft = 0;
      enforceZeroHorizontalScroll();
    }

    function setupNavState(isImmediate) {
      if (isImmediate && drilldownContainer) {
        drilldownContainer.classList.add('no-drilldown-transition');
      }

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

      // 2. Si non trouvé par URL, chercher par classe active existante
      if (!activeLink) {
        const activeElements = mobileDrawer.querySelectorAll('.drilldown-link.active');
        if (activeElements.length > 0) {
          activeLink = activeElements[activeElements.length - 1];
        }
      }

      // Réinitialiser l'état actif de tous les panneaux
      const allPanels = Array.from(mobileDrawer.querySelectorAll('.drilldown-panel'));
      allPanels.forEach(panel => {
        panel.classList.remove('is-active', 'is-ancestor');
        panel.scrollLeft = 0;
      });

      const rootPanel = document.getElementById('panel-root');

      if (activeLink) {
        // Mettre en valeur l'élément actif
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
          targetPanel.classList.remove('is-ancestor');
          targetPanel.classList.add('is-active');

          // Marquer tous les ancêtres stricts jusqu'au panneau racine
          let currentParentId = targetPanel.getAttribute('data-parent');
          while (currentParentId) {
            const parentPanel = document.getElementById(currentParentId);
            if (parentPanel && parentPanel !== targetPanel) {
              parentPanel.classList.remove('is-active');
              parentPanel.classList.add('is-ancestor');
              parentPanel.scrollLeft = 0;
              currentParentId = parentPanel.getAttribute('data-parent');
            } else {
              break;
            }
          }

          scrollToActiveLink(targetPanel, activeLink);
        } else if (rootPanel) {
          rootPanel.classList.remove('is-ancestor');
          rootPanel.classList.add('is-active');
          scrollToActiveLink(rootPanel, activeLink);
        }
      } else if (rootPanel) {
        rootPanel.classList.add('is-active');
        rootPanel.scrollTop = 0;
        rootPanel.scrollLeft = 0;
      }

      enforceZeroHorizontalScroll();

      if (isImmediate && drilldownContainer) {
        // Forcer le reflow synchrone avant de réactiver les transitions CSS pour les interactions utilisateur
        void drilldownContainer.offsetHeight;
        drilldownContainer.classList.remove('no-drilldown-transition');
      }
    }

    // Initialisation immédiate au chargement du DOM (sans attendre l'ouverture)
    setupNavState(true);

  });
})();
