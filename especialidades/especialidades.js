let datosEspecialidades = [];

// Cargar datos desde localStorage
function cargarDesdeLocalstorage() {
    const datosJSON = localStorage.getItem('datos_medicos');
    if (datosJSON) {
        const datos = JSON.parse(datosJSON);
        datosEspecialidades = datos.especialidades || [];
    } else {
        datosEspecialidades = [];
    }
}

// Guardar datos en localStorage
function guardarEnLocalstorage() {
    let datos = localStorage.getItem('datos_medicos');
    let objDatos = datos ? JSON.parse(datos) : {};
    objDatos.especialidades = datosEspecialidades;
    localStorage.setItem('datos_medicos', JSON.stringify(objDatos));
}

// Cargar tabla con especialidades
function cargarTablaEspecialidades() {
    cargarDesdeLocalstorage();

    const tbody = document.querySelector('#tabla-especialidades tbody');
    tbody.innerHTML = '';

    let contaFilas = 0;

    datosEspecialidades.forEach(especialidad => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="text-center">${especialidad.id_especialidad}</td>
            <td>${especialidad.nombre}</td>
            <td class="text-center">
                <button class="btn btn-success btn-sm me-1" title="Editar" onclick="editarEspecialidad(${especialidad.id_especialidad})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn btn-warning btn-sm" title="Eliminar" onclick="eliminarEspecialidad(${especialidad.id_especialidad})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(fila);
        contaFilas++;
    });

    // Total
    const total = document.createElement('tr');
    total.innerHTML = `<td colspan="3" class="fw-bold text-end">Total de especialidades: ${contaFilas}</td>`;
    tbody.appendChild(total);
}

// Obtener nuevo ID
function getId() {
    if (datosEspecialidades.length === 0) return 1;
    return Math.max(...datosEspecialidades.map(e => e.id_especialidad)) + 1;
}

// Limpiar formulario y errores
function limpiarFormulario() {
    document.getElementById('id_especialidad').value = 0;
    document.getElementById('nombre_especialidad').value = '';
    limpiarError('nombre_especialidad');
}

// Mostrar modal
function mostrarFormulario() {
    const modalEl = document.getElementById('modalEspecialidad');
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
        modal = new bootstrap.Modal(modalEl);
    }
    modal.show();
}

// Cerrar modal
function cerrarModal() {
    const modalEl = document.getElementById('modalEspecialidad');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}

// Mostrar error
function mostrarError(idCampo, mensaje) {
    const input = document.getElementById(idCampo);
    input.classList.add('is-invalid');
    const errorDiv = document.getElementById(`error-${idCampo}`);
    errorDiv.textContent = mensaje;
}

// Limpiar error
function limpiarError(idCampo) {
    const input = document.getElementById(idCampo);
    input.classList.remove('is-invalid');
    const errorDiv = document.getElementById(`error-${idCampo}`);
    errorDiv.textContent = '';
}

// Validar campo vacío
function validarCampoVacio(valor) {
    return valor.trim() !== '';
}

// Validar solo letras y espacios
function validarSoloLetras(texto) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return regex.test(texto.trim());
}

// Validar longitud mínima
function validarLongitudMinima(texto, min) {
    return texto.trim().length >= min;
}

// Validar formulario
function validarFormularioEspecialidad() {
    let esValido = true;
    limpiarError('nombre_especialidad');

    const nombre = document.getElementById('nombre_especialidad').value;

    if (!validarCampoVacio(nombre)) {
        mostrarError('nombre_especialidad', 'El nombre es obligatorio');
        esValido = false;
    } else if (!validarSoloLetras(nombre)) {
        mostrarError('nombre_especialidad', 'El nombre solo debe contener letras y espacios');
        esValido = false;
    } else if (!validarLongitudMinima(nombre, 2)) {
        mostrarError('nombre_especialidad', 'El nombre debe tener al menos 2 caracteres');
        esValido = false;
    } else {
        limpiarError('nombre_especialidad');
    }

    return esValido;
}

// Nuevo registro
function nuevoEspecialidad() {
    limpiarFormulario();
    mostrarFormulario();
}

// Editar registro
function editarEspecialidad(id_especialidad) {
    limpiarFormulario();
    cargarDesdeLocalstorage();

    const especialidad = datosEspecialidades.find(e => e.id_especialidad === id_especialidad);
    if (!especialidad) {
        Swal.fire('Error', 'Especialidad no encontrada', 'error');
        return;
    }

    document.getElementById('id_especialidad').value = especialidad.id_especialidad;
    document.getElementById('nombre_especialidad').value = especialidad.nombre;

    mostrarFormulario();
}

// Guardar especialidad (nuevo o editar)
function guardarEspecialidad() {
    if (!validarFormularioEspecialidad()) {
        Swal.fire('Error de validación', 'Por favor corrija los errores en el formulario', 'error');
        return;
    }

    const id = parseInt(document.getElementById('id_especialidad').value);
    const nombre = capitalizarTexto(document.getElementById('nombre_especialidad').value.trim());

    cargarDesdeLocalstorage();

    if (id === 0) {
        // Nuevo registro
        const nuevoId = getId();
        datosEspecialidades.push({ id_especialidad: nuevoId, nombre });
        Swal.fire({
            icon: 'success',
            title: 'Guardado',
            text: 'La especialidad fue agregada correctamente',
            timer: 2000,
            showConfirmButton: false,
        });
    } else {
        // Editar registro
        const index = datosEspecialidades.findIndex(e => e.id_especialidad === id);
        if (index !== -1) {
            datosEspecialidades[index].nombre = nombre;
            Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: 'La especialidad fue actualizada correctamente',
                timer: 2000,
                showConfirmButton: false,
            });
        } else {
            Swal.fire('Error', 'No se encontró la especialidad a actualizar', 'error');
            return;
        }
    }

    guardarEnLocalstorage();
    cargarTablaEspecialidades();
    cerrarModal();
}

// Eliminar registro
function eliminarEspecialidad(id_especialidad) {
    Swal.fire({
        title: '¿Está seguro?',
        text: 'Si la elimina, no podrá recuperarla',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            datosEspecialidades = datosEspecialidades.filter(e => e.id_especialidad !== id_especialidad);
            guardarEnLocalstorage();
            cargarTablaEspecialidades();
            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'La especialidad fue eliminada correctamente',
                timer: 2000,
                showConfirmButton: false,
            });
        }
    });
}

// Capitalizar texto (primera letra en mayúscula)
function capitalizarTexto(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// Evento botón guardar
document.getElementById('btnGuardarEspecialidad').addEventListener('click', guardarEspecialidad);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarTablaEspecialidades();
});
