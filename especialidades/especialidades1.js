/* VARIABLES GLOBALES */
let datosEspecialidades = [];
const KEY_STORAGE = 'datos_medicos'; 

/* * -------------------------------------------------------------------
 * FUNCIONES DE APOYO (Carga de datos y cierre de modal)
 * -------------------------------------------------------------------
 */

// Carga los datos del localStorage y asigna a la variable global.
function cargarDatos() {
    const jsonString = localStorage.getItem(KEY_STORAGE);
    let datos = {
        profesionales: [], 
        especialidades: [], 
        obrasSociales: []
    };

    if (jsonString) {
        datos = JSON.parse(jsonString);
    }
    
    // Si no existen las especialidades en el objeto principal, las inicializa.
    if (!datos.especialidades) {
        datos.especialidades = [];
    }

    // Asigna el sub-array de especialidades a la variable global
    datosEspecialidades = datos.especialidades;
}

function cerrarModal() {
    const modalElemento = document.getElementById('modalEspecialidades');
    const modalInstancia = bootstrap.Modal.getInstance(modalElemento); 

    if (modalInstancia) {
        modalInstancia.hide();
    }
}

function mostrarFormulario() {
    const miModalElemento = document.getElementById('modalEspecialidades');
    let miModal = bootstrap.Modal.getInstance(miModalElemento);

    if (!miModal) {
        miModal = new bootstrap.Modal(miModalElemento);
    }

    miModal.show();
}

function limpiarFormulario() {
    document.getElementById('id_especialidad').value = 0;
    document.getElementById('nombre_especialidad').value = '';
}


/* * -------------------------------------------------------------------
 * FUNCIONES ABM (CRUD)
 * -------------------------------------------------------------------
 */

function validarFormularioEspecialidad() {
    let esValido = true;
    
    // Asumimos que tienes una función global limpiarTodosLosErrores
    limpiarTodosLosErrores('formEspecialidad'); 
    
    // Validar Nombre
    const nombre = document.getElementById('nombre_especialidad').value;
    if (!validarCampoVacio(nombre)) { // Asumiendo función validarCampoVacio
        mostrarError('nombre_especialidad', 'El nombre de la especialidad es obligatorio'); // Asumiendo función mostrarError
        esValido = false;
    } else if (!validarSoloLetras(nombre)) { // Asumiendo función validarSoloLetras
        mostrarError('nombre_especialidad', 'El nombre solo debe contener letras');
        esValido = false;
    } else {
        limpiarError('nombre_especialidad'); // Asumiendo función limpiarError
    }
    
    return esValido;
}


function getIdEspecialidad() {
    // Busca el ID más grande para asignar el siguiente (como en medicos.js)
    const maximoId = datosEspecialidades.reduce((maxId, especialidadActual) => {        
        return Math.max(maxId, especialidadActual.id_especialidad);
    }, 0); 

    return maximoId + 1;
}

