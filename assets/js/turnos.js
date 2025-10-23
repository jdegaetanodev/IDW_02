let datosTurnos = [];

function cargarTurnosDesdeLocalStorage() {
    cargarDesdeLocalstorage();
    
    const jsonString = localStorage.getItem('datos_medicos');
    if (jsonString) {
        const datos = JSON.parse(jsonString);

        if (!datos.turnos) {
            datos.turnos = [];
            localStorage.setItem('datos_medicos', JSON.stringify(datos));
        }
        
        datosTurnos = datos.turnos || [];
    }
}

function guardarTurnosEnLocalStorage(turnos) {
    const jsonString = localStorage.getItem('datos_medicos');
    let datos = JSON.parse(jsonString);
    datos.turnos = turnos;
    localStorage.setItem('datos_medicos', JSON.stringify(datos));
}


function cargarTablaTurnos() {
    cargarTurnosDesdeLocalStorage();
    
    const tbody = document.querySelector('#tabla-turnos tbody');
    tbody.innerHTML = '';
    
    let contaFilas = 0;
    
    datosTurnos.forEach(turno => {
   
        const profesional = datosProfesionales.find(
            p => p.id_profesional === turno.id_profesional
        );
        
      
        const especialidad = datosEspecialidades.find(
            e => e.id_especialidad === turno.id_especialidad
        );
        
       
        const obraSocial = datosObraSocial.find(
            o => o.id_obra_social === turno.id_obra_social
        );
        
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
            <td>${turno.id_turno}</td>
            <td>${turno.paciente_apellido}, ${turno.paciente_nombre}</td>
            <td>${turno.paciente_documento}</td>
            <td>Dr/a. ${profesional ? profesional.apellido + ' ' + profesional.nombre : 'N/A'}</td>
            <td>${especialidad ? especialidad.nombre : 'N/A'}</td>
            <td>${obraSocial ? obraSocial.nombre : 'N/A'}</td>
            <td>${formatearFecha(turno.fecha)}</td>
            <td>${turno.hora}</td>
            <td class="text-end">$ ${turno.costo_total.toLocaleString('es-AR')}</td>
            <td class="text-center">
                <a href="javascript:editarTurno(${turno.id_turno})" class="btn btn-success btn-sm" title="Editar">
                    <i class="fa-solid fa-pen-to-square"></i>
                </a>
                <a href="javascript:eliminarTurno(${turno.id_turno})" class="btn btn-warning btn-sm" title="Eliminar">
                    <i class="fa-solid fa-trash"></i>
                </a>
            </td>
        `;
        
        tbody.appendChild(fila);
        contaFilas++;
    });
    
    const total = document.createElement('tr');
    total.innerHTML = `<td colspan="10" class="fw-bold">Total de turnos: ${contaFilas}</td>`;
    tbody.appendChild(total);
}

function formatearFecha(fecha) {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
}

function nuevoTurno() {
    limpiarFormularioTurno();
    completarComboProfesionales();
    completarComboEspecialidadesTurno();
    completarComboObrasSocialesTurno();
    
    document.getElementById('id_turno').value = 0;
    document.getElementById('costo_total').value = 0;
    
    mostrarFormularioTurno();
}

function editarTurno(id_turno) {
    limpiarFormularioTurno();
    
    const turnoSeleccionado = datosTurnos.find(turno => 
        turno.id_turno === id_turno
    );
    
    if (turnoSeleccionado) {
        document.getElementById('id_turno').value = turnoSeleccionado.id_turno;
        document.getElementById('paciente_apellido').value = turnoSeleccionado.paciente_apellido;
        document.getElementById('paciente_nombre').value = turnoSeleccionado.paciente_nombre;
        document.getElementById('paciente_documento').value = turnoSeleccionado.paciente_documento;
        
        completarComboEspecialidadesTurno();
        document.getElementById('especialidad_turno').value = turnoSeleccionado.id_especialidad;
        
        completarComboProfesionalesPorEspecialidad(turnoSeleccionado.id_especialidad);
        document.getElementById('profesional_turno').value = turnoSeleccionado.id_profesional;
        
        completarComboObrasSocialesTurno();
        document.getElementById('obrasocial_turno').value = turnoSeleccionado.id_obra_social;
        
        document.getElementById('fecha_turno').value = turnoSeleccionado.fecha;
        document.getElementById('hora_turno').value = turnoSeleccionado.hora;
        document.getElementById('costo_total').value = turnoSeleccionado.costo_total;
        
        mostrarFormularioTurno();
    }
}

function eliminarTurno(id_turno) {
    Swal.fire({
        title: "¿Está seguro?",
        text: "Si elimina el turno, no se podrá recuperar",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            const turnosFiltrados = datosTurnos.filter(turno => 
                turno.id_turno !== id_turno
            );
            
            const seElimino = turnosFiltrados.length < datosTurnos.length;
            
            if (seElimino) {
                guardarTurnosEnLocalStorage(turnosFiltrados);
                datosTurnos = turnosFiltrados;
                
                Swal.fire({
                    title: "Eliminado",
                    text: "El turno fue eliminado con éxito",
                    icon: "success"
                });
                
                cargarTablaTurnos();
            } else {
                Swal.fire({
                    title: "Error",
                    text: "El turno no pudo ser eliminado",
                    icon: "error"
                });
            }
        }
    });
}


function guardarTurno() {
      if (!validarFormularioTurno()) {
        return;
    }
    
    let id_turno = parseInt(document.getElementById('id_turno').value);
    let accion;
    
    if (id_turno === 0) {
        id_turno = getIdTurno();
        accion = 'nuevo';
    } else {
        accion = 'editar';
    }
    
    const turnoActual = {
        id_turno: id_turno,
        paciente_apellido: document.getElementById('paciente_apellido').value,
        paciente_nombre: document.getElementById('paciente_nombre').value,
        paciente_documento: document.getElementById('paciente_documento').value,
        id_profesional: parseInt(document.getElementById('profesional_turno').value),
        id_especialidad: parseInt(document.getElementById('especialidad_turno').value),
        id_obra_social: parseInt(document.getElementById('obrasocial_turno').value),
        fecha: document.getElementById('fecha_turno').value,
        hora: document.getElementById('hora_turno').value,
        costo_total: parseFloat(document.getElementById('costo_total').value)
    };
    
    if (accion === 'nuevo') {
        datosTurnos.push(turnoActual);
        guardarTurnosEnLocalStorage(datosTurnos);
        
        Swal.fire({
            title: "Guardado",
            text: "El turno fue agendado con éxito",
            icon: "success"
        });
    } else {
        const indice = datosTurnos.findIndex(
            t => t.id_turno === turnoActual.id_turno
        );
        
        if (indice !== -1) {
            datosTurnos[indice] = turnoActual;
            guardarTurnosEnLocalStorage(datosTurnos);
            
            Swal.fire({
                title: "Actualizado",
                text: "El turno fue actualizado con éxito",
                icon: "success"
            });
        } else {
            Swal.fire({
                title: "Error",
                text: "No se encontró el turno a actualizar",
                icon: "error"
            });
        }
    }
    
    cargarTablaTurnos();
    cerrarModalTurno();
}

function validarFormularioTurno() {
    const paciente_apellido = document.getElementById('paciente_apellido').value.trim();
    const paciente_nombre = document.getElementById('paciente_nombre').value.trim();
    const paciente_documento = document.getElementById('paciente_documento').value.trim();
    const profesional = document.getElementById('profesional_turno').value;
    const especialidad = document.getElementById('especialidad_turno').value;
    const obraSocial = document.getElementById('obrasocial_turno').value;
    const fecha = document.getElementById('fecha_turno').value;
    const hora = document.getElementById('hora_turno').value;
    
    if (!paciente_apellido) {
        Swal.fire('Error', 'Debe ingresar el apellido del paciente', 'error');
        return false;
    }
    
    if (!paciente_nombre) {
        Swal.fire('Error', 'Debe ingresar el nombre del paciente', 'error');
        return false;
    }
    
    if (!paciente_documento) {
        Swal.fire('Error', 'Debe ingresar el documento del paciente', 'error');
        return false;
    }
    
    if (!especialidad || especialidad === "0") {
        Swal.fire('Error', 'Debe seleccionar una especialidad', 'error');
        return false;
    }
    
    if (!profesional || profesional === "0") {
        Swal.fire('Error', 'Debe seleccionar un profesional', 'error');
        return false;
    }
    
    if (!obraSocial || obraSocial === "0") {
        Swal.fire('Error', 'Debe seleccionar una obra social', 'error');
        return false;
    }
    
    if (!fecha) {
        Swal.fire('Error', 'Debe seleccionar una fecha', 'error');
        return false;
    }
    
    if (!hora) {
        Swal.fire('Error', 'Debe seleccionar una hora', 'error');
        return false;
    }
  
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
        Swal.fire('Error', 'La fecha del turno no puede ser anterior a hoy', 'error');
        return false;
    }
    
    return true;
}

function getIdTurno() {
    if (datosTurnos.length === 0) {
        return 1;
    }
    
    const maximoId = datosTurnos.reduce((maxId, turnoActual) => {
        return Math.max(maxId, turnoActual.id_turno);
    }, 0);
    
    return maximoId + 1;
}

function limpiarFormularioTurno() {
    document.getElementById('paciente_apellido').value = '';
    document.getElementById('paciente_nombre').value = '';
    document.getElementById('paciente_documento').value = '';
    document.getElementById('especialidad_turno').value = '0';
    document.getElementById('profesional_turno').value = '0';
    document.getElementById('obrasocial_turno').value = '0';
    document.getElementById('fecha_turno').value = '';
    document.getElementById('hora_turno').value = '';
    document.getElementById('costo_total').value = '0';
}

function mostrarFormularioTurno() {
    const miModalElemento = document.getElementById('modalTurnos');
    let miModal = bootstrap.Modal.getInstance(miModalElemento);
    
    if (!miModal) {
        miModal = new bootstrap.Modal(miModalElemento);
    }
    
    miModal.show();
}

function cerrarModalTurno() {
    const modalElemento = document.getElementById('modalTurnos');
    const modalInstancia = bootstrap.Modal.getInstance(modalElemento);
    
    if (modalInstancia) {
        modalInstancia.hide();
    }
}

function completarComboEspecialidadesTurno() {
    const cmbEspecialidad = document.getElementById('especialidad_turno');
    cmbEspecialidad.innerHTML = '<option value="0">-- Seleccione una especialidad --</option>';
    
    datosEspecialidades.forEach(especialidad => {
        const nuevaOpcion = document.createElement('option');
        nuevaOpcion.value = especialidad.id_especialidad;
        nuevaOpcion.textContent = especialidad.nombre;
        cmbEspecialidad.appendChild(nuevaOpcion);
    });
}

function completarComboProfesionales() {
    const cmbProfesional = document.getElementById('profesional_turno');
    cmbProfesional.innerHTML = '<option value="0">-- Primero seleccione una especialidad --</option>';
}

function completarComboProfesionalesPorEspecialidad(id_especialidad) {
    const cmbProfesional = document.getElementById('profesional_turno');
    cmbProfesional.innerHTML = '<option value="0">-- Seleccione un profesional --</option>';
    
    const profesionalesFiltrados = datosProfesionales.filter(
        p => p.id_especialidad === parseInt(id_especialidad)
    );
    
    profesionalesFiltrados.forEach(profesional => {
        const nuevaOpcion = document.createElement('option');
        nuevaOpcion.value = profesional.id_profesional;
        nuevaOpcion.textContent = `Dr/a. ${profesional.apellido} ${profesional.nombre}`;
        nuevaOpcion.setAttribute('data-costo', profesional.costo_consulta);
        cmbProfesional.appendChild(nuevaOpcion);
    });
}

function completarComboObrasSocialesTurno() {
    const cmbObraSocial = document.getElementById('obrasocial_turno');
    cmbObraSocial.innerHTML = '<option value="0">-- Seleccione una Obra Social --</option>';
    
    datosObraSocial.forEach(obraSocial => {
        const nuevaOpcion = document.createElement('option');
        nuevaOpcion.value = obraSocial.id_obra_social;
        nuevaOpcion.textContent = obraSocial.nombre;
        cmbObraSocial.appendChild(nuevaOpcion);
    });
}


function calcularCostoTurno() {
    const profesionalSelect = document.getElementById('profesional_turno');
    const opcionSeleccionada = profesionalSelect.options[profesionalSelect.selectedIndex];
    
    if (opcionSeleccionada && opcionSeleccionada.value !== "0") {
        const costo = parseFloat(opcionSeleccionada.getAttribute('data-costo'));
        document.getElementById('costo_total').value = costo;
    } else {
        document.getElementById('costo_total').value = 0;
    }
}

document.addEventListener('DOMContentLoaded', function() {
     cargarTurnosDesdeLocalStorage();
    cargarTablaTurnos();
    

    const btnGuardarTurno = document.getElementById('btnGuardarTurno');
    if (btnGuardarTurno) {
        btnGuardarTurno.addEventListener('click', guardarTurno);
    }
    
    
    const especialidadSelect = document.getElementById('especialidad_turno');
    if (especialidadSelect) {
        especialidadSelect.addEventListener('change', function() {
            const id_especialidad = this.value;
            if (id_especialidad !== "0") {
                completarComboProfesionalesPorEspecialidad(id_especialidad);
            } else {
                completarComboProfesionales();
            }
            document.getElementById('costo_total').value = 0;
        });
    }
    
  
    const profesionalSelect = document.getElementById('profesional_turno');
    if (profesionalSelect) {
        profesionalSelect.addEventListener('change', calcularCostoTurno);
    }
});