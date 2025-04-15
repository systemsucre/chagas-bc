const Router = require("express")
const  Usuario = require("../modelo/admin/usuario.js")
const {actualizarMiPerfil, cambiarMiContraseña} = require('../validacion/admin/usuario.js')

//const modelo from "../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos


const rutas = Router()
const usuarios = new Usuario()




rutas.post("/mis-datos", async (req, res) => {
    // console.log(req.body.usuario, 'mi perfil')
    try {
        const resultado = await usuarios.miPerfil(req.body.user)
        return res.json({ ok: true, data: resultado })
    } catch (error) {
        console.log('error en la base de datos', error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/recet",  async (req, res) => {
    const { contraseña_actual, nueva_contraseña, fecha_, user } = req.body
    const datos = { contraseña_actual, nueva_contraseña, modified: fecha_, user }
    try {
        await usuarios.cambiarMiContraseña(datos).then(j => {
            if (!j) return res.json({ msg: 'Contraseña actual incorrecta', ok: false })
            if (j) res.json({ ok: true, msg: 'La contraseña se ha cambiado correctamente', ok: true })
        })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


rutas.post("/actualizarMiPerfil", actualizarMiPerfil, async (req, res) => {
    // console.log(req.body, ' mi perfil')

    const { nombre, ap1, ap2, correo, direccion, celular, fecha_, user } = req.body
    const datos = {

        nombre, ap1, ap2, correo, direccion, celular, fecha_,  user
    }
    try {
        const result = await usuarios.actualizarMiPerfil(datos)
        if (result == -1) {
            return res.json({ msg: 'No existe el registro', ok: false })
        }
        if (!result) {
            return res.json({ msg: 'error al actualizar', ok: false })
        }
        return res.json({ ok: true, msg: 'Su perfil se ha actualizado correctamente' })

        // console.log(resultado)

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})



module.exports = rutas