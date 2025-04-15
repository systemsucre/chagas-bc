const { Router } = require("express")
const Entidad = require("../../modelo/admin/entidad.js")
const { insertar, editar, eliminar, } = require('../../validacion/admin/entidad.js')

//const modelo = require("../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos

const rutas = Router()
const entidad_ = new Entidad()

rutas.post("/listar", async (req, res) => {
    // console.log(req)
    try {
        const resultado = await entidad_.listar()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/buscar", async (req, res) => {
    try {
        const resultado = await entidad_.buscar(req.body.dato)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-municipios", async (req, res) => {
    try {
        // console.log(req.body, 'llamando a listar munic')

        const resultado = await entidad_.listarMunicipio()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-niveles", async (req, res) => {
    try {
        // console.log(req.body, 'llamando a listar munic')

        const resultado = await entidad_.listarNiveles()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


rutas.post("/guardar", insertar, async (req, res) => {


    try {
        const { nombre, municipio, nivel, laboratorio, fecha_, user, codigo } = req.body
        const datos = { nombre, municipio, nivel, laboratorio,creating: fecha_, user_creating: user, codigo }
        const resultado = await entidad_.insertar(datos)
        if (resultado === -1) {
            return res.json({ ok: false, msg: 'ya existe el registro' })
        }
        if (resultado === -2) {
            return res.json({ ok: false, msg: 'Codigo de hospital ya registrado' })
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
        const { id, nombre, municipio, nivel, laboratorio, estado, fecha_, user, codigo } = req.body
        const datos = { id, nombre, municipio, nivel, laboratorio, estado: estado === 1 ? 1 : 0, modified: fecha_, user_modified: user, codigo }

        const resultado = await entidad_.actualizar(datos)
        if (resultado === -1) {
            return res.json({ msg: 'ya existe el registro', ok: false })
        }
        if (resultado === -2) {
            return res.json({ ok: false, msg: 'Codigo de hospital ya registrado' })
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
        const resultado = await entidad_.eliminar(id)
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