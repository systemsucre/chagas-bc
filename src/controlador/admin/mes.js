const { Router } = require("express")
const  Mes  = require("../../modelo/admin/mes.js")
const {  editar,   id } = require('../../validacion/admin/mes.js')


const rutas = Router()
const mes = new Mes()


rutas.post("/listarinicio", async (req, res) => { 
    try {
        const resultado = await mes.listarInicio(req.body.fecha_.split('-')[0])
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }

})
rutas.post("/listargestion", async (req, res) => {
    try {
        const resultado = await mes.listarGestion()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }

})
rutas.post("/listar", id, async (req, res) => {
    try {
        const resultado = await mes.listar(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }

})









rutas.post("/actualizar", editar, async (req, res) => {

    const { id, f1, h1, f2, h2, fecha_, estado, user } = req.body
    const datos = {
        id,
        f1, h1, f2, h2,
        modificado:fecha_,
        usuario:user, estado 
    }
    try {
        await mes.actualizar(datos).then(j => {
            return res.json({ ok: true, msg: 'Acceso actualizados' })
        })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})



module.exports = rutas;