let datosTurnos = [];

console.log('✓ turnos.js cargado correctamente');

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

// CARGAR TABLA CON ESTADOS VISUALES
function cargarTablaTurnos() {
    cargarTurnosDesdeLocalStorage();
    
    const tbody = document.querySelector('#tabla-turnos tbody');
    tbody.innerHTML = '';
    
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    
    let turnosFiltrados = datosTurnos;
    
    if (userRole === 'paciente') {
        turnosFiltrados = datosTurnos.filter(turno => 
            turno.paciente_documento === username || 
            turno.username === username
        );
    }
    
    let contaFilas = 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    turnosFiltrados.forEach(turno => {
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
        
        // COLOREAR SEGÚN ESTADO DEL TURNO
        const fechaTurno = new Date(turno.fecha);
        fechaTurno.setHours(0, 0, 0, 0);
        
        if (fechaTurno < hoy) {
            fila.classList.add('table-secondary');
        } else if (fechaTurno.getTime() === hoy.getTime()) {
            fila.classList.add('table-warning');
        }
        
        let botonesAccion = '';
        if (userRole === 'administrador') {
            botonesAccion = `
                <a href="javascript:editarTurno(${turno.id_turno})" class="btn btn-success btn-sm" title="Editar">
                    <i class="fa-solid fa-pen-to-square"></i>
                </a>
                <a href="javascript:eliminarTurno(${turno.id_turno})" class="btn btn-warning btn-sm" title="Eliminar">
                    <i class="fa-solid fa-trash"></i>
                </a>
            `;
        } else {
            if (fechaTurno >= hoy) {
                botonesAccion = `
                    <a href="javascript:cancelarTurno(${turno.id_turno})" class="btn btn-danger btn-sm" title="Cancelar">
                        <i class="fa-solid fa-times"></i> Cancelar
                    </a>
                `;
            } else {
                botonesAccion = `<span class="badge bg-secondary">Finalizado</span>`;
            }
        }
        
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
                ${botonesAccion}
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

// VALIDACIÓN DE TURNO DUPLICADO
function validarTurnoDuplicado(id_profesional, fecha, hora, id_turno_actual = 0) {
    const turnoExistente = datosTurnos.find(turno => 
        turno.id_profesional === parseInt(id_profesional) &&
        turno.fecha === fecha &&
        turno.hora === hora &&
        turno.id_turno !== id_turno_actual
    );
    
    return !turnoExistente;
}

// VALIDACIÓN DE DÍA HÁBIL
function validarDiaHabil(fecha) {
    const fechaObj = new Date(fecha + 'T00:00:00');
    const dia = fechaObj.getDay();
    return dia !== 0 && dia !== 6;
}

// VALIDACIÓN DE RANGO DE FECHA (90 días)
function validarRangoFecha(fecha, diasMaximos = 90) {
    const fechaSeleccionada = new Date(fecha + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaMaxima = new Date(hoy);
    fechaMaxima.setDate(fechaMaxima.getDate() + diasMaximos);
    
    return fechaSeleccionada >= hoy && fechaSeleccionada <= fechaMaxima;
}

// VALIDACIÓN DE HORARIO LABORAL
function validarHorarioLaboral(hora, horaInicio = "08:00", horaFin = "22:00") {
    const [horaNum, minNum] = hora.split(':').map(Number);
    const [horaInicioNum, minInicioNum] = horaInicio.split(':').map(Number);
    const [horaFinNum, minFinNum] = horaFin.split(':').map(Number);
    
    const minutosHora = horaNum * 60 + minNum;
    const minutosInicio = horaInicioNum * 60 + minInicioNum;
    const minutosFin = horaFinNum * 60 + minFinNum;
    
    return minutosHora >= minutosInicio && minutosHora <= minutosFin;
}

// NUEVO TURNO SEGÚN ROL
function nuevoTurno() {
    console.log('=== FUNCIÓN nuevoTurno() LLAMADA ===');
    
    limpiarFormularioTurno();
    completarComboEspecialidadesTurno();
    completarComboObrasSocialesTurno();
    completarComboProfesionales();
    completarCombosHora();
    
    document.getElementById('id_turno').value = 0;
    document.getElementById('costo_total').value = 0;
    
    const userRole = localStorage.getItem('userRole');
    
    if (userRole === 'paciente') {
        document.getElementById('campos-paciente-admin').classList.add('d-none');
        document.getElementById('info-paciente-readonly').classList.remove('d-none');
        
        const username = localStorage.getItem('username');
        document.getElementById('paciente_documento').value = username;
        document.getElementById('paciente_apellido').value = 'Paciente';
        document.getElementById('paciente_nombre').value = username;
    } else {
        document.getElementById('campos-paciente-admin').classList.remove('d-none');
        document.getElementById('info-paciente-readonly').classList.add('d-none');
    }
    
    mostrarFormularioTurno();
}

// ABRIR MODAL CON PROFESIONAL PRESELECCIONADO
function nuevoTurnoConProfesional(id_profesional) {
    console.log('=== nuevoTurnoConProfesional ===', id_profesional);
    
    const profesional = datosProfesionales.find(p => p.id_profesional === id_profesional);
    
    if (!profesional) {
        nuevoTurno();
        return;
    }
    
    limpiarFormularioTurno();
    completarComboEspecialidadesTurno();
    completarComboObrasSocialesTurno();
    completarCombosHora();
    
    document.getElementById('id_turno').value = 0;
    document.getElementById('costo_total').value = 0;
    
    const userRole = localStorage.getItem('userRole');
    
    if (userRole === 'paciente') {
        document.getElementById('campos-paciente-admin').classList.add('d-none');
        document.getElementById('info-paciente-readonly').classList.remove('d-none');
        
        const username = localStorage.getItem('username');
        document.getElementById('paciente_documento').value = username;
        document.getElementById('paciente_apellido').value = 'Paciente';
        document.getElementById('paciente_nombre').value = username;
    } else {
        document.getElementById('campos-paciente-admin').classList.remove('d-none');
        document.getElementById('info-paciente-readonly').classList.add('d-none');
    }
    
    document.getElementById('especialidad_turno').value = profesional.id_especialidad;
    completarComboProfesionalesPorEspecialidad(profesional.id_especialidad);
    document.getElementById('profesional_turno').value = id_profesional;
    calcularCostoTurno();
    
    mostrarFormularioTurno();
}

function editarTurno(id_turno) {
    limpiarFormularioTurno();
    
    const turnoSeleccionado = datosTurnos.find(turno => turno.id_turno === id_turno);
    
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
        
        completarCombosHora();
        if (turnoSeleccionado.hora) {
            const [hora, minuto] = turnoSeleccionado.hora.split(':');
            document.getElementById('hora_solo_hora').value = hora;
            document.getElementById('hora_solo_minuto').value = minuto;
            document.getElementById('hora_turno').value = turnoSeleccionado.hora;
        }
        
        document.getElementById('costo_total').value = turnoSeleccionado.costo_total;
        
        mostrarFormularioTurno();
    }
}

function cancelarTurno(id_turno) {
    Swal.fire({
        title: "¿Cancelar turno?",
        text: "¿Está seguro que desea cancelar este turno?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, cancelar turno",
        cancelButtonText: "No, mantener"
    }).then((result) => {
        if (result.isConfirmed) {
            ejecutarEliminacion(id_turno);
        }
    });
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
            ejecutarEliminacion(id_turno);
        }
    });
}

