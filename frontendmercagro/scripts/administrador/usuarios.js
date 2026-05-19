// ---------------------------------------------
// ARCHIVO: administrador/usuarios.js
// Función: Cargar y mostrar la lista de usuarios registrados.
// Solo accesible por el administrador.
// ---------------------------------------------

import { ENDPOINTS } from "../api.js"; // Importa los endpoints centralizados

// -------------------------
// FUNCIÓN PRINCIPAL
// CARGAR USUARIOS (ADMIN)
// -------------------------
export function cargarUsuarios(){
    const tabla = document.querySelector("#tabla-usuarios tbody");   // Cuerpo de la tabla donde se listan los usuarios
  const error = document.getElementById("usuarios-error");         // Contenedor de errores

  // Petición GET para obtener la lista de usuarios desde el backend
  fetch(ENDPOINTS.listaUsuarios, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,  // Autenticación con token
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("No se pudieron cargar los usuarios"); // Validación de respuesta
      return res.json(); // Conversión a JSON
    })
    .then(usuarios => {
      tabla.innerHTML = ""; // Limpia la tabla antes de insertar los nuevos datos

      // Recorre cada usuario y crea una fila HTML
      usuarios.forEach(usuario => {
        tabla.insertAdjacentHTML("beforeend", `
          <tr>
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${usuario.rol}</td>
          </tr>
        `);
      });
    })
    .catch(err => {
      // Muestra un mensaje de error si ocurre un problema
      error.textContent = err.message;
      error.classList.remove("d-none");
    });
}