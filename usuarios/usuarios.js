const API_URL = "https://dummyjson.com/users";
const tbody = document.querySelector("#tabla-usuarios tbody");
var divTotal = '';
var totalFilas = 0;

document.addEventListener("DOMContentLoaded", () => {

    fetchUsuarios();
});


async function fetchUsuarios() {
  
    try {

        const response = await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                `Error de red: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();
        const users = data.users;

        cargarUsuariosTabla(users);

    } catch (error) {

        console.error("Hubo un problema con la operación fetch:", error);
        listContainer.innerHTML = `<p style="color: red;">Error al cargar los usuarios: ${error.message}</p>`;
  }
}

function cargarUsuariosTabla(users) {

    tbody.innerHTML = "";    
    totalFilas = 0;
    
    if (users.length === 0) {
        listContainer.innerHTML = "<p>No se encontraron usuarios.</p>";
        return;
    }

    users.forEach((user) => {

        const fila = document.createElement("tr");
        fila.setAttribute("data-id", user.id);

        const userImage = `https://i.pravatar.cc/10${user.id}`; 

        fila.innerHTML = `
            <td class="text-center">${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td class="text-center">
                <img src="${userImage}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;"/>
            </td>

            
            <td class="text-center">
                
                <a href="javascript:eliminarUsuario(${user.id})" class="btn btn-warning btn-sm" title="Eliminar">
                    <i class="fa-solid fa-trash"></i>
                </a>

                <a href="javascript:editarUsuario(${user.id})" class="btn btn-success btn-sm" title="Editar">
                    <i class="fa-solid fa-pen-to-square"></i>
                </a>                        

            </td>
        `;

        tbody.appendChild(fila);
        totalFilas++;
      });        


    const total = document.createElement("tr");
    total.innerHTML = ` <td colspan="2" class="fw-bold">Total de usuarios:</td> 
                        <td colspan="5" class="fw-bold"> 
                            <div id="divTotal">${totalFilas}</div>
                        </td>`;
                        
    tbody.appendChild(total);

    divTotal = document.getElementById("divTotal");
}

async function eliminarUsuario(id) {

    const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: `¡Esta acción eliminará al usuario con ID ${id}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
        return;
    }

    const DELETE_URL = `https://dummyjson.com/users/${id}`;

    try {
        const response = await fetch(DELETE_URL, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.isDeleted) {

            Swal.fire({
              title: "Usuario eliminado",
              text: `Usuario ${id} eliminado correctamente`,
              icon: "info",
            }); 
                                  
            const filaAEliminar = document.querySelector(`tr[data-id="${id}"]`);

            if (filaAEliminar) {

                filaAEliminar.remove();
            }

            totalFilas--;
            divTotal.innerHTML = totalFilas;

        } else {

            Swal.fire({
                title: "Error al eliminar",
                text: `El usuario seleccionado no pudo ser eliminado`,
                icon: "error",
            });  

        }

    } catch (error) {

        Swal.fire({
            title: "Error al eliminar",
            text: `El usuario seleccionado no pudo ser eliminado`,
            icon: "error",
        });          
    }
}

const idInput = document.getElementById('id_usuario');
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const username = document.getElementById("username");
const email = document.getElementById("email");

const modalElement = new bootstrap.Modal(document.getElementById('profesionales'));
const modalTitle = document.querySelector('#profesionales .modal-title');
const btnGuardar = document.getElementById('btnGuardarProfesional');

// Editar usuario

async function editarUsuario(id) {

    const USER_URL = `https://dummyjson.com/users/${id}`;

    try {
        const response = await fetch(USER_URL);
        
        if (!response.ok) {
            throw new Error(`Error al obtener usuario: ${response.status}`);
        }

        const user = await response.json();

        idInput.value = user.id;
        firstName.value = user.firstName;
        lastName.value = user.lastName;
        username.value = user.username;
        email.value = user.email;
       
        modalTitle.textContent = `Editar Usuario`;
        btnGuardar.textContent = "ACTUALIZAR";
        btnGuardar.onclick = actualizarUsuario;

        modalElement.show();

    } catch (error) {

        Swal.fire({
          title: "Error al editar",
          text: `No se pudieron cargar los datos para edición`,
          icon: "error",
        });            
    }
}

async function actualizarUsuario() {

    const id = idInput.value;
    const UPDATE_URL = `https://dummyjson.com/users/${id}`;

    const dataToSend = {
        firstName: firstName.value,
        lastName: lastName.value,
        username: username.value,
        email: email.value,
    };

    try {
        const response = await fetch(UPDATE_URL, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar: ${response.status}`);
        }

        const updatedUser = {
            id: id,
            firstName: dataToSend.firstName,
            lastName: dataToSend.lastName,
            username: dataToSend.username,
            email: dataToSend.email,
            image: `https://i.pravatar.cc/10${id}`, 
        };
        
        const filaAEditar = document.querySelector(`tr[data-id="${id}"]`);

        if (filaAEditar) {
            filaAEditar.innerHTML = crearFilaUsuario(updatedUser).innerHTML;
        }        

        Swal.fire({
            title: "Actualizado",
            text: `El usuario fue actualizado con exito`,
            icon: "success",
        });         
        
        modalElement.hide();        

    } catch (error) {

        Swal.fire({
          title: "Error",
          text: `Hubo un problema al intentar actualizar el usuario`,
          icon: "error",
        });  
    }
}

// Nuevo usuario

function nuevoUsuario() {

    idInput.value = '';
    firstName.value = '';
    lastName.value = '';
    username.value = '';
    email.value = '';

    modalTitle.textContent = `Nuevo Usuario`;
    btnGuardar.textContent = "GUARDAR";
    
    btnGuardar.onclick = guardarNuevoUsuario;

    modalElement.show();
}

async function guardarNuevoUsuario() {

    const CREATE_URL = 'https://dummyjson.com/users/add';

    const dataToSend = {
        firstName: firstName.value,
        lastName: lastName.value,
        username: username.value,
        email: email.value,
    };

    try {
        const response = await fetch(CREATE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            throw new Error(`Error al guardar: ${response.status}`);
        }

        const newUser = await response.json(); // La API devuelve el objeto creado (simulado)

        const nuevaFila = crearFilaUsuario(newUser);
        
        tbody.prepend(nuevaFila);

        Swal.fire({
            title: "Creado",
            text: `El usuario ${newUser.firstName} (ID: ${newUser.id}) fue creado con éxito`,
            icon: "success",
        });
        
        totalFilas++;
        divTotal.innerHTML = totalFilas;

        modalElement.hide();

    } catch (error) {

        Swal.fire({
            title: "Error",
            text: `Hubo un problema al intentar crear el usuario.`,
            icon: "error",
        });
    }
}

function crearFilaUsuario(user) {

    const userImage = user.image || 'https://i.pravatar.cc/150'; 

    const fila = document.createElement("tr");

    fila.setAttribute("data-id", user.id);

    fila.innerHTML = `
        <td class="text-center">${user.id}</td>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td class="text-center">
            <img src="${userImage}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;"/>
        </td>
        <td class="text-center">
            <a href="javascript:eliminarUsuario(${user.id})" class="btn btn-warning btn-sm" title="Eliminar">
                <i class="fa-solid fa-trash"></i>
            </a>
            <a href="javascript:editarUsuario(${user.id})" class="btn btn-success btn-sm" title="Editar">
                <i class="fa-solid fa-pen-to-square"></i>
            </a> 
        </td>
    `;
    
    return fila;
}