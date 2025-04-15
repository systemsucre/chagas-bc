const { Router } = require("express")
const IEC = require('../../modelo/IEC/iec.js')

// import nodemailer from "nodemailer";
// import { CLAVEGMAIL } from '../../config.js'
// import pool from '../../modelo/bdConfig.js'

//const modelo from "../modelo/usuario.js"
// desde esta plantilla se importa las funcionalidades de los controladores de los modulos


const rutas = Router()
const iec = new IEC()



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
        return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor' })
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
        return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor' })
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
        const resultado = await iec.buscarVideos(req.body.dato)
        return res.json({ data: resultado, ok: true, msg: 'Operacion exitosa' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor' })
    }
})

rutas.post("/contar-visita", async (req, res) => {
    // console.log('EVENTO PLAY ', req.body.id)
    try {
        await iec.contarVisita(req.body.id)
        return res.json({ ok: true, msg: 'Operacion exitosa' })
    } catch (error) {
        console.log(error)
        return res.json({ msg: 'Error en el servidor' })
    }
})




module.exports = rutas