export const BASE_URL= "http://localhost:8000"

export const ENDPOINTS= {

    login: `${BASE_URL}/api/auth/login/`,
    registro: `${BASE_URL}/api/auth/registro/`,
    usuario: `${BASE_URL}/api/auth/usuario/`,
    listaUsuarios: `${BASE_URL}/api/auth/usuarios/`,

    productos: `${BASE_URL}/api/mercado/productos/`,

    cultivos: `${BASE_URL}/api/cultivos/`,
    listaCultivos: `${BASE_URL}/api/cultivos/publicados/lista/`,

    crearSolicitud: `${BASE_URL}/api/solicitudes/crear/`,
    solicitudesEnviadas: `${BASE_URL}/api/solicitudes/enviadas/`,
    solicitudesRecibidas: `${BASE_URL}/api/solicitudes/recibidas/`,
    cambiarEstadoSolicitud: `${BASE_URL}/api/solicitudes/estado/`,
    historialSolicitudes: `${BASE_URL}/api/solicitudes/historial/`,
}

export async function obtenerUsuario(token= localStorage.getItem("access")){
    
    const res= await fetch(ENDPOINTS.usuario, {
        headers:{
            Authorization: `Bearer ${token}`
        }
    })

    if (!res.ok) {
        throw new Error("No se pudo obtener el usuario")
    }

    return res.json()
}