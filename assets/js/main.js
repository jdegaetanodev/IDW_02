// ============================================
// FUNCIONES PARA IMÁGENES BASE64
// ============================================

/**
 * Obtiene la imagen desde Base64 o desde ruta física
 * @param {string} nombreArchivo - Nombre del archivo (ej: "cardiologia.jpg")
 * @param {string} carpetaDefault - Carpeta por defecto si no existe en Base64
 * @returns {string} - Ruta Base64 o ruta física del archivo
 */
function obtenerImagen(nombreArchivo, carpetaDefault = 'assets/img') {
    // Si no hay nombre de archivo, retornar imagen por defecto
    if (!nombreArchivo) {
        return `${carpetaDefault}/default-especialidad.jpg`;
    }
    
    // Si existe en Base64, usarla
    if (window.IMAGENES_BASE64 && window.IMAGENES_BASE64[nombreArchivo]) {
        return window.IMAGENES_BASE64[nombreArchivo];
    }
    
    // Si no, usar ruta física (para imágenes futuras)
    return `${carpetaDefault}/${nombreArchivo}`;
}

/**
 * Obtiene imagen del profesional por ID (compatibilidad con código anterior)
 * @param {number} idProfesional - ID del profesional
 * @param {object} profesional - Objeto profesional con img_base64 opcional
 * @returns {string} - Ruta de la imagen
 */
function obtenerImagenProfesional(idProfesional, profesional = null) {
    // Prioridad 1: img_base64 del profesional
    if (profesional && profesional.img_base64) {
        return profesional.img_base64;
    }
    
    // Prioridad 2: Buscar por nombre de archivo si existe
    const nombreArchivo = `${idProfesional}.png`;
    if (window.IMAGENES_BASE64 && window.IMAGENES_BASE64[nombreArchivo]) {
        return window.IMAGENES_BASE64[nombreArchivo];
    }
    
    // Prioridad 3: Imagen por defecto
    return 'assets/img/default-profesional.jpg';
}
// ============================================
// AUTENTICACIÓN Y PROTECCIÓN DE RUTAS
// ============================================

function verificarAutenticacion() {
    const accessToken = sessionStorage.getItem('accessToken');
    const currentPath = window.location.pathname;

    const PUBLIC_PAGES = [
        'login.html',
        'index.html',
        'contacto.html',
        'nosotros.html', 
        'especialidades.html'
    ];

    const isPublicPage = PUBLIC_PAGES.some(page => currentPath.includes(page));

    let loginPath;

    if (currentPath.includes('/medicos/') || 
        currentPath.includes('/especialidades/') || 
        currentPath.includes('/turnos/') ||
        currentPath.includes('/obrassociales/') ||
        currentPath.includes('/usuarios/')) {
        
        loginPath = '../login.html'; 
    } else {
        loginPath = 'login.html';
    }

    if (!accessToken && !isPublicPage) {
        window.location.href = loginPath; 
        return false; 
    }
    
    return true; 
}

// Ejecutar verificación al cargar
verificarAutenticacion();

// ============================================
// LOGOUT
// ============================================

function logout() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userRole');
    
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    
    const currentPath = window.location.pathname;
    let targetPath;

    if (currentPath.includes('/medicos/') || 
        currentPath.includes('/especialidades/') || 
        currentPath.includes('/turnos/') ||
        currentPath.includes('/obrassociales/') ||
        currentPath.includes('/usuarios/')) {
        
        targetPath = '../index.html'; 
    } else {
        targetPath = 'index.html';
    }

    Swal.fire({
        icon: 'info', 
        title: 'Sesión Cerrada',
        html: 'Has cerrado sesión correctamente. ¡Vuelve pronto!<br>Esta ventana se cerrará automáticamente en 2 segundos.',
        showConfirmButton: false, 
        timer: 2000 
    }).then(() => {
        window.location.href = targetPath;
    });
}

