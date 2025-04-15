
const { check } = require("express-validator")
const { validaciones } = require("../headers.js")

const editar = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),
    check('f1')
        .exists()
        .matches(/\d{4}[-]\d{2}[-]\d{2}/)
        .exists(),
    check('h1')
        .matches(/\d{2}[:]\d{2}[:]\d{2}/)
        .exists(),
    check('f2')
        .exists()
        .matches(/\d{4}[-]\d{2}[-]\d{2}/)
        .exists(),
    check('h2')
        .matches(/\d{2}[:]\d{2}[:]\d{2}/)
        .exists(),
    check('estado').isLength({ min: 1 }).exists().isNumeric(),


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

const id = [
    check('id').isLength({ min: 1 }).exists().isNumeric(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]


module.exports = { editar, id,}