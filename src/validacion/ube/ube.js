
const { check } = require("express-validator")
const { validaciones } = require("../headers.js")

const insertar = [

    check('casa')
        .matches(/^[0-9]{1,40}$/)
        .exists(),
    check('lci')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcp')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('ti')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('ts')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('tg')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('pm')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('other')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('num_envase')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('muertos')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('vivos')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('num_adultos')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('num_ninfas')
        .matches(/^[0-9]{1,20}$/)
        .exists(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

const editar = [
    check('id')
        .isLength({ min: 1 })
        .exists().isNumeric(),

    check('lci')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcp')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('ti')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('ts')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('tg')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('pm')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('other')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('num_envase')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('muertos')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('vivos')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('num_adultos')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('num_ninfas')
        .matches(/^[0-9]{1,20}$/)
        .exists(),

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
module.exports = { insertar, editar,  id }





