const DUMMY_JSON_LOGIN_URL = 'https://dummyjson.com/auth/login';

async function manejarLogin(evento) {
    evento.preventDefault();

    const inputUsuario = document.getElementById('usuario');
    const inputContrasena = document.getElementById('contrasena');
    
    const usuarioIngresado = inputUsuario.value.trim();
    const claveIngresada = inputContrasena.value.trim();

    const btnIngresar = document.querySelector('.btn-ingresar');
    btnIngresar.disabled = true;
    btnIngresar.textContent = 'Ingresando...'; 

    try {
        const respuesta = await fetch(DUMMY_JSON_LOGIN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: usuarioIngresado,
                password: claveIngresada,
            })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            sessionStorage.setItem('accessToken', datos.token);
            sessionStorage.setItem('userId', datos.id);
            sessionStorage.setItem('username', datos.username);
            
            const userRole = (datos.id === 1) ? 'administrador' : 'paciente';
            sessionStorage.setItem('userRole', userRole);

            if (userRole === 'administrador') {
                window.location.href = 'index.html'; 
            } else {
                window.location.href = 'index.html'; 
            }

        } else {
           let errorMessage = datos.message; 
            
            if (errorMessage === 'Invalid credentials') {
                errorMessage = 'Credenciales Inválidas. Usuario o contraseña incorrectos.';
            } else {
                errorMessage = 'Error en el inicio de sesión. Por favor, intente de nuevo.';
            }

            Swal.fire({
                icon: 'error',
                title: 'Acceso denegado',
                text: errorMessage,
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#d33'
            });
        }

    } catch (error) {
        console.error("Error al intentar iniciar sesión:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error de Conexión',
            text: 'No se pudo conectar con el servidor de autenticación.',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#d33'
        });

    } finally {
        btnIngresar.disabled = false;
        btnIngresar.textContent = 'Ingresar al Sistema';
        
        if (!respuesta.ok) {
            inputContrasena.value = '';
            inputUsuario.focus();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formularioLogin');
    if (formulario) {
        formulario.addEventListener('submit', manejarLogin);
    }
});