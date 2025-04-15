const { Router } = require("express")
const Ube = require("../../modelo/ube/ube.js")
const { insertar, editar, } = require('../../validacion/ube/ube.js')


const rutas = Router()
const ube = new Ube()

rutas.post("/listar-municipios", async (req, res) => {    
    try {

        const resultado = await ube.listarMunicipios()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})
rutas.post("/listar-comunidad", async (req, res) => {
    try {

        const resultado = await ube.listarComunidad(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-casas", async (req, res) => {
    try {
        const resultado = await ube.listarCasas(req.body.comunidad)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-datos-ee1", async (req, res) => {
    try {
        const resultado = await ube.listarDatosEE1(req.body.casa)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });   
    }
})

rutas.post("/listar", async (req, res) => {

    try {
        const resultado = await ube.listar(req.body.comunidad)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})
rutas.post("/listar-usuarios", async (req, res) => {

    try {
        const resultado = await ube.listarUsuarios()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


rutas.post("/buscar", async (req, res) => {
    try {
        const resultado = await ube.buscar({ comunidad: req.body.comunidad, fecha1: req.body.fecha1 || null, fecha2: req.body.fecha2 || null })
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})



rutas.post("/guardar", insertar, async (req, res) => {

    try {
        let {
            casa, lci, lcp, ti, ts, tg, pm, other, num_envase, muertos, vivos, num_adultos, num_ninfas, fecha_, user, nombreusuarioS } = req.body

        if ((lci + lcp) === 0) {
            return res.json({ ok: false, msg: 'Introduzca almenos un numero diferente de cero' })
        }
        if ((lci + lcp) !== (ti + ts + tg + pm + other)) {
            return res.json({ ok: false, msg: 'Los ejemplares capturados no coinciden con la sumatoria T.i, T.s, T.g., P.m., y otros' })
        }
        if ((lci + lcp) !== (vivos + muertos)) {
            return res.json({ ok: false, msg: 'Los ejemplares capturados no coinciden con la sumatoria Recepcionados vivos y muertos' })
        }

        if ((lci + lcp) !== (num_adultos + num_ninfas)) {
            return res.json({ ok: false, msg: 'Los ejemplares capturados no coinciden con la sumatoria N° Adultos y N° Ninfas' })
        }


        const datos = {
            casa, lci, lcp, ti, ts, tg, pm, otros: other, num_envase, muertos, vivos, num_adultos, num_ninfas, fecha_recepcion: fecha_.split(' ')[0], usuario_recepcion: user, author: nombreusuarioS
        }
        const resultado = await ube.insertar(datos)
        if (resultado === -1) {
            return res.json({ ok: false, msg: 'Numeros incorrectos. El sistema esta gurdando este intento de sabotaje de datos.... Numero totalmente diferentes' })
        }
        if (!resultado) {
            return res.json({ ok: false, msg: 'No se ha podido guardar el registro, intentelo nuvamente..!!!' })
        }
        return res.json({ ok: true, msg: 'Registro Guardado' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})



rutas.post("/actualizar", editar, async (req, res) => {
    try {
        let {
            id, lci, lcp, ti, ts, tg, pm, other, num_envase, muertos, vivos, num_adultos, num_ninfas, fecha_, user, nombreusuarioS } = req.body

        if ((lci + lcp) === 0) {
            return res.json({ ok: false, msg: 'Introduzca almenos un numero diferente de cero' })
        }
        if ((lci + lcp) !== (ti + ts + tg + pm + other)) {
            return res.json({ ok: false, msg: 'Los ejemplares capturados no coinciden con la sumatoria T.i, T.s, T.g., P.m., y otros' })
        }

        if ((lci + lcp) !== (vivos + muertos)) {
            return res.json({ ok: false, msg: 'Los ejemplares capturados no coinciden con la sumatoria Recepcionados vivos y muertos' })
        }

        if ((lci + lcp) !== (num_adultos + num_ninfas)) {
            return res.json({ ok: false, msg: 'Los ejemplares capturados no coinciden con la sumatoria N° Adultos y N° Ninfas' })
        }

        const datos = {
            id, lci, lcp, ti, ts, tg, pm, otros: other, num_envase, muertos, vivos, num_adultos, num_ninfas, fecha_modified: fecha_, user_modified: user, author: nombreusuarioS
        }
        const resultado = await ube.actualizar(datos)
        if (resultado === -1) {
            return res.json({ ok: false, msg: 'Numeros incorrectos. El sistema esta gurdando este intento de sabotaje de datos.... Numero totalmente diferentes' })
        }
        if (!resultado) {
            return res.json({ ok: false, msg: 'No se ha podido guardar el registro, intentelo nuvamente..!!!' })
        }
        return res.json({ ok: true, msg: 'Registro actualizado' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})



rutas.post("/eliminar", async (req, res) => {
    try {
        const id = req.body.id;
        const resultado = await ube.eliminar(id)
        if (!resultado) {
            return res.json({ msg: 'Ops! No se ha eliminado el registro.', ok: false })
        }
        return res.json({ ok: true, msg: 'Registro eliminado correctamete' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage + '. Puede existir valores dependientes a este registro. Consulte con el administrador' });
    }
})

rutas.post("/validar", async (req, res) => {
    try {

        const { usuario, comunidad,fecha_, activa, denuncia, movEst, otros, observaciones } = req.body

        let corresponde = null
        if (activa) corresponde = 1
        if (denuncia) corresponde = 2
        if (movEst) corresponde = 3
        if (otros) corresponde = 4
        const datos = {tecnico: usuario, comunidad, corresponde, observaciones , fecha:fecha_}
        const resultado = await ube.validar(fecha_,datos)
        if (!resultado) {
            return res.json({ msg: 'Ops! No se ha podido completar la accion!.', ok: false })
        }
        return res.json({ ok: true, msg: 'Registro completado correctamente' })

    } catch (error) {
        console.log(error)
        return res.json({ ok:false, msg: error.sqlMessage ||'Esta accion no esta disponible' });
    }
})


module.exports = rutas;