

/******************************************************************************
** JavaScript pour gérer la pagination du blog
******************************************************************************/
// Logique pour gérer le changement de page et les couleurs
// document.addEventListener('DOMContentLoaded', function() {
//     const navButtons = document.querySelectorAll('.page-number');
//     const allPages = document.querySelectorAll('.pages .page');

//     navButtons.forEach(button => {
//         button.addEventListener('click', function(e) {
//             // Empêche le saut brusque de l'ancre
//             e.preventDefault();

//             const targetId = this.getAttribute('data-target');
//             const targetPage = document.getElementById(targetId);

//             if (targetPage) {
//                 // 1. Nettoyage : Retire la classe active de TOUT (boutons et pages)
//                 navButtons.forEach(btn => btn.classList.remove('active'));
//                 allPages.forEach(page => page.classList.remove('active'));

//                 // 2. Activation : Ajoute la classe active sur les éléments ciblés
//                 this.classList.add('active');
//                 targetPage.classList.add('active');

//                 // 3. Navigation visuelle (Scroll haut de page)
//                 window.scrollTo({ top: 0, behavior: 'smooth' });
                
//                 // 4. (Optionnel) Mise à jour de l'URL sans rechargement pour l'historique
//                 history.pushState(null, null, '#' + targetId);
//             }
//         });
//     });

//     // Gestion du bouton "Précédent/Suivant" du navigateur
//     window.addEventListener('popstate', function() {
//         const hash = window.location.hash.replace('#', '');
//         if (hash) {
//             const btn = document.querySelector(`.page-number[data-target="${hash}"]`);
//             if (btn) btn.click();
//         }
//     });
// });


/******************************************************************************
** JavaScript pour copier les blocs de code
******************************************************************************/
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.highlight').forEach((block) => {
        // 1. Création du bouton
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerText = 'Copier';
        block.appendChild(button);

        // 2. Logique de copie
        button.addEventListener('click', () => {
            // Si c'est un tableau, on prend le code dans la cellule .code
            // Sinon on prend la balise code classique
            const codeContainer = block.querySelector('td.code pre') || block.querySelector('code') || block.querySelector('pre');
            const codeText = codeContainer.innerText;
            
            // Méthode de copie robuste
            const textArea = document.createElement('textarea');
            textArea.value = codeText;
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                button.innerText = 'Copié !';
                button.style.backgroundColor = '#ecfdf5';
                button.style.color = '#059669';
                button.style.borderColor = '#10b981';
            } catch (err) {
                button.innerText = 'Erreur';
            }

            document.body.removeChild(textArea);

            // Reset du bouton
            setTimeout(() => {
                button.innerText = 'Copier';
                button.style = ''; // Reset styles inline
            }, 2000);
        });
    });
});
// document.addEventListener('DOMContentLoaded', () => {
//     document.querySelectorAll('.highlight').forEach((block) => {
//         // Création du bouton
//         const button = document.createElement('button');
//         button.className = 'copy-btn';
//         button.innerText = 'Copier';

//         // Ajout du bouton au bloc
//         block.appendChild(button);

//         button.addEventListener('click', () => {
//             const code = block.querySelector('code').innerText;
            
//             // Simulation de copie (compatible iFrame/MkDocs)
//             const el = document.createElement('textarea');
//             el.value = code;
//             document.body.appendChild(el);
//             el.select();
//             document.execCommand('copy');
//             document.body.removeChild(el);

//             // Feedback visuel
//             button.innerText = 'Copié !';
//             button.style.borderColor = '#10b981';
//             button.style.color = '#10b981';

//             setTimeout(() => {
//                 button.innerText = 'Copier';
//                 button.style.borderColor = '#eaebed';
//                 button.style.color = '#6b7280';
//             }, 2000);
//         });
//     });
// });