// ============================================
// VERIFICACIÓN Y ACTUALIZACIÓN DE UI
// ============================================

function checkAuthenticationAndUI() {
    const isLogged = !!sessionStorage.getItem('accessToken');
    const userRole = sessionStorage.getItem('userRole');

    const btnIngresar = document.getElementById('btn-ingresar');
    const btnSolicitarTurno = document.getElementById('btn-solicitar-turno');
    const navLogout = document.getElementById('nav-logout');
    const userIcon = document.getElementById('user-icon');
    const navAdmin = document.getElementById('nav-admin');

    if (btnIngresar && btnSolicitarTurno && navLogout && userIcon && navAdmin) {
        if (isLogged) {
            btnIngresar.classList.add('d-none');
            navLogout.classList.remove('d-none');
            userIcon.classList.remove('d-none');
            
            if (userRole === 'administrador') {
                btnSolicitarTurno.classList.add('d-none');
                navAdmin.classList.remove('d-none');
            } else {
                btnSolicitarTurno.classList.remove('d-none');
                navAdmin.classList.add('d-none');
            }
        } else {
            btnIngresar.classList.remove('d-none');
            btnSolicitarTurno.classList.add('d-none');
            navLogout.classList.add('d-none');
            userIcon.classList.add('d-none');
            navAdmin.classList.add('d-none');
        }
    }
}

window.onload = checkAuthenticationAndUI;

// ============================================
// SOLICITAR TURNO CON VALIDACIÓN
// ============================================

function solicitarTurno(id_profesional = null) {
    const isLogged = !!sessionStorage.getItem('accessToken');
    
    if (!isLogged) {
        Swal.fire({
            icon: 'warning',
            title: 'Acceso Restringido',
            text: 'Debe iniciar sesión para solicitar un turno',
            showCancelButton: true,
            confirmButtonText: 'Ir a Login',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const currentPath = window.location.pathname;
                if (currentPath.includes('/medicos/') || 
                    currentPath.includes('/especialidades/') || 
                    currentPath.includes('/turnos/')) {
                    window.location.href = '../login.html';
                } else {
                    window.location.href = 'login.html';
                }
            }
        });
        return;
    }

    if (id_profesional) {
        localStorage.setItem('id_profesional_preseleccionado', id_profesional);
    }
    
    const currentPath = window.location.pathname;
    let targetUrl = '';
    
    if (currentPath.includes('/medicos/') || 
        currentPath.includes('/especialidades/') || 
        currentPath.includes('/turnos/') ||
        currentPath.includes('/obrassociales/') ||
        currentPath.includes('/usuarios/')) {
        targetUrl = '../turnos/listar.html';
    } else {
        targetUrl = 'turnos/listar.html';
    }
    
    window.location.href = targetUrl;
}

// ============================================
// LOCAL STORAGE - GESTIÓN DE DATOS
// ============================================

function cargaEnLocalStorage() {
    if(localStorage.getItem('datos_medicos') === null) {
        const claveLocalStorage = 'datos_medicos';
        const jsonString = JSON.stringify(datosIniciales);
        localStorage.setItem(claveLocalStorage, jsonString);
    }
}

function obtenerDeLocalStorage() {
    const claveLocalStorage = 'datos_medicos';
    const jsonString = localStorage.getItem(claveLocalStorage);
  
    if (jsonString) {
        const datosRecuperados = JSON.parse(jsonString);
        return datosRecuperados;
    } else {
        return null;
    }
}

function cargarDesdeLocalstorage() {
    cargaEnLocalStorage();
    datos = obtenerDeLocalStorage();       
    datosProfesionales = datos.profesionales;     
    datosEspecialidades = datos.especialidades;  
    datosObraSocial = datos.obras_sociales;
}

