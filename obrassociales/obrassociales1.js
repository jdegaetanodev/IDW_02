let datosObrasSociales = [];
const KEY_STORAGE = 'datos_medicos'; 
const MODAL_ID = 'modalObrasSociales'; 
const FORM_ID = 'formObraSocial';

/* * -------------------------------------------------------------------
 * FUNCIONES DE APOYO
 * -------------------------------------------------------------------
 */

// Carga los datos de localStorage, asignando el sub-array obrasSociales.
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
    
    if (!datos.obrasSociales) {
        datos.obrasSociales = [];
    }

    // Asigna el sub-array de obras sociales a la variable global
    datosObrasSociales = datos.obrasSociales;
}

function cerrarModal() {
    const modalElemento = document.getElementById(MODAL_ID);
    const modalInstancia = bootstrap.Modal.getInstance(modalElemento); 

    if (modalInstancia) {
        modalInstancia.hide();
    }
}

function mostrarFormulario() {
    const miModalElemento = document.getElementById(MODAL_ID);
    let miModal = bootstrap.Modal.getInstance(miModalElemento);

    if (!miModal) {
        miModal = new bootstrap.Modal(miModalElemento);
    }

    miModal.show();
}

function limpiarFormulario() {
    document.getElementById('id_obra_social').value = 0;
    document.getElementById('nombre_obra_social').value = '';
    document.getElementById('porcentaje_cobertura').value = '';
}


/* * -------------------------------------------------------------------
 * FUNCIONES ABM (CRUD)
 * -------------------------------------------------------------------
 */

function validarFormularioObraSocial() {
    let esValido = true;
    
    // Limpiar errores previos (asumiendo que tienes esta función)
    // limpiarTodosLosErrores(FORM_ID); 
    
    // Validar Nombre
    const nombre = document.getElementById('nombre_obra_social').value;
    if (!validarCampoVacio(nombre)) { 
        mostrarError('nombre_obra_social', 'El nombre de la Obra Social es obligatorio'); 
        esValido = false;
    } else {
        limpiarError('nombre_obra_social'); 
    }
    
    // Validar Porcentaje de Cobertura
    const cobertura = document.getElementById('porcentaje_cobertura').value;
    const coberturaNum = parseInt(cobertura);
    if (!validarCampoVacio(cobertura)) { 
        mostrarError('porcentaje_cobertura', 'El porcentaje es obligatorio');
        esValido = false;
    } else if (!validarSoloNumeros(cobertura)) { // Asumiendo función validarSoloNumeros
        mostrarError('porcentaje_cobertura', 'Debe ser un número válido');
        esValido = false;
    } else if (coberturaNum < 0 || coberturaNum > 100) {
        mostrarError('porcentaje_cobertura', 'El valor debe estar entre 0 y 100');
        esValido = false;
    } else {
        limpiarError('porcentaje_cobertura');
    }
    
    return esValido;
}


function getIdObraSocial() {
    // Busca el ID más grande para asignar el siguiente
    const maximoId = datosObrasSociales.reduce((maxId, obraActual) => {        
        return Math.max(maxId, obraActual.id_obra_social);
    }, 0); 

    return maximoId + 1;
}

