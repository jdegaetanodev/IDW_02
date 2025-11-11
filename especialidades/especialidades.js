let datosEspecialidades = [];

function cargarDesdeLocalstorage() {
    const datosJSON = localStorage.getItem('datos_medicos');
    if (datosJSON) {
        const datos = JSON.parse(datosJSON);
        datosEspecialidades = datos.especialidades || [];
    } else {
        datosEspecialidades = [];
    }
}

function guardarEnLocalstorage() {
    let datos = localStorage.getItem('datos_medicos');
    let objDatos = datos ? JSON.parse(datos) : {};
    objDatos.especialidades = datosEspecialidades;
    localStorage.setItem('datos_medicos', JSON.stringify(objDatos));
}

function cargarTablaEspecialidades() {
    cargarDesdeLocalstorage();

    const tbody = document.querySelector('#tabla-especialidades tbody');
    tbody.innerHTML = '';

    let contaFilas = 0;

    datosEspecialidades.forEach(especialidad => {
        const fila = document.createElement('tr');
        
        // 🔧 MOSTRAR IMAGEN (Base64 o fallback)
        let imagenHTML = '<span class="text-muted">Sin imagen</span>';
        
        if (especialidad.img_base64) {
            // Tiene Base64 ✅
            imagenHTML = `<img src="${especialidad.img_base64}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" alt="${especialidad.nombre}" />`;
        } else if (especialidad.img) {
            // Fallback a archivo físico
            imagenHTML = `<img src="../assets/img/${especialidad.img}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" alt="${especialidad.nombre}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';" /><span class="text-muted" style="display:none;">Sin imagen</span>`;
        }
        
        fila.innerHTML = `
            <td class="text-center">${especialidad.id_especialidad}</td>
            <td>${especialidad.nombre}</td>
            <td class="text-center">${imagenHTML}</td>
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

    const total = document.createElement('tr');
    total.innerHTML = `<td colspan="4" class="fw-bold text-end">Total de especialidades: ${contaFilas}</td>`;
    tbody.appendChild(total);
}

function getId() {
    if (datosEspecialidades.length === 0) return 1;
    return Math.max(...datosEspecialidades.map(e => e.id_especialidad)) + 1;
}

function limpiarFormulario() {
    document.getElementById('id_especialidad').value = 0;
    document.getElementById('nombre_especialidad').value = '';
    document.getElementById('descripcion_especialidad').value = '';
    document.getElementById('imagen_especialidad').value = '';
    
    const preview = document.getElementById('preview-imagen');
    if (preview) {
        preview.innerHTML = '<p class="text-muted">Vista previa de la imagen</p>';
    }
    
    const contador = document.getElementById('contador-caracteres');
    if (contador) {
        contador.textContent = '0';
    }
    
    limpiarError('nombre_especialidad');
    limpiarError('descripcion_especialidad');
}

function mostrarFormulario() {
    const modalEl = document.getElementById('modalEspecialidad');
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (!modal) {
        modal = new bootstrap.Modal(modalEl);
    }
    modal.show();
}

function cerrarModal() {
    const modalEl = document.getElementById('modalEspecialidad');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}

function mostrarError(idCampo, mensaje) {
    const input = document.getElementById(idCampo);
    if (!input) return;
    input.classList.add('is-invalid');
    const errorDiv = document.getElementById(`error-${idCampo}`);
    if (errorDiv) {
        errorDiv.textContent = mensaje;
    }
}

function limpiarError(idCampo) {
    const input = document.getElementById(idCampo);
    if (!input) return;
    input.classList.remove('is-invalid');
    const errorDiv = document.getElementById(`error-${idCampo}`);
    if (errorDiv) {
        errorDiv.textContent = '';
    }
}

function validarCampoVacio(valor) {
    return valor.trim() !== '';
}

function validarSoloLetras(texto) {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    return regex.test(texto.trim());
}

function validarLongitudMinima(texto, min) {
    return texto.trim().length >= min;
}

function validarLongitudMaxima(texto, max) {
    return texto.trim().length <= max;
}

function validarFormularioEspecialidad() {
    let esValido = true;
    limpiarError('nombre_especialidad');
    limpiarError('descripcion_especialidad');

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

    const descripcion = document.getElementById('descripcion_especialidad').value;
    if (!validarCampoVacio(descripcion)) {
        mostrarError('descripcion_especialidad', 'La descripción es obligatoria');
        esValido = false;
    } else if (!validarLongitudMinima(descripcion, 20)) {
        mostrarError('descripcion_especialidad', 'La descripción debe tener al menos 20 caracteres');
        esValido = false;
    } else if (!validarLongitudMaxima(descripcion, 500)) {
        mostrarError('descripcion_especialidad', 'La descripción no puede superar los 500 caracteres');
        esValido = false;
    } else {
        limpiarError('descripcion_especialidad');
    }

    return esValido;
}

// ✅ CONVERTIR IMAGEN A BASE64
function convertirImagenBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// ✅ VISTA PREVIA DE IMAGEN
function previsualizarImagen() {
    const input = document.getElementById('imagen_especialidad');
    const preview = document.getElementById('preview-imagen');
    
    if (!input || !preview) return;
    
    if (input.files && input.files[0]) {
        const file = input.files[0];
        
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            preview.innerHTML = '<p class="text-danger">Por favor seleccione una imagen válida</p>';
            return;
        }
        
        // Validar tamaño (máx 2MB)
        if (file.size > 2 * 1024 * 1024) {
            preview.innerHTML = `<p class="text-danger">La imagen es muy grande (${(file.size / 1024 / 1024).toFixed(2)} MB). Máximo: 2MB</p>`;
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" class="img-fluid" style="max-height: 200px; border-radius: 5px;" />`;
        };
        reader.readAsDataURL(file);
    }
}

