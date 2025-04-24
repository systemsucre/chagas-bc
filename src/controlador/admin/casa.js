const { Router } = require("express")
const Casa = require("../../modelo/admin/casa.js")
const { insertar, editar, eliminar, editarCoordenadas, } = require('../../validacion/admin/casa.js')


const rutas = Router()
const casa = new Casa()

rutas.post("/listar-coordenadas", async (req, res) => {
    console.log(req.body)
    try {
        const resultado = await casa.listarMapa()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar", async (req, res) => {
    let comunidad = null
    let municipio = null
    if (req.body.srol == 40) comunidad = req.body.sidcomunidad
    else municipio = req.body.municipio_id_tec
    try {
        const resultado = await casa.listar({ comunidad, municipio, rol: req.body.srol })
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/buscar", async (req, res) => {
    try {
        const resultado = await casa.buscar({ comunidad: req.body.dato, municipio: req.body.municipio_id_tec, rol: req.body.srol })
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-municipios", async (req, res) => {
    try {
        // console.log(req.body, 'llamando a listar munic')

        const resultado = await casa.listarMunicipio()
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-hospital", async (req, res) => {
    try {
        // console.log(req.body, 'llamando a listar munic')

        const resultado = await casa.listarEst(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/listar-comunidad", async (req, res) => {
    try {
        // console.log(req.body, 'llamando a listar munic')


        const resultado = await casa.listarComunidad(req.body.srol == 3 ? req.body.municipio_id_tec : req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})


rutas.post("/guardar", insertar, async (req, res) => {

    try {
        if (req.body.srol == 3 || req.body.srol == 40) {
            const { comunidad, latitud, longitud, altitud, jefefamilia,
                vmIntra, vmPeri, numero_habitaciones, numero_habitantes,
                numero_control_vectorial, fecha_, user } = req.body

            let comunidad2 = comunidad
            if (req.body.srol == 40) comunidad2 = req.body.sidcomunidad
            const datos = {
                comunidad: comunidad2, latitud, longitud, altitud, vm_intra: vmIntra, vm_peri: vmPeri, jefefamilia,
                num_hab: numero_habitaciones, habitantes: numero_habitantes,
                cv: numero_control_vectorial, creating: fecha_, user_creating: user
            }
            const resultado = await casa.insertar(datos) 
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
        }

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})



rutas.post("/actualizar", editar, async (req, res) => {
    try {
        if (req.body.srol == 3 || req.body.srol == 40) {
            const { id, comunidad, jefefamilia,
                vmIntra, vmPeri, numero_habitaciones, numero_habitantes,
                numero_control_vectorial, fecha_, user } = req.body
            const datos = {
                id, comunidad, vm_intra: vmIntra, vm_peri: vmPeri, jefefamilia,
                num_hab: numero_habitaciones, numero_habitantes,
                cv: numero_control_vectorial, modified: fecha_, user_modified: user
            }

            const resultado = await casa.actualizar(datos)

            if (resultado === -1) {
                return res.json({ ok: false, msg: 'Numero control vectorial ya esta registrada' })
            }

            if (!resultado) {
                return res.json({ msg: 'Actualizacion Fállida', ok: false })
            }
            return res.json({ ok: true, msg: 'Registro actualizado' })
        }

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})

rutas.post("/actualizar-coordenadas", editarCoordenadas, async (req, res) => {
    try {
        if (req.body.srol == 3 || req.body.srol == 40) {
            const { id, latitud, longitud, altitud,
                fecha_, user } = req.body
            const datos = {
                id, latitud, longitud, altitud, modified: fecha_, user_modified: user
            }

            const resultado = await casa.actualizarCoordenadas(datos)
            if (resultado === -1) {
                return res.json({ ok: false, msg: 'Esta coordenada ya esta registrada' })
            }


            if (!resultado) {
                return res.json({ msg: 'Actualizacion Fállida', ok: false })
            }
            return res.json({ ok: true, msg: 'Registro actualizado' })
        }

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: error.sqlMessage });
    }
})



rutas.post("/eliminar", eliminar, async (req, res) => {
    try {
        if (req.body.srol == 3 || req.body.srol == 40) {
            const id = req.body.id;
            const resultado = await casa.eliminar(id)
            if (!resultado) {
                return res.json({ msg: 'Ops! No se ha eliminado el registro.', ok: false })
            }
            return res.json({ ok: true, msg: 'Registro eliminado correctamete' })
        }
    } catch (error) {
        console.log(error)
        if (error.sqlState === '23000')
            return res.json({ error: 500, msg: 'La vivienda se encuentra asociado a una evaluacion, laboratorio o actividad de rociado...' });
        else return res.json({ error: 500, msg: error.sqlMessage + '. Puede existir valores dependientes a este registro. COnsulte con el administrador' });

    }
})


module.exports = rutas;