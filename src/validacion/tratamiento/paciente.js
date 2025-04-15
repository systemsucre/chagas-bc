const { check } = require("express-validator")
const { validaciones } = require("../headers.js")

const insertar = [
  check("sexo")
    .isLength({ min: 1 }).exists().
    isNumeric(),

  check("ci")
    .matches(/^\d{5,15}((\s|[-])\d{1}[A-Z]{1})?$/)
    .optional({ nullable: true }),

  check("ap1")
    .matches(/^[a-zA-ZÑñ áéíóúÁÉÍÓÚ]{2,50}$/)
    .exists(),

  check("ap2")
    .matches(/^[a-zA-Z-Ññ áéíóúÁÉÍÓÚ]{2,50}$/)
    .optional({ nullable: true }),

  check("nombre")
    .matches(/^[a-zA-ZÑñ áéíóúÁÉÍÓÚ]{2,50}$/)
    .exists(),

  check("fecha_nac")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .exists(),

  check("celular")
    .matches(/^\d{5,13}$/)
    .exists(),

  check("direccion")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("comunidad")
    .matches(/^[0-9.-]{1,40}$/)
    .optional({ nullable: true }),
  check("ocupacion")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("ant_per")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("ant_fam")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("otros")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("persona_referencia")
    .matches(/^.{0,1000}$/s)
    .optional({ nullable: true }),

  check("celular_referencia")
    .matches(/^.{0,1000}$/s)
    .optional({ nullable: true }),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];


const actualizar = [

  check("id")
    .matches(/^[0-9.-]{1,40}$/),

  check("sexo")
    .isLength({ min: 1 }).exists().
    isNumeric(),

  check("ci")
    .matches(/^\d{5,15}((\s|[-])\d{1}[A-Z]{1})?$/)
    .optional({ nullable: true }),

  check("ap1")
    .matches(/^[a-zA-ZÑñ áéíóúÁÉÍÓÚ]{2,50}$/)
    .exists(),

  check("ap2")
    .matches(/^[a-zA-Z-Ññ áéíóúÁÉÍÓÚ]{2,50}$/)
    .optional({ nullable: true }),

  check("nombre")
    .matches(/^[a-zA-ZÑñ áéíóúÁÉÍÓÚ]{2,50}$/)
    .exists(),
  check("ocupacion")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("fecha_nac")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .exists(),

  check("celular")
    .matches(/^\d{5,13}$/)
    .exists(),

  check("direccion")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("comunidad")
    .matches(/^[0-9.-]{1,40}$/)
    .optional({ nullable: true }),
  check("comunidad_nombre")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("ant_per")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("ant_fam")
    .matches(/^.{0,1000}$/s)
    .optional({ nullable: true }),

  check("otros")
    .matches(/^.{0,1000}$/s)
    .optional({ nullable: true }),

  check("persona_referencia")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("celular_referencia")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];



const buscar = [
  check("dato")
    .matches(/^[()/a-zA-Z.@ Ññ0-9_-]{1,400}$/)
    .exists(),
  (req, res, next) => {
    validaciones(req, res, next);
  },
];


module.exports = { insertar, actualizar, buscar, }
