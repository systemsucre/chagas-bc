const { check } = require("express-validator");
const { validaciones } = require("../../headers.js");

const insertar = [

  check("id_tratamiento")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("id_paciente")
    .matches(/^\d{1,10}$/)  
    .exists(),
  check("fecha_consulta")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .exists(),
  check("id_medicamento")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("medicamento")
    .matches(/^.{1,100}$/s)
    .exists(),
  check("dosis")
    .matches(/^.{1,100}$/s)
    .exists(),

  check("id_mujeres_tratamiento")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("mujeres_tratamiento")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),
  check("id_reaccion_dermatologica")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("reaccion_dermatologica")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),
  check("id_reaccion_digestiva")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("reaccion_digestiva")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),
  check("id_reaccion_neurologica")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("reaccion_neurologica")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),
  check("id_reaccion_hematologica")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("reaccion_hematologica")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),
  check("id_items_laboratorio")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("items_laboratorio")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),


  (req, res, next) => {
    validaciones(req, res, next);
  },
];

const modificar = [
  check("id")
    .matches(/^\d{1,10}$/)
    .exists(),

  check("id_tratamiento")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("id_paciente")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("fecha_consulta")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .exists(),
  check("id_medicamento")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("medicamento")
    .matches(/^.{1,100}$/s)
    .exists(),
  check("dosis")
    .matches(/^.{1,100}$/s)
    .exists(),
  check("id_mujeres_tratamiento")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("mujeres_tratamiento")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),
  check("id_reaccion_dermatologica")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("reaccion_dermatologica")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),
  check("id_reaccion_digestiva")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("reaccion_digestiva")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),
  check("id_reaccion_neurologica")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("reaccion_neurologica")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),
  check("id_reaccion_hematologica")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("reaccion_hematologica")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),
  check("id_items_laboratorio")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("items_laboratorio")
    .matches(/^.{1,100}$/s)
    .optional({ nullable: true }),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];

module.exports = {
  insertar,
  modificar
} 
