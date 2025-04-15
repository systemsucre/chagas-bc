const { Router } = require("express")
const Estratificado = require("../../../modelo/estadistica/estratificado/estratificado.js")


const rutas = Router()
const estratificado = new Estratificado()



rutas.post("/listar-municipios", async (req, res) => {
    try {
        const resultado = await estratificado.listarMunicipios()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-meses", async (req, res) => {
    try {
        const resultado = await estratificado.listarMeses(req.body.gestion)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})




rutas.post("/estratificado-por-municipio", async (req, res) => {
    try {
        console.log(req.body)
        if (!req.body.mes1 || !req.body.mes2 || !req.body.gestion || !req.body.municipio) {
            return res.json({ ok: false, msg: 'Seleccione todos los parametros de búsqueda!' })
        }
        const resultado = await estratificado.listarPorMunicipio(req.body.municipio, req.body.mes1, req.body.mes2, req.body.gestion)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})






rutas.post("/listar-por-comunidad", async (req, res) => {
    try {
        const resultado = await estratificado.listarPorComunidad(req.body.comunidad, req.body.mes)
        return res.json({ data: resultado, ok: true, msg: 'requets ok.' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


module.exports = rutas; 