const { check } = require("express-validator");
const { validaciones } = require("../../headers.js");

const insertar = [


  check("fecha_solicitud")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .exists(),
  check("id_grupo")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("grupo")
    .matches(/^.{1,100}$/s)
    .exists(),
  check("id_grupo_etario")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("grupo_etario")
    .matches(/^.{1,100}$/s)
    .exists(),
  check("edad")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("id_pre_quirurgico")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("pre_quirurgico")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),
  check("id_post_tratamiento")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("post_tratamiento")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),
  check("id_paciente")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("paciente")
    .matches(/^.{1,100}$/s)
    .exists(),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];

const modificar = [
  check("id")
    .matches(/^\d{1,10}$/)
    .exists(),
 
    check("fecha_solicitud")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .exists(),
  check("id_grupo")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("grupo")
    .matches(/^.{1,100}$/s)
    .exists(),
  check("id_grupo_etario")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("grupo_etario")
    .matches(/^.{1,100}$/s)
    .exists(),
  check("edad")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("id_pre_quirurgico")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("pre_quirurgico")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),
  check("id_post_tratamiento")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("post_tratamiento")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),
  check("id_paciente")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("paciente")
    .matches(/^.{1,100}$/s)
    .exists(),

    check("codigo")
    .matches(/^.{1,200}$/s)
    .exists(),


  (req, res, next) => {
    validaciones(req, res, next);
  },
];

module.exports = {
  insertar,
  modificar
} 
