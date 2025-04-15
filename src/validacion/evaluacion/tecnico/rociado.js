
const { check } = require("express-validator")
const { validaciones } = require("../../headers.js")

const insertar = [

    check('casa')
        .matches(/^[0-9.-]{1,40}$/)
        .exists(),
    check('comunidad')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('rociadas')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('noRociadas')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('corrales')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('gallineros')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('conejeras')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('zarzo')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('otros')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('cerrada')
        .isBoolean()
        .exists(),
    check('renuente')
        .isBoolean()
        .exists(),
    check('numeroCargas')
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
    check('casa')
        .matches(/^[0-9.-]{1,40}$/)
        .exists(),

    check('comunidad')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('rociadas')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('noRociadas')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('corrales')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('gallineros')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('conejeras')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('zarzo')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('otros')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('cerrada')
        .isBoolean()
        .exists(),
    check('renuente')
        .isBoolean()
        .exists(),
    check('numeroCargas')
        .matches(/^[0-9]{1,20}$/)
        .optional(),
    check('municipio')
        .matches(/^[0-9]{1,20}$/)
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


const validar = [

    check('comunidad')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('insecticida')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('dosis')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('ciclo')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lote')
        .matches(/^.{1,200}$/)
        .exists(),
    check('usuarioBrigada')
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
module.exports = { insertar, editar, eliminar, id, validar }





