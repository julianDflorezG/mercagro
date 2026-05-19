// ---------------------------------------------
// ARCHIVO: comprador/solicitudes.js
// Función: Muestra las solicitudes enviadas por el comprador
// y permite cambiar su estado a CANCELADA o COMPLETADA.
// ---------------------------------------------

import { ENDPOINTS } from "../api.js";

const el = id => document.getElementById(id); // Función auxiliar para acceder por ID

// -------------------------
// CARGAR SOLICITUDES ENVIADAS
// -------------------------
export function cargarSolicitudesComprador(){
    const tabla = document.querySelector("#tabla-solicitudes-comprador tbody");
  const error = el("solicitudes-error");

  fetch(ENDPOINTS.solicitudesEnviadas, {
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
        tabla.innerHTML = `<tr><td colspan="6" class="text-center">No tienes solicitudes enviadas.</td></tr>`;
        return;
      }

      // Mostrar cada solicitud en una fila con botón para cambiar su estado si aplica
      data.forEach(solicitud => {
        const puedeCambiar = solicitud.estado === "PENDIENTE" || solicitud.estado === "ACEPTADA";

        const fila = `
          <tr>
            <td>${solicitud.id}</td>
            <td>${solicitud.producto_nombre}</td>
            <td>${solicitud.mensaje}</td>
            <td>${solicitud.estado}</td>
            <td>${new Date(solicitud.fecha_creacion).toLocaleDateString()}</td>
            <td>
              <button class="btn btn-sm btn-warning cambiar-estado-comprador"
                      data-id="${solicitud.id}" 
                      data-estado="${solicitud.estado}"
                      ${!puedeCambiar ? "disabled" : ""}>
                Cambiar Estado
              </button>
            </td>
          </tr>
        `;
        tabla.insertAdjacentHTML("beforeend", fila);
      });

      activarCambioEstadoComprador();                         // Asigna funcionalidad al botón
      corregirAccesibilidadModalCambiarEstadoComprador();    // Mejora accesibilidad al cerrar el modal
    })
    .catch(err => {
      error.textContent = err.message;
      error.classList.remove("d-none");
    });
}


// -------------------------
// CAMBIAR ESTADO - Modal
// -------------------------
// Configura la lógica del modal para cambiar estado de solicitud
function activarCambioEstadoComprador() {
  const modal = new bootstrap.Modal(el("modalCambiarEstadoComprador"));
  const form = el("form-cambiar-estado-comprador");

  document.querySelectorAll(".cambiar-estado-comprador:not([disabled])").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const estadoActual = btn.getAttribute("data-estado");

      const select = el("comprador-estado-nuevo");
      const idInput = el("comprador-estado-id");
      const error = el("comprador-estado-error");

      select.innerHTML = "";
      error.classList.add("d-none");
      idInput.value = id;

      // Define posibles estados a los que puede cambiar según el estado actual
      let opciones = [];
      if (estadoActual === "PENDIENTE") {
        opciones = ["CANCELADA"];
      } else if (estadoActual === "ACEPTADA") {
        opciones = ["COMPLETADA"];
      }

      // Agrega opciones al select
      opciones.forEach(op => {
        const option = document.createElement("option");
        option.value = op;
        option.textContent = op;
        select.appendChild(option);
      });

      modal.show(); // Abre el modal
    });
  });

  // Maneja el envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = el("comprador-estado-id").value;
    const nuevoEstado = el("comprador-estado-nuevo").value;
    const error = el("comprador-estado-error");

    try {
      const res = await fetch(`${ENDPOINTS.cambiarEstadoSolicitud}${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) throw new Error("No se pudo actualizar la solicitud");

      bootstrap.Modal.getInstance(el("modalCambiarEstadoComprador")).hide();
      cargarSolicitudesComprador(); // Recargar tabla tras el cambio
    } catch (err) {
      error.textContent = err.message;
      error.classList.remove("d-none");
    }
  });
}

// -------------------------
// ACCESIBILIDAD MODAL
// -------------------------
function corregirAccesibilidadModalCambiarEstadoComprador() {
  const modal = el("modalCambiarEstadoComprador");
  if (!modal) return;

  modal.addEventListener("hide.bs.modal", () => {
    setTimeout(() => {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }, 10);
  });
}
