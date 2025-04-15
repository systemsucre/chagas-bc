const Router = require("express");
const Paciente = require('../../modelo/tratamiento/paciente.js');
const {
  buscar,
  siguiente,
  insertar,
  actualizar,

} = require("../../validacion/tratamiento/paciente.js");


const rutas = Router();
const paciente = new Paciente();

rutas.post("/listar", async (req, res) => {

  try {
    const resultado = await paciente.listar(req.body.sidhospital);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error en el servidor" });
  }
});





rutas.post("/buscar", buscar, async (req, res) => {
  const dato = req.body.dato;
  try {
    const resultado = await paciente.buscar(dato);
    return res.send({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error en el servidor" });
  }
});



rutas.post("/registrar", insertar, async (req, res) => {
  // console.log("datos: ", req.body);
  const {
    ci,
    ap1,
    ap2, sexo, ocupacion,
    nombre, fecha_nac, celular, direccion, comunidad, comunidad_nombre, ant_fam, otros, persona_referencia, celular_referencia, sidhospital, shospital, fecha_, user, usernameS, ant_per,

  } = req.body;
  const datos = {
    ci,
    ap1,
    ap2, sexo,
    nombre, fecha_nac, celular, ocupacion, direccion, comunidad, comunidad_nombre, ant_fam, otros, persona_referencia, celular_referencia, id_hospital: sidhospital, hospital: shospital, created: fecha_, user_created: user, usuario: usernameS, ant_per,
  };
  try {
    const resultado = await paciente.insertar(datos);

    if (!resultado)
      return res.json({
        ok: false,
        msg: "C.I.  ya esta registrado",
      });

    else return res.json({
      data: resultado,
      ok: true,
      msg: "Registro creado correctamente",
    });

  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error en el Servidor", ok: false });
  }
});


rutas.post("/modificar", actualizar, async (req, res) => {
  const {
    id,
    ci,
    ap1,
    ap2, sexo, ocupacion,
    nombre, fecha_nac, celular, direccion, comunidad, comunidad_nombre, ant_fam, otros, persona_referencia, celular_referencia, sidhospital, shospital, fecha_, user, usernameS, ant_per,

  } = req.body;
  const datos = {
    id,
    ci,
    ap1,
    ap2, sexo, ocupacion,
    nombre, fecha_nac, celular, direccion, comunidad, comunidad_nombre, ant_fam, otros, persona_referencia, celular_referencia, id_hospital: sidhospital, hospital: shospital, modified: fecha_, user: user, usuario: usernameS, ant_per,
  };
  try {
    const resultado = await paciente.actualizar(datos);

    if (resultado.repeat)
      return res.json({
        ok: false,
        msg: "Este C.I. ya esta registrado",
      });

    else {
      if (!resultado)
        return res.json({
          ok: false,
          msg: "Registro no actualizado",
        });
      else return res.json({
        ok: true,
        msg: "Registro actualizado correctamente",
      });
    }

  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error en el Servidor", ok: false });
  }
});


rutas.post("/eliminar", async (req, res) => {

  try {
    const resultado = await paciente.eliminar(req.body.id, req.body.user, req.body.sidhospital);


    if (!resultado)
      return res.json({
        ok: false,
        msg: "Registro no eliminado",
      });
    else return res.json({
      ok: true,
      msg: "Registro eliminado correctamente",
    });

  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error en el Servidor", ok: false });
  }
});



module.exports = rutas;
