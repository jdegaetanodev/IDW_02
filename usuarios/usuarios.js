const API_URL = "https://dummyjson.com/users";
const tbody = document.querySelector("#tabla-usuarios tbody");

document.addEventListener("DOMContentLoaded", () => {
    fetchUsuarios();
});

async function fetchUsuarios() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Error de red: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const users = data.users;

        cargarUsuariosTabla(users);
    } catch (error) {
        console.error("Hubo un problema con la operación fetch:", error);
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error al cargar los usuarios: ${error.message}</td></tr>`;
    }
}

function cargarUsuariosTabla(users) {
    tbody.innerHTML = "";    
    
    let contaFilas = 0;

    if (users.length === 0) {
        tbody.innerHTML = "<tr><td colspan='7' class='text-center'>No se encontraron usuarios.</td></tr>";
        return;
    }

    users.forEach((user) => {
        const fila = document.createElement("tr");
        fila.setAttribute("data-id", user.id);

        fila.innerHTML = `
            <td class="text-center">${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td class="text-center">
                <img src="${user.image}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;"/>
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
        contaFilas++;
    });

    const total = document.createElement("tr");
    total.innerHTML = `<td colspan="7" class="fw-bold">Total de usuarios: ${contaFilas}</td>`;
    tbody.appendChild(total);
}

async function eliminarUsuario(id) {
    const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: `¡Esta acción eliminará al usuario con ID ${id}!`,
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

// Referencias al modal y campos
const idInput = document.getElementById('id_usuario');
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const username = document.getElementById("username");
const email = document.getElementById("email");

const modalElement = new bootstrap.Modal(document.getElementById('modalUsuarios'));
const modalTitle = document.querySelector('#modalUsuarios .modal-title');
const btnGuardar = document.getElementById('btnGuardarUsuario');

// ✅ FUNCIÓN PARA CREAR NUEVO USUARIO
function nuevoUsuario() {
    // Limpiar campos
    idInput.value = 0;
    firstName.value = '';
    lastName.value = '';
    username.value = '';
    email.value = '';
    
    modalTitle.textContent = 'Nuevo Usuario';
    btnGuardar.textContent = 'GUARDAR';
    btnGuardar.onclick = crearUsuario;
    
    modalElement.show();
}

// ✅ FUNCIÓN PARA CREAR USUARIO (POST)
async function crearUsuario() {
    // Validar campos
    if (!firstName.value || !lastName.value || !username.value || !email.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor complete todos los campos'
        });
        return;
    }
    
    const CREATE_URL = 'https://dummyjson.com/users/add';
    
    const nuevoUsuarioData = {
        firstName: firstName.value,
        lastName: lastName.value,
        username: username.value,
        email: email.value
    };

    try {
        const response = await fetch(CREATE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoUsuarioData)
        });

        if (!response.ok) {
            throw new Error(`Error al crear: ${response.status}`);
        }

        const newUser = await response.json();

        Swal.fire({
            title: "¡Usuario creado!",
            text: `El usuario ${newUser.username} fue creado con éxito`,
            icon: "success",
        });
        
        modalElement.hide();
        
        // Nota: La API de dummyjson solo simula la creación, no persiste los datos
        // Por eso recargamos la lista original
        fetchUsuarios();
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: `Hubo un problema al crear el usuario: ${error.message}`,
            icon: "error",
        });
    }
}

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

        const updatedUser = await response.json();

        Swal.fire({
            title: "Actualizado",
            text: `El usuario fue actualizado con éxito`,
            icon: "success",
        });
        
        modalElement.hide();
        fetchUsuarios();
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: `Hubo un problema al intentar actualizar el usuario`,
            icon: "error",
        });
    }
}