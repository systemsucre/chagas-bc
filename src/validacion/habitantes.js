
const { check } = require("express-validator")
const { validaciones } = require("../headers.js")

const insertar = [

    check('nombre')
        .matches(/^[a-zA-ZÑñ ]{2,50}$/)
        .exists(),
    check('ap1')
        .matches(/^[a-zA-ZÑñ ]{2,50}$/)
        .exists(),
    check('ap2')
        .matches(/^[a-zA-ZÑñ ]{2,50}$/)
        .exists(),
    check('responsable')
        .matches(/^[01]{1,1}$/)
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
        .matches(/^[a-zA-ZÑñ ]{2,50}$/)
        .exists(),
    check('ap1')
        .matches(/^[a-zA-ZÑñ ]{2,50}$/)
        .exists(),
    check('ap2')
        .matches(/^[a-zA-ZÑñ ]{2,50}$/)
        .exists(),
    check('responsable')
        .matches(/^[01]{1,1}$/)
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
module.exports = { insertar, editar, eliminar, id, editarCoordenadas }





