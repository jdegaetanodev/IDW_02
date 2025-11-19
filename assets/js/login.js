const DUMMY_JSON_LOGIN_URL = 'https://dummyjson.com/auth/login';
const DUMMY_JSON_USER_URL = 'https://dummyjson.com/users';

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
        // 1. AUTENTICAR USUARIO
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
            // 2. OBTENER DATOS COMPLETOS DEL USUARIO
            const respuestaUsuario = await fetch(`${DUMMY_JSON_USER_URL}/${datos.id}`);
            const datosCompletos = await respuestaUsuario.json();

            // Guardar en sessionStorage
            sessionStorage.setItem('accessToken', datos.token);
            sessionStorage.setItem('userId', datos.id);
            sessionStorage.setItem('username', datos.username);
            
            // Determinar rol: emilys (id=1) es admin, los demás son pacientes
            const userRole = (datos.username === 'emilys') ? 'administrador' : 'paciente';
            sessionStorage.setItem('userRole', userRole);

            // IMPORTANTE: También guardar en localStorage para que turnos.js pueda acceder
            localStorage.setItem('accessToken', datos.token);
            localStorage.setItem('userId', datos.id);
            localStorage.setItem('username', datos.username);
            localStorage.setItem('userRole', userRole);

            // 3. GUARDAR DATOS DEL PACIENTE DESDE DUMMYJSON
            if (userRole === 'paciente' && datosCompletos) {
                // Usar los datos reales de DummyJSON
                localStorage.setItem('paciente_apellido', datosCompletos.lastName || 'Sin Apellido');
                localStorage.setItem('paciente_nombre', datosCompletos.firstName || datosCompletos.username);
                
                // Generar documento basado en el ID o usar un campo disponible
                // DummyJSON no tiene campo de documento, así que generamos uno
                const documentoGenerado = `${30000000 + datosCompletos.id}`;
                localStorage.setItem('paciente_documento', documentoGenerado);
                
                // Guardar datos adicionales que puedan ser útiles
                localStorage.setItem('paciente_email', datosCompletos.email || '');
                localStorage.setItem('paciente_telefono', datosCompletos.phone || '');
                localStorage.setItem('paciente_edad', datosCompletos.age || '');
                localStorage.setItem('paciente_genero', datosCompletos.gender || '');
            } else if (userRole === 'administrador' && datosCompletos) {
                // Para admin también guardamos los datos
                localStorage.setItem('admin_nombre', datosCompletos.firstName || datosCompletos.username);
                localStorage.setItem('admin_apellido', datosCompletos.lastName || 'Admin');
            }

            // 4. Mostrar mensaje de bienvenida con datos reales
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                html: userRole === 'administrador' ? 
                    `<p>Has ingresado como <strong>Administrador</strong></p>
                     <p>${datosCompletos.firstName} ${datosCompletos.lastName}</p>` : 
                    `<p>Hola <strong>${datosCompletos.firstName} ${datosCompletos.lastName}</strong></p>
                     <p>Ahora puedes solicitar turnos médicos</p>`,
                timer: 2500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'index.html';
            });

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
        
        if (!respuesta || !respuesta.ok) {
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
    
    // Mostrar información de usuarios de prueba
    console.log('=== USUARIOS DE PRUEBA ===');
    console.log('Admin: emilys / emilyspass');
    console.log('Paciente: michaelw / michaelwpass');
    console.log('Paciente: sophiab / sophiabpass');
    console.log('==========================');
});