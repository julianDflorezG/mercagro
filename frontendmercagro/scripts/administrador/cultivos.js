// ---------------------------------------------
// ARCHIVO: administrador/cultivos.js
// Función: Mostrar los cultivos publicados para el administrador.
// ---------------------------------------------

import { ENDPOINTS } from "../api.js"; // Importa los endpoints del sistema

// -------------------------
// CARGAR CULTIVOS (ADMIN)
// -------------------------
// Esta función consulta los cultivos públicos y los muestra en una tabla.
export function cargarCultivosAdmin(){
    const tabla = document.querySelector("#tabla-cultivos tbody"); // Cuerpo de la tabla donde se insertarán los datos
  const errorDiv = document.getElementById("cultivos-error");     // Contenedor de errores

  // Realiza una petición GET al endpoint de cultivos publicados
  fetch(ENDPOINTS.listaCultivos, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`, // Añade el token de acceso
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("No se pudieron cargar los cultivos"); // Manejo de error si falla la respuesta
      return res.json(); // Convierte la respuesta a JSON
    })
    .then(cultivos => {
      tabla.innerHTML = ""; // Limpia la tabla antes de insertar nuevas filas

      // Si no hay cultivos, muestra mensaje
      if (cultivos.length === 0) {
        tabla.innerHTML = `<tr><td colspan="8" class="text-center">No hay cultivos publicados.</td></tr>`;
        return;
      }

      // Recorre cada cultivo y crea una fila para mostrarlo
      cultivos.forEach(c => {
        const fila = `
          <tr>
            <td>${c.id}</td>
            <td>${c.producto_nombre || "-"}</td>
            <td>${c.agricultor_nombre || "-"}</td>
            <td>${c.cantidad}</td>
            <td>${c.unidad_medida?.toUpperCase() || "-"}</td>
            <td>$${parseFloat(c.precio).toFixed(2)}</td>
            <td>${new Date(c.fecha_creacion).toLocaleDateString()}</td>
          </tr>
        `;
        tabla.insertAdjacentHTML("beforeend", fila); // Agrega la fila a la tabla
      });
    })
    .catch(err => {
      // Muestra el error si ocurre algún problema en la carga
      errorDiv.textContent = err.message;
      errorDiv.classList.remove("d-none");
    });
}