const { Router } = require("express")
const Consolidado = require("../../modelo/ube/consolidado.js")


const rutas = Router()
const consolidado = new Consolidado()

rutas.post("/listar-municipios", async (req, res) => {
    try {

        const resultado = await consolidado.listarMunicipios()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar", async (req, res) => {

    try {
        const resultado = await consolidado.listar(req.body.municipio, req.body.corresponde)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/buscar", async (req, res) => {
    try {
        const resultado = await consolidado.buscar({ municipio: req.body.municipio, corresponde: req.body.corresponde, fecha1: req.body.fecha1 || null, fecha2: req.body.fecha2 || null })
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


rutas.post("/habilitar-edicion", async (req, res) => {

    try {

        const resultado = await consolidado.habilitarEdicion(req.body.codigo)
        if (!resultado) {
            return res.json({ ok: false, msg: 'No se ha podido modificar el registro, intentelo nuvamente..!!!' })
        }
        console.log(resultado)
        return res.json({ ok: true, msg: 'Registro habilitado para su edicion' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})






module.exports = rutas;