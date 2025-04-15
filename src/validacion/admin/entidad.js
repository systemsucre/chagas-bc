
const { check } = require("express-validator")
const { validaciones } = require("../headers.js")

const insertar = [

    check('nombre')
        .matches(/^[()/a-zA-Z Ññ0-9_-]{1,400}$/)
        .exists(),
    check('nombre')
        .matches(/^[()/a-zA-Z Ññ0-9_-]{1,400}$/)
        .exists(),
    check('codigo')
        .matches(/^.{1,200}$/)
        .exists(),
    check('municipio')
        .matches(/^\d{1,10}$/,)
        .exists(),

    check('laboratorio')
        .isBoolean()
        .exists(),
    check('nivel')
        .matches(/^.{1,1000}$/s)
        .exists(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

const editar = [
    check('id')
        .isLength({ min: 1 })
        .exists().isNumeric(),
    check('nombre')
        .matches(/^[()/a-zA-Z Ññ0-9_-]{1,400}$/)
        .exists(),
    check('municipio')
        .matches(/^\d{1,10}$/,)
        .exists(),
    check('codigo')
        .matches(/^.{1,200}$/)
        .exists(),
    check('laboratorio')
        .isBoolean()
        .exists(),
    check('nivel')
        .matches(/^.{1,1000}$/s)
        .exists(),
    check('estado')
        .matches(/^.{1,1000}$/s)
        .exists(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

const eliminar = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]

const id = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]
module.exports = { insertar, editar, eliminar, id }





