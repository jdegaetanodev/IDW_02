function cargarTablaProfesionales() {

    cargarDesdeLocalstorage();

    const tbody = document.querySelector('#tabla-profesionales tbody');
    tbody.innerHTML = '';

    let contaFilas = 0;

    datosProfesionales.forEach(profesional => {

        // Buscar la descripción de la especialidad => retorna un objeto con el id y el nombre
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
            <td class="text-end">$ ${profesional.costo_consulta}</td>
            <td class="text-center">
                
                <a href="javascript:eliminarProfesional(${profesional.id_profesional})" class="btn btn-warning btn-sm">
                    <i class="fa-solid fa-trash"></i>
                </a>

                <a href="javascript:editarProfesional(${profesional.id_profesional})" class="btn btn-success btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i>
                </a>                        

            </td>
        `;

        tbody.appendChild(fila);

        contaFilas++;
    });            

    const total = document.createElement('tr');
    total.innerHTML = `<td colspan="7">Total: ${contaFilas}</td>`;
    tbody.appendChild(total);
}

function nuevoProfesional() {

    limpiarFormulario();
    mostrarFormulario();

    document.getElementById('id_profesional').value = 0;
}

function editarProfesional(id_profesional) {

    limpiarFormulario();

    // Filtrar el profesional seleccionado
    const profesionalSeleccionado = datosProfesionales.filter(profesional => 
        profesional.id_profesional == id_profesional
    );
    
    document.getElementById('id_profesional').value = profesionalSeleccionado[0].id_profesional;

    document.getElementById('matricula').value = profesionalSeleccionado[0].matricula;
    document.getElementById('apellido').value = profesionalSeleccionado[0].apellido;
    document.getElementById('nombre').value = profesionalSeleccionado[0].nombre;

    completarComboEspecialidades()
    document.getElementById('especialidad').value = profesionalSeleccionado[0].id_especialidad;

    completarComboObrasSociales();
    document.getElementById('obrasocial').value = profesionalSeleccionado[0].id_obra_social;
    
    document.getElementById('consulta').value = profesionalSeleccionado[0].costo_consulta; 

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

    completarComboEspecialidades();
    completarComboObrasSociales();

    if (!miModal) {
        miModal = new bootstrap.Modal(miModalElemento);
    }

    miModal.show();
}

function eliminarProfesional(id_profesional) {


    Swal.fire({
        title: "¿Esta seguro?",
        text: "Si lo elimina, no se podrá recuperar",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminarlo"
    }).then((result) => {

        if (result.isConfirmed) {

            /* Eliminar Profesional */
            const profesionalesFiltrado = datosProfesionales.filter(profesional => 
                profesional.id_profesional !== id_profesional
            );

            // Verifico si lo encontro y elimino
            const seElimino = profesionalesFiltrado.length < datosProfesionales.length;
            
            if (seElimino) {
                // Reemplazo profesionales por el que no tiene el profesional eliminado
                datos.profesionales = profesionalesFiltrado;
                
                // 7. Sobreescribir el LocalStorage con los datos actualizados
                localStorage.setItem('datos_medicos', JSON.stringify(datos));
                
                Swal.fire({
                    title: "Eliminado",
                    text: "El profesional fue eliminado con éxito",
                    icon: "success"
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
            /* /Eliminar Profesional */
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

    let id_profesional = parseInt(document.getElementById('id_profesional').value);
    let accion;

    if(id_profesional == 0) {

        id_profesional = getId();    
        accion = 'nuevo';    

    } else {

        accion = 'editar';

    }


    const profesionalActual = {

        id_profesional: id_profesional,
        matricula: document.getElementById('matricula').value,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        
        id_obra_social: parseInt(document.getElementById('obrasocial').value),
        id_especialidad: parseInt(document.getElementById('especialidad').value),

        costo_consulta: parseInt(document.getElementById('consulta').value)
    };

    if(accion == 'nuevo') {

        const jsonString = localStorage.getItem('datos_medicos');
        let datosActuales;

        datosActuales = JSON.parse(jsonString);
        datosActuales.profesionales.push(profesionalActual);
        localStorage.setItem('datos_medicos', JSON.stringify(datosActuales));

        Swal.fire({
            title: "Guardado",
            text: "El profesional fue dado de alta con éxito",
            icon: "success"
        });        

    } else { // Editar

        const jsonString = localStorage.getItem('datos_medicos');
        let datosActuales = JSON.parse(jsonString); 
        let datosProfesionales = datosActuales.profesionales; 
        
        const indice = datosProfesionales.findIndex(
            p => p.id_profesional == profesionalActual.id_profesional
        );

        if (indice !== -1) { // Se encontro el profesional a actualizar
            
            datosProfesionales[indice] = profesionalActual;
            datosActuales.profesionales = datosProfesionales;
            
            localStorage.setItem('datos_medicos', JSON.stringify(datosActuales));

            Swal.fire({
                title: "Guardado",
                text: "El profesional fue actualizado con éxito",
                icon: "success"
            });

        } else {

            Swal.fire({
                title: "Error",
                text: "No se encontro el profesional a actualizar",
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
    const lista = document.createElement('option');


    datosEspecialidades.forEach(especialidad => {

        const nuevaOpcion = document.createElement('option');
        nuevaOpcion.value = especialidad.id_especialidad;
        nuevaOpcion.textContent = especialidad.nombre;
        cmbEspecialidad.appendChild(nuevaOpcion);

    });  

}

function completarComboObrasSociales() {

    let cmbObraSocial = document.getElementById('obrasocial');
    const lista = document.createElement('option');

    datosObraSocial.forEach(obraSocial => {

        const nuevaOpcion = document.createElement('option');
        nuevaOpcion.value = obraSocial.id_obra_social;
        nuevaOpcion.textContent = obraSocial.nombre;
        cmbObraSocial.appendChild(nuevaOpcion);

    });              

}

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