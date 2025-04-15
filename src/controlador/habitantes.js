const { Router } = require("express")
const Habitantes = require("../../modelo/habitantes.js")
const { insertar, editar, eliminar,  } = require('../../validacion/habitantes.js')


const rutas = Router()
const habitantes = new Habitantes()

rutas.post("/listar", async (req, res) => {
    // console.log(req)
    try {
        const resultado = await habitantes.listar()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})
 
rutas.post("/buscar", async (req, res) => {
    try {
        const resultado = await habitantes.buscar(req.body.dato)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-municipios", async (req, res) => {
    try {
        // console.log(req.body, 'llamando a listar munic')

        const resultado = await habitantes.listarMunicipio()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-hospital", async (req, res) => {
    try {
        // console.log(req.body, 'llamando a listar munic')

        const resultado = await habitantes.listarEst(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-comunidad", async (req, res) => {
    try {
        // console.log(req.body, 'llamando a listar munic')

        const resultado = await habitantes.listarComunidad(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


rutas.post("/guardar", insertar, async (req, res) => {

    try {
        const { comunidad, latitud, longitud, altitud,
            vmIntra, vmPeri, numero_habitaciones,
            numero_control_vectorial, fecha_, user } = req.body
        const datos = {
            comunidad, latitud, longitud, altitud, vm_intra: vmIntra, vm_peri: vmPeri,
            num_hab: numero_habitaciones,
            cv: numero_control_vectorial, creating: fecha_, user_creating: user
        }
        const resultado = await habitantes.insertar(datos)
        if (resultado === -1) {
            return res.json({ ok: false, msg: 'Esta coordenada ya esta registrada' })
        }
        if (resultado === -2) {
            return res.json({ ok: false, msg: 'Numero control vectorial ya esta registrada' })
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
        const { id, comunidad, 
            vmIntra, vmPeri, numero_habitaciones,
            numero_control_vectorial, fecha_, user } = req.body
        const datos = {
            id, comunidad, vm_intra: vmIntra, vm_peri: vmPeri,
            num_hab: numero_habitaciones,
            cv: numero_control_vectorial, modified: fecha_, user_modified: user
        }

        const resultado = await habitantes.actualizar(datos)

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
        const resultado = await habitantes.eliminar(id)
        if (!resultado) {
            return res.json({ msg: 'Ops! No se ha eliminado el registro.', ok: false })
        }
        return res.json({ ok: true, msg: 'Registro eliminado correctamete' })

    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage + '. Puede existir valores dependientes a este registro. COnsulte con el administrador' });
    }
})


module.exports = rutas;