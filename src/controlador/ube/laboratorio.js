const { Router } = require("express")
const Laboratorio = require("../../modelo/ube/laboratorio.js")
const { editar, } = require('../../validacion/ube/laboratorio.js')


const rutas = Router()
const laboratorio = new Laboratorio()

rutas.post("/listar-municipios", async (req, res) => {
    try {

        const resultado = await laboratorio.listarMunicipios()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})
rutas.post("/listar-comunidad", async (req, res) => {
    try {

        const resultado = await laboratorio.listarComunidad(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-casas", async (req, res) => {
    try {
        const resultado = await laboratorio.listarCasas(req.body.comunidad)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar", async (req, res) => {

    try {
        const resultado = await laboratorio.listar(req.body.comu,req.body.codigo)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/buscar", async (req, res) => {
    try {
        const resultado = await laboratorio.buscar({ comunidad: req.body.comunidad, fecha1: req.body.fecha1 || null, fecha2: req.body.fecha2 || null })
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


rutas.post("/actualizar", editar, async (req, res) => {
    
    try {
        let {
            ahneg, ahpos, amneg, ampos, n1neg, n1pos, n2neg, n2pos, n3neg, n3pos, n4neg, n4pos, n5neg, n5pos, id, fecha_, user } = req.body

        if ((ahneg + ahpos + amneg + ampos + n1neg + n1pos + n2neg + n2pos + n3neg + n3pos + n4neg + n4pos + n5neg + n5pos) === 0) {
            return res.json({ ok: false, msg: 'Introduzca almenos un valor mayor 0' })
        }


        const datos = {
            ahneg, ahpos, amneg, ampos, n1neg, n1pos, n2neg, n2pos, n3neg, n3pos, n4neg, n4pos, n5neg, n5pos, id,  fecha_modified: fecha_, user_modified: user
        }
        const resultado = await laboratorio.actualizar(datos)
        if (!resultado) {
            return res.json({ ok: false, msg: 'No se ha podido guardar el registro, intentelo nuvamente..!!!' })
        }
        return res.json({ ok: true, msg: 'Registro actualizado' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})






module.exports = rutas;