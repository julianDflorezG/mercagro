
const el = id => document.getElementById(id);

export async function cargarNavbar(rol){
    
    const navbarContainer = el("navbar-container");

    try {
        // Cargar el archivo HTML del navbar (plantilla)
        const res = await fetch("partials/navbar.html");
        const html = await res.text();

        // Inyectar el contenido del navbar en el contenedor correspondiente
        navbarContainer.innerHTML = html;

        // Ejecutar funciones después de insertar el navbar
        mostrarNombreUsuario();   // Coloca el nombre del usuario en el navbar
        activarCerrarSesion();    // Activa el botón para cerrar sesión
        cargarMenuPorRol(rol);    // Carga los enlaces del menú según el rol (admin, agricultor, comprador)

    } catch (err) {
        // Si hay un error cargando el navbar, se muestra un mensaje de error
        console.error("Error al cargar el navbar:", err);
        navbarContainer.innerHTML = `<div class="alert alert-danger"> No se pudo cargar el menú de navegación. </div>`;
    }

}


// -------------------------
// MOSTRAR NOMBRE EN EL NAVBAR
// -------------------------
function mostrarNombreUsuario() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const nombre = usuario?.nombre || "Usuario";
    el("usuarioNombre").textContent = nombre;
    
  } catch {
    console.warn("No se pudo mostrar el nombre del usuario.");
  }
}

// -------------------------
// CERRAR SESIÓN (LOGOUT)
// -------------------------
function activarCerrarSesion() {
  const btn = el("cerrar-sesion");
  if (!btn) return;

  btn.addEventListener("click", () => {
    localStorage.clear();
    location.hash = "#login";
  });
}

// -------------------------
// MENÚ LATERAL SEGÚN ROL
// -------------------------
const MENUS = {
  ADMIN: [
    { text: "Productos", hash: "#productos" },
    { text: "Usuarios", hash: "#usuarios" },
    { text: "Cultivos", hash: "#cultivosadmin" },
    { text: "Solicitudes", hash: "#solicitudesadmin" },
  ],
  AGRICULTOR: [
    { text: "Cultivos", hash: "#cultivosagricultor" },
    { text: "Solicitudes", hash: "#solicitudesagricultor" },
  ],
  COMPRADOR: [
    { text: "Cultivos", hash: "#cultivoscomprador" },
    { text: "Solicitudes", hash: "#solicitudescomprador" },
  ],
};

// Carga los ítems del menú lateral según el rol
function cargarMenuPorRol(rol) {
  const menuNav = el("menu-nav");
  if (!menuNav) return;

  const items = MENUS[rol] || [];
  menuNav.innerHTML = items.map(item =>
    `<li class="nav-item"><a class="nav-link" href="${item.hash}">${item.text}</a></li>`
  ).join("");
}