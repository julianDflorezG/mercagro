// ---------------------------------------------
// ARCHIVO: administrador/productos.js
// Función: Carga, visualiza y permite crear productos agrícolas.
// ---------------------------------------------
import { ENDPOINTS } from "../api.js";

// Función auxiliar para obtener un elemento por su ID
const el = id => document.getElementById(id);

// -------------------------
// CARGAR PRODUCTOS
// -------------------------
// Esta función carga todos los productos del sistema para que el administrador los vea en una tabla.
export function cargarProductos(){
    const tabla = document.querySelector("#tabla-productos tbody");
    const error = el("productos-error");

    // Fetch al endpoint de productos con token
  fetch(ENDPOINTS.productos, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("No se pudieron cargar los productos");
      return res.json();
    })
    .then(data => {
      tabla.innerHTML = ""; // Limpia la tabla antes de insertar

      // Recorre los productos y crea una fila para cada uno
      data.forEach(producto => {
        const fila = `
          <tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${Number(producto.precio_referencia).toFixed(2)}</td>
            <td>${producto.unidad_medida.toUpperCase()}</td>
            <td>
              <button class="btn btn-sm btn-info ver-detalle" data-id="${producto.id}">Detalle</button>
            </td>
          </tr>
        `;
        tabla.insertAdjacentHTML("beforeend", fila); // Inserta en la tabla
      });

      // Activa los botones de detalle para cambiar a la vista del producto específico
      document.querySelectorAll(".ver-detalle").forEach(btn => {
        btn.addEventListener("click", () => {
          location.hash = `#producto-${btn.getAttribute("data-id")}`; // Redirecciona a ruta dinámica
        });
      });
    })
    .catch(err => {
      error.textContent = err.message;
      error.classList.remove("d-none"); // Muestra mensaje de error
    });

  activarFormularioCrearProducto();    // Activa formulario para crear producto
  configurarModalCrearProducto();      // Configura el modal para comportamiento correcto
}

// -------------------------
// FORMULARIO CREAR PRODUCTO
// -------------------------
// Esta función gestiona el envío del formulario para crear un nuevo producto
export function activarFormularioCrearProducto() {
  const form = el("form-crear-producto");
  if (!form) return;

  const nombre = el("producto-nombre");
  const precio = el("producto-precio-referencia");
  const unidad = el("producto-unidad");
  const error = el("crear-producto-error");

  form.addEventListener("submit", async e => {
    e.preventDefault();

    // Estructura del nuevo producto a enviar
    const data = {
      nombre: nombre.value.trim(),
      precio_referencia: parseFloat(precio.value),
      unidad_medida: unidad.value.trim(),
    };

    try {
      const res = await fetch(ENDPOINTS.productos, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al crear el producto");

      // Oculta el modal, reinicia el formulario y recarga la tabla
      bootstrap.Modal.getInstance(el("modalCrearProducto")).hide();
      form.reset();
      error.classList.add("d-none");
      cargarProductos(); // Recarga la tabla con el nuevo producto
    } catch (err) {
      error.textContent = err.message;
      error.classList.remove("d-none");
    }
  });
}

// -------------------------
// CONFIGURAR MODAL DE CREACIÓN
// -------------------------
// Limpia los campos y mejora accesibilidad al cerrar el modal
function configurarModalCrearProducto() {
  const modal = el("modalCrearProducto");
  if (!modal) return;

  // Al cerrar el modal, se reinicia el formulario y se oculta el mensaje de error
  modal.addEventListener("hidden.bs.modal", () => {
    el("form-crear-producto").reset();
    el("crear-producto-error").classList.add("d-none");
  });

  // Al cerrarse el modal, se elimina el foco activo para evitar problemas de accesibilidad
  modal.addEventListener("hide.bs.modal", () => {
    setTimeout(() => document.activeElement.blur(), 10);
  });
}
