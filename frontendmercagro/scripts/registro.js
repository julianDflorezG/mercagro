import { ENDPOINTS } from "./api.js";

const el= id => document.getElementById(id)

export function iniciarRegistro(){
    
    const form= el("registro-form")
    const nombre= el("reg-nombre")
    const email= el("reg-email")
    const password= el("reg-password")
    const rol= el("reg-rol")
    const errorDiv= el("registro-error")
    const exitoDiv= el("registro-exito")

    form.addEventListener("submit", async (e)=>{
        e.preventDefault()

        const data= {
            nombre: nombre.value.trim(),
            email: email.value.trim(),
            clave: password.value,
            rol: rol.value
        }

        try {

            const res=  await fetch(ENDPOINTS.registro, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })

            if(!res.ok) throw new Error("Error al registrar usuario")

            exitoDiv.textContent= "Registro exitoso"
            exitoDiv.classList.remove("d-none")
            errorDiv.classList.add("d-none")

            form.reset()

            location.hash= "#login"

            
        } catch (error) {
            errorDiv.textContent= error.message
            errorDiv.classList.remove("d-none")
            exitoDiv.classList.add("d-none")
        }
    })
}