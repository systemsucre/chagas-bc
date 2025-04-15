const { Router } = require("express")
const IEC = require("../../modelo/IEC/iec.js")

const multer = require("multer")
const fs = require('node:fs')
const path = require('path')



const rutas = Router()
const iec = new IEC()



const disktorage = multer.diskStorage({

    destination: path.join(__dirname, '../../../public/imagenes'),

    filename: (req, file, cb) => {
        console.log(req.query, 'nombre imagen, gurdar imagen')
        cb(null, req.query.nombre + '.png')
    }
})
const fileUpload = multer({
    storage: disktorage
}).single('resultado')


rutas.post("/guardar-imagen", async (req, res) => {
    try {

        console.log(req.body, ' datos de la base de datos')

        const { titulo, descripcion, user, fecha_ } = req.body
        const datos = { id_categoria_iec: 1, titulo, descripcion, user_create: user, create_at: fecha_ } 
        const resultado = await iec.guardar(datos)
        console.log(req.body, resultado, ' datos de la base de datos')

        return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor' })
    }
})




// rutas.post("/guardar-imagen", upload.single('resultado'), async (req, res) => {
rutas.post("/guardar-imagen-file", fileUpload, async (req, res) => {
    try {

        console.log(req.file, 'archivo')
        // const result = SaveImage(req.file, req.query.nombre)
        return res.json({ ok: true, msg: 'Operacion exitosa' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor' })
    }
})

rutas.post("/eliminar-imagen", async (req, res) => {
    console.log(req.body, 'controlador Eliminar')
    try {
        fs.unlinkSync(path.join(__dirname, '../../../public/imagenes/' + req.body.id + '.png'))
        const result = await iec.delete(req.body.id)
        if (result)
            return res.json({ ok: true, msg: 'Operacion exitosa' })
        else
            return res.json({ ok: false, msg: 'Primero elimine los registro dependientes de este registro' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Primero elimine los registro dependientes de este registro' })
    }
})


rutas.post("/listar-imagenes", async (req, res) => {
    try {
        const resultado = await iec.listar()
        return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor' })
    }
})

rutas.post("/buscar-imagenes", async (req, res) => {
    try {
        const resultado = await iec.buscar(req.body.dato)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})




///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// FOLLETOS



rutas.post("/guardar-pdf-bd", async (req, res) => {
    try {

        const { titulo, descripcion, subcategoria, user, fecha_ } = req.body
        const datos = { id_categoria_iec: 2, titulo, descripcion, id_sub_categoria_iec: subcategoria, user_create: user, create_at: fecha_ }
        const resultado = await iec.guardarFolleto(datos)
        return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: error.sqlMessage })
    }
})

const disktoragePdf = multer.diskStorage({

    destination: path.join(__dirname, '../../../public/pdf'),

    filename: (req, file, cb) => {
        // console.log(req.query, 'nombre imagen, gurdar imagen')
            cb(null, req.query.nombre + '.pdf')
    }
})
const fileUploadPdf = multer({
    storage: disktoragePdf
}).single('resultado')




// rutas.post("/guardar-imagen", upload.single('resultado'), async (req, res) => {
rutas.post("/guardar-pdf", fileUploadPdf, async (req, res) => {
//   const filePath = path.join(__dirname, '../../../public/pdf', req.file.filename);
//   fs.renameSync(req.file.path, filePath);
    try {

        console.log(req.file, 'archivo')
        // const result = SaveImage(req.file, req.query.nombre)
        return res.json({ ok: true, msg: 'Operacion exitosa' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor' })
    }
})

rutas.post("/eliminar-folletos", async (req, res) => {
    console.log(req.body, 'controlador Eliminar')
    try {
        fs.unlinkSync(path.join(__dirname, '../../../public/pdf/' + req.body.id + '.pdf'))
        const result = await iec.delete(req.body.id)
        if (result)
            return res.json({ ok: true, msg: 'Operacion exitosa' })
        else
            return res.json({ ok: false, msg: 'Primero elimine los registro dependientes de este registro' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'operacion fallida ' })
    }
})


rutas.post("/listar-folletos", async (req, res) => {
    try {
        const resultado = await iec.listarFolletos()
        return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor' })
    }
})

rutas.post("/buscar-folletos", async (req, res) => {
    try {
        const resultado = await iec.buscarFolletos(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})




///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
// FOLLETOS



rutas.post("/guardar-video", async (req, res) => {
    try {

        const { titulo, descripcion, direccion, user, fecha_ } = req.body
        const datos = { id_categoria_iec: 3, titulo, descripcion, direccion, user_create: user, create_at: fecha_ }
        const resultado = await iec.guardarVideos(datos)
        if(resultado)
            return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })
        else
            return res.json({ ok: false, msg: 'Error al guardar registro' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: error.sqlMessage })
    }
})




rutas.post("/eliminar-videos", async (req, res) => {
    try {
        const result = await iec.delete(req.body.id)
        if (result)
            return res.json({ ok: true, msg: 'Operacion exitosa' })
        else
            return res.json({ ok: false, msg: 'Primero elimine los registro dependientes de este registro' })

    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Primero elimine los registro dependientes de este registro' })
    }
})


rutas.post("/listar-videos", async (req, res) => {
    try {
        const resultado = await iec.listarVideos()
        return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor' })
    }
})

rutas.post("/buscar-videos", async (req, res) => {
    try {
        const resultado = await iec.buscarVideos(req.body.id)
        return res.json({ data: resultado, ok: true })
    } catch (error) {
        console.log(error)
        return res.json({ ok: false, msg: 'Error en el servidor' })
    }
})






module.exports = rutas;