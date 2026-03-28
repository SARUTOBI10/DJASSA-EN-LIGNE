// Script de débogage pour le raccourci clavier
document.addEventListener('keydown', (e) => {
    console.log('Touche pressée:', e.key, 'Alt:', e.altKey, 'Ctrl:', e.ctrlKey, 'Shift:', e.shiftKey);
    if (e.altKey && e.key === 'm') {
        console.log('🎯 Raccourci Alt+M détecté !');
    }
});