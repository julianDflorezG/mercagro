import { iniciarLogin } from "./login.js"
import { iniciarRegistro } from "./registro.js"
import { mostrarPefil } from "./perfil.js"
import { cargarNavbar } from "./layout.js"

import { cargarProductos } from "./administrador/productos.js";
import { cargarUsuarios } from "./administrador/usuarios.js";
import { mostrarDetalleProducto } from "./administrador/producto_detalle.js"
import { cargarCultivosAdmin } from "./administrador/cultivos.js";
import { cargarSolicitudesAdmin } from "./administrador/solicitudes.js";

import { cargarCultivosAgricultor } from "./agricultor/cultivos.js";
import { mostrarDetalleCultivo } from "./agricultor/cultivo_detalle.js"
import { cargarSolicitudesRecibidas } from "./agricultor/solicitudes.js";

import { cargarCultivosComprador } from "./comprador/cultivos.js";
import { cargarSolicitudesComprador } from "./comprador/solicitudes.js";


function estaAutenticado(){
    return localStorage.getItem("access") && localStorage.getItem("usuario")
}


function obtenerRol(){
    try {
        const usuario= JSON.parse(localStorage.getItem("usuario"))
        return usuario?.rol
    } catch (error) {
        return null
    }
}


export function redirigirPorRol(){
    const rol= obtenerRol()
    switch (rol) {
        case "ADMIN": return "#productos"
        case "AGRICULTOR": return "#cultivosagricultor"
        case "COMPRADOR": return "#cultivoscomprador"           
        default: return "#login"
    }
}


// localhost:5500//#producto-5
const rutaDinamicas= [
    {
        patron: /^#producto-(\d+)$/,
        vista: "main/administrador/producto_detalle.html",
        callback: mostrarDetalleProducto
    },
    {
        patron: /^#cultivo-(\d+)$/,
        vista: "main/agricultor/cultivo_detalle.html",
        callback: mostrarDetalleCultivo
    }
]


async function cagarVista(url, callback, contenedor){
    try {
        const res= await fetch(url)
        const html= await res.text()
        contenedor.innerHTML = html
        if (typeof callback === "function") callback()
    } catch (error) {
        contenedor.innerHTML= `<div class="alert alert-danger">Error al cargar: ${url} </div>`
    }
}


const rutas= {
    "#login": {vista: "main/login.html", callback: iniciarLogin},
    "#registro": {vista: "main/registro.html", callback: iniciarRegistro},
    "#perfil": {vista: "main/perfil.html", callback: mostrarPefil},
    "#usuarios": { vista: "main/administrador/usuarios.html", callback: cargarUsuarios },
    "#productos": { vista: "main/administrador/productos.html", callback: cargarProductos },
    "#cultivosadmin": { vista: "main/administrador/cultivos.html", callback: cargarCultivosAdmin },
    "#solicitudesadmin": { vista: "main/administrador/solicitudes.html", callback: cargarSolicitudesAdmin },
    "#cultivosagricultor": { vista: "main/agricultor/cultivos.html", callback: cargarCultivosAgricultor },
    "#solicitudesagricultor": { vista: "main/agricultor/solicitudes.html", callback: cargarSolicitudesRecibidas },
    "#cultivoscomprador": { vista: "main/comprador/cultivos.html", callback: cargarCultivosComprador },
    "#solicitudescomprador": { vista: "main/comprador/solicitudes.html", callback: cargarSolicitudesComprador },
}


export async function manejarRuta(mainContent){

    let hash= location.hash || "#login"

    if (!estaAutenticado() && hash !== "#login" && hash !== "#registro") {
        location.hash= "#login"
        return
    }
    
    if (estaAutenticado() && (hash === "#login" || hash === "#registro")) {
        location.hash= redirigirPorRol()
        return
    }

    // match= ["#producto-5" ,"5"]
    for (let ruta of rutaDinamicas) {
        const match= hash.match(ruta.patron) 
        if (match) {
            const id= match[1]
            await cagarVista(ruta.vista, ()=>ruta.callback(id), mainContent)
            return
        }
    }

    const ruta= rutas[hash]
    if (!ruta) {
        mainContent.innerHTML= `<div class="alert alert-danger">Ruta no encontrada: ${hash} </div>`
        return
    }

    await cagarVista(ruta.vista, ruta.callback, mainContent)

    if (hash!=="#login" && hash!=="registro") {
        cargarNavbar(obtenerRol())
    }else{
        document.getElementById("navbar-container").innerHTML= ""
    }
}

window.addEventListener("DOMContentLoaded", ()=>{
    location.hash= estaAutenticado() ? redirigirPorRol() : "#login"
})

window.addEventListener("hashchange", ()=>{
    const mainContent= document.getElementById("main-content")
    manejarRuta(mainContent)
})