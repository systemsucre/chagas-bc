
const { check } = require("express-validator")
const { validaciones } = require("../headers.js")

const editar = [
    check('id')
        .isLength({ min: 1 })
        .exists().isNumeric(),

    check('ahneg')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('ahpos')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('amneg')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('ampos')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('n1neg')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('n1pos')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('n2neg')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('n2pos')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('n3neg')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('n3pos')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('n4neg')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('n4pos')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('n5neg')
        .matches(/^[0-9]{1,20}$/)
        .exists(),
    check('n5pos')
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
module.exports = { editar, id }





