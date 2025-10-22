function logout() {
    // 1. Borrar la información de la sesión del localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    
    // 🚨 Mostrar alerta de sesión cerrada con SweetAlert2 🚨
    Swal.fire({
        icon: 'info', // Puedes usar 'success' o 'info'
        title: 'Sesión Cerrada',
        html: 'Has cerrado sesión correctamente. ¡Vuelve pronto!<br>Esta ventana se cerrará automáticamente en 2 segundos.',
        showConfirmButton: false, // Opcional: No mostrar el botón
        timer: 2000 // Opcional: Cerrar automáticamente después de 2 segundos
    }).then(() => {
        // 2. Redirigir a la página principal (index.html) después de que SweetAlert se cierre
        window.location.href = 'index.html'; 
    });
}

function checkAuthentication() {
    // 1. Obtener estado de logueo y ROL del usuario
    const isLogged = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole'); 

    // 2. Obtener referencias
    const btnIngresar = document.getElementById('btn-ingresar');
    const btnSolicitarTurno = document.getElementById('btn-solicitar-turno');
    const navLogout = document.getElementById('nav-logout'); 
    const userIcon = document.getElementById('user-icon'); // <--- Referencia al nuevo ícono

    if (btnIngresar && btnSolicitarTurno && navLogout && userIcon) {
        if (isLogged) {
            // USUARIO LOGUEADO: 
            
            btnIngresar.classList.add('d-none');
            navLogout.classList.remove('d-none');         
            
            // LÓGICA DEL ÍCONO: Muestra la silueta
            userIcon.classList.remove('d-none');

            // LÓGICA DEL BOTÓN SOLICITAR TURNO (oculto para admin)
            if (userRole === 'administrador') {
                btnSolicitarTurno.classList.add('d-none');
            } else {
                btnSolicitarTurno.classList.remove('d-none');
            }

        } else {
            // USUARIO NO LOGUEADO:
            
            btnIngresar.classList.remove('d-none');
            btnSolicitarTurno.classList.add('d-none');
            navLogout.classList.add('d-none'); 
            
            // LÓGICA DEL ÍCONO: Oculta la silueta
            userIcon.classList.add('d-none');
        }
    }
}

window.onload = checkAuthentication;

function solicitarTurno()
{
    //alert('En desarrollo');
    window.location.href = 'turnos.html';
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
            <i class="fa-solid fa-backward"></i>
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