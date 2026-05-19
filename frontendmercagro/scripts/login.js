import { ENDPOINTS, obtenerUsuario } from "./api.js";
import { redirigirPorRol } from "./router.js";

const el= id => document.getElementById(id)

export function iniciarLogin(){

    const loginForm= el("login-form")

    if (!loginForm) return

    const emailInput= el("email")
    const passwordInput= el("password")
    const erroDiv= el("login-error")

    loginForm.addEventListener("submit", async (e)=>{
        e.preventDefault()

        try {

            const res=  await fetch(ENDPOINTS.login, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: emailInput.value.trim(),
                    password: passwordInput.value
                })
            })

            if(!res.ok) throw new Error("Credenciales incorrectas")

            const data= await res.json()

            localStorage.setItem("access", data.access)

            const usuario= await obtenerUsuario(data.access)

            localStorage.setItem("usuario", JSON.stringify(usuario))

            location.hash= redirigirPorRol()
            
        } catch (error) {
            erroDiv.textContent= error.message
            erroDiv.classList.remove("d-none")
        }

    })

}