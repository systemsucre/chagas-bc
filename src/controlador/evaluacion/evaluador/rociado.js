const { Router } = require("express")
const Rociado = require("../../../modelo/evaluacion/tecnico/rociado.js")
const { insertar, editar, eliminar, validar, } = require('../../../validacion/evaluacion/tecnico/rociado.js')


const rutas = Router()
const rociado = new Rociado()

rutas.post("/listar", async (req, res) => {
    // console.log(req)
    // 
    try {
        const resultado = await rociado.listar(req.body.comunidad)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage }); 
    }
})

rutas.post("/buscar", async (req, res) => {
    try {
        const resultado = await rociado.buscar(req.body.fecha1, req.body.fecha2, req.body.user, req.body.comunidad)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-municipios", async (req, res) => {
    try {

        const resultado = await rociado.listarMunicipios()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-ciclos", async (req, res) => {
    try {

        const resultado = await rociado.listarCiclos()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


rutas.post("/listar-insecticida", async (req, res) => {
    try {

        const resultado = await rociado.listarInsecticida()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})
rutas.post("/listar-comunidad", async (req, res) => {
    try {

        const resultado = await rociado.listarComunidad(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-casas", async (req, res) => {
    try {
        // console.log(req.body, 'list house')

        const resultado = await rociado.listarCasas(req.body.comunidad)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-usuarios", async (req, res) => {
    try {

        const resultado = await rociado.listarUsuarios(req.body.municipio, req.body.user)
        // console.log(resultado, req.body.municipio, ' llamando a listar munic')

        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


rutas.post("/guardar", insertar, async (req, res) => {

    try {
        let {
            casa, comunidad, municipio, fecha,
            rociadas, noRociadas, corrales, gallineros, conejeras, zarzo, otros, cerrada, renuente, numeroCargas, fecha_, user, nombreusuarioS } = req.body
        if (renuente || cerrada) {
            rociadas = 0
            noRociadas = 0
            corrales = 0
            gallineros = 0
            conejeras = 0
            zarzo = 0
            otros = 0
            numeroCargas = 0
        }
        if (!renuente || !cerrada) {
           if(numeroCargas < 1) return res.json({ ok: false, msg: 'La cantidad de cargas no puede ser menor a 1' })
        }



        const datos = {
            casa, comunidad, municipio, fecha,
            idr: rociadas, idnr: noRociadas, corrales, gallineros, conejeras, zarzo, otros, cerrada, renuente, numeroCargas,  usuario: user,
            user_created:user, created_at:fecha_, author: nombreusuarioS
        }
     
        const resultado = await rociado.insertar(datos, comunidad)
        if (resultado === -1) {
            return res.json({ ok: false, msg: 'Esta vivienda no esta registrada' })
        }
        if (resultado === -2) {
            return res.json({ ok: false, msg: 'Ya existe un registro con este CV para hoy "sin fecha de emision", espere a la nueva orden de su jefe de brigada' })
        }
  
        if (resultado === -4) {
            return res.json({ ok: false, msg: 'La cantidad de habitaciones no es igual a la original que figura en el registro de viviendas. Revise sus datos...  ' })
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
            casa, comunidad, municipio, fecha,
            rociadas, noRociadas, corrales, gallineros, conejeras, zarzo, otros, renuente, cerrada, numeroCargas, fecha_, user, nombreusuarioS } = req.body
        if (renuente || cerrada) {
            rociadas = 0
            noRociadas = 0
            corrales = 0
            gallineros = 0
            conejeras = 0
            zarzo = 0
            otros = 0
            numeroCargas = 0
        }

        if (!renuente || !cerrada) {
            if(numeroCargas < 1) return res.json({ ok: false, msg: 'La cantidad de cargas no puede ser menor a 1' })
         }
 

        const datos = {
            id,
            casa, comunidad, municipio, fecha,
            idr: rociadas, idnr: noRociadas, corrales, gallineros, conejeras, zarzo, otros, cerrada, renuente, numeroCargas, usuario: user, author: nombreusuarioS
        }
        const resultado = await rociado.actualizar(datos)

        if (resultado === -1) {
            return res.json({ ok: false, msg: 'Vivienda ya esta rociada' })
        }
        if (resultado === -4) {
            return res.json({ ok: false, msg: 'La cantidad de habitaciones no es igual a la original que figura en el registro de viviendas. Revise sus datos... ' })
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
        const resultado = await rociado.eliminar(id, user, username, fecha)
        if (!resultado) {
            return res.json({ msg: 'Ops! No se ha eliminado el registro.', ok: false })
        }
        return res.json({ ok: true, msg: 'Registro eliminado correctamete' })

    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage + '. Puede existir valores dependientes a este registro. COnsulte con el administrador' });
    }
})

rutas.post("/validar", validar, async (req, res) => {
    try {
        let {
            comunidad, usuario1, usuario2, usuario3, usuario4,
            insecticida, dosis, ciclo, lote, fecha_, user, usuarioBrigada, observaciones, selectivo, total, denuncia } = req.body
        if(!selectivo && !total && !denuncia) selectivo = true
        const datos = { comunidad, insecticida, usuario:user, usuario1, usuario2, usuario3, usuario4, dosis, ciclo, lote, fecha: fecha_, user, usuarioBrigada, observaciones, selectivo, total, denuncia  }
        const resultado = await rociado.validar(datos)

        if (!resultado) {
            return res.json({ msg: 'Ops! No se ha podido completar la accion!. No existen registros para enviar/', ok: false })
        }

        return res.json({ ok: true, msg: 'Los registros se han enviado correctamete' })

    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})


module.exports = rutas;