// ============================================
// MODO OSCURO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('toggle-dark-mode');
    
    if (!btn) return;
    
    const icon = btn.querySelector('i');
    const body = document.body;

    const modoGuardado = localStorage.getItem('modo');
    
    if (modoGuardado === 'oscuro') {
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

// ============================================
// ESPECIALIDADES - VERSIÓN CON BASE64
// ============================================

function desplegarEspecialidades() {
    let listaEspecialidades = document.getElementById('especialidades');
    let titulo = document.getElementById('titulo');    
    let divVolver = document.getElementById('divVolver');    

    divVolver.innerHTML = "";
    listaEspecialidades.innerHTML = "";

    titulo.innerHTML = `
        <div class="col-12 text-center mb-5">
            <h3>Especialidades</h3>
            <hr>
            <p>Un equipo de profesionales especializados en diversas áreas de la salud</p>
        </div>
    `;

    datosEspecialidades.forEach(especialidad => {
        const fila = document.createElement('div');
        fila.classList.add('col-sm-12', 'mt-3', 'col-md-3');
        
        // ✅ USAR FUNCIÓN obtenerImagen()
        let imagenSrc = obtenerImagen(
            especialidad.img_base64 || especialidad.img, 
            'assets/img'
        );
        
        fila.innerHTML = `
            <div class="card h-100">
                <img src="${imagenSrc}" 
                     class="card-img-top" 
                     alt="Especialidad ${especialidad.nombre}"
                     style="height: 200px; width: 100%; object-fit: cover; object-position: center;"
                     onerror="this.src='assets/img/default-especialidad.jpg'">
                <div class="card-body text-center text-sm-start">
                    <h5 class="card-title">${especialidad.nombre}</h5>
                    <p class="card-text">${especialidad.descripcion || 'Descripción no disponible'}</p>
                    <a href="javascript:desplegarProfesionalesEspecialidad(${especialidad.id_especialidad})" class="btn btn-primary">Ver profesionales</a>
                </div>
            </div>
        `;

        listaEspecialidades.appendChild(fila);
    });   
}

function desplegarEspecialidadesIndex() {
    let listaEspecialidades = document.getElementById('especialidades');
    
    if (!listaEspecialidades) return;

    datosEspecialidades.forEach(especialidad => {
        const fila = document.createElement('div');
        fila.classList.add('col-sm-12', 'mt-3', 'col-md-3');
        
        // ✅ USAR FUNCIÓN obtenerImagen()
        let imagenSrc = obtenerImagen(
            especialidad.img_base64 || especialidad.img,
            'assets/img'
        );
        
        fila.innerHTML = `
            <div class="card h-100">
                <img src="${imagenSrc}" 
                     class="card-img-top" 
                     alt="Especialidad ${especialidad.nombre}"
                     style="height: 200px; object-fit: cover;"
                     onerror="this.src='assets/img/default-especialidad.jpg'">
                <div class="card-body text-center text-sm-start">
                    <h5 class="card-title">${especialidad.nombre}</h5>
                    <p class="card-text">${especialidad.descripcion}</p>
                </div>
            </div>
        `;

        listaEspecialidades.appendChild(fila);
    });
}

function desplegarProfesionalesEspecialidad(id_especialidad) {
    datosProfesionales = [];     
    datosEspecialidades = [];  
    datosObraSocial = [];

    cargarDesdeLocalstorage();

    const profesionalesFiltrado = datosProfesionales.filter(profesional => 
        profesional.id_especialidad == id_especialidad
    );    

    let listaEspecialidades = document.getElementById('especialidades');    
    let titulo = document.getElementById('titulo');    
    let divVolver = document.getElementById('divVolver');    

    divVolver.innerHTML = `
        <a href="javascript:desplegarEspecialidades()" class="btn btn-success">
            <i class="fa-solid fa-backward"></i> Volver
        </a>
    `;

    listaEspecialidades.innerHTML = '';
    titulo.innerHTML = '';

    const tituloEspecialidad = datosEspecialidades.find(
        e => e.id_especialidad === id_especialidad
    );    

    titulo.innerHTML = `
        <div class="col-12 text-center mb-5">
            <h3>${tituloEspecialidad.nombre}</h3>
            <hr>
            <p>${tituloEspecialidad.descripcion}</p>
        </div>
    `;

    profesionalesFiltrado.forEach(profesional => {
        const especialidad = datosEspecialidades.find(
            e => e.id_especialidad === profesional.id_especialidad
        );      

        const fila = document.createElement('div');
        fila.classList.add('col-sm-12', 'mt-3', 'col-md-3');
        
        // ✅ USAR FUNCIÓN obtenerImagenProfesional()
        let imagenSrc = obtenerImagenProfesional(profesional.id_profesional, profesional);
        
        fila.innerHTML = `
            <div class="card h-100">
                <img src="${imagenSrc}" 
                     class="card-img-top" 
                     alt="Dr/a ${profesional.nombre} ${profesional.apellido}"
                     style="height: 200px; width: 100%; object-fit: cover; object-position: center;"
                     onerror="this.src='assets/img/default-profesional.jpg'">
                <div class="card-body text-center text-sm-start">
                    <h5 class="card-title">Dr/a ${profesional.nombre} ${profesional.apellido}</h5>
                    <p class="card-text">${especialidad.nombre}</p>                                        
                    <a href="javascript:solicitarTurno(${profesional.id_profesional})" class="btn btn-success mt-5">Solicitar Turno</a>                                    
                </div>
            </div>
        `;

        listaEspecialidades.appendChild(fila);
    });   
}
// ============================================
// INICIALIZACIÓN
// ============================================
// ============================================
// CARGAR LOGO AUTOMÁTICAMENTE DESDE BASE64
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Buscar todas las imágenes del logo
    const logos = document.querySelectorAll('img[src*="LogoSanar"], img[alt*="Clinica Sanar"]');
    
    logos.forEach(logo => {
        if (window.IMAGENES_BASE64 && window.IMAGENES_BASE64['LogoSanar.png']) {
            logo.src = window.IMAGENES_BASE64['LogoSanar.png'];
        } else {
            // Fallback: determinar si estamos en subcarpeta
            const currentPath = window.location.pathname;
            const esSubcarpeta = currentPath.includes('/especialidades/') || 
                                currentPath.includes('/medicos/') ||
                                currentPath.includes('/turnos/') ||
                                currentPath.includes('/usuarios/') ||
                                currentPath.includes('/obrassociales/');
            
            logo.src = esSubcarpeta ? '../assets/img/LogoSanar.png' : 'assets/img/LogoSanar.png';
        }
    });
});

// ============================================
// CARGAR ÍCONOS Y ELEMENTOS DINÁMICOS
// ============================================

// Esta función ya debe existir, pero asegúrate que esté presente
document.addEventListener('DOMContentLoaded', function() {
    // Cargar imágenes del slider si existen
    const sliderImages = document.querySelectorAll('.carousel-item img[src*="slider"]');
    
    sliderImages.forEach(img => {
        const filename = img.src.split('/').pop();
        if (window.IMAGENES_BASE64 && window.IMAGENES_BASE64[filename]) {
            img.src = window.IMAGENES_BASE64[filename];
        }
    });
    
    // Cargar imágenes de nosotros
    const nosotrosImages = document.querySelectorAll('img[src*="nosotros"], img[src*="quienes-somos"], img[src*="lo-que-nos-mueve"], img[src*="hacia-donde-vamos"]');
    
    nosotrosImages.forEach(img => {
        const filename = img.src.split('/').pop();
        if (window.IMAGENES_BASE64 && window.IMAGENES_BASE64[filename]) {
            img.src = window.IMAGENES_BASE64[filename];
        }
    });
});
datosProfesionales = [];     
datosEspecialidades = [];  
datosObraSocial = [];

cargarDesdeLocalstorage();