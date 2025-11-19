// ============================================
// MÉDICOS/PROFESIONALES - VERSIÓN INTEGRADA
// ============================================

// IMPORTANTE: Este archivo mantiene la funcionalidad del repositorio
// pero integra las validaciones del nuevo sistema

// ============================================
// FUNCIÓN HELPER PARA IMÁGENES BASE64
// ============================================

/**
 * Obtiene imagen del profesional desde Base64 o ruta física
 */
function obtenerImagenProfesional(profesional, rutaRelativa = '../assets/img') {
    // ✅ PRIORIDAD 1: img_base64 guardada en el registro (SIEMPRE PRIMERO)
    if (profesional.img_base64) {
        console.log('✅ [PROFESIONAL] Usando img_base64 para:', profesional.nombre, profesional.apellido);
        return profesional.img_base64;
    }
    
    // ✅ PRIORIDAD 2: Buscar en IMAGENES_BASE64 global por ID
    const nombreArchivo = `${profesional.id_profesional}.png`;
    if (window.IMAGENES_BASE64 && window.IMAGENES_BASE64[nombreArchivo]) {
        console.log('✅ [PROFESIONAL] Usando IMAGENES_BASE64 para:', nombreArchivo);
        return window.IMAGENES_BASE64[nombreArchivo];
    }
    
    // ✅ PRIORIDAD 3: Intentar con nombre de archivo alternativo (.jpg)
    const nombreArchivoJpg = `${profesional.id_profesional}.jpg`;
    if (window.IMAGENES_BASE64 && window.IMAGENES_BASE64[nombreArchivoJpg]) {
        console.log('✅ [PROFESIONAL] Usando IMAGENES_BASE64 (jpg) para:', nombreArchivoJpg);
        return window.IMAGENES_BASE64[nombreArchivoJpg];
    }
    
    // ✅ FALLBACK: imagen por defecto
    console.log('⚠️ [PROFESIONAL] Usando imagen por defecto');
    return `${rutaRelativa}/default-profesional.jpg`;
}

// ============================================
// FUNCIÓN PARA CARGAR IMAGEN EN BASE64
// ============================================

function cargarImagenBase64(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }
    
    // Validar tipo de archivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif'];
    if (!tiposPermitidos.includes(file.type)) {
        Swal.fire({
            icon: 'error',
            title: 'Formato no válido',
            text: 'Solo se permiten imágenes JPG, PNG o GIF'
        });
        event.target.value = '';
        return;
    }
    
    // Validar tamaño (2MB máximo)
    const maxSize = 2 * 1024 * 1024; // 2MB en bytes
    if (file.size > maxSize) {
        Swal.fire({
            icon: 'error',
            title: 'Archivo muy grande',
            text: 'La imagen no debe superar los 2MB'
        });
        event.target.value = '';
        return;
    }
    
    // Convertir a Base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        
        // Guardar en campo oculto
        document.getElementById('img_base64').value = base64;
        
        // Mostrar vista previa
        document.getElementById('vista-previa-img').src = base64;
        document.getElementById('vista-previa-container').style.display = 'block';
    };
    
    reader.onerror = function() {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo leer la imagen'
        });
    };
    
    reader.readAsDataURL(file);
}

// ============================================
// VALIDACIÓN MEJORADA DEL FORMULARIO
// ============================================

