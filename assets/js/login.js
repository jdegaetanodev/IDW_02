// Definición de usuarios y contraseñas (Hardcodeado)
const USUARIOS_VALIDOS = [
    { usuario: "paciente", clave: "paciente", rol: "paciente" },
    { usuario: "admin", clave: "admin", rol: "administrador" }
];

function manejarLogin(evento) {
    // 1. Prevenir el envío normal del formulario
    evento.preventDefault();

    // 2. Obtener los valores de los campos
    const inputUsuario = document.getElementById('usuario');
    const inputContrasena = document.getElementById('contrasena');
    
    const usuarioIngresado = inputUsuario.value.trim().toLowerCase();
    const claveIngresada = inputContrasena.value.trim();

    // 3. Buscar si el usuario existe y si la clave coincide
    const usuarioEncontrado = USUARIOS_VALIDOS.find(user => 
        user.usuario === usuarioIngresado && user.clave === claveIngresada
    );

    if (usuarioEncontrado) {
        // --- INICIO DE SESIÓN EXITOSO ---
        
        // 4. Almacenar el estado de la sesión en localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', usuarioEncontrado.rol);
        localStorage.setItem('username', usuarioEncontrado.usuario);

        // ¡ATENCIÓN! Se ELIMINA el alert de bienvenida aquí.

        // 5. REDIRECCIÓN BASADA EN EL ROL
        if (usuarioEncontrado.rol === 'administrador') {
            window.location.href = 'index.html';
        } else {
            window.location.href = 'index.html'; 
        }

    } else {
        // --- INICIO DE SESIÓN FALLIDO ---
        
        // 🚨 Mostrar alerta de error con SweetAlert2 🚨
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Usuario o contraseña incorrectos.',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#d33'
        });

        // Limpiar el campo de contraseña
        inputContrasena.value = '';
        inputUsuario.focus();
    }
}

// ... El listener del evento 'submit' se mantiene igual ...
document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioLogin');
    if (formulario) {
        formulario.addEventListener('submit', manejarLogin);
    }
});