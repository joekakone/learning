


/******************************************************************************
** JavaScript pour copier les blocs de code
******************************************************************************/
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.highlight').forEach((block) => {
        // Création du bouton
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerText = 'Copier';

        // Ajout du bouton au bloc
        block.appendChild(button);

        button.addEventListener('click', () => {
            const code = block.querySelector('code').innerText;
            
            // Simulation de copie (compatible iFrame/MkDocs)
            const el = document.createElement('textarea');
            el.value = code;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);

            // Feedback visuel
            button.innerText = 'Copié !';
            button.style.borderColor = '#10b981';
            button.style.color = '#10b981';

            setTimeout(() => {
                button.innerText = 'Copier';
                button.style.borderColor = '#eaebed';
                button.style.color = '#6b7280';
            }, 2000);
        });
    });
});