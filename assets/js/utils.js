
const CONSTANTES = {
    // LocalStorage
    CLAVE_STORAGE: 'datos_medicos',
    
    // Valores por defecto
    VALOR_VACIO_SELECT: '0',
    
    // Horarios
    HORA_INICIO_LABORAL: '08:00',
    HORA_FIN_LABORAL: '20:00',
    
    // Límites
    MAX_DIAS_TURNO: 90,
    COSTO_MIN_CONSULTA: 1000,
    COSTO_MAX_CONSULTA: 100000,
    
    // Mensajes
    MSG_ERROR_VALIDACION: 'Por favor corrija los errores en el formulario',
    MSG_CONFIRM_ELIMINAR: '¿Está seguro?',
    MSG_TEXTO_ELIMINAR: 'Si lo elimina, no se podrá recuperar',
    
    // Timers
    TIMER_SUCCESS: 2000,
    
    // Longitudes
    MIN_LONGITUD_NOMBRE: 2,
    MAX_LONGITUD_NOMBRE: 50,
    MIN_LONGITUD_DESCRIPCION: 20,
    MAX_LONGITUD_DESCRIPCION: 500
};
class StorageManager {
    /**
     * Obtiene todos los datos del sistema
     * @returns {Object} Datos completos del sistema
     */
    static obtenerDatos() {
        const jsonString = localStorage.getItem(CONSTANTES.CLAVE_STORAGE);
        return jsonString ? JSON.parse(jsonString) : null;
    }
    
    /**
     * Guarda datos en el sistema
     * @param {Object} datos - Datos a guardar
     */
    static guardarDatos(datos) {
        localStorage.setItem(CONSTANTES.CLAVE_STORAGE, JSON.stringify(datos));
    }
    
    /**
     * Obtiene una colección específica
     * @param {string} coleccion - Nombre de la colección
     * @returns {Array} Colección solicitada
     */
    static obtenerColeccion(coleccion) {
        const datos = this.obtenerDatos();
        return datos ? datos[coleccion] : [];
    }
    
    /**
     * Actualiza una colección específica
     * @param {string} coleccion - Nombre de la colección
     * @param {Array} nuevosValores - Nuevos valores
     */
    static actualizarColeccion(coleccion, nuevosValores) {
        const datos = this.obtenerDatos();
        if (datos) {
            datos[coleccion] = nuevosValores;
            this.guardarDatos(datos);
        }
    }
    
    /**
     * Inicializa el localStorage si está vacío
     * @param {Object} datosIniciales - Datos por defecto
     */
    static inicializar(datosIniciales) {
        if (!localStorage.getItem(CONSTANTES.CLAVE_STORAGE)) {
            this.guardarDatos(datosIniciales);
        }
    }
}


class ModalManager {
    /**
     * Muestra un modal
     * @param {string} modalId - ID del modal
     */
    static mostrar(modalId) {
        const modalElement = document.getElementById(modalId);
        if (!modalElement) {
            console.error(`Modal ${modalId} no encontrado`);
            return;
        }
        
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (!modalInstance) {
            modalInstance = new bootstrap.Modal(modalElement);
        }
        modalInstance.show();
    }
    
    /**
     * Cierra un modal
     * @param {string} modalId - ID del modal
     */
    static cerrar(modalId) {
        const modalElement = document.getElementById(modalId);
        if (!modalElement) return;
        
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
    
    /**
     * Limpia y cierra un modal
     * @param {string} modalId - ID del modal
     * @param {string} formId - ID del formulario a limpiar
     */
    static limpiarYCerrar(modalId, formId) {
        if (formId) {
            FormManager.limpiar(formId);
            limpiarTodosLosErrores(formId);
        }
        this.cerrar(modalId);
    }
}

class FormManager {
    /**
     * Limpia un formulario
     * @param {string} formId - ID del formulario
     */
    static limpiar(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    }
    
