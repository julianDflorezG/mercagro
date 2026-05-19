// ---------------------------------------------
// ARCHIVO: agricultor/cultivos.js
// Función: Muestra y permite crear cultivos del agricultor autenticado.
// ---------------------------------------------

import { ENDPOINTS } from "../api.js"; // Importa los endpoints definidos

const el = id => document.getElementById(id); // Función auxiliar para obtener elementos por ID

// -------------------------
// CARGAR CULTIVOS DEL AGRICULTOR
// -------------------------
export function cargarCultivosAgricultor(){
    const tabla = document.querySelector("#tabla-cultivos tbody");
  const error = el("cultivos-error");

  // Solicita los cultivos del agricultor autenticado
  fetch(ENDPOINTS.cultivos, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`, // Token de autenticación
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("No se pudieron cargar los cultivos");
      return res.json();
    })
    .then(data => {
      tabla.innerHTML = "";

      if (data.length === 0) {
        tabla.innerHTML = `<tr><td colspan="7" class="text-center">No tienes cultivos registrados.</td></tr>`;
        return;
      }

      // Inserta cada cultivo en una fila
      data.forEach(cultivo => {
        const fila = `
          <tr>
            <td>${cultivo.id}</td>
            <td>${cultivo.producto_nombre}</td>
            <td>${cultivo.cantidad}</td>
            <td>${cultivo.unidad_medida}</td>
            <td>$${parseFloat(cultivo.precio).toFixed(2)}</td>
            <td>${cultivo.estado}</td>
            <td>
              <button class="btn btn-sm btn-info ver-detalle" data-id="${cultivo.id}">Detalle</button>
            </td>
          </tr>
        `;
        tabla.insertAdjacentHTML("beforeend", fila);
      });

      // Agrega funcionalidad a los botones "Detalle"
      document.querySelectorAll(".ver-detalle").forEach(btn => {
        btn.addEventListener("click", () => {
          location.hash = `#cultivo-${btn.getAttribute("data-id")}`; // Cambia la ruta
        });
      });
    })
    .catch(err => {
      error.textContent = err.message;
      error.classList.remove("d-none");
    });

  // Activa el formulario y modal de creación
  activarFormularioCrearCultivo();
  configurarModalCrearCultivo();
}


// -------------------------
// FORMULARIO CREAR CULTIVO
// -------------------------
// Esta función configura el formulario y envía el nuevo cultivo al backend
function activarFormularioCrearCultivo() {
  const form = el("form-crear-cultivo");
  if (!form) return;

  const productoSelect = el("cultivo-producto");
  const descripcion = el("cultivo-descripcion");
  const cantidad = el("cultivo-cantidad");
  const unidad = el("cultivo-unidad");
  const precio = el("cultivo-precio");
  const imagen = el("cultivo-imagen");
  const error = el("crear-cultivo-error");

  // Cargar los productos disponibles en el <select>
  fetch(ENDPOINTS.productos, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  })
    .then(res => res.json())
    .then(productos => {
      productoSelect.innerHTML =
        `<option value="" disabled selected>Seleccionar producto</option>` +
        productos.map(p => `<option value="${p.id}">${p.nombre}</option>`).join("");
    })
    .catch(() => {
      productoSelect.innerHTML = `<option disabled selected>Error al cargar productos</option>`;
    });

  // Enviar el formulario con FormData (para incluir imagen)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("producto", productoSelect.value);
    formData.append("descripcion", descripcion.value.trim());
    formData.append("cantidad", cantidad.value.trim());
    formData.append("unidad_medida", unidad.value.trim());
    formData.append("precio", precio.value.trim());
    formData.append("estado", "REGISTRO"); // Estado inicial del cultivo
    formData.append("imagen", imagen.files[0]); // Imagen del cultivo

    try {
      const res = await fetch(ENDPOINTS.cultivos, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al crear cultivo");

      // Oculta modal, reinicia formulario y recarga la tabla
      bootstrap.Modal.getInstance(el("modalCrearCultivo")).hide();
      form.reset();
      error.classList.add("d-none");
      cargarCultivosAgricultor();

    } catch (err) {
      error.textContent = err.message;
      error.classList.remove("d-none");
    }
  });
}


// -------------------------
// MODAL: RESET Y ACCESIBILIDAD
// -------------------------
// Limpia el modal al cerrarse y elimina el foco activo para accesibilidad
function configurarModalCrearCultivo() {
  const modal = el("modalCrearCultivo");
  if (!modal) return;

  modal.addEventListener("hidden.bs.modal", () => {
    el("form-crear-cultivo").reset();
    el("crear-cultivo-error").classList.add("d-none");
  });

  modal.addEventListener("hide.bs.modal", () => {
    setTimeout(() => document.activeElement.blur(), 10);
  });
}