function ejecutarEliminacion(id_turno) {
    const turnosFiltrados = datosTurnos.filter(turno => turno.id_turno !== id_turno);
    const seElimino = turnosFiltrados.length < datosTurnos.length;
    
    if (seElimino) {
        guardarTurnosEnLocalStorage(turnosFiltrados);
        datosTurnos = turnosFiltrados;
        
        Swal.fire({
            title: "Eliminado",
            text: "El turno fue eliminado con éxito",
            icon: "success",
            timer: 2000
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

// GUARDAR TURNO CON VALIDACIONES MEJORADAS
function guardarTurno() {
    if (!validarFormularioTurno()) {
        return;
    }
    
    let id_turno = parseInt(document.getElementById('id_turno').value);
    let accion = (id_turno === 0) ? 'nuevo' : 'editar';
    
    if (accion === 'nuevo') {
        id_turno = getIdTurno();
    }
    
    const username = localStorage.getItem('username');
    const id_profesional = parseInt(document.getElementById('profesional_turno').value);
    const profesional = datosProfesionales.find(p => p.id_profesional === id_profesional);
    
    const turnoActual = {
        id_turno: id_turno,
        paciente_apellido: document.getElementById('paciente_apellido').value,
        paciente_nombre: document.getElementById('paciente_nombre').value,
        paciente_documento: document.getElementById('paciente_documento').value,
        id_profesional: id_profesional,
        id_especialidad: parseInt(document.getElementById('especialidad_turno').value),
        id_obra_social: parseInt(document.getElementById('obrasocial_turno').value),
        fecha: document.getElementById('fecha_turno').value,
        hora: document.getElementById('hora_turno').value,
        costo_total: parseFloat(document.getElementById('costo_total').value),
        username: username
    };
    
    if (accion === 'nuevo') {
        datosTurnos.push(turnoActual);
        guardarTurnosEnLocalStorage(datosTurnos);
        
        Swal.fire({
            icon: 'success',
            title: '✓ Turno Agendado',
            html: `
                <div style="text-align: left; margin: 20px;">
                    <p><strong>📋 Paciente:</strong> ${turnoActual.paciente_nombre} ${turnoActual.paciente_apellido}</p>
                    <p><strong>👨‍⚕️ Profesional:</strong> Dr/a. ${profesional ? profesional.apellido + ' ' + profesional.nombre : 'N/A'}</p>
                    <p><strong>📅 Fecha:</strong> ${formatearFecha(turnoActual.fecha)}</p>
                    <p><strong>🕐 Hora:</strong> ${turnoActual.hora}</p>
                    <p><strong>💰 Costo:</strong> $${turnoActual.costo_total.toLocaleString('es-AR')}</p>
                </div>
            `,
            timer: 5000,
            showConfirmButton: true,
            confirmButtonText: 'Entendido'
        });
    } else {
        const indice = datosTurnos.findIndex(t => t.id_turno === turnoActual.id_turno);
        
        if (indice !== -1) {
            datosTurnos[indice] = turnoActual;
            guardarTurnosEnLocalStorage(datosTurnos);
            
            Swal.fire({
                title: "Actualizado",
                text: "El turno fue actualizado con éxito",
                icon: "success",
                timer: 2000
            });
        }
    }
    
    cargarTablaTurnos();
    cerrarModalTurno();
}

// VALIDACIÓN COMPLETA DEL FORMULARIO
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
    
    if (!hora || hora === "") {
        Swal.fire('Error', 'Debe seleccionar una hora', 'error');
        return false;
    }
  
    const fechaSeleccionada = new Date(fecha + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
        Swal.fire('Error', 'La fecha del turno no puede ser anterior a hoy', 'error');
        return false;
    }
    
    if (!validarDiaHabil(fecha)) {
        Swal.fire({
            icon: 'error',
            title: 'Día no hábil',
            text: 'No se pueden agendar turnos los fines de semana',
            confirmButtonColor: '#dc3545'
        });
        return false;
    }
    
    if (!validarRangoFecha(fecha, 90)) {
        Swal.fire({
            icon: 'error',
            title: 'Fecha fuera de rango',
            text: 'Solo puede agendar turnos hasta 90 días en el futuro',
            confirmButtonColor: '#dc3545'
        });
        return false;
    }
    
    if (!validarHorarioLaboral(hora, "08:00", "22:00")) {
        Swal.fire({
            icon: 'error',
            title: 'Horario no válido',
            text: 'El horario de atención es de 08:00 a 22:00 hs',
            confirmButtonColor: '#dc3545'
        });
        return false;
    }
    
    const id_turno_actual = parseInt(document.getElementById('id_turno').value);
    if (!validarTurnoDuplicado(profesional, fecha, hora, id_turno_actual)) {
        Swal.fire({
            icon: 'error',
            title: 'Turno no disponible',
            text: 'Ya existe un turno para este profesional en la fecha y hora seleccionada',
            confirmButtonColor: '#dc3545'
        });
        return false;
    }
    
    return true;
}

function getIdTurno() {
    if (datosTurnos.length === 0) return 1;
    
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
    document.getElementById('hora_solo_hora').value = '';
    document.getElementById('hora_solo_minuto').value = '';
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

function completarCombosHora() {
    const cmbHora = document.getElementById('hora_solo_hora');
    const cmbMinuto = document.getElementById('hora_solo_minuto');
    
    cmbHora.innerHTML = '<option value="">HH</option>';
    cmbMinuto.innerHTML = '<option value="">MM</option>';
    
    for (let h = 8; h <= 22; h++) {
        const horaStr = h.toString().padStart(2, '0');
        const nuevaOpcion = document.createElement('option');
        nuevaOpcion.value = horaStr;
        nuevaOpcion.textContent = horaStr;
        cmbHora.appendChild(nuevaOpcion);
    }
    
    const minutosValidos = [0, 15, 30, 45];
    minutosValidos.forEach(m => {
        const minutoStr = m.toString().padStart(2, '0');
        const nuevaOpcion = document.createElement('option');
        nuevaOpcion.value = minutoStr;
        nuevaOpcion.textContent = minutoStr;
        cmbMinuto.appendChild(nuevaOpcion);
    });
}

function combinarHoraMinuto() {
    const hora = document.getElementById('hora_solo_hora').value;
    const minuto = document.getElementById('hora_solo_minuto').value;
    
    if (hora && minuto) {
        document.getElementById('hora_turno').value = `${hora}:${minuto}`;
    } else {
        document.getElementById('hora_turno').value = '';
    }
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

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIALIZANDO MÓDULO DE TURNOS ===');
    
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
    
    const horaSoloHora = document.getElementById('hora_solo_hora');
    const horaSoloMinuto = document.getElementById('hora_solo_minuto');
    
    if (horaSoloHora) {
        horaSoloHora.addEventListener('change', combinarHoraMinuto);
    }
    
    if (horaSoloMinuto) {
        horaSoloMinuto.addEventListener('change', combinarHoraMinuto);
    }
    
    console.log('=== MÓDULO DE TURNOS INICIALIZADO ===');
});