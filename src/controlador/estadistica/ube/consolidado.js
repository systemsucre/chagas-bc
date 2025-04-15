const { Router } = require("express")
const Consolidado = require("../../../modelo/estadistica/ube/consolidado.js")


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


rutas.post("/buscar", async (req, res) => {
    try {
        const resultado = await consolidado.buscar({ municipio: req.body.municipio, corresponde: req.body.corresponde, fecha1: req.body.fecha1 || null, fecha2: req.body.fecha2 || null })
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


rutas.post("/buscar-basico", async (req, res) => {
    try {
        const resultado = await consolidado.buscarBasico({ municipio: req.body.municipio, corresponde: req.body.corresponde, fecha1: req.body.fecha1 || null, fecha2: req.body.fecha2 || null })
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})






module.exports = rutas;