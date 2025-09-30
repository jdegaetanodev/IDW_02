function en_desarrollo()
{
    alert('En desarrollo');
}

// Gestionar el modo oscuro 

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('toggle-dark-mode');
    const icon = btn.querySelector('i');
    const body = document.body;

    // Cargar preferencia desde localStorage
    const modoGuardado = localStorage.getItem('modo');
    
    if (modoGuardado === 'oscuro') 
    {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }

    btn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        const enModoOscuro = body.classList.contains('dark-mode');

        if (enModoOscuro) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('modo', 'oscuro');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('modo', 'claro');
        }
    });
});