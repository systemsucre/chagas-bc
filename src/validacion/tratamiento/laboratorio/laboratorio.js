const { check } = require("express-validator");
const { validaciones } = require("../../headers.js");

const insertar = [





  (req, res, next) => {
    validaciones(req, res, next);
  },
];

const modificar = [
  check("conclusiones")
  .matches(/^.{1,300}$/s)
  .optional({ nullable: true }),
  check("observaciones")
  .matches(/^.{1,300}$/s)
  .optional({ nullable: true }),



  (req, res, next) => {
    validaciones(req, res, next);
  },
];

module.exports = {
  insertar,
  modificar
} 
