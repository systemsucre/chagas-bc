
const { check } = require("express-validator")
const { validaciones } = require("../../headers.js")



const buscar = [
    check('fecha1')
        .matches(/\d{4}[-]\d{2}[-]\d{2}/)
        .exists(),
    check('fecha2')
        .matches(/\d{4}[-]\d{2}[-]\d{2}/)
        .exists(), 
    (req, res, next) => {
        validaciones(req, res, next)
    }
]
const id = [
    check('id')
        .matches(/^\d{1,10}$/)
        .exists(),

    (req, res, next) => {
        validaciones(req, res, next)
    }
]



module.exports = { buscar, id }





