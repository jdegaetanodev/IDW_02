
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

verificarAutenticacion();


function logout() {
    sessionStorage.removeItem('accessToken');
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



function checkAuthenticationAndUI() {
    const isLogged = !!sessionStorage.getItem('accessToken');
    const userRole = sessionStorage.getItem('userRole');
    //const userName = sessionStorage.getItem('username');

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
                navAdmin.classList.remove('d-none'); // Mostrar botón Admin
            } else { // Paciente o Rol no Administrador
                btnSolicitarTurno.classList.remove('d-none');
                navAdmin.classList.add('d-none');    // Ocultar botón Admin
            }
            
            
        } else {
            btnIngresar.classList.remove('d-none');
            btnSolicitarTurno.classList.add('d-none');
            navLogout.classList.add('d-none');
            userIcon.classList.add('d-none');
            navAdmin.classList.add('d-none'); // Ocultar botón Admin si no está logueado
        }
    }
}


window.onload = checkAuthenticationAndUI;


function solicitarTurno()
{
    // Detectar en qué carpeta estamos
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/medicos/') || currentPath.includes('/especialidades/') || currentPath.includes('/turnos/')) {
        // Estamos en una subcarpeta
        window.location.href = 'turnos.html';
    } else {
        // Estamos en la raíz
        window.location.href = 'turnos.html';
    }
}

function cargaEnLocalStorage() // Carga desde la variable al LocalStorage
{
    if(localStorage.getItem('datos_medicos') === null) 
    {
        const claveLocalStorage = 'datos_medicos';
        const jsonString = JSON.stringify(datosIniciales);
        
        localStorage.setItem(claveLocalStorage, jsonString);
    }
}

function obtenerDeLocalStorage() 
{
    const claveLocalStorage = 'datos_medicos';
    const jsonString = localStorage.getItem(claveLocalStorage);
  
    if (jsonString) 
    {
        const datosRecuperados = JSON.parse(jsonString);
        return datosRecuperados;
    }  
    else 
    {
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

// Gestionar el modo oscuro 

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('toggle-dark-mode');
    
    if (!btn) return; // Si no existe el botón, salir
    
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

/* Especialidades */ 
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
        
        fila.innerHTML = `
                
                    <!-- card -->
                    <div class="card h-100">
                        <img src="assets/img/${especialidad.img}" class="card-img-top" alt="Especialidad ${especialidad.nombre}">
                        <div class="card-body text-center text-sm-start">
                            <h5 class="card-title">${especialidad.nombre}</h5>
                            <p class="card-text">${especialidad.descripcion}</p>
                            <a href="javascript:desplegarProfesionalesEspecialidad(${especialidad.id_especialidad})" class="btn btn-primary">Ver profesionales</a>
                        </div>
                    </div>             
                    <!-- /card -->                         

        `;

        listaEspecialidades.appendChild(fila);

    });   
}

function desplegarEspecialidadesIndex() {
  let listaEspecialidades = document.getElementById("especialidades");


  datosEspecialidades.forEach((especialidad) => {

    const fila = document.createElement("div");

    fila.classList.add("col-sm-12", "mt-3", "col-md-3");

    fila.innerHTML = `
                
                    <!-- card -->
                    <div class="card h-100">
                        <img src="assets/img/${especialidad.img}" class="card-img-top" alt="Especialidad ${especialidad.nombre}">
                        <div class="card-body text-center text-sm-start">
                            <h5 class="card-title">${especialidad.nombre}</h5>
                            <p class="card-text">${especialidad.descripcion}</p>                            
                        </div>
                    </div>             
                    <!-- /card -->                         

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
        
        fila.innerHTML = `
                
            <!-- card -->
            <div class="card h-100">
                <img src="assets/img/${profesional.id_profesional}.png" class="card-img-top" alt="Especialidad Cardiologia">
                <div class="card-body text-center text-sm-start">
                    <h5 class="card-title">Dr/a ${profesional.nombre} ${profesional.apellido}</h5>
                    <p class="card-text">${especialidad.nombre}</p>                                        
                    <a href="javascript:solicitarTurno(${profesional.id_profesional})" class="btn btn-success mt-5">Solicitar Turno</a>                                    
                </div>
            </div>             
            <!-- /card -->                      

        `;

        listaEspecialidades.appendChild(fila);

    });   
}

datosProfesionales = [];     
datosEspecialidades = [];  
datosObraSocial = [];

cargarDesdeLocalstorage();