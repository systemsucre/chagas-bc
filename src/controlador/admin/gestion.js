const { Router } = require("express")
const  Gestion  = require("../../modelo/admin/gestion.js")
const { insertar, editar, eliminar,  } = require('../../validacion/admin/gestion.js')


const rutas = Router()
const gestion = new Gestion()


rutas.post("/listar", async (req, res) => {
    try {
        const resultado = await gestion.listar() 
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' }) 
    }

})



rutas.post("/activar", eliminar, async (req, res) => {
    // console.log('datos antes de aliminar : ',req.body)
    try {
        const { id, modificado, usuario } = req.body;
        const datos = { id, modificado, usuario }
        const resultado = await gestion.activar(datos)
        if (!resultado)
            return res.json({ msg: "No existe el registro", ok: false });
        return res.json({ ok: true, msg: 'Gestion activado' })
    } catch (error) {
        console.log(error)

        return res.json({ ok: false, msg: error.sqlMessage });
    }
})
rutas.post("/desactivar", eliminar, async (req, res) => {
    // console.log('datos antes de aliminar : ',req.body)
    try {
        const { id, modificado, usuario } = req.body;
        const datos = { id, modificado, usuario }
        const resultado = await gestion.desactivar(datos)
        if (!resultado)
            return res.json({ msg: "No existe el registro", ok: false });
        return res.json({ ok: true, msg: 'Gestion desactivado' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

module.exports = rutas;