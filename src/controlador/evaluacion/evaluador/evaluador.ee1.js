const { Router } = require("express")
const EE1 = require("../../../modelo/evaluacion/evaluador/evaluador.ee1.js")
const { insertar } = require('../../../validacion/evaluacion/evaluador/evaluador.ee1.js')


const rutas = Router()
const ee1 = new EE1()


rutas.post("/listar-anios", async (req, res) => {
    try {
        const resultado = await ee1.listarGestion()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


rutas.post("/listar-meses", async (req, res) => {
    try {
        const resultado = await ee1.listarMeses(req.body.gestion, req.body.fecha_)

        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/filtrar-evaluaciones-viviendas", async (req, res) => { 
    try {
        const resultado = await ee1.filtarEvaluacionesViviendas(req.body.gestion, req.body.user, req.body.sidcomunidad)
        // console.log(resultado, 'dashboard')

        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})



rutas.post("/listar-casas", async (req, res) => {
    try {
        // console.log(req.body.sidcomunidad, ' lisatr casas ')
        const resultado = await ee1.listarCasas(req.body.sidcomunidad, req.body.mes)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})



rutas.post("/guardar", insertar, async (req, res) => {
    console.log('guardar evaluador ee1', req.body.id_mes)

    try {
        let {
            casa, sidcomunidad, scomunidad, municipio_id_tec, municipio_tec, id_gestion, gestion, id_mes, mes,
            inicio, final, ecin, ecia, ecpn, ecpa, lcipd, lcicm, lcith, lciot, lcppd,
            lcpga, lcpcl, lcpcj, lcpz, lcpot, negativa, cerrada, renuente, prerociado,
            fecha_, user, nombreusuarioS } = req.body

        if (
            ecin == 0 &&
            ecia == 0 &&
            ecpn == 0 &&
            ecpa == 0 &&
            lcipd == 0 &&
            lcicm == 0 &&
            lcith == 0 &&
            lciot == 0 &&
            lcppd == 0 &&
            lcpga == 0 &&
            lcpcl == 0 &&
            lcpcj == 0 &&
            lcpz == 0 &&
            lcpot == 0 &&
            cerrada == 0 && renuente == 0
        ) negativa = 1
        if (cerrada || negativa || renuente) {
            ecin = 0
            ecia = 0
            ecpn = 0
            ecpa = 0
            lcipd = 0
            lcicm = 0
            lcith = 0
            lciot = 0
            lcppd = 0
            lcpga = 0
            lcpcl = 0
            lcpcj = 0
            lcpz = 0
            lcpot = 0
        }
        const datos = {
            casa,
            inicio, final, ecin, ecia, ecpn, ecpa, lcipd, lcicm, lcith, lciot, lcppd, comunidad: sidcomunidad, nombre_comunidad: scomunidad, municipio: municipio_id_tec,
            nombre_municipio: municipio_tec,
            lcpga, lcpcl, lcpcj, lcpz, lcpot, usuario: user, user_created: user, created_at: fecha_, negativa, cerrada, renuente, author: nombreusuarioS,
            id_gestion, gestion, id_mes, mes, prerociado
        }
        let fecha1 = new Date(fecha_.split('-')[0], fecha_.split('-')[1], fecha_.split('-')[2].split(' ')[0], inicio.split(':')[0], inicio.split(':')[1], inicio.split(':')[2], 0)
        let fecha2 = new Date(fecha_.split('-')[0], fecha_.split('-')[1], fecha_.split('-')[2].split(' ')[0], final.split(':')[0], final.split(':')[1], final.split(':')[2], 0)


        // console.log(, inicio, fecha2, final)
        if (Date.parse(fecha1) >= Date.parse(fecha2)) {
            return res.json({ ok: false, msg: 'La hora de finalizacion debe ser mayor a la hora de inicio ' })
        }


        if ((ecin + ecia) != (lcipd + lcicm + lcith + lciot)) {
            return res.json({ ok: false, msg: 'Debe coincidir la sumatoria de Los ejemplares capturados en el interior del domicilio ' })

        }
        if ((ecpn + ecpa) != (lcppd + lcpga + lcpcl + lcpcj + lcpz + lcpot)) {
            return res.json({ ok: false, msg: 'Debe coincidir la sumatoria de Los ejemplares capturados en el PERI/Exterior del domicilio ' })
        }
        const resultado = await ee1.insertar(datos)

        if (!resultado) {
            return res.json({ ok: false, msg: 'No se ha podido guardar el registro, intentelo nuvamente..!!!' })
        }
        return res.json({ ok: true, msg: 'Registro Guardado' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/deleted", async (req, res) => {
    let evaluacion = null
    if (req.body.evaluacion)
        evaluacion = req.body.evaluacion
    else
        evaluacion = 0
    const result = await ee1.deleted(evaluacion, req.body.user, req.body.nombreusuarioS, req.body.fecha_)
    if (result)
        res.json({ ok: true, msg: 'Evaluacion eliminado con exito' })
    else
        res.json({ ok: false, msg: 'Evaluacion no eliminado!!!' })
})




module.exports = rutas;