    /**
     * Obtiene los valores de un formulario
     * @param {string} formId - ID del formulario
     * @returns {Object} Objeto con los valores
     */
    static obtenerValores(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};
        
        const formData = new FormData(form);
        const valores = {};
        
        for (let [key, value] of formData.entries()) {
            valores[key] = value;
        }
        
        return valores;
    }
    
    /**
     * Establece los valores de un formulario
     * @param {string} formId - ID del formulario
     * @param {Object} valores - Valores a establecer
     */
    static establecerValores(formId, valores) {
        for (let [key, value] of Object.entries(valores)) {
            const campo = document.getElementById(key);
            if (campo) {
                campo.value = value;
            }
        }
    }
}


class ComboManager {
    /**
     * Completa un combo con opciones
     * @param {string} comboId - ID del select
     * @param {Array} opciones - Array de opciones
     * @param {string} valorKey - Key del valor
     * @param {string} textoKey - Key del texto
     * @param {string} mensajeVacio - Mensaje para opción vacía
     */
    static completar(comboId, opciones, valorKey, textoKey, mensajeVacio = '-- Seleccione --') {
        const combo = document.getElementById(comboId);
        if (!combo) return;
        
        // Limpiar opciones existentes
        combo.innerHTML = `<option value="${CONSTANTES.VALOR_VACIO_SELECT}">${mensajeVacio}</option>`;
        
        // Agregar nuevas opciones
        opciones.forEach(opcion => {
            const nuevaOpcion = document.createElement('option');
            nuevaOpcion.value = opcion[valorKey];
            nuevaOpcion.textContent = opcion[textoKey];
            
            // Agregar atributos adicionales si existen
            if (opcion.dataAttributes) {
                Object.entries(opcion.dataAttributes).forEach(([key, value]) => {
                    nuevaOpcion.setAttribute(`data-${key}`, value);
                });
            }
            
            combo.appendChild(nuevaOpcion);
        });
    }
    
    /**
     * Obtiene el valor seleccionado y sus atributos data
     * @param {string} comboId - ID del select
     * @returns {Object} Objeto con valor y datos
     */
    static obtenerSeleccion(comboId) {
        const combo = document.getElementById(comboId);
        if (!combo) return null;
        
        const opcionSeleccionada = combo.options[combo.selectedIndex];
        if (!opcionSeleccionada) return null;
        
        return {
            valor: opcionSeleccionada.value,
            texto: opcionSeleccionada.textContent,
            datos: {...opcionSeleccionada.dataset}
        };
    }
}
class TablaManager {
    /**
     * Agrega una fila al final de la tabla con total
     * @param {string} tbodySelector - Selector del tbody
     * @param {number} colspan - Cantidad de columnas
     * @param {string} texto - Texto a mostrar
     */
    static agregarFilaTotal(tbodySelector, colspan, texto) {
        const tbody = document.querySelector(tbodySelector);
        if (!tbody) return;
        
        const fila = document.createElement('tr');
        fila.innerHTML = `<td colspan="${colspan}" class="fw-bold">${texto}</td>`;
        tbody.appendChild(fila);
    }
    
    /**
     * Limpia el contenido de una tabla
     * @param {string} tbodySelector - Selector del tbody
     */
    static limpiar(tbodySelector) {
        const tbody = document.querySelector(tbodySelector);
        if (tbody) {
            tbody.innerHTML = '';
        }
    }
}

class IdManager {
    /**
     * Obtiene el próximo ID disponible
     * @param {Array} coleccion - Colección de objetos
     * @param {string} campoId - Nombre del campo ID
     * @returns {number} Próximo ID
     */
    static obtenerProximoId(coleccion, campoId) {
        if (!coleccion || coleccion.length === 0) return 1;
        
        const maximoId = coleccion.reduce((maxId, item) => {
            return Math.max(maxId, item[campoId] || 0);
        }, 0);
        
        return maximoId + 1;
    }
}