function cargarTablaEspecialidades() {
    cargarDatos(); // Actualiza datosEspecialidades desde localStorage

    const tbody = document.querySelector('#tabla-especialidades tbody');
    tbody.innerHTML = '';

    let contaFilas = 0;

    datosEspecialidades.forEach(especialidad => {
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
            <td class="text-center">${especialidad.id_especialidad}</td>
            <td>${especialidad.nombre}</td>
            <td class="text-center">
                
                <a href="javascript:eliminarEspecialidad(${especialidad.id_especialidad})" class="btn btn-warning btn-sm" title="Eliminar">
                    <i class="fa-solid fa-trash"></i>
                </a>

                <a href="javascript:editarEspecialidad(${especialidad.id_especialidad})" class="btn btn-success btn-sm" title="Editar">
                    <i class="fa-solid fa-pen-to-square"></i>
                </a>                        
            </td>
        `;

        tbody.appendChild(fila);
        contaFilas++;
    });            

    // Agrega la fila del total, adaptada a 3 columnas
    const total = document.createElement('tr');
    total.innerHTML = `<td colspan="3" class="fw-bold">Total de especialidades: ${contaFilas}</td>`;
    tbody.appendChild(total);
}

function nuevaEspecialidad() {
    limpiarFormulario();
    // Asumimos que la función para limpiar errores está en config.js o main.js
    // limpiarTodosLosErrores('formEspecialidad');
    mostrarFormulario();
}

function editarEspecialidad(id_especialidad) {
    limpiarFormulario();
    // limpiarTodosLosErrores('formEspecialidad');

    // Filtrar la especialidad seleccionada
    const especialidadSeleccionada = datosEspecialidades.find(e => 
        e.id_especialidad == id_especialidad
    );
    
    if (especialidadSeleccionada) {
        document.getElementById('id_especialidad').value = especialidadSeleccionada.id_especialidad;
        document.getElementById('nombre_especialidad').value = especialidadSeleccionada.nombre;
        mostrarFormulario();
    } else {
        Swal.fire("Error", "No se encontró la especialidad.", "error");
    }
}


function guardarEspecialidad() {
    // 1. Validar
    if (!validarFormularioEspecialidad()) {
        Swal.fire({
            title: "Error de validación",
            text: "Por favor corrija los errores en el formulario",
            icon: "error"
        });
        return;
    }

    let id_especialidad = parseInt(document.getElementById('id_especialidad').value);
    let accion;

    if(id_especialidad == 0) {
        id_especialidad = getIdEspecialidad();    
        accion = 'nuevo';    
    } else {
        accion = 'editar';
    }

    // 2. Crear/Actualizar Objeto
    // Asumimos la función capitalizarTexto, como en medicos.js
    const nombreCapitalizado = capitalizarTexto(document.getElementById('nombre_especialidad').value);

    const especialidadActual = {
        id_especialidad: id_especialidad,
        nombre: nombreCapitalizado
    };

    // 3. Obtener el Objeto Principal (datos_medicos) de localStorage
    const jsonString = localStorage.getItem(KEY_STORAGE);
    let datosActuales = JSON.parse(jsonString) || {
        profesionales: [], 
        especialidades: [], 
        obrasSociales: []
    }; 
    
    // Inicializa el array si no existe
    if (!datosActuales.especialidades) {
        datosActuales.especialidades = [];
    }

    if(accion == 'nuevo') {
        // AGREGAR
        datosActuales.especialidades.push(especialidadActual);
        Swal.fire({title: "Guardado", text: "La especialidad fue dada de alta con éxito", icon: "success", timer: 2000});        
    } else { 
        // EDITAR
        let datosEspecialidades = datosActuales.especialidades; 
        
        const indice = datosEspecialidades.findIndex(
            e => e.id_especialidad == especialidadActual.id_especialidad
        );

        if (indice !== -1) {
            datosEspecialidades[indice] = especialidadActual;
            datosActuales.especialidades = datosEspecialidades;
            Swal.fire({title: "Actualizado", text: "La especialidad fue actualizada con éxito", icon: "success", timer: 2000});
        } else {
            Swal.fire({title: "Error", text: "No se encontró la especialidad a actualizar", icon: "error"});   
        }
    }
    
    // 4. Guardar en localStorage
    localStorage.setItem(KEY_STORAGE, JSON.stringify(datosActuales));

    // 5. Refrescar UI
    cargarTablaEspecialidades();  
    cerrarModal();
}


function eliminarEspecialidad(id_especialidad) {
    Swal.fire({
        title: "¿Está seguro?",
        text: "Si elimina la especialidad, los profesionales asociados podrían perder su referencia",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            
            // 1. Obtener el Objeto Principal (datos_medicos) de localStorage
            const jsonString = localStorage.getItem(KEY_STORAGE);
            let datosActuales = JSON.parse(jsonString); 
            
            // 2. Filtrar
            const especialidadesFiltradas = datosActuales.especialidades.filter(e => 
                e.id_especialidad !== id_especialidad
            );

            const seElimino = especialidadesFiltradas.length < datosActuales.especialidades.length;
            
            if (seElimino) {
                // 3. Reemplazar y Guardar
                datosActuales.especialidades = especialidadesFiltradas;
                localStorage.setItem(KEY_STORAGE, JSON.stringify(datosActuales));
                
                Swal.fire({title: "Eliminado", text: "La especialidad fue eliminada con éxito", icon: "success", timer: 2000});      
            } else {
                Swal.fire({title: "Error", text: "La especialidad no pudo ser eliminada", icon: "error"});
            }

            // 4. Refrescar UI
            cargarTablaEspecialidades();  
        }
    });
}

/* * -------------------------------------------------------------------
 * INICIALIZACIÓN
 * -------------------------------------------------------------------
 */

// Event Listener para el botón Guardar
let btnGuardarEspecialidad = document.getElementById('btnGuardarEspecialidad');

// Solo si el elemento existe (si estamos en la página correcta)
if (btnGuardarEspecialidad) {
    btnGuardarEspecialidad.addEventListener('click', () => {
        guardarEspecialidad();
    });
}

// Cargar la tabla al inicio
cargarTablaEspecialidades();