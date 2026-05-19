import { manejarRuta } from "./router.js"

document.addEventListener("DOMContentLoaded", ()=>{
    const mainContent= document.getElementById("main-content")
    manejarRuta(mainContent)
})