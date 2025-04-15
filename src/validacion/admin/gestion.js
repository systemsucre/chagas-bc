const { check } = require("express-validator")
const { validaciones } = require("../headers.js")

const insertar = [     

    check('tipo')
        .exists()
        .matches(/^[()a-zA-Z Ññ0-9_-]{1,400}$/),
    check('descripcion')
        .exists()
        .matches(/^[()a-zA-Z Ññ0-9_-]{1,400}$/),

    check('creado')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/),
    check('usuario')
        .exists()
        .isLength({ min: 1 }).isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

const editar = [
    check('id')
        .isLength({ min: 1 })
        .exists().isNumeric(),
    check('tipo')
        .exists()
        .matches(/^[()a-zA-Z Ññ0-9_-]{1,400}$/),
    check('descripcion')
        .exists()
        .matches(/^[()a-zA-Z Ññ0-9_-]{1,400}$/),

    check('modificado')
        .exists()
        .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/),
    check('usuario')
        .exists()
        .isLength({ min: 1 }).isNumeric(),

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

const siguiente = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

const anterior = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

const buscar = [
    check('dato').isLength({ min: 1 }).exists(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]

module.exports = {insertar, editar, eliminar, siguiente, anterior, buscar}