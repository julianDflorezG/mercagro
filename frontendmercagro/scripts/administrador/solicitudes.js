// ---------------------------------------------
// ARCHIVO: administrador/solicitudes.js
// Función: Carga el historial de solicitudes realizadas en la plataforma.
// Visible únicamente para el rol ADMINISTRADOR.
// ---------------------------------------------

import { ENDPOINTS } from "../api.js"; // Importa los endpoints desde api.js

// -------------------------
// FUNCIÓN PRINCIPAL
// CARGAR SOLICITUDES (ADMIN)
// -------------------------
export function cargarSolicitudesAdmin(){
      const tabla = document.querySelector("#tabla-solicitudes-admin tbody"); // Referencia al cuerpo de la tabla
  const errorDiv = document.getElementById("solicitudes-error");          // Contenedor de errores

  // Petición GET para obtener todas las solicitudes registradas
  fetch(ENDPOINTS.historialSolicitudes, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`, // Se envía el token de autenticación
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("No se pudieron cargar las solicitudes"); // Validación de respuesta
      return res.json(); // Convierte la respuesta en JSON
    })
    .then(solicitudes => {
      tabla.innerHTML = ""; // Limpia la tabla

      // Si no hay solicitudes, muestra mensaje
      if (solicitudes.length === 0) {
        tabla.innerHTML = `<tr><td colspan="6" class="text-center">No hay solicitudes registradas.</td></tr>`;
        return;
      }

      // Recorre cada solicitud y genera una fila en la tabla
      solicitudes.forEach(s => {
        tabla.insertAdjacentHTML("beforeend", `
          <tr>
            <td>${s.id}</td>
            <td>${s.producto_nombre}</td>
            <td>${s.comprador_nombre}</td>
            <td>${s.mensaje}</td>
            <td>${s.estado}</td>
            <td>${new Date(s.fecha_creacion).toLocaleDateString()}</td>
          </tr>
        `);
      });
    })
    .catch(err => {
      // Muestra el error en caso de que la solicitud falle
      errorDiv.textContent = err.message;
      errorDiv.classList.remove("d-none");
    });
}