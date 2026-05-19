// ---------------------------------------------
// ARCHIVO: agricultor/cultivo_detalle.js
// Función: Muestra el detalle de un cultivo individual,
// permite editarlo y eliminarlo.
// ---------------------------------------------

import { ENDPOINTS } from "../api.js"; // Endpoints centralizados

const el = id => document.getElementById(id); // Acceso rápido a elementos por ID

// -------------------------
// MOSTRAR DETALLE DEL CULTIVO
// -------------------------
export async function mostrarDetalleCultivo(id){
     try {
    // Obtener detalles del cultivo con fetch
    const res = await fetch(`${ENDPOINTS.cultivos}${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });

    if (!res.ok) throw new Error("No se pudo obtener el cultivo");

    const cultivo = await res.json();

    // Mostrar información en la vista
    el("detalle-id").textContent = cultivo.id;
    el("detalle-producto").textContent = cultivo.producto_nombre;
    el("detalle-descripcion").textContent = cultivo.descripcion;
    el("detalle-cantidad").textContent = cultivo.cantidad;
    el("detalle-unidad").textContent = cultivo.unidad_medida;
    el("detalle-precio").textContent = parseFloat(cultivo.precio).toFixed(2);
    el("detalle-estado").textContent = cultivo.estado;
    el("detalle-fecha").textContent = new Date(cultivo.fecha_creacion).toLocaleString();
    el("detalle-imagen").src = cultivo.imagen;
    el("detalle-imagen").alt = cultivo.producto_nombre;

    // Precargar los datos en el formulario de edición
    el("edit-id").value = cultivo.id;
    el("edit-producto").value = cultivo.producto_nombre;
    el("edit-descripcion").value = cultivo.descripcion;
    el("edit-cantidad").value = cultivo.cantidad;
    el("edit-unidad").value = cultivo.unidad_medida;
    el("edit-precio").value = cultivo.precio;
    el("edit-estado").value = cultivo.estado;

    // Activar formularios y botones
    configurarFormularioEditarCultivo(id);
    configurarBotonEliminarCultivo(id);
    corregirAccesibilidadModales();

  } catch (err) {
    el("main-content").innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
  }
}


// -------------------------
// EDITAR CULTIVO
// -------------------------
// Configura el formulario de edición para actualizar el cultivo
function configurarFormularioEditarCultivo(id) {
  const form = el("form-editar-cultivo");
  const errorDiv = el("editar-cultivo-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Usar FormData para incluir imagen si se actualiza
    const formData = new FormData();
    formData.append("descripcion", el("edit-descripcion").value.trim());
    formData.append("cantidad", el("edit-cantidad").value.trim());
    formData.append("unidad_medida", el("edit-unidad").value.trim());
    formData.append("precio", el("edit-precio").value.trim());
    formData.append("estado", el("edit-estado").value);

    const nuevaImagen = el("edit-imagen").files[0];
    if (nuevaImagen) {
      formData.append("imagen", nuevaImagen);
    }

    try {
      // PATCH para actualizar solo campos modificados
      const res = await fetch(`${ENDPOINTS.cultivos}${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al actualizar el cultivo");

      // Cierra el modal y redirige al listado
      bootstrap.Modal.getInstance(el("modalEditarCultivo")).hide();
      location.hash = "#cultivosagricultor";

    } catch (err) {
      errorDiv.textContent = err.message;
      errorDiv.classList.remove("d-none");
    }
  });
}


// -------------------------
// ELIMINAR CULTIVO
// -------------------------
// Elimina el cultivo actual tras confirmación
function configurarBotonEliminarCultivo(id) {
  const btn = el("btn-confirmar-eliminar");

  btn.addEventListener("click", async () => {
    try {
      const res = await fetch(`${ENDPOINTS.cultivos}${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar cultivo");

      // Cierra el modal y redirige al listado
      bootstrap.Modal.getInstance(el("modalEliminarCultivo")).hide();
      location.hash = "#cultivosagricultor";

    } catch (err) {
      alert("No se pudo eliminar el cultivo: " + err.message);
    }
  });
}


// -------------------------
// ACCESIBILIDAD EN MODALES
// -------------------------
// Quita el foco activo al cerrar modales para mejorar accesibilidad
function corregirAccesibilidadModales() {
  ["modalEditarCultivo", "modalEliminarCultivo"].forEach(id => {
    const modal = el(id);
    if (modal) {
      modal.addEventListener("hide.bs.modal", () => {
        setTimeout(() => document.activeElement.blur(), 10);
      });
    }
  });
}