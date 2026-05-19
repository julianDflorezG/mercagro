// ---------------------------------------------
// ARCHIVO: perfil.js
// Función: Mostrar, editar y eliminar el perfil del usuario autenticado.
// ---------------------------------------------

// Importa los endpoints y función para obtener los datos del usuario actual
import { ENDPOINTS, obtenerUsuario } from "./api.js";

// Función auxiliar para acceder rápidamente a un elemento por su ID
const el = id => document.getElementById(id);

// -------------------------
// MOSTRAR PERFIL
// -------------------------
export async function mostrarPefil(){
 try {
    const usuario = await obtenerUsuario(); // Obtiene los datos del usuario autenticado
    if (!usuario) throw new Error("No se pudo obtener la información del usuario");

    actualizarVistaPerfil(usuario);     // Muestra los datos en la vista
    activarFormularioEditar(usuario);   // Activa el formulario para editar perfil
    activarBotonEliminar();             // Activa el botón para eliminar cuenta
    corregirAccesibilidadModales();     // Mejora accesibilidad al cerrar modales
  } catch (err) {
    el("main-content").innerHTML = `
      <div class="alert alert-danger">${err.message}</div>
    `;
  }
}

// -------------------------
// ACTUALIZAR VISTA PERFIL
// -------------------------
// Muestra los datos del usuario en la vista de perfil
function actualizarVistaPerfil(usuario) {
  el("perfil-nombre").textContent = usuario.nombre;
  el("perfil-email").textContent = usuario.email;
  el("perfil-rol").textContent = usuario.rol;

  // También actualiza el nombre mostrado en el navbar
  const nombreNavbar = el("usuarioNombre");
  if (nombreNavbar) nombreNavbar.textContent = usuario.nombre;
}

// -------------------------
// FORMULARIO EDITAR PERFIL
// -------------------------
// Activa el formulario de edición de nombre y contraseña
function activarFormularioEditar(usuario) {
  const form = el("form-editar-perfil");
  const nombreInput = el("edit-nombre");
  const claveInput = el("edit-password");
  const errorDiv = el("perfil-error");

  nombreInput.value = usuario.nombre;
  errorDiv.classList.add("d-none"); // Oculta mensaje de error

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
      email: usuario.email,
      nombre: nombreInput.value.trim(),
      rol: usuario.rol,
    };

    const nuevaClave = claveInput.value.trim();
    if (nuevaClave) datos.clave = nuevaClave; // Solo agrega clave si se proporciona

    try {
      // Envía la solicitud PUT para actualizar el perfil
      const res = await fetch(ENDPOINTS.usuario, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify(datos),
      });

      if (!res.ok) throw new Error("Error al actualizar perfil");

      const usuarioActualizado = await obtenerUsuario();
      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

      // Actualiza los datos en la vista
      actualizarVistaPerfil(usuarioActualizado);

      bootstrap.Modal.getInstance(el("modalEditarPerfil")).hide();

    } catch (err) {
      errorDiv.textContent = err.message;
      errorDiv.classList.remove("d-none");
    }
  });
}

// -------------------------
// BOTÓN ELIMINAR PERFIL
// -------------------------
// Envía solicitud DELETE para eliminar la cuenta
function activarBotonEliminar() {
  const btn = el("confirmar-eliminar-perfil");

  btn.addEventListener("click", async () => {
    try {
      const res = await fetch(ENDPOINTS.usuario, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar la cuenta");

      localStorage.clear();           // Borra sesión
      location.href = "index.html";   // Redirige al login (inicio)

    } catch (err) {
      alert("No se pudo eliminar la cuenta: " + err.message);
    }
  });
}

// -------------------------
// ACCESIBILIDAD EN MODALES
// -------------------------
// Quita el foco del botón activo al cerrar el modal para evitar accesibilidad incorrecta
function corregirAccesibilidadModales() {
  ["modalEditarPerfil", "modalEliminarPerfil"].forEach(id => {
    const modal = el(id);
    if (modal) {
      modal.addEventListener("hide.bs.modal", () => {
        setTimeout(() => document.activeElement.blur(), 10);
      });
    }
  });
}
