//SISTEMA DE VALIDACIONES/
/**
 * Valida que un campo no esté vacío
 * @param {string} valor - Valor a validar
 * @returns {boolean}
 */
function validarCampoVacio(valor) {
    return valor.trim() !== '';
}

/**
 * Valida que un campo tenga una longitud mínima
 * @param {string} valor - Valor a validar
 * @param {number} longitudMinima - Longitud mínima requerida
 * @returns {boolean}
 */
function validarLongitudMinima(valor, longitudMinima) {
    return valor.trim().length >= longitudMinima;
}

/**
 * Valida que un campo tenga una longitud máxima
 * @param {string} valor - Valor a validar
 * @param {number} longitudMaxima - Longitud máxima permitida
 * @returns {boolean}
 */
function validarLongitudMaxima(valor, longitudMaxima) {
    return valor.trim().length <= longitudMaxima;
}

/**
 * Valida que solo contenga letras y espacios
 * @param {string} valor - Valor a validar
 * @returns {boolean}
 */
function validarSoloLetras(valor) {
    const regex = /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ\s]+$/;
    return regex.test(valor.trim());
}

/**
 * Valida que solo contenga números
 * @param {string} valor - Valor a validar
 * @returns {boolean}
 */
function validarSoloNumeros(valor) {
    const regex = /^[0-9]+$/;
    return regex.test(valor.trim());
}

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
}

/**
 * Valida formato de teléfono argentino
 * Acepta: 1234567890, 11-2345-6789, (011) 2345-6789, etc.
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean}
 */
function validarTelefono(telefono) {
    const regex = /^[\d\s\-\(\)]+$/;
    const soloNumeros = telefono.replace(/[\s\-\(\)]/g, '');
    return regex.test(telefono) && soloNumeros.length >= 8 && soloNumeros.length <= 15;
}

/**
 * Valida formato de DNI argentino
 * @param {string} dni - DNI a validar
 * @returns {boolean}
 */
function validarDNI(dni) {
    const soloNumeros = dni.replace(/\./g, '');
    return /^[0-9]{7,8}$/.test(soloNumeros);
}

/**
 * Valida que un número esté dentro de un rango
 * @param {number} numero - Número a validar
 * @param {number} minimo - Valor mínimo
 * @param {number} maximo - Valor máximo
 * @returns {boolean}
 */
function validarRangoNumerico(numero, minimo, maximo) {
    return numero >= minimo && numero <= maximo;
}

/**
 * Valida que una fecha no sea anterior a hoy
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {boolean}
 */
function validarFechaNoAnterior(fecha) {
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaSeleccionada >= hoy;
}

/**
 * Valida que una fecha esté dentro de un rango
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {number} diasMaximos - Días máximos hacia adelante
 * @returns {boolean}
 */
function validarRangoFecha(fecha, diasMaximos) {
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaMaxima = new Date(hoy);
    fechaMaxima.setDate(fechaMaxima.getDate() + diasMaximos);
    
    return fechaSeleccionada >= hoy && fechaSeleccionada <= fechaMaxima;
}

/**
 * Valida formato de matrícula profesional
 * Acepta: CM-12345, DE-67890, etc.
 * @param {string} matricula - Matrícula a validar
 * @returns {boolean}
 */
function validarMatricula(matricula) {
    const regex = /^[A-Z]{2}-[0-9]{5}$/;
    return regex.test(matricula.trim().toUpperCase());
}

/**
 * Valida que un select tenga un valor seleccionado válido
 * @param {string} valor - Valor del select
 * @returns {boolean}
 */
function validarSelect(valor) {
    return valor !== "" && valor !== "0" && valor !== null;
}

/**
 * Valida formato de hora (HH:MM)
 * @param {string} hora - Hora a validar
 * @returns {boolean}
 */
function validarHora(hora) {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(hora);
}

/**
 * Valida que una hora esté dentro del horario laboral
 * @param {string} hora - Hora en formato HH:MM
 * @param {string} horaInicio - Hora de inicio (default: 08:00)
 * @param {string} horaFin - Hora de fin (default: 20:00)
 * @returns {boolean}
 */
function validarHorarioLaboral(hora, horaInicio = "08:00", horaFin = "20:00") {
    const [horaNum, minNum] = hora.split(':').map(Number);
    const [horaInicioNum, minInicioNum] = horaInicio.split(':').map(Number);
    const [horaFinNum, minFinNum] = horaFin.split(':').map(Number);
    
    const minutosHora = horaNum * 60 + minNum;
    const minutosInicio = horaInicioNum * 60 + minInicioNum;
    const minutosFin = horaFinNum * 60 + minFinNum;
    
    return minutosHora >= minutosInicio && minutosHora <= minutosFin;
}