class NotificacionManager {
    /**
     * Muestra un mensaje de éxito
     * @param {string} titulo - Título del mensaje
     * @param {string} texto - Texto del mensaje
     * @param {number} timer - Tiempo en ms (opcional)
     */
    static exito(titulo, texto, timer = CONSTANTES.TIMER_SUCCESS) {
        Swal.fire({
            title: titulo,
            text: texto,
            icon: 'success',
            timer: timer
        });
    }
    
    /**
     * Muestra un mensaje de error
     * @param {string} titulo - Título del mensaje
     * @param {string} texto - Texto del mensaje
     */
    static error(titulo, texto) {
        Swal.fire({
            title: titulo,
            text: texto,
            icon: 'error'
        });
    }
    
    /**
     * Muestra un mensaje de advertencia
     * @param {string} titulo - Título del mensaje
     * @param {string} texto - Texto del mensaje
     */
    static advertencia(titulo, texto) {
        Swal.fire({
            title: titulo,
            text: texto,
            icon: 'warning',
            confirmButtonText: 'Entendido'
        });
    }
    
    /**
     * Muestra confirmación para eliminar
     * @param {Function} callback - Función a ejecutar si confirma
     */
    static confirmarEliminacion(callback) {
        Swal.fire({
            title: CONSTANTES.MSG_CONFIRM_ELIMINAR,
            text: CONSTANTES.MSG_TEXTO_ELIMINAR,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed && callback) {
                callback();
            }
        });
    }
}

class FormateadorManager {
    /**
     * Formatea un número como moneda argentina
     * @param {number} numero - Número a formatear
     * @returns {string} Número formateado
     */
    static moneda(numero) {
        return `$ ${numero.toLocaleString('es-AR')}`;
    }
    
    /**
     * Formatea una fecha de YYYY-MM-DD a DD/MM/YYYY
     * @param {string} fecha - Fecha en formato ISO
     * @returns {string} Fecha formateada
     */
    static fecha(fecha) {
        if (!fecha) return '';
        const [anio, mes, dia] = fecha.split('-');
        return `${dia}/${mes}/${anio}`;
    }
    
    /**
     * Trunca un texto a una longitud específica
     * @param {string} texto - Texto a truncar
     * @param {number} longitud - Longitud máxima
     * @returns {string} Texto truncado
     */
    static truncar(texto, longitud = 80) {
        if (!texto || texto.length <= longitud) return texto;
        return texto.substring(0, longitud) + '...';
    }
}

class IntegridadManager {
    /**
     * Verifica si una especialidad tiene profesionales asociados
     * @param {number} idEspecialidad - ID de la especialidad
     * @returns {Object} Resultado con cantidad
     */
    static verificarEspecialidadTieneProfesionales(idEspecialidad) {
        const profesionales = StorageManager.obtenerColeccion('profesionales');
        const asociados = profesionales.filter(p => p.id_especialidad === idEspecialidad);
        
        return {
            tiene: asociados.length > 0,
            cantidad: asociados.length,
            profesionales: asociados
        };
    }
    
    /**
     * Verifica si un profesional tiene turnos asociados
     * @param {number} idProfesional - ID del profesional
     * @returns {Object} Resultado con cantidad
     */
    static verificarProfesionalTieneTurnos(idProfesional) {
        const turnos = StorageManager.obtenerColeccion('turnos') || [];
        const asociados = turnos.filter(t => t.id_profesional === idProfesional);
        
        return {
            tiene: asociados.length > 0,
            cantidad: asociados.length,
            turnos: asociados
        };
    }
}

window.CONSTANTES = CONSTANTES;
window.StorageManager = StorageManager;
window.ModalManager = ModalManager;
window.FormManager = FormManager;
window.ComboManager = ComboManager;
window.TablaManager = TablaManager;
window.IdManager = IdManager;
window.NotificacionManager = NotificacionManager;
window.FormateadorManager = FormateadorManager;
window.IntegridadManager = IntegridadManager;