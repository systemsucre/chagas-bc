const { Router } = require("express")
const EE2 = require("../../../modelo/evaluacion/estadistica/ee2.js")


const rutas = Router()
const ee2 = new EE2()


rutas.post("/listar-municipios", async (req, res) => {
    try {
        const resultado = await ee2.listarMunicipios() 
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-meses", async (req, res) => {
    try {
        const resultado = await ee2.listarMeses(req.body.gestion)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})





rutas.post("/buscar", async (req, res) => {
    try {
        const { fecha1, fecha2, municipio_id_tec, entidad, gestion, nivel} = req.body
        const datos = { fecha1, fecha2, municipio_id_tec, entidad, gestion, nivel }
        const resultado = await ee2.buscar(datos)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})




rutas.post("/listar-por-comunidad", async (req, res) => {
    try {
        const { gestion,mes, comunidad } = req.body
        const resultado = await ee2.listarPorComunidad({gestion, mes, comunidad,  })
        return res.json({ data: resultado, ok: true, msg: 'La informacion se ha enviado al nivel departamental exitosamente.' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


module.exports = rutas;