const { Router } = require("express")
const Comunidad = require("../../modelo/admin/comunidad.js")
const { insertar, editar, eliminar, } = require('../../validacion/admin/comunidad.js')


const rutas = Router()
const comunidad_ = new Comunidad()

rutas.post("/listar", async (req, res) => {
    // console.log(req)
    try {
        const resultado = await comunidad_.listar()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/buscar", async (req, res) => {
    try {
        const resultado = await comunidad_.buscar(req.body.dato)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-municipios", async (req, res) => {
    try {
        // console.log(req.body, 'llamando a listar munic')

        const resultado = await comunidad_.listarMunicipio()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-est", async (req, res) => {
    try {
        // console.log(req.body, 'llamando a listar munic')

        const resultado = await comunidad_.listarEst(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


rutas.post("/guardar", insertar, async (req, res) => {


    try {
        const { comunidad, codigo, municipio, hospital, fecha_, user } = req.body
        const datos = { nombre: comunidad, codigo, municipio, est: hospital, creating: fecha_, user_creating: user }
        console.log(req.body)

        const resultado = await comunidad_.insertar(datos)
        if (resultado === -1) {
            return res.json({ ok: false, msg: 'ya existe el registro' })
        }
        if (resultado === -2) {
            return res.json({ ok: false, msg: 'Codigo ya registrado!' })
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
        console.log(req.body)

        const { id, comunidad, codigo, municipio, hospital, estado, fecha_, user, } = req.body
        const datos = { id, nombre: comunidad, codigo, municipio, hospital, estado: estado === 1 ? 1 : 0, modified: fecha_, user_modified: user }

        const resultado = await comunidad_.actualizar(datos)
        if (resultado === -1) {
            return res.json({ msg: 'ya existe el registro', ok: false })
        }
        if (resultado === -2) {
            return res.json({ ok: false, msg: 'Codigo ya registrado!' })
        }
        if (!resultado) {
            return res.json({ msg: 'Actualizacion Fállida', ok: false })
        }
        return res.json({ ok: true, msg: 'Registro actualizado' })

    } catch (error) {
        console.log(error)
        return res.json({ error: 500, msg: error.sqlMessage });
    }
})


rutas.post("/eliminar", eliminar, async (req, res) => {
    try {
        const id = req.body.id;
        const resultado = await comunidad_.eliminar(id)
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