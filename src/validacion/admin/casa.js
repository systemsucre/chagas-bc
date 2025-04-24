
const { check } = require("express-validator")
const { validaciones } = require("../headers.js")

const insertar = [

    check('comunidad')
        .matches(/^\d{1,10}$/,)
        .optional({ nullable: true }),
    check('longitud')
        .matches(/^[0-9.-]{1,40}$/)
        .exists(),
    check('latitud')
        .matches(/^[0-9.-]{1,40}$/)
        .exists(),
    check('altitud')
        .matches(/^[0-9.-]{1,40}$/)
        .exists(),
    check('vmIntra')
        .matches(/^[01]{1,40}$/)
        .exists(),
    check('vmPeri')
        .matches(/^[01]{1,40}$/)
        .exists(),
    check('numero_habitaciones')
        .matches(/^\d{1,3}$/,)
        .exists(),
    check('numero_habitantes')
        .matches(/^\d{1,3}$/,)
        .exists(),
    check('numero_control_vectorial')
        .matches(/^.{1,200}$/)
        .exists(),
    check('jefefamilia')
        .matches(/^[a-zA-ZÑñaáeéiíoóuúAÁEÉIÍOÓUÚ ]{2,50}$/)
        .exists(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]

const editar = [
    check('id')
        .isLength({ min: 1 })
        .exists().isNumeric(),
    check('comunidad')
        .matches(/^\d{1,10}$/,)
        .optional({ nullable: true }),
    check('vmIntra')
        .matches(/^[01]{1,40}$/)
        .exists(),
    check('vmPeri')
        .matches(/^[01]{1,40}$/)
        .exists(),
    check('numero_habitaciones')
        .matches(/^\d{1,3}$/,)
        .exists(),
    check('numero_habitantes')
        .matches(/^\d{1,3}$/,)
        .exists(),
    check('numero_control_vectorial')
        .matches(/^.{1,200}$/)
        .exists(),
    check('jefefamilia')
        .matches(/^[a-zA-ZÑñaáeéiíoóuúAÁEÉIÍOÓUÚ ]{2,50}$/)
        .exists(),
    (req, res, next) => {
        validaciones(req, res, next)
    }
]


const editarCoordenadas = [
    check('id')
        .isLength({ min: 1 })
        .exists().isNumeric(),
    check('longitud')
        .matches(/^[0-9.-]{1,40}$/)
        .exists(),
    check('latitud')
        .matches(/^[0-9.-]{1,40}$/)
        .exists(),
    check('altitud')
        .matches(/^[0-9.-]{1,40}$/)
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