function validarFormularioProfesional() {
    let esValido = true;
    
    // Limpiar errores previos
    limpiarTodosLosErrores('formProfesional');
    
    // Validar Matrícula
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
    
    // Validar Apellido
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
    
    // Validar Nombre
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
    
    // Validar Especialidad
    const especialidad = document.getElementById('especialidad').value;
    if (!validarSelect(especialidad)) {
        mostrarError('especialidad', 'Debe seleccionar una especialidad');
        esValido = false;
    } else {
        limpiarError('especialidad');
    }
    
    // Validar Obra Social
    const obraSocial = document.getElementById('obrasocial').value;
    if (!validarSelect(obraSocial)) {
        mostrarError('obrasocial', 'Debe seleccionar una obra social');
        esValido = false;
    } else {
        limpiarError('obrasocial');
    }
    
    // Validar Costo Consulta
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

// ============================================
// TABLA DE PROFESIONALES - VERSIÓN BASE64 CORREGIDA
// ============================================

function cargarTablaProfesionales() {
    cargarDesdeLocalstorage();

    const tbody = document.querySelector('#tabla-profesionales tbody');
    tbody.innerHTML = '';

    let contaFilas = 0;

    datosProfesionales.forEach((profesional, index) => {
        console.log(`📋 [TABLA] Profesional ${index + 1}:`, {
            id: profesional.id_profesional,
            nombre: `${profesional.nombre} ${profesional.apellido}`,
            tieneImgBase64: !!profesional.img_base64,
            tamañoBase64: profesional.img_base64 ? (profesional.img_base64.length / 1024).toFixed(2) + ' KB' : 'No'
        });
        
        // Buscar la descripción de la especialidad
        const especialidad = datosEspecialidades.find(
            e => e.id_especialidad === profesional.id_especialidad
        );

        const obraSocial = datosObraSocial.find(
            e => e.id_obra_social === profesional.id_obra_social
        );
        
        // ✅ USAR FUNCIÓN HELPER (prioriza img_base64)
        const imagenSrc = obtenerImagenProfesional(profesional, '../assets/img');
        
        // ✅ IMAGEN CENTRADA Y CON ESTILOS CORRECTOS
        const imagenHTML = `
            <div style="display: flex; justify-content: center; align-items: center;">
                <img src="${imagenSrc}" 
                     style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" 
                     alt="${profesional.nombre} ${profesional.apellido}" 
                     onerror="console.error('❌ Error cargando imagen'); this.src='../assets/img/default-profesional.jpg'" />
            </div>
        `;
        
        const fila = document.createElement('tr');
        
        fila.innerHTML = `
            <td>${profesional.matricula}</td>
            <td>${profesional.apellido}</td>
            <td>${profesional.nombre}</td>
            <td>${especialidad.nombre}</td>
            <td>${obraSocial.nombre}</td>
            <td class="text-center">${imagenHTML}</td>
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
    total.innerHTML = `<td colspan="8" class="fw-bold">Total de profesionales: ${contaFilas}</td>`;
    tbody.appendChild(total);
}

// ============================================
// NUEVO PROFESIONAL
// ============================================

function nuevoProfesional() {
    limpiarFormulario();
    limpiarTodosLosErrores('formProfesional');
    mostrarFormulario();

    document.getElementById('id_profesional').value = 0;
    
    // Limpiar imagen
    document.getElementById('img_base64').value = '';
    document.getElementById('imagen_profesional').value = '';
    document.getElementById('vista-previa-container').style.display = 'none';
}

// ============================================
// EDITAR PROFESIONAL
// ============================================

function editarProfesional(id_profesional) {
    limpiarFormulario();
    limpiarTodosLosErrores('formProfesional');

    // Filtrar el profesional seleccionado
    const profesionalSeleccionado = datosProfesionales.filter(profesional => 
        profesional.id_profesional == id_profesional
    );
    
    document.getElementById('id_profesional').value = profesionalSeleccionado[0].id_profesional;

    document.getElementById('matricula').value = profesionalSeleccionado[0].matricula;
    document.getElementById('apellido').value = profesionalSeleccionado[0].apellido;
    document.getElementById('nombre').value = profesionalSeleccionado[0].nombre;
    
    document.getElementById('consulta').value = profesionalSeleccionado[0].costo_consulta;
    
    // ✅ LLENAR COMBOS PRIMERO (antes de mostrar el modal)
    completarComboEspecialidades(profesionalSeleccionado[0].id_especialidad);
    completarComboObrasSociales(profesionalSeleccionado[0].id_obra_social);
    
    // Cargar imagen si existe
    if (profesionalSeleccionado[0].img_base64) {
        document.getElementById('img_base64').value = profesionalSeleccionado[0].img_base64;
        document.getElementById('vista-previa-img').src = profesionalSeleccionado[0].img_base64;
        document.getElementById('vista-previa-container').style.display = 'block';
    } else {
        document.getElementById('img_base64').value = '';
        document.getElementById('vista-previa-container').style.display = 'none';
    }

    // ✅ MOSTRAR MODAL AL FINAL (sin volver a llamar a los combos)
    const miModalElemento = document.getElementById('profesionales');
    let miModal = bootstrap.Modal.getInstance(miModalElemento);

    if (!miModal) {
        miModal = new bootstrap.Modal(miModalElemento);
    }

    miModal.show();
}

// ============================================
// LIMPIAR FORMULARIO
// ============================================

function limpiarFormulario() {
    document.getElementById('matricula').value = '';
    document.getElementById('apellido').value = '';
    document.getElementById('nombre').value = '';
    
    document.getElementById('especialidad').value = 0;
    document.getElementById('obrasocial').value = 0;    
    document.getElementById('consulta').value = '';
    
    // Limpiar imagen
    document.getElementById('img_base64').value = '';
    document.getElementById('imagen_profesional').value = '';
    document.getElementById('vista-previa-container').style.display = 'none';
}

// ============================================
// MOSTRAR FORMULARIO
// ============================================

function mostrarFormulario() {
    const miModalElemento = document.getElementById('profesionales');
    let miModal = bootstrap.Modal.getInstance(miModalElemento);

    // ✅ Solo completar combos si NO están ya completados (para nuevo profesional)
    const especialidadCombo = document.getElementById('especialidad');
    if (especialidadCombo.options.length <= 1) {
        completarComboEspecialidades();
        completarComboObrasSociales();
    }

    if (!miModal) {
        miModal = new bootstrap.Modal(miModalElemento);
    }

    miModal.show();
}

// ============================================
// ELIMINAR PROFESIONAL
// ============================================

function eliminarProfesional(id_profesional) {
    // Verificar si hay turnos asociados
    const datosCompletos = JSON.parse(localStorage.getItem('datos_medicos'));
    const turnosAsociados = (datosCompletos.turnos || []).filter(
        t => t.id_profesional === id_profesional
    );
    
    if (turnosAsociados.length > 0) {
        Swal.fire({
            icon: 'error',
            title: 'No se puede eliminar',
            text: `No se puede eliminar este profesional porque tiene ${turnosAsociados.length} turno(s) registrado(s). Primero debe eliminar o reasignar los turnos.`,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#dc3545'
        });
        return;
    }
    
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
            /* Eliminar Profesional */
            const profesionalesFiltrado = datosProfesionales.filter(profesional => 
                profesional.id_profesional !== id_profesional
            );

            // Verifico si lo encontró y eliminó
            const seElimino = profesionalesFiltrado.length < datosProfesionales.length;
            
            if (seElimino) {
                // Reemplazo profesionales por el que no tiene el profesional eliminado
                datos.profesionales = profesionalesFiltrado;
                
                // Sobreescribir el LocalStorage con los datos actualizados
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
            
            cargarTablaProfesionales();  

            Swal.fire({
                title: "Error",
                text: "El profesional no pudo ser eliminado",
                icon: "error"
            });

            return;
        }
    });
}

// ============================================
// OBTENER NUEVO ID
// ============================================

function getId() {
    const maximoId = datosProfesionales.reduce((maxId, profesionalActual) => {        
        return Math.max(maxId, profesionalActual.id_profesional);
    }, 0); 

    return maximoId + 1;
}

// ============================================
// GUARDAR PROFESIONAL
// ============================================

function guardarProfesional() {
    console.log('🔄 [GUARDAR] Guardando profesional...');
    
    // Validar formulario antes de guardar
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

    // Obtener valores SIN capitalizar automáticamente
    const apellido = document.getElementById('apellido').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const matricula = document.getElementById('matricula').value.trim();
    const img_base64 = document.getElementById('img_base64').value; // OBTENER IMAGEN

    const profesionalActual = {
        id_profesional: id_profesional,
        matricula: matricula,
        nombre: nombre,
        apellido: apellido,
        
        id_obra_social: parseInt(document.getElementById('obrasocial').value),
        id_especialidad: parseInt(document.getElementById('especialidad').value),

        costo_consulta: parseInt(document.getElementById('consulta').value),
        
        // ✅ AGREGAR IMAGEN BASE64 AL OBJETO (siempre, aunque sea vacío)
        img_base64: img_base64 || null
    };

    console.log('📋 [GUARDAR] Datos del profesional:', {
        id: profesionalActual.id_profesional,
        nombre: `${profesionalActual.nombre} ${profesionalActual.apellido}`,
        tieneImgBase64: !!profesionalActual.img_base64,
        tamañoBase64: profesionalActual.img_base64 ? (profesionalActual.img_base64.length / 1024).toFixed(2) + ' KB' : 'No',
        accion: accion
    });

    if(accion == 'nuevo') {
        const jsonString = localStorage.getItem('datos_medicos');
        let datosActuales;

        datosActuales = JSON.parse(jsonString);
        datosActuales.profesionales.push(profesionalActual);
        localStorage.setItem('datos_medicos', JSON.stringify(datosActuales));

        console.log('✅ [GUARDAR] Profesional NUEVO guardado');
        
        Swal.fire({
            title: "Guardado",
            text: "El profesional fue dado de alta con éxito",
            icon: "success",
            timer: 2000
        });        

    } else { // Editar
        const jsonString = localStorage.getItem('datos_medicos');
        let datosActuales = JSON.parse(jsonString); 
        let datosProfesionales = datosActuales.profesionales; 
        
        const indice = datosProfesionales.findIndex(
            p => p.id_profesional == profesionalActual.id_profesional
        );

        if (indice !== -1) {
            // ✅ MANTENER img_base64 ANTERIOR SI NO SE CARGÓ UNA NUEVA
            if (!profesionalActual.img_base64 && datosProfesionales[indice].img_base64) {
                profesionalActual.img_base64 = datosProfesionales[indice].img_base64;
                console.log('✅ [GUARDAR] Manteniendo img_base64 anterior');
            } else if (profesionalActual.img_base64) {
                console.log('✅ [GUARDAR] Actualizando con NUEVA img_base64');
            }
            
            // ✅ REEMPLAZAR TODO EL OBJETO
            datosProfesionales[indice] = profesionalActual;
            datosActuales.profesionales = datosProfesionales;
            
            localStorage.setItem('datos_medicos', JSON.stringify(datosActuales));

            console.log('✅ [GUARDAR] Profesional EDITADO guardado:', {
                id: profesionalActual.id_profesional,
                tieneImgBase64: !!profesionalActual.img_base64
            });

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

// ============================================
// CERRAR MODAL
// ============================================

function cerrarModal() {
    const modalElemento = document.getElementById('profesionales');
    const modalInstancia = bootstrap.Modal.getInstance(modalElemento); 

    if (modalInstancia) {
        modalInstancia.hide();
    }
}

// ============================================
// COMBOS - ESPECIALIDADES Y OBRAS SOCIALES
// ============================================

function completarComboEspecialidades(id_especialidad = null) {

    const cmbEspecialidad = document.getElementById('especialidad');
    cmbEspecialidad.innerHTML = '<option value="0">-- Seleccione una especialidad --</option>';

    datosEspecialidades.forEach(especialidad => {

        const nuevaOpcion = document.createElement('option');
        nuevaOpcion.value = especialidad.id_especialidad;
        nuevaOpcion.textContent = especialidad.nombre;

        if (Number(especialidad.id_especialidad) === Number(id_especialidad)) {
        
            nuevaOpcion.selected = true;    
        }
        
        cmbEspecialidad.appendChild(nuevaOpcion);        
    });     
}

function completarComboObrasSociales(id_obra_social = null) {
    let cmbObraSocial = document.getElementById('obrasocial');
    cmbObraSocial.innerHTML = '<option value="0">-- Seleccione una Obra Social --</option>';

    datosObraSocial.forEach(obraSocial => {
        const nuevaOpcion = document.createElement('option');
        nuevaOpcion.value = obraSocial.id_obra_social;
        nuevaOpcion.textContent = obraSocial.nombre;

        if (Number(obraSocial.id_obra_social) === Number(id_obra_social)) {
            nuevaOpcion.selected = true;
        }

        cmbObraSocial.appendChild(nuevaOpcion);
    });              
}

// ============================================
// INICIALIZACIÓN
// ============================================

datosProfesionales = [];     
datosEspecialidades = [];  
datosObraSocial = [];

cargarDesdeLocalstorage();

/* Event Listeners */
let btnGuardarProfesional = document.getElementById('btnGuardarProfesional');

btnGuardarProfesional.addEventListener('click', () => {
    guardarProfesional();
})

cargarTablaProfesionales();
