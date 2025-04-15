const { Router } = require("express")
const Rociado = require("../../../modelo/evaluacion/estadistica/rociado.js")


const rutas = Router()
const rociado = new Rociado()


rutas.post("/listar-municipios", async (req, res) => {
    try {
        const resultado = await rociado.listarMunicipios() 
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-meses", async (req, res) => {
    try {
        const resultado = await rociado.listarMeses(req.body.gestion)
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
        const resultado = await rociado.buscar(datos)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})




rutas.post("/listar-por-comunidad", async (req, res) => {
    try {
        const { gestion,mes, comunidad } = req.body
        const resultado = await rociado.listarPorComunidad({gestion, mes, comunidad,  })
        return res.json({ data: resultado, ok: true, msg: 'La informacion se ha enviado al nivel departamental exitosamente.' })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


module.exports = rutas;