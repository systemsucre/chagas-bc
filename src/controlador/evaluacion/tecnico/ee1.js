const { Router } = require("express")
const EE1 = require("../../../modelo/evaluacion/tecnico/ee1.js")
const { insertar, editar, eliminar, completar, } = require('../../../validacion/evaluacion/tecnico/ee1.js')


const rutas = Router()
const ee1 = new EE1()

rutas.post("/listar", async (req, res) => {
    // console.log(req.query)
    try {
        const resultado = await ee1.listar(req.body.comunidad)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/buscar", async (req, res) => {
    try {
        const resultado = await ee1.buscar(req.body.fecha1, req.body.fecha2, req.body.user, req.body.comunidad)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-municipios", async (req, res) => {
    try {

        const resultado = await ee1.listarMunicipios()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-comunidad", async (req, res) => {
    try {

        const resultado = await ee1.listarComunidad(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-casas", async (req, res) => {
    try {
        console.log(req.body, 'list house')

        const resultado = await ee1.listarCasas(req.body.comunidad)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-usuarios", async (req, res) => {
    try {

        const resultado = await ee1.listarUsuarios(req.body.user, req.body.municipio_id_tec)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


rutas.post("/guardar", insertar, async (req, res) => {
    // console.log('guardar', req.body.fecha_)

    try {
        let {
            casa, comunidad, sidmunicpio, fecha,
            inicio, final, ecin, ecia, ecpn, ecpa, lcipd, lcicm, lcith, lciot, lcppd,
            lcpga, lcpcl, lcpcj, lcpz, lcpot, negativa, cerrada, renuente,
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
            fecha, inicio, final, ecin, ecia, ecpn, ecpa, lcipd, lcicm, lcith, lciot, lcppd, comunidad, municipio:sidmunicpio,
            lcpga, lcpcl, lcpcj, lcpz, lcpot, fecha: fecha, usuario: user, user_created: user, created_at: fecha_, negativa, cerrada, renuente,author: nombreusuarioS
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

        if (resultado === -2) {
            return res.json({ ok: false, msg: 'Ya existe un registro con este CV para hoy "sin fecha de emision", espere a la nueva orden de su jefe de brigada.. ' })
        }
        if (resultado === -3) {
            return res.json({ ok: false, msg: 'Otro colega suyo ya empezo con la evaluacion entomologica de esta comunidad, Le sujerimos cambiar a otra comunidad, o comuniquese con su jefe de brigada. ' })
        }

        if (resultado === -4) {
            return res.json({ ok: false, msg: 'Esta comunidad Tiene otra actividad de evaluacion entomologica para enviar, Revise la informacion. ' })
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
        let { id,
            casa, comunidad,fecha,
            inicio, final, ecin, ecia, ecpn, ecpa, lcipd, lcicm, lcith, lciot, lcppd,
            lcpga, lcpcl, lcpcj, lcpz, lcpot, user, negativa, cerrada, renuente,
            fecha_, nombreusuarioS } = req.body
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


        let fecha1 = new Date(fecha_.split('-')[0], fecha_.split('-')[1], fecha_.split('-')[2].split(' ')[0], inicio.split(':')[0], inicio.split(':')[1], inicio.split(':')[2], 0)
        let fecha2 = new Date(fecha_.split('-')[0], fecha_.split('-')[1], fecha_.split('-')[2].split(' ')[0], final.split(':')[0], final.split(':')[1], final.split(':')[2], 0)


        // console.log(, inicio, fecha2, final)
        if (Date.parse(fecha1) >= Date.parse(fecha2)) {
            return res.json({ ok: false, msg: 'La hora de finalizacion debe ser mayor a la hora de inicio ' })  
        }


        const datos = {
            id,
            casa, comunidad, 
            inicio, final, ecin, ecia, ecpn, ecpa, lcipd, lcicm, lcith, lciot, lcppd,
            lcpga, lcpcl, lcpcj, lcpz, lcpot, user, fecha, negativa, cerrada, renuente,author: nombreusuarioS
        }
        if ((ecin + ecia) != (lcipd + lcicm + lcith + lciot)) {
            return res.json({ ok: false, msg: 'Debe coincidir la sumatoia de Los ejemplares capturados en el interior del domicilio ' })

        }
        if ((ecpn + ecpa) != (lcppd + lcpga + lcpcl + lcpcj + lcpz + lcpot)) {
            return res.json({ ok: false, msg: 'Debe coincidir la sumatoia de Los ejemplares capturados en el PERI/Exterior del domicilio ' })
        }
        const resultado = await ee1.actualizar(datos)

        if (resultado === -1) {
            return res.json({ ok: false, msg: 'Numero control vectorial ya esta registrada' })
        }

        if (!resultado) {
            return res.json({ msg: 'Actualizacion Fállida', ok: false })
        }
        return res.json({ ok: true, msg: 'Registro actualizado' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})



rutas.post("/eliminar", eliminar, async (req, res) => {
    try {
        const id = req.body.id;
        const user = req.body.user;
        const username = req.body.nombreusuarioS;
        const fecha = req.body.fecha_;
        const resultado = await ee1.eliminar(id, user, username, fecha)
        if (!resultado) {
            return res.json({ msg: 'Ops! No se ha eliminado el registro.', ok: false })
        }
        return res.json({ ok: true, msg: 'Registro eliminado correctamete' })

    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage + '. Puede existir valores dependientes a este registro. Consulte con el administrador' });
    }
})

rutas.post("/validar", completar, async (req, res) => {
    try {
        const fecha = req.body.fecha_;
        const usuario = req.body.user;
        const comunidad = req.body.comunidad;
        const { usuario1, usuario2, usuario3, usuario4, prerociado, observaciones, jefeBrigada } = req.body
        const datos = { usuario1, usuario2, usuario3, usuario4, prerociado, observaciones, jefeBrigada }
        const resultado = await ee1.validar(fecha, usuario, comunidad, datos)
        if (!resultado) {
            return res.json({ msg: 'Ops! No se ha podido completar la accion!. No existen registros para enviar/', ok: false })
        }

        if (resultado === -1) {
            return res.json({ msg: 'Falta vivienda por evaluar', ok: false })
        }

        if (resultado === -2) {
            return res.json({ msg: 'La cobertura almenos deveria alcanzar el 70%', ok: false })
        }
        
        return res.json({ ok: true, msg: 'El registro se ha enviado correctamete' })

    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})


module.exports = rutas;