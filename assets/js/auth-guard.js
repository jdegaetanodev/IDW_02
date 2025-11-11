/**
 * AUTH GUARD - Protección de rutas administrativas
 * Este archivo debe incluirse en TODAS las páginas que requieran autenticación
 */

(function() {
    'use strict';
    
    // Verificar si el usuario está logueado
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    // Obtener la ruta actual
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    
    // Definir páginas que requieren autenticación
    const paginasProtegidas = [
        'admin.html',
        'medicos/listar.html',
        'especialidades/listar.html',
        'obrassociales/listar.html',
        'turnos/listar.html'
    ];
    
    // Definir páginas que solo pueden acceder administradores
    const paginasAdmin = [
        'admin.html',
        'medicos/listar.html',
        'especialidades/listar.html',
        'obrassociales/listar.html'
    ];
    
    // Verificar si la página actual está protegida
    const esPaginaProtegida = paginasProtegidas.some(pagina => 
        currentPath.includes(pagina) || currentPage === pagina
    );
    
    const esPaginaAdmin = paginasAdmin.some(pagina => 
        currentPath.includes(pagina) || currentPage === pagina
    );
    
    // Si es página protegida y no está logueado
    if (esPaginaProtegida && !isLoggedIn) {
        console.warn('⚠️ Acceso denegado: Usuario no autenticado');
        
        // Mostrar alerta
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'Debe iniciar sesión para acceder a esta página',
                confirmButtonColor: '#1B69B4',
                allowOutsideClick: false
            }).then(() => {
                // Determinar la ruta correcta al login
                const nivelCarpeta = currentPath.split('/').length - 2;
                const rutaLogin = nivelCarpeta > 0 ? '../login.html' : 'login.html';
                window.location.href = rutaLogin;
            });
        } else {
            // Si SweetAlert no está disponible, redireccionar directamente
            alert('Debe iniciar sesión para acceder a esta página');
            const nivelCarpeta = currentPath.split('/').length - 2;
            const rutaLogin = nivelCarpeta > 0 ? '../login.html' : 'login.html';
            window.location.href = rutaLogin;
        }
        
        return;
    }
    
    // Si es página de admin y el usuario es paciente
    if (esPaginaAdmin && userRole === 'paciente') {
        console.warn('⚠️ Acceso denegado: Permisos insuficientes');
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'No tiene permisos para acceder a esta página',
                confirmButtonColor: '#dc3545',
                allowOutsideClick: false
            }).then(() => {
                const nivelCarpeta = currentPath.split('/').length - 2;
                const rutaIndex = nivelCarpeta > 0 ? '../index.html' : 'index.html';
                window.location.href = rutaIndex;
            });
        } else {
            alert('No tiene permisos para acceder a esta página');
            const nivelCarpeta = currentPath.split('/').length - 2;
            const rutaIndex = nivelCarpeta > 0 ? '../index.html' : 'index.html';
            window.location.href = rutaIndex;
        }
        
        return;
    }
    
    console.log('✅ Acceso autorizado:', userRole);
    
})();