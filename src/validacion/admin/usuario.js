const { check } = require("express-validator");
const { validaciones } = require("../headers.js");

const insertar = [
  check("rol").isLength({ min: 1 }).exists().isNumeric(),
  check("municipio").isLength({ min: 1 }).optional({ nullable: true }).isNumeric(),
  check("comunidad").isLength({ min: 1 }).optional({ nullable: true }).isNumeric(),
  check("hospital").isLength({ min: 1 }).optional({ nullable: true }).isNumeric(),
  check("usuario")
    .matches(/^[a-zA-ZÑñ0-9]{4,16}$/)
    .exists(),
  check("contraseña")
    .matches(/^.{1,1500}$/s)
    .exists(),
  check("nombre")
    .matches(/^[a-zA-ZÑñaáeéiíoóuúAÁEÉIÍOÓUÚ ]{2,50}$/)
    .exists(),
  check("ap1")
    .matches(/^[a-zA-ZÑñaáeéiíoóuúAÁEÉIÍOÓUÚ ]{2,50}$/)
    .exists(),
  check("ap2")
    .matches(/^[a-zA-ZÑñaáeéiíoóuúAÁEÉIÍOÓUÚ ]{2,50}$/)
    .optional({ nullable: true }),
  check("celular")
    .matches(/^[+0-9 ]{2,18}$/)
    .optional({ nullable: true }),
  check("correo")
    .matches(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)
    .optional({ nullable: true }),
  check("direccion")
    .matches(/^[a-zA-ZÑñ /0-9-@.,+]{1,100}$/)
    .optional({ nullable: true }),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];

const actualizar = [
  check("id")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("rol").isLength({ min: 1 }).exists().isNumeric(),
  check("municipio").isLength({ min: 1 }).optional({ nullable: true }).isNumeric(),
  check("comunidad").isLength({ min: 1 }).optional({ nullable: true }).isNumeric(),

  check("hospital").isLength({ min: 1 }).optional({ nullable: true }).isNumeric(),
  check("nombre")
    .matches(/^[a-zA-ZÑñaáeéiíoóuúAÁEÉIÍOÓUÚ ]{2,50}$/)
    .exists(),
  check("ap1")
    .matches(/^[a-zA-ZÑñaáeéiíoóuúAÁEÉIÍOÓUÚ ]{2,50}$/)
    .exists(),
  check("ap2")
    .matches(/^[a-zA-ZÑñaáeéiíoóuúAÁEÉIÍOÓUÚ ]{2,50}$/)
    .optional({ nullable: true }),
  check("celular")
    .matches(/^[+0-9 ]{2,18}$/)
    .optional({ nullable: true }),
  check("correo")
    .matches(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/)
    .optional({ nullable: true }),
  check("direccion")
    .matches(/^[a-zA-ZÑñ /0-9-@.,+]{1,100}$/)
    .optional({ nullable: true }),
  check("estado")
    .matches(/^\d{1,10}$/)
    .exists(),
  (req, res, next) => {
    validaciones(req, res, next);
  },
];

const recet = [
  check("id")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("otros")
    .matches(/^.{4,3000}$/)
    .exists(),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];

const actualizarMiPerfil = [

  check("nombre")
    .matches(/^[a-zA-ZÑñ áéíóúÁÉÍÓÚ.]{2,3000}$/)
    .exists(),
  check("ap1")
    .matches(/^[a-zA-ZÑñ áéíóúÁÉÍÓÚ.]{2,3000}$/)
    .optional({ nullable: true }),
  check("ap2")
    .matches(/^[a-zA-ZÑñ áéíóúÁÉÍÓÚ.]{2,3000}$/)
    .optional({ nullable: true }),
  check("celular")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),

  check("direccion")
    .matches(/^[a-zA-ZÑñ /0-9-@.,+]{1,100}$/)
    .optional({ nullable: true }),
  check("correo").matches(/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/).optional({ nullable: true }), 

  (req, res, next) => {
    validaciones(req, res, next);
  },
];

const cambiarMiContraseña = [
  check("pass1").exists().isLength({ min: 5 }),
  check("pass2").exists().isLength({ min: 5 }),
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

const siguiente = [
  check("cantidad").isLength({ min: 1 }).exists().isNumeric(),
  check("id").isLength({ min: 1 }).exists().isNumeric(),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];

const anterior = [
  check("cantidad").isLength({ min: 1 }).exists().isNumeric(),
  check("id").isLength({ min: 1 }).exists().isNumeric(),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];

module.exports = { insertar, actualizar, recet, actualizarMiPerfil, cambiarMiContraseña, buscar, siguiente, anterior };