/**
 * Muestra un mensaje de error en un campo
 * @param {string} idCampo - ID del campo
 * @param {string} mensaje - Mensaje de error
 */
function mostrarError(idCampo, mensaje) {
    const campo = document.getElementById(idCampo);
    if (campo) {
        campo.classList.add('is-invalid');
        
        // Buscar o crear div de error
        let errorDiv = campo.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
            errorDiv = document.createElement('div');
            errorDiv.classList.add('invalid-feedback');
            campo.parentNode.insertBefore(errorDiv, campo.nextSibling);
        }
        errorDiv.textContent = mensaje;
    }
}

/**
 * Limpia el mensaje de error de un campo
 * @param {string} idCampo - ID del campo
 */
function limpiarError(idCampo) {
    const campo = document.getElementById(idCampo);
    if (campo) {
        campo.classList.remove('is-invalid');
        campo.classList.add('is-valid');
        
        const errorDiv = campo.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
            errorDiv.textContent = '';
        }
    }
}

/**
 * Limpia todos los errores de un formulario
 * @param {string} idFormulario - ID del formulario
 */
function limpiarTodosLosErrores(idFormulario) {
    const formulario = document.getElementById(idFormulario);
    if (formulario) {
        const campos = formulario.querySelectorAll('.is-invalid, .is-valid');
        campos.forEach(campo => {
            campo.classList.remove('is-invalid', 'is-valid');
        });
        
        const mensajesError = formulario.querySelectorAll('.invalid-feedback');
        mensajesError.forEach(mensaje => {
            mensaje.textContent = '';
        });
    }
}

/**
 * Sanitiza un string eliminando caracteres peligrosos
 * @param {string} texto - Texto a sanitizar
 * @returns {string}
 */
function sanitizarTexto(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * Formatea un DNI agregando puntos
 * @param {string} dni - DNI sin formato
 * @returns {string}
 */
function formatearDNI(dni) {
    const soloNumeros = dni.replace(/\D/g, '');
    return soloNumeros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Formatea un teléfono argentino
 * @param {string} telefono - Teléfono sin formato
 * @returns {string}
 */
function formatearTelefono(telefono) {
    const soloNumeros = telefono.replace(/\D/g, '');
    
    if (soloNumeros.length === 10) {
        // Formato: (011) 1234-5678
        return `(${soloNumeros.substring(0, 3)}) ${soloNumeros.substring(3, 7)}-${soloNumeros.substring(7)}`;
    }
    
    return telefono;
}

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} texto - Texto a capitalizar
 * @returns {string}
 */
function capitalizarTexto(texto) {
    return texto.toLowerCase().replace(/\b\w/g, letra => letra.toUpperCase());
}

/**
 * Agrega validación en tiempo real a un campo
 * @param {string} idCampo - ID del campo
 * @param {function} funcionValidacion - Función de validación
 * @param {string} mensajeError - Mensaje de error
 */
function agregarValidacionTiempoReal(idCampo, funcionValidacion, mensajeError) {
    const campo = document.getElementById(idCampo);
    if (campo) {
        campo.addEventListener('blur', function() {
            if (!funcionValidacion(this.value)) {
                mostrarError(idCampo, mensajeError);
            } else {
                limpiarError(idCampo);
            }
        });
        
        campo.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                if (funcionValidacion(this.value)) {
                    limpiarError(idCampo);
                }
            }
        });
    }
}

function configurarValidacionesBasicas() {

    const camposLetras = ['apellido', 'nombre', 'paciente_apellido', 'paciente_nombre'];
    camposLetras.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            agregarValidacionTiempoReal(
                id,
                validarSoloLetras,
                'Este campo solo debe contener letras'
            );
        }
    });

    const camposDocumento = ['paciente_documento'];
    camposDocumento.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            agregarValidacionTiempoReal(
                id,
                (valor) => validarSoloNumeros(valor) && validarLongitudMinima(valor, 7),
                'Ingrese un documento válido (mínimo 7 dígitos)'
            );
        }
    });

    const campoMatricula = document.getElementById('matricula');
    if (campoMatricula) {
        agregarValidacionTiempoReal(
            'matricula',
            validarMatricula,
            'Formato: XX-12345 (Ej: CM-12345)'
        );
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', configurarValidacionesBasicas);
} else {
    configurarValidacionesBasicas();
}