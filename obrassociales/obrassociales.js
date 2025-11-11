// obras_sociales.js

let datosObrasSociales = [];

// Cargar datos desde localStorage
function cargarDesdeLocalstorage() {
    const datosJSON = localStorage.getItem('datos_medicos');
    if (datosJSON) {
        const datos = JSON.parse(datosJSON);
        datosObrasSociales = datos.obras_sociales || [];
    } else {
        datosObrasSociales = [];
    }
}

// Guardar datos en localStorage
function guardarEnLocalstorage() {
    let datos = localStorage.getItem('datos_medicos');
    let objDatos = datos ? JSON.parse(datos) : {};
    objDatos.obras_sociales = datosObrasSociales;
    localStorage.setItem('datos_medicos', JSON.stringify(objDatos));
}

// Cargar tabla con obras sociales
function cargarTablaObrasSociales() {
    cargarDesdeLocalstorage();

    const tbody = document.querySelector('#tabla-obras-sociales tbody');
    tbody.innerHTML = '';

    let contaFilas = 0;

    datosObrasSociales.forEach(obra => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="text-center">${obra.id_obra_social}</td>
            <td>${obra.nombre}</td>
            <td class="text-center">
                <button class="btn btn-success btn-sm me-1" title="Editar" onclick="editarObraSocial(${obra.id_obra_social})">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn btn-warning btn-sm" title="Eliminar" onclick="eliminarObraSocial(${obra.id_obra_social})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(fila);
        contaFilas++;
    });

    // Total
    const total = document.createElement('tr');
    total.innerHTML = `<td colspan="3" class="fw-bold text-end">Total de obras sociales: ${contaFilas}</td>`;
    tbody.appendChild(total);
}

// Obtener nuevo ID
function getId() {
    if (datosObrasSociales.length === 0) return 1;
    return Math.max(...datosObrasSociales.map(e => e.id_obra_social)) + 1;
}

// Limpiar formulario y errores
function limpiarFormulario() {
    document.getElementById('id_obra_social').value = 0;
    document.getElementById('nombre_obra_social').value = '';
    limpiarError('nombre_obra_social');
}

// Mostrar modal
function mostrarFormulario() {
    const modalEl = document.getElementById('modalObraSocial');
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
        modal = new bootstrap.Modal(modalEl);
    }
    modal.show();
}

// Cerrar modal
function cerrarModal() {
    const modalEl = document.getElementById('modalObraSocial');
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
function validarFormularioObraSocial() {
    let esValido = true;
    limpiarError('nombre_obra_social');

    const nombre = document.getElementById('nombre_obra_social').value;

    if (!validarCampoVacio(nombre)) {
        mostrarError('nombre_obra_social', 'El nombre es obligatorio');
        esValido = false;
    } else if (!validarSoloLetras(nombre)) {
        mostrarError('nombre_obra_social', 'El nombre solo debe contener letras y espacios');
        esValido = false;
    } else if (!validarLongitudMinima(nombre, 2)) {
        mostrarError('nombre_obra_social', 'El nombre debe tener al menos 2 caracteres');
        esValido = false;
    } else {
        limpiarError('nombre_obra_social');
    }

    return esValido;
}

// Nuevo registro
function nuevoObraSocial() {
    limpiarFormulario();
    mostrarFormulario();
}

// Editar registro
function editarObraSocial(id_obra_social) {
    limpiarFormulario();
    cargarDesdeLocalstorage();

    const obra = datosObrasSociales.find(e => e.id_obra_social === id_obra_social);
    if (!obra) {
        Swal.fire('Error', 'Obra social no encontrada', 'error');
        return;
    }

    document.getElementById('id_obra_social').value = obra.id_obra_social;
    document.getElementById('nombre_obra_social').value = obra.nombre;

    mostrarFormulario();
}

// Guardar obra social (nuevo o editar)
function guardarObraSocial() {
    if (!validarFormularioObraSocial()) {
        Swal.fire('Error de validación', 'Por favor corrija los errores en el formulario', 'error');
        return;
    }

    const id = parseInt(document.getElementById('id_obra_social').value);
    const nombre = capitalizarTexto(document.getElementById('nombre_obra_social').value.trim());

    cargarDesdeLocalstorage();

    if (id === 0) {
        // Nuevo registro
        const nuevoId = getId();
        datosObrasSociales.push({ id_obra_social: nuevoId, nombre });
        Swal.fire({
            icon: 'success',
            title: 'Guardado',
            text: 'La obra social fue agregada correctamente',
            timer: 2000,
            showConfirmButton: false,
        });
    } else {
        // Editar registro
        const index = datosObrasSociales.findIndex(e => e.id_obra_social === id);
        if (index !== -1) {
            datosObrasSociales[index].nombre = nombre;
            Swal.fire({
                icon: 'success',
                title: 'Actualizado',
                text: 'La obra social fue actualizada correctamente',
                timer: 2000,
                showConfirmButton: false,
            });
        } else {
            Swal.fire('Error', 'No se encontró la obra social a actualizar', 'error');
            return;
        }
    }

    guardarEnLocalstorage();
    cargarTablaObrasSociales();
    cerrarModal();
}

// ELIMINAR CON VALIDACIÓN DE INTEGRIDAD
function eliminarObraSocial(id_obra_social) {
    // VERIFICAR INTEGRIDAD REFERENCIAL
    const datosCompletos = JSON.parse(localStorage.getItem('datos_medicos'));
    
    // Verificar si hay profesionales con esta obra social
    const profesionalesAsociados = datosCompletos.profesionales.filter(
        p => p.id_obra_social === id_obra_social
    );
    
    // Verificar si hay turnos con esta obra social
    const turnosAsociados = (datosCompletos.turnos || []).filter(
        t => t.id_obra_social === id_obra_social
    );
    
    // Si hay registros asociados, mostrar error detallado
    if (profesionalesAsociados.length > 0 || turnosAsociados.length > 0) {
        let mensaje = 'No se puede eliminar esta obra social porque tiene:\n\n';
        
        if (profesionalesAsociados.length > 0) {
            mensaje += `• ${profesionalesAsociados.length} profesional(es) asignado(s)\n`;
        }
        
        if (turnosAsociados.length > 0) {
            mensaje += `• ${turnosAsociados.length} turno(s) registrado(s)\n`;
        }
        
        mensaje += '\nPrimero debe eliminar o reasignar estos registros.';
        
        Swal.fire({
            icon: 'error',
            title: 'No se puede eliminar',
            text: mensaje,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#dc3545'
        });
        return;
    }
    
    // Si no hay registros asociados, continuar con la eliminación
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
            datosObrasSociales = datosObrasSociales.filter(e => e.id_obra_social !== id_obra_social);
            guardarEnLocalstorage();
            cargarTablaObrasSociales();
            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'La obra social fue eliminada correctamente',
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
document.getElementById('btnGuardarObraSocial').addEventListener('click', guardarObraSocial);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarTablaObrasSociales();
});