function nuevoEspecialidad() {
    limpiarFormulario();
    mostrarFormulario();
}

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
    
    const descripcionInput = document.getElementById('descripcion_especialidad');
    if (descripcionInput) {
        descripcionInput.value = especialidad.descripcion || '';
        const contador = document.getElementById('contador-caracteres');
        if (contador) {
            contador.textContent = (especialidad.descripcion || '').length;
        }
    }
    
    // Mostrar imagen actual si existe
    const preview = document.getElementById('preview-imagen');
    if (preview && especialidad.img_base64) {
        preview.innerHTML = `
            <img src="${especialidad.img_base64}" class="img-fluid" style="max-height: 200px; border-radius: 5px;" />
            <p class="text-muted mt-2"><small>Imagen actual (puede cambiarla seleccionando una nueva)</small></p>
        `;
    }

    mostrarFormulario();
}

// ⚠️ IMPORTANTE: Esta función DEBE ser ASYNC
async function guardarEspecialidad() {
    console.log('🔄 Guardando especialidad...');
    
    if (!validarFormularioEspecialidad()) {
        Swal.fire('Error de validación', 'Por favor corrija los errores en el formulario', 'error');
        return;
    }

    const id = parseInt(document.getElementById('id_especialidad').value);
    const nombre = capitalizarTexto(document.getElementById('nombre_especialidad').value.trim());
    const descripcion = document.getElementById('descripcion_especialidad').value.trim();
    
    cargarDesdeLocalstorage();

    // Preparar objeto de especialidad
    const especialidadData = {
        nombre: nombre,
        descripcion: descripcion
    };

    // ✅ PROCESAR IMAGEN SI HAY UNA NUEVA
    const inputImagen = document.getElementById('imagen_especialidad');
    if (inputImagen && inputImagen.files && inputImagen.files[0]) {
        console.log('📸 Procesando imagen nueva...');
        try {
            const imagenBase64 = await convertirImagenBase64(inputImagen.files[0]);
            especialidadData.img_base64 = imagenBase64;
            console.log('✅ Imagen convertida a Base64:', (imagenBase64.length / 1024).toFixed(2), 'KB');
        } catch (error) {
            console.error('❌ Error al convertir imagen:', error);
            Swal.fire('Error', 'No se pudo procesar la imagen', 'error');
            return;
        }
    } else if (id !== 0) {
        // Si estamos editando y no hay nueva imagen, mantener la anterior
        const especialidadExistente = datosEspecialidades.find(e => e.id_especialidad === id);
        if (especialidadExistente && especialidadExistente.img_base64) {
            especialidadData.img_base64 = especialidadExistente.img_base64;
            console.log('📋 Manteniendo imagen anterior');
        }
    }

    if (id === 0) {
        // Nuevo registro
        const nuevoId = getId();
        especialidadData.id_especialidad = nuevoId;
        
        // Mantener compatibilidad con img (nombre de archivo)
        especialidadData.img = `especialidad_${nuevoId}.jpg`;
        
        datosEspecialidades.push(especialidadData);
        console.log('✅ Nueva especialidad agregada:', especialidadData);
        
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
            especialidadData.id_especialidad = id;
            
            // Mantener img anterior si existe
            if (datosEspecialidades[index].img) {
                especialidadData.img = datosEspecialidades[index].img;
            }
            
            datosEspecialidades[index] = especialidadData;
            console.log('✅ Especialidad actualizada:', especialidadData);
            
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
    cargarTablaEspecialidades(); // 🔄 Recargar tabla
    cerrarModal();
}

function eliminarEspecialidad(id_especialidad) {
    const datosCompletos = JSON.parse(localStorage.getItem('datos_medicos'));
    
    const profesionalesAsociados = datosCompletos.profesionales.filter(
        p => p.id_especialidad === id_especialidad
    );
    
    const turnosAsociados = (datosCompletos.turnos || []).filter(
        t => t.id_especialidad === id_especialidad
    );
    
    if (profesionalesAsociados.length > 0 || turnosAsociados.length > 0) {
        let mensaje = 'No se puede eliminar esta especialidad porque tiene:\n\n';
        
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

function capitalizarTexto(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// ✅ EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    // Botón guardar
    const btnGuardar = document.getElementById('btnGuardarEspecialidad');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', guardarEspecialidad);
    }
    
    // Input de imagen
    const inputImagen = document.getElementById('imagen_especialidad');
    if (inputImagen) {
        inputImagen.addEventListener('change', previsualizarImagen);
    }
    
    // Contador de caracteres
    const descripcionInput = document.getElementById('descripcion_especialidad');
    const contador = document.getElementById('contador-caracteres');
    if (descripcionInput && contador) {
        descripcionInput.addEventListener('input', function() {
            contador.textContent = this.value.length;
        });
    }
    
    // Cargar tabla inicial
    cargarTablaEspecialidades();
    
    console.log('✅ especialidades.js cargado correctamente');
});