// ---------------------------------------------
// ARCHIVO: administrador/producto_detalle.js
// Función: Muestra el detalle de un producto y permite editarlo o eliminarlo.
// ---------------------------------------------

import { ENDPOINTS } from "../api.js"; // Endpoints del backend

const el = id => document.getElementById(id); // Función auxiliar para acceder por ID

// -------------------------
// MOSTRAR DETALLE PRODUCTO
// -------------------------
// Carga los datos de un producto por su ID y los muestra en la vista
export async function mostrarDetalleProducto(id){
     try {
    const res = await fetch(`${ENDPOINTS.productos}${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });

    if (!res.ok) throw new Error("No se pudo obtener el producto");

    const producto = await res.json();

    // Mostrar los datos en los elementos de la vista
    el("detalle-id").textContent = producto.id;
    el("detalle-nombre").textContent = producto.nombre;
    el("detalle-precio").textContent = producto.precio_referencia;
    el("detalle-unidad").textContent = producto.unidad_medida.toUpperCase();

    // Cargar los datos en el formulario de edición
    el("edit-id").value = producto.id;
    el("edit-nombre").value = producto.nombre;
    el("edit-precio").value = producto.precio_referencia;
    el("edit-unidad").value = producto.unidad_medida;

    // Configurar funcionalidades adicionales
    configurarFormularioEditarProducto(id);
    configurarBotonEliminarProducto(id);
    corregirAccesibilidadModalesProducto();

  } catch (error) {
    // Mostrar error en pantalla si la petición falla
    el("main-content").innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
  }
}


// -------------------------
// FORMULARIO EDITAR PRODUCTO
// -------------------------
// Configura el formulario del modal para actualizar los datos del producto
function configurarFormularioEditarProducto(id) {
  const form = el("form-editar-producto");
  const errorDiv = el("editar-producto-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener los nuevos valores del formulario
    const data = {
      nombre: el("edit-nombre").value.trim(),
      precio_referencia: parseFloat(el("edit-precio").value),
      unidad_medida: el("edit-unidad").value.trim(),
    };

    try {
      const res = await fetch(`${ENDPOINTS.productos}${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al actualizar el producto");

    
      bootstrap.Modal.getInstance(el("modalEditarProducto")).hide();
      location.hash = "#productos";

    } catch (err) {
      errorDiv.textContent = err.message;
      errorDiv.classList.remove("d-none");
    }
  });
}


// -------------------------
// BOTÓN ELIMINAR PRODUCTO
// -------------------------
// Configura el botón de confirmación de eliminación
function configurarBotonEliminarProducto(id) {
  const btn = el("btn-confirmar-eliminar");

  btn.addEventListener("click", async () => {
    try {
      const res = await fetch(`${ENDPOINTS.productos}${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar el producto");

      // Cierra el modal y vuelve al listado
      bootstrap.Modal.getInstance(el("modalEliminarProducto")).hide();
      location.hash = "#productos";

    } catch (err) {
      alert(err.message);
    }
  });
}


// -------------------------
// ACCESIBILIDAD: QUITAR FOCO
// -------------------------
// Mejora la accesibilidad quitando el foco activo tras cerrar un modal
function corregirAccesibilidadModalesProducto() {
  ["modalEditarProducto", "modalEliminarProducto"].forEach(id => {
    const modal = el(id);
    if (modal) {
      modal.addEventListener("hide.bs.modal", () => {
        setTimeout(() => document.activeElement.blur(), 10);
      });
    }
  });
}
