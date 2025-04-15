
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
    check('prerociado')
        .matches(/^[12]{1,20}$/)
        .exists(),
    check('id_gestion')
        .isNumeric()
        .exists(),
    check('gestion')
        .matches(/^.{4,4}$/s)
        .exists(),
    check('id_mes')
        .isNumeric()
        .exists(),
    check('mes')
        .matches(/^.{4,15}$/s)
        .exists(),



    (req, res, next) => {
        validaciones(req, res, next)
    }
]

module.exports = { insertar }





