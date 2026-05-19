// ---------------------------------------------
// ARCHIVO: comprador/cultivos.js
// Función: Mostrar cultivos publicados y permitir al comprador enviar solicitudes.
// ---------------------------------------------

import { ENDPOINTS } from "../api.js";

const el = id => document.getElementById(id); // Función abreviada para obtener elementos por ID

// -------------------------
// CARGAR CULTIVOS PUBLICADOS
// -------------------------
export function cargarCultivosComprador(){
const tabla = document.querySelector("#tabla-publicados tbody");
  const error = el("publicados-error");

  // Petición al endpoint de cultivos publicados (todos los cultivos con estado "PUBLICADO")
  fetch(ENDPOINTS.listaCultivos, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("No se pudieron cargar los cultivos");
      return res.json();
    })
    .then(data => {
      tabla.innerHTML = "";

      // Filtra solo los cultivos PUBLICADOS
      const publicados = data.filter(c => c.estado === "PUBLICADO");

      if (publicados.length === 0) {
        tabla.innerHTML = `<tr><td colspan="8" class="text-center">No hay cultivos disponibles.</td></tr>`;
        return;
      }

      // Inserta cada cultivo en una fila
      publicados.forEach(cultivo => {
        const fila = `
          <tr>
            <td>${cultivo.id}</td>
            <td>${cultivo.producto_nombre}</td>
            <td>${cultivo.agricultor_nombre}</td>
            <td>$${parseFloat(cultivo.precio).toFixed(2)}</td>
            <td>${cultivo.unidad_medida}</td>
            <td>${cultivo.cantidad}</td>
            <td>${cultivo.estado}</td>
            <td>
              <button class="btn btn-sm btn-primary solicitar" 
                      data-id="${cultivo.id}" 
                      data-producto="${cultivo.producto_nombre}" 
                      data-agricultor="${cultivo.agricultor_nombre}">
                Solicitar
              </button>
            </td>
          </tr>
        `;
        tabla.insertAdjacentHTML("beforeend", fila);
      });

      activarBotonesSolicitar();              // Activa funcionalidad de los botones
      limpiarFormularioAlCerrar();            // Limpia modal al cerrarlo
      corregirAccesibilidadModalSolicitud();  // Accesibilidad al cerrar modal
    })
    .catch(err => {
      error.textContent = err.message;
      error.classList.remove("d-none");
    });
}


// -------------------------
// ACTIVAR BOTONES DE SOLICITAR
// -------------------------
// Agrega evento a cada botón "Solicitar"
function activarBotonesSolicitar() {
  document.querySelectorAll(".solicitar").forEach(btn => {
    btn.addEventListener("click", () => {
      el("cultivo-id").value = btn.getAttribute("data-id");
      el("mensaje-solicitud").value = "";
      el("solicitud-error").classList.add("d-none");

      el("solicitud-producto").textContent = btn.getAttribute("data-producto");
      el("solicitud-agricultor").textContent = btn.getAttribute("data-agricultor");

      new bootstrap.Modal(el("modalCrearSolicitud")).show();
    });
  });

  // Enviar formulario de solicitud
  el("form-crear-solicitud").addEventListener("submit", async (e) => {
    e.preventDefault();

    const cultivoId = el("cultivo-id").value;
    const mensaje = el("mensaje-solicitud").value.trim();
    const error = el("solicitud-error");

    if (!mensaje) {
      error.textContent = "El mensaje no puede estar vacío.";
      error.classList.remove("d-none");
      return;
    }

    try {
      const res = await fetch(ENDPOINTS.crearSolicitud, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({ cultivo: cultivoId, mensaje }),
      });

      if (!res.ok) throw new Error("No se pudo enviar la solicitud");

      // Cierra el modal y redirige a la vista de solicitudes enviadas
      const modal = bootstrap.Modal.getInstance(el("modalCrearSolicitud"));
      modal.hide();

      modal._element.addEventListener("hidden.bs.modal", () => {
        location.hash = "#solicitudescomprador";
      }, { once: true });

    } catch (err) {
      error.textContent = err.message;
      error.classList.remove("d-none");
    }
  });
}

// -------------------------
// LIMPIAR FORMULARIO AL CERRAR MODAL
// -------------------------
function limpiarFormularioAlCerrar() {
  const modal = el("modalCrearSolicitud");
  if (!modal) return;

  modal.addEventListener("hidden.bs.modal", () => {
    el("form-crear-solicitud").reset();
    el("solicitud-error").classList.add("d-none");
    el("solicitud-producto").textContent = "";
    el("solicitud-agricultor").textContent = "";
  });
}


// -------------------------
// ACCESIBILIDAD AL CERRAR MODAL
// -------------------------
function corregirAccesibilidadModalSolicitud() {
  const modal = el("modalCrearSolicitud");
  if (modal) {
    modal.addEventListener("hide.bs.modal", () => {
      setTimeout(() => document.activeElement.blur(), 10);
    });
  }
}
