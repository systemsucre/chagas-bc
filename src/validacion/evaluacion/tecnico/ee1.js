
const { check } = require("express-validator")
const { validaciones } = require("../../headers.js")

const insertar = [

    check('casa')
        .matches(/^[0-9.-]{1,40}$/)
        .exists(),
    check('inicio')
        .matches(/\d{2}[:]\d{2}/)
        .exists(),
    check('final')
        .matches(/\d{2}[:]\d{2}/)
        .exists(),
    check('ecin')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('ecia')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('ecpn')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('ecpa')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcipd')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcicm')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcith')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lciot')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcppd')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcpga')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcpcl')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcpcj')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcpz')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcpot')
        .matches(/^[0-9]{1,20}$/)
        .exists(),

    check('negativa')
        .isBoolean()
        .exists(),
    check('cerrada')
        .isBoolean()
        .exists(),
    check('renuente')
        .isBoolean()
        .exists(),
    check('comunidad')
        .matches(/^[0-9.-]{1,40}$/)
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
    check('inicio')
        .matches(/\d{2}[:]\d{2}/)
        .exists(),
    check('final')
        .matches(/\d{2}[:]\d{2}/)
        .exists(),
    check('ecin')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('ecia')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('ecpn')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('ecpa')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcipd')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcicm')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcith')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lciot')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcppd')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcpga')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcpcl')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcpcj')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcpz')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('lcpot')
        .matches(/^[0-9]{1,20}$/)
        .exists(),


    check('negativa')
        .isBoolean()
        .exists(),
    check('cerrada')
        .isBoolean()
        .exists(),
    check('renuente')
        .isBoolean()
        .exists(),
    check('comunidad')
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
const completar = [

    check('comunidad').isLength({ min: 1 }).exists().isNumeric(),
    check('jefeBrigada').isLength({ min: 1 }).exists().isNumeric(),
    check('prerociado')
        .isBoolean()
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
module.exports = { insertar, editar, eliminar, id, completar }