function cargarTablaObrasSociales() {
    cargarDatos(); // Actualiza datosObrasSociales desde localStorage

    const tbody = document.querySelector('#tabla-obras-sociales tbody');
    tbody.innerHTML = '';

    let contaFilas = 0;

    datosObrasSociales.forEach(obraSocial => {
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
            <td class="text-center">${obraSocial.id_obra_social}</td>
            <td>${obraSocial.nombre}</td>
            <td class="text-center">${obraSocial.porcentaje_cobertura}%</td>
            <td class="text-center">
                
                <a href="javascript:eliminarObraSocial(${obraSocial.id_obra_social})" class="btn btn-warning btn-sm" title="Eliminar">
                    <i class="fa-solid fa-trash"></i>
                </a>

                <a href="javascript:editarObraSocial(${obraSocial.id_obra_social})" class="btn btn-success btn-sm" title="Editar">
                    <i class="fa-solid fa-pen-to-square"></i>
                </a>                        
            </td>
        `;

        tbody.appendChild(fila);
        contaFilas++;
    });            

    // Agrega la fila del total, adaptada a 4 columnas
    const total = document.createElement('tr');
    total.innerHTML = `<td colspan="4" class="fw-bold">Total de Obras Sociales: ${contaFilas}</td>`;
    tbody.appendChild(total);
}

function nuevaObraSocial() {
    limpiarFormulario();
    // limpiarTodosLosErrores(FORM_ID);
    mostrarFormulario();
}

function editarObraSocial(id_obra_social) {
    limpiarFormulario();
    // limpiarTodosLosErrores(FORM_ID);

    // Filtrar la obra social seleccionada
    const obraSeleccionada = datosObrasSociales.find(o => 
        o.id_obra_social == id_obra_social
    );
    
    if (obraSeleccionada) {
        document.getElementById('id_obra_social').value = obraSeleccionada.id_obra_social;
        document.getElementById('nombre_obra_social').value = obraSeleccionada.nombre;
        document.getElementById('porcentaje_cobertura').value = obraSeleccionada.porcentaje_cobertura;
        mostrarFormulario();
    } else {
        Swal.fire("Error", "No se encontró la Obra Social.", "error");
    }
}


function guardarObraSocial() {
    // 1. Validar
    if (!validarFormularioObraSocial()) {
        Swal.fire({
            title: "Error de validación",
            text: "Por favor corrija los errores en el formulario",
            icon: "error"
        });
        return;
    }

    let id_obra_social = parseInt(document.getElementById('id_obra_social').value);
    let accion;

    if(id_obra_social == 0) {
        id_obra_social = getIdObraSocial();    
        accion = 'nuevo';    
    } else {
        accion = 'editar';
    }

    // 2. Crear/Actualizar Objeto
    const nombreCapitalizado = capitalizarTexto(document.getElementById('nombre_obra_social').value); // Asumiendo capitalizarTexto

    const obraSocialActual = {
        id_obra_social: id_obra_social,
        nombre: nombreCapitalizado,
        porcentaje_cobertura: parseInt(document.getElementById('porcentaje_cobertura').value)
    };

    // 3. Obtener el Objeto Principal (datos_medicos) de localStorage
    const jsonString = localStorage.getItem(KEY_STORAGE);
    let datosActuales = JSON.parse(jsonString) || {
        profesionales: [], 
        especialidades: [], 
        obrasSociales: []
    }; 
    
    // Inicializa el array si no existe
    if (!datosActuales.obrasSociales) {
        datosActuales.obrasSociales = [];
    }

    if(accion == 'nuevo') {
        // AGREGAR
        datosActuales.obrasSociales.push(obraSocialActual);
        Swal.fire({title: "Guardado", text: "La Obra Social fue dada de alta con éxito", icon: "success", timer: 2000});        
    } else { 
        // EDITAR
        let datosObras = datosActuales.obrasSociales; 
        
        const indice = datosObras.findIndex(
            o => o.id_obra_social == obraSocialActual.id_obra_social
        );

        if (indice !== -1) {
            datosObras[indice] = obraSocialActual;
            datosActuales.obrasSociales = datosObras;
            Swal.fire({title: "Actualizado", text: "La Obra Social fue actualizada con éxito", icon: "success", timer: 2000});
        } else {
            Swal.fire({title: "Error", text: "No se encontró la Obra Social a actualizar", icon: "error"});   
        }
    }
    
    // 4. Guardar en localStorage
    localStorage.setItem(KEY_STORAGE, JSON.stringify(datosActuales));

    // 5. Refrescar UI
    cargarTablaObrasSociales();  
    cerrarModal();
}


function eliminarObraSocial(id_obra_social) {
    Swal.fire({
        title: "¿Está seguro?",
        text: "Si elimina la Obra Social, los profesionales y turnos asociados podrían perder su referencia",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarla",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            
            // 1. Obtener el Objeto Principal (datos_medicos) de localStorage
            const jsonString = localStorage.getItem(KEY_STORAGE);
            let datosActuales = JSON.parse(jsonString); 
            
            // 2. Filtrar
            const obrasSocialesFiltradas = datosActuales.obrasSociales.filter(o => 
                o.id_obra_social !== id_obra_social
            );

            const seElimino = obrasSocialesFiltradas.length < datosActuales.obrasSociales.length;
            
            if (seElimino) {
                // 3. Reemplazar y Guardar
                datosActuales.obrasSociales = obrasSocialesFiltradas;
                localStorage.setItem(KEY_STORAGE, JSON.stringify(datosActuales));
                
                Swal.fire({title: "Eliminada", text: "La Obra Social fue eliminada con éxito", icon: "success", timer: 2000});      
            } else {
                Swal.fire({title: "Error", text: "La Obra Social no pudo ser eliminada", icon: "error"});
            }

            // 4. Refrescar UI
            cargarTablaObrasSociales();  
        }
    });
}

/* * -------------------------------------------------------------------
 * INICIALIZACIÓN
 * -------------------------------------------------------------------
 */

// Event Listener para el botón Guardar
let btnGuardarObraSocial = document.getElementById('btnGuardarObraSocial');

// Solo si el elemento existe (si estamos en la página correcta)
if (btnGuardarObraSocial) {
    btnGuardarObraSocial.addEventListener('click', () => {
        guardarObraSocial();
    });
}

// Cargar la tabla al inicio
cargarTablaObrasSociales();