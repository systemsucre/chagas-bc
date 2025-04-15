const { check } = require("express-validator");
const { validaciones } = require("../../headers.js");

const insertar = [

  check("id_paciente")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("nombre_paciente")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("id_grupo")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("grupo")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("id_grupo_etario")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("grupo_etario")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("edad")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("id_comunidad")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("comunidad")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  //grupo1 formaulario
  check("notificacion")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .exists(),
  check("idSemana")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("semana")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("numero")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("mujerEmbarazada")
    .isBoolean()
    .exists(),
  check("fum")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .optional({ nullable: true }),
  check("tutorMenorEdad")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  //Antecedentes Patologicos
  check("transfusionSangre")
    .isBoolean()
    .exists(),

  check("madreSerologica")
    .isBoolean()
    .exists(),
  check("tuboTransplante")
    .isBoolean()
    .exists(),
  check("carneMalCocida")
    .isBoolean()
    .exists(),
  check("otraInformacion")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),


  //RESIDENCIA ACTUAL DEL PACIENTE
  check("departamentoResidencia")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("municipioResidencia")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("comunidadResidencia")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),
  check("diasResidencia")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("mesesResidencia")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("añosResidencia")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("permanenciaResidencia")
    .isBoolean()
    .exists(),

  //ANTECEDENTES EPIDEMIOLÓGICOS
  check("viveZonaEndemica")
    .isBoolean()
    .exists(),
  check("departamentoEndemica")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),
  check("municipioEndemica")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),
  check("comunidadEndemica")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),
  check("barrioEndemica")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  //DATOS CLÍNICOS - CLASIFICACIÓN DE CASO
  //FASE AGUDA
  check("fechaInicioSintomasAgudas")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .optional({ nullable: true }),
  check("asintomaticoAgudo")
    .isBoolean()
    .exists(),
  check("fiebreMayor7dias")
    .isBoolean()
    .exists(),
  check("chagomaInoculacion")
    .isBoolean()
    .exists(),
  check("signoRomaña")
    .isBoolean()
    .exists(),
  check("adenopatia")
    .isBoolean()
    .exists(),
  check("irritabilidad")
    .isBoolean()
    .exists(),
  check("diarreas")
    .isBoolean()
    .exists(),
  check("hepatoesplenomegalia")
    .isBoolean()
    .exists(),
  check("convulsiones")
    .isBoolean()
    .exists(),
  check("otrosSintomasAgudos")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),


  //FASE CRÓNICA
  check("fechaInicioSintomasCronicas")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .optional({ nullable: true }),
  check("asintomaticoCronico")
    .isBoolean()
    .exists(),
  check("alteracionesCardiacas")
    .isBoolean()
    .exists(),
  check("alteracionesDigestivas")
    .isBoolean()
    .exists(),
  check("alteracionesNerviosas")
    .isBoolean()
    .exists(),
  check("alteracionesAnedopatia")
    .isBoolean()
    .exists(),
  check("otrosSintomasCronicas")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),


  //FORMA DE TRANSMISIÓN
  check("oral")
    .isBoolean()
    .exists(),
  check("vectorial")
    .isBoolean()
    .exists(),
  check("congenito")
    .isBoolean()
    .exists(),
  check("transfucional")
    .isBoolean()
    .exists(),
  check("transplante")
    .isBoolean()
    .exists(),
  check("otrasTransmisiones")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),



  //CLASIFICACIÓN DEL CASO
  check("agudo")
    .isBoolean()
    .exists(),
  check("cronico"),


  // EXÁMENES DE LABORATORIO
  check("sangre_total")
    .isBoolean()
    .exists(),
  check("idLaboratorio")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("fechaTomaMuestra")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .exists(),


  //REACCIONES ADVERSAS
  check("idReaccionDermatologica")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("idReaccionDigestiva")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("idReaccionNeurologica")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("idReaccionHematologica")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),


  // OTRA INFORMACION

  check("epidemica")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("complementarios")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("idMedicamento")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("medicamento")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("dosis")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("idMujeresTratamiento")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),


  check("idSuspension")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),

  check("idAbandono")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),

  check("idHospital")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("hospital")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("id_pre_quirurgico")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("pre_quirurgico")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("id_post_tratamiento")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("post_tratamiento")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("id_estado_mujeres")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("estado_mujeres")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),
  check("observacion")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];




const modificar = [
  check("id")
    .matches(/^\d{1,10}$/)
    .exists(),
    check("id_paciente")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("nombre_paciente")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("id_grupo")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("grupo")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("id_grupo_etario")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("grupo_etario")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("edad")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("id_comunidad")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("comunidad")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  //grupo1 formaulario
  check("notificacion")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .exists(),
  check("idSemana")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("semana")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("numero")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("mujerEmbarazada")
    .isBoolean()
    .exists(),
  check("fum")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .optional({ nullable: true }),
  check("tutorMenorEdad")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  //Antecedentes Patologicos
  check("transfusionSangre")
    .isBoolean()
    .exists(),

  check("madreSerologica")
    .isBoolean()
    .exists(),
  check("tuboTransplante")
    .isBoolean()
    .exists(),
  check("carneMalCocida")
    .isBoolean()
    .exists(),
  check("otraInformacion")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),


  //RESIDENCIA ACTUAL DEL PACIENTE
  check("departamentoResidencia")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("municipioResidencia")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("comunidadResidencia")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),
  check("diasResidencia")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("mesesResidencia")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("añosResidencia")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("permanenciaResidencia")
    .isBoolean()
    .exists(),

  //ANTECEDENTES EPIDEMIOLÓGICOS
  check("viveZonaEndemica")
    .isBoolean()
    .exists(),
  check("departamentoEndemica")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),
  check("municipioEndemica")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),
  check("comunidadEndemica")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),
  check("barrioEndemica")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  //DATOS CLÍNICOS - CLASIFICACIÓN DE CASO
  //FASE AGUDA
  check("fechaInicioSintomasAgudas")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .optional({ nullable: true }),
  check("asintomaticoAgudo")
    .isBoolean()
    .exists(),
  check("fiebreMayor7dias")
    .isBoolean()
    .exists(),
  check("chagomaInoculacion")
    .isBoolean()
    .exists(),
  check("signoRomaña")
    .isBoolean()
    .exists(),
  check("adenopatia")
    .isBoolean()
    .exists(),
  check("irritabilidad")
    .isBoolean()
    .exists(),
  check("diarreas")
    .isBoolean()
    .exists(),
  check("hepatoesplenomegalia")
    .isBoolean()
    .exists(),
  check("convulsiones")
    .isBoolean()
    .exists(),
  check("otrosSintomasAgudos")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),


  //FASE CRÓNICA
  check("fechaInicioSintomasCronicas")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .optional({ nullable: true }),
  check("asintomaticoCronico")
    .isBoolean()
    .exists(),
  check("alteracionesCardiacas")
    .isBoolean()
    .exists(),
  check("alteracionesDigestivas")
    .isBoolean()
    .exists(),
  check("alteracionesNerviosas")
    .isBoolean()
    .exists(),
  check("alteracionesAnedopatia")
    .isBoolean()
    .exists(),
  check("otrosSintomasCronicas")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),


  //FORMA DE TRANSMISIÓN
  check("oral")
    .isBoolean()
    .exists(),
  check("vectorial")
    .isBoolean()
    .exists(),
  check("congenito")
    .isBoolean()
    .exists(),
  check("transfucional")
    .isBoolean()
    .exists(),
  check("transplante")
    .isBoolean()
    .exists(),
  check("otrasTransmisiones")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),



  //CLASIFICACIÓN DEL CASO
  check("agudo")
    .isBoolean()
    .exists(),
  check("cronico"),


  // EXÁMENES DE LABORATORIO
  check("sangre_total")
    .isBoolean()
    .exists(),
  check("idLaboratorio")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("fechaTomaMuestra")
    .matches(/\d{4}[-]\d{2}[-]\d{2}/)
    .exists(),


  //REACCIONES ADVERSAS
  check("idReaccionDermatologica")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("idReaccionDigestiva")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("idReaccionNeurologica")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("idReaccionHematologica")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),


  // OTRA INFORMACION

  check("epidemica")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("complementarios")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("idMedicamento")
    .matches(/^\d{1,10}$/)
    .exists(),
  check("medicamento")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("dosis")
    .matches(/^.{1,1000}$/s)
    .exists(),
  check("idMujeresTratamiento")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),


  check("idSuspension")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),

  check("idAbandono")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),

  check("idHospital")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("hospital")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("id_pre_quirurgico")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("pre_quirurgico")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("id_post_tratamiento")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("post_tratamiento")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),

  check("id_estado_mujeres")
    .matches(/^\d{1,10}$/)
    .optional({ nullable: true }),
  check("estado_mujeres")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),
  check("observacion")
    .matches(/^.{1,1000}$/s)
    .optional({ nullable: true }),
  check("codigo")
    .matches(/^.{1,1000}$/s)
    .exists(),

  (req, res, next) => {
    validaciones(req, res, next);
  },
];



module.exports = { insertar, modificar } 