// ---------------------------------------------
// ARCHIVO: agricultor/solicitudes.js
// Función: Mostrar solicitudes recibidas por el agricultor
// y permitir cambiar su estado.
// ---------------------------------------------

import { ENDPOINTS } from "../api.js";

const el = id => document.getElementById(id); // Función abreviada para obtener elementos por ID

// -------------------------
// CARGAR SOLICITUDES RECIBIDAS
// -------------------------
export function cargarSolicitudesRecibidas(){
    const tabla = document.querySelector("#tabla-solicitudes-agricultor tbody");
  const error = el("solicitudes-error");

  // Consultar solicitudes recibidas
  fetch(ENDPOINTS.solicitudesRecibidas, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("No se pudieron cargar las solicitudes");
      return res.json();
    })
    .then(data => {
      tabla.innerHTML = "";

      if (data.length === 0) {
        tabla.innerHTML = `<tr><td colspan="7" class="text-center">No tienes solicitudes recibidas.</td></tr>`;
        return;
      }

      // Mostrar cada solicitud en una fila de la tabla
      data.forEach(solicitud => {
        const { id, producto_nombre, comprador_nombre, mensaje, estado, fecha_creacion } = solicitud;

        tabla.insertAdjacentHTML("beforeend", `
          <tr>
            <td>${id}</td>
            <td>${producto_nombre}</td>
            <td>${comprador_nombre}</td>
            <td>${mensaje}</td>
            <td>${estado}</td>
            <td>${new Date(fecha_creacion).toLocaleDateString()}</td>
            <td>
              <button class="btn btn-sm btn-warning cambiar-estado"
                      data-id="${id}" 
                      data-estado="${estado}" 
                      ${["RECHAZADA", "COMPLETADA", "CANCELADA"].includes(estado) ? "disabled" : ""}>
                Cambiar Estado
              </button>
            </td>
          </tr>
        `);
      });

      activarCambioEstado(); // Agrega lógica a botones de cambio de estado
      corregirAccesibilidadModalCambiarEstado(); // Mejora accesibilidad
    })
    .catch(err => {
      error.textContent = err.message;
      error.classList.remove("d-none");
    });
}


// -------------------------
// CAMBIAR ESTADO DE LA SOLICITUD
// -------------------------
function activarCambioEstado() {
  document.querySelectorAll(".cambiar-estado:not([disabled])").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const estadoActual = btn.getAttribute("data-estado");

      const select = el("estado-nuevo");
      const idInput = el("estado-id");
      const error = el("estado-error");

      // Reiniciar modal
      select.innerHTML = "";
      error.classList.add("d-none");
      idInput.value = id;

      // Determinar opciones válidas según estado actual
      const opciones = estadoActual === "PENDIENTE"
        ? ["ACEPTADA", "RECHAZADA"]
        : estadoActual === "ACEPTADA"
        ? ["COMPLETADA"]
        : [];

      // Agregar opciones al select
      opciones.forEach(op => {
        const option = document.createElement("option");
        option.value = op;
        option.textContent = op;
        select.appendChild(option);
      });

      // Mostrar modal
      new bootstrap.Modal(el("modalCambiarEstado")).show();
    });
  });

  // Enviar formulario de cambio de estado
  el("form-cambiar-estado").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = el("estado-id").value;
    const nuevoEstado = el("estado-nuevo").value;
    const error = el("estado-error");

    try {
      const res = await fetch(`${ENDPOINTS.cambiarEstadoSolicitud}${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error("No se pudo actualizar el estado");

      bootstrap.Modal.getInstance(el("modalCambiarEstado")).hide(); // Cierra modal
      cargarSolicitudesRecibidas(); // Recarga tabla

    } catch (err) {
      error.textContent = err.message;
      error.classList.remove("d-none");
    }
  });
}


// -------------------------
// ACCESIBILIDAD DEL MODAL
// -------------------------
// Quita el foco del botón activo al cerrar el modal
function corregirAccesibilidadModalCambiarEstado() {
  const modal = el("modalCambiarEstado");
  if (modal) {
    modal.addEventListener("hide.bs.modal", () => {
      setTimeout(() => document.activeElement.blur(), 10);
    });
  }
}