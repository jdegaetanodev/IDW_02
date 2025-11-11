function validarFormularioProfesional() {
    let esValido = true;
    
    limpiarTodosLosErrores('formProfesional');
    
    const matricula = document.getElementById('matricula').value;
    if (!validarCampoVacio(matricula)) {
        mostrarError('matricula', 'La matrícula es obligatoria');
        esValido = false;
    } else if (!validarMatricula(matricula)) {
        mostrarError('matricula', 'Formato inválido. Debe ser: XX-12345 (Ej: CM-12345)');
        esValido = false;
    } else {
        limpiarError('matricula');
    }
    
    const apellido = document.getElementById('apellido').value;
    if (!validarCampoVacio(apellido)) {
        mostrarError('apellido', 'El apellido es obligatorio');
        esValido = false;
    } else if (!validarSoloLetras(apellido)) {
        mostrarError('apellido', 'El apellido solo debe contener letras');
        esValido = false;
    } else if (!validarLongitudMinima(apellido, 2)) {
        mostrarError('apellido', 'El apellido debe tener al menos 2 caracteres');
        esValido = false;
    } else {
        limpiarError('apellido');
    }
    
    const nombre = document.getElementById('nombre').value;
    if (!validarCampoVacio(nombre)) {
        mostrarError('nombre', 'El nombre es obligatorio');
        esValido = false;
    } else if (!validarSoloLetras(nombre)) {
        mostrarError('nombre', 'El nombre solo debe contener letras');
        esValido = false;
    } else if (!validarLongitudMinima(nombre, 2)) {
        mostrarError('nombre', 'El nombre debe tener al menos 2 caracteres');
        esValido = false;
    } else {
        limpiarError('nombre');
    }
    
    const especialidad = document.getElementById('especialidad').value;
    if (!validarSelect(especialidad)) {
        mostrarError('especialidad', 'Debe seleccionar una especialidad');
        esValido = false;
    } else {
        limpiarError('especialidad');
    }
    
    const obraSocial = document.getElementById('obrasocial').value;
    if (!validarSelect(obraSocial)) {
        mostrarError('obrasocial', 'Debe seleccionar una obra social');
        esValido = false;
    } else {
        limpiarError('obrasocial');
    }
    
    const consulta = document.getElementById('consulta').value;
    if (!validarCampoVacio(consulta)) {
        mostrarError('consulta', 'El costo de consulta es obligatorio');
        esValido = false;
    } else if (!validarSoloNumeros(consulta)) {
        mostrarError('consulta', 'El costo debe ser un número válido');
        esValido = false;
    } else if (!validarRangoNumerico(parseInt(consulta), 1000, 100000)) {
        mostrarError('consulta', 'El costo debe estar entre $1.000 y $100.000');
        esValido = false;
    } else {
        limpiarError('consulta');
    }
    
    return esValido;
}

function cargarTablaProfesionales() {
    cargarDesdeLocalstorage();

    const tbody = document.querySelector('#tabla-profesionales tbody');
    tbody.innerHTML = '';

    let contaFilas = 0;

    datosProfesionales.forEach(profesional => {
        const especialidad = datosEspecialidades.find(
            e => e.id_especialidad === profesional.id_especialidad
        );

        const obraSocial = datosObraSocial.find(
            e => e.id_obra_social === profesional.id_obra_social
        );                
        
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
            <td>${profesional.matricula}</td>
            <td>${profesional.apellido}</td>
            <td>${profesional.nombre}</td>
            <td>${especialidad.nombre}</td>
            <td>${obraSocial.nombre}</td>
            <td class="text-end">$ ${profesional.costo_consulta.toLocaleString('es-AR')}</td>
            <td class="text-center">
                
                <a href="javascript:eliminarProfesional(${profesional.id_profesional})" class="btn btn-warning btn-sm" title="Eliminar">
                    <i class="fa-solid fa-trash"></i>
                </a>

                <a href="javascript:editarProfesional(${profesional.id_profesional})" class="btn btn-success btn-sm" title="Editar">
                    <i class="fa-solid fa-pen-to-square"></i>
                </a>                        

            </td>
        `;

        tbody.appendChild(fila);
        contaFilas++;
    });            

    const total = document.createElement('tr');
    total.innerHTML = `<td colspan="7" class="fw-bold">Total de profesionales: ${contaFilas}</td>`;
    tbody.appendChild(total);
}

function nuevoProfesional() {
    limpiarFormulario();
    limpiarTodosLosErrores('formProfesional');
    
    // ✅ COMPLETAR COMBOS AL CREAR NUEVO
    completarComboEspecialidades();
    completarComboObrasSociales();
    
    document.getElementById('id_profesional').value = 0;
    mostrarFormulario();
}

function editarProfesional(id_profesional) {
    limpiarFormulario();
    limpiarTodosLosErrores('formProfesional');

    // ✅ PRIMERO COMPLETAR LOS COMBOS
    completarComboEspecialidades();
    completarComboObrasSociales();

    // Filtrar el profesional seleccionado
    const profesionalSeleccionado = datosProfesionales.find(profesional => 
        profesional.id_profesional == id_profesional
    );
    
    if (!profesionalSeleccionado) {
        Swal.fire('Error', 'Profesional no encontrado', 'error');
        return;
    }
    
    document.getElementById('id_profesional').value = profesionalSeleccionado.id_profesional;
    document.getElementById('matricula').value = profesionalSeleccionado.matricula;
    document.getElementById('apellido').value = profesionalSeleccionado.apellido;
    document.getElementById('nombre').value = profesionalSeleccionado.nombre;
    
    // ✅ AHORA SÍ SELECCIONAR LOS VALORES
    document.getElementById('especialidad').value = profesionalSeleccionado.id_especialidad;
    document.getElementById('obrasocial').value = profesionalSeleccionado.id_obra_social;
    document.getElementById('consulta').value = profesionalSeleccionado.costo_consulta; 

    mostrarFormulario();
}

function limpiarFormulario() {
    document.getElementById('matricula').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('especialidad').value = 0;
    document.getElementById('obrasocial').value = 0;    
    document.getElementById('consulta').value = '';    
}

function mostrarFormulario() {
    const miModalElemento = document.getElementById('profesionales');
    let miModal = bootstrap.Modal.getInstance(miModalElemento);

    if (!miModal) {
        miModal = new bootstrap.Modal(miModalElemento);
    }

    miModal.show();
}

// ✅ ELIMINAR CON VALIDACIÓN DE INTEGRIDAD REFERENCIAL
function eliminarProfesional(id_profesional) {
    // VERIFICAR SI TIENE TURNOS ASIGNADOS
    const datosCompletos = JSON.parse(localStorage.getItem('datos_medicos'));
    const turnosAsociados = (datosCompletos.turnos || []).filter(
        t => t.id_profesional === id_profesional
    );
    
    // Si tiene turnos, bloquear eliminación
    if (turnosAsociados.length > 0) {
        Swal.fire({
            icon: 'error',
            title: 'No se puede eliminar',
            text: `Este profesional tiene ${turnosAsociados.length} turno(s) asignado(s). Primero debe eliminar o reasignar los turnos.`,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#dc3545'
        });
        return;
    }
    
    // Si no tiene turnos, continuar con eliminación
    Swal.fire({
        title: "¿Está seguro?",
        text: "Si lo elimina, no se podrá recuperar",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            const profesionalesFiltrado = datosProfesionales.filter(profesional => 
                profesional.id_profesional !== id_profesional
            );

            const seElimino = profesionalesFiltrado.length < datosProfesionales.length;
            
            if (seElimino) {
                datos.profesionales = profesionalesFiltrado;
                localStorage.setItem('datos_medicos', JSON.stringify(datos));
                
                Swal.fire({
                    title: "Eliminado",
                    text: "El profesional fue eliminado con éxito",
                    icon: "success",
                    timer: 2000
                });      

                cargarTablaProfesionales();  
                return;
            }
            
            Swal.fire({
                title: "Error",
                text: "El profesional no pudo ser eliminado",
                icon: "error"
            });
        }
    });
}

function getId() {
    const maximoId = datosProfesionales.reduce((maxId, profesionalActual) => {        
        return Math.max(maxId, profesionalActual.id_profesional);
    }, 0); 

    return maximoId + 1;
}

function guardarProfesional() {
    if (!validarFormularioProfesional()) {
        Swal.fire({
            title: "Error de validación",
            text: "Por favor corrija los errores en el formulario",
            icon: "error"
        });
        return;
    }

    let id_profesional = parseInt(document.getElementById('id_profesional').value);
    let accion;

    if(id_profesional == 0) {
        id_profesional = getId();    
        accion = 'nuevo';    
    } else {
        accion = 'editar';
    }

    const apellidoCapitalizado = capitalizarTexto(document.getElementById('apellido').value);
    const nombreCapitalizado = capitalizarTexto(document.getElementById('nombre').value);
    const matriculaFormateada = document.getElementById('matricula').value.toUpperCase();

    const profesionalActual = {
        id_profesional: id_profesional,
        matricula: matriculaFormateada,
        nombre: nombreCapitalizado,
        apellido: apellidoCapitalizado,
        id_obra_social: parseInt(document.getElementById('obrasocial').value),
        id_especialidad: parseInt(document.getElementById('especialidad').value),
        costo_consulta: parseInt(document.getElementById('consulta').value)
    };

    if(accion == 'nuevo') {
        const jsonString = localStorage.getItem('datos_medicos');
        let datosActuales = JSON.parse(jsonString);
        datosActuales.profesionales.push(profesionalActual);
        localStorage.setItem('datos_medicos', JSON.stringify(datosActuales));

        Swal.fire({
            title: "Guardado",
            text: "El profesional fue dado de alta con éxito",
            icon: "success",
            timer: 2000
        });        
    } else {
        const jsonString = localStorage.getItem('datos_medicos');
        let datosActuales = JSON.parse(jsonString); 
        let datosProfesionales = datosActuales.profesionales; 
        
        const indice = datosProfesionales.findIndex(
            p => p.id_profesional == profesionalActual.id_profesional
        );

        if (indice !== -1) {
            datosProfesionales[indice] = profesionalActual;
            datosActuales.profesionales = datosProfesionales;
            localStorage.setItem('datos_medicos', JSON.stringify(datosActuales));

            Swal.fire({
                title: "Actualizado",
                text: "El profesional fue actualizado con éxito",
                icon: "success",
                timer: 2000
            });
        } else {
            Swal.fire({
                title: "Error",
                text: "No se encontró el profesional a actualizar",
                icon: "error"
            });            
        }
    }

    cargarTablaProfesionales();  
    cerrarModal();
}

function cerrarModal() {
    const modalElemento = document.getElementById('profesionales');
    const modalInstancia = bootstrap.Modal.getInstance(modalElemento); 

    if (modalInstancia) {
        modalInstancia.hide();
    }
}

function completarComboEspecialidades() {
    const cmbEspecialidad = document.getElementById('especialidad');
    cmbEspecialidad.innerHTML = '<option value="0">-- Seleccione una especialidad --</option>';

    datosEspecialidades.forEach(especialidad => {
        const nuevaOpcion = document.createElement('option');
        nuevaOpcion.value = especialidad.id_especialidad;
        nuevaOpcion.textContent = especialidad.nombre;
        cmbEspecialidad.appendChild(nuevaOpcion);
    });  
}

function completarComboObrasSociales() {
    let cmbObraSocial = document.getElementById('obrasocial');
    cmbObraSocial.innerHTML = '<option value="0">-- Seleccione una Obra Social --</option>';

    datosObraSocial.forEach(obraSocial => {
        const nuevaOpcion = document.createElement('option');
        nuevaOpcion.value = obraSocial.id_obra_social;
        nuevaOpcion.textContent = obraSocial.nombre;
        cmbObraSocial.appendChild(nuevaOpcion);
    });              
}

function capitalizarTexto(texto) {
    return texto.toLowerCase().replace(/\b\w/g, letra => letra.toUpperCase());
}

datosProfesionales = [];     
datosEspecialidades = [];  
datosObraSocial = [];

cargarDesdeLocalstorage();

let btnGuardarProfesional = document.getElementById('btnGuardarProfesional');
btnGuardarProfesional.addEventListener('click', () => {
    guardarProfesional();
});

cargarTablaProfesionales();