create table
    suspension (
        id int auto_increment primary key,
        nombre text not null,
        estado boolean default true
    ) ENGINE = InnoDB;

create table
    abandono (
        id int auto_increment primary key,
        nombre text not null,
        estado boolean default true
    ) ENGINE = InnoDB;

CREATE TABLE
    `tratamiento` (
        `id` int NOT NULL AUTO_INCREMENT,
        `diagnostico` text NOT NULL,
        `paciente` int NOT NULL,
        `suspension` text NULL,
        `id_suspension` int NULL,
        `abandono` text NULL,
        `id_abandono` int NULL,
        `hospital` int NOT NULL,
        `id_hospital` int NOT NULL,
        `id_medico` int NOT NULL,
        `medico` int NOT NULL,
        `fecha_ini` date NOT NULL,
        `fecha_fin` date DEFAULT NULL,
        `observacion` text,
        created datetime default current_timestamp,
        modified datetime default current_timestamp on update current_timestamp,
        PRIMARY KEY (`id`),
        KEY `paciente` (`paciente`),
        KEY `fk_medico` (`id_medico`),
        CONSTRAINT `fk_medico` FOREIGN KEY (`id_medico`) REFERENCES `usuario` (`id`),
        CONSTRAINT `tratamiento_ibfk_1` FOREIGN KEY (`paciente`) REFERENCES `paciente` (`id`),
        CONSTRAINT `tratamiento_ibfk_2` FOREIGN KEY (`id_suspension`) REFERENCES `suspension` (`id`),
        CONSTRAINT `tratamiento_ibfk_3` FOREIGN KEY (`id_abandono`) REFERENCES `abandono` (`id`)
    ) ENGINE = InnoDB
create table
    infeccion (
        id int auto_increment primary key,
        nombre text not null,
        estado int default 1
    ) engine = innodb;

create table
    medicamentos (
        id int auto_increment primary key,
        nombre text not null,
        estado int default 1
    ) engine = innodb;

create table
    mujeres_tratamiento (
        id int auto_increment primary key,
        nombre text not null,
        estado int default 1
    ) engine = innodb;

create table
    reaccion_dermatologica (
        id int auto_increment primary key,
        nombre text not null,
        estado int default 1
    ) engine = innodb;

create table
    reaccion_digestiva (
        id int auto_increment primary key,
        nombre text not null,
        estado int default 1
    ) engine = innodb;

create table
    reaccion_neurologica (
        id int auto_increment primary key,
        nombre text not null,
        estado int default 1
    ) engine = innodb;

create table
    reaccion_hematologica (
        id int auto_increment primary key,
        nombre text not null,
        estado int default 1
    ) engine = innodb;

create table
    consultas (
        id int auto_increment primary key,
        fecha_consulta date not null,
        dosis text not null,
        hospital text not null,
        id_hospital int not null,
        id_medico int not null,
        medico text not null,
        id_tratamiento int not null,
        id_infeccion int null,
        infeccion text null,
        id_medicamento int null,
        medicamento text null,
        id_mujeres_tratamiento int null,
        mujeres_tratamiento text null,
        id_reaccion_dermatologica int null,
        reaccion_dermatologica text null,
        id_reaccion_digestiva int null,
        reaccion_digestiva text null,
        id_reaccion_neurologica int null,
        reaccion_neurologica text null,
        id_reaccion_hematologica int null,
        reaccion_hematologica text null,
        id_items_laboratorio int null,
        items_laboratorio text null,
        created datetime default current_timestamp,
        modified datetime default current_timestamp on update current_timestamp,
        foreign key (id_infeccion) references infeccion (id),
        foreign key (id_tratamiento) references tratamiento (id),
        foreign key (id_medicamento) references medicamentos (id),
        foreign key (id_mujeres_tratamiento) references mujeres_tratamiento (id),
        foreign key (id_reaccion_dermatologica) references reaccion_dermatologica (id),
        foreign key (id_reaccion_digestiva) references reaccion_digestiva (id),
        foreign key (id_reaccion_neurologica) references reaccion_neurologica (id),
        foreign key (id_reaccion_hematologica) references reaccion_hematologica (id),
        foreign key (id_items_laboratorio) references items_laboratorio (id)
    ) ENGINE = InnoDB;

create table
    items_laboratorio (
        id int auto_increment primary key,
        nombre text not null,
        estado int default 1
    ) engine = innodb;

create table
    laboratorio (
        id int auto_increment primary key,
        id_paciente int not null,
        id_items_laboratorio int not null,
        id_consulta int not null,
        resultado text not null,
        fecha date not null,
        post_tratamiento boolean default false,
        foreign key (id_paciente) references paciente (id),
        foreign key (id_items_laboratorio) references items_laboratorio (id),
        foreign key (id_consulta) references consultas (id)
    ) ENGINE = InnoDB;

create table
    item_diagnostico (
        id int auto_increment primary key,
        nombre text not null,
        estado int default 1
    ) engine = innodb;

create table
    grupo (
        id int auto_increment primary key,
        nombre text not null,
        estado int default 1
    ) engine = innodb;

create table
    grupo_etario (
        id int auto_increment primary key,
        id_grupo int not null,
        descripcion text not null,
        estado int default 1,
        foreign key (id_grupo) references grupo (id)
    ) engine = innodb;

create table
    diagnostico (
        id int auto_increment primary key,
        pre_diagnostico text not null,
        id_items_diagnostico int not null,
        items_diagnostico text not null,
        id_paciente int not null,
        paciente text not null,
        fecha_solicitud date not null,
        fecha_diagnostico date null,
        modified_result datetime null,
        edad int not null,
        conclusiones text null,
        observaciones text null,
        id_grupo_etario int null,
        grupo_etario text null,
        id_grupo int null,
        grupo text null,
        id_hospital int null,
        hospital text null,
        id_laboratorio int null,
        laboratorio text null,
        id_medico_solicitante int null,
        medico_solicitante text null,
        id_medico_diagnostico int null,
        medico_diagnostico text null,
        id_comunidad int null,
        comunidad text null,
        id_municipio int null,
        municipio text null,
        id_red int null,
        red text null,
        id_pre_quirurgico int null,
        pre_quirurgico text null,
        id_post_tratamiento int null,
        post_tratamiento text null,
        positivo boolean default false,
        negativo boolean default false,
        indeterminado boolean default false,
        prediagnostico text null,
        codigo text not null,
        foreign key (id_paciente) references paciente (id),
        foreign key (id_items_diagnostico) references items_diagnostico (id)
    ) ENGINE = InnoDB;

CREATE TABLE
    rociado (
        id int NOT NULL AUTO_INCREMENT,
        casa int NOT NULL COMMENT 'id de la casa rociada',
        comunidad int COMMENT 'id de la comunidad de la casa rociada',
        nombre_comunidad text not null COMMENT 'nombre de la comunidad',
        hospital int COMMENT 'id del hospital de la casa rociada',
        nombre_hospital text not null COMMENT 'nombre del hospital',
        municipio int COMMENT 'id de la de comunidad de la casa rociada',
        nombre_municipio text not null COMMENT 'nombre del municipio',
        red int COMMENT 'id de la red de la casa rociada',
        nombre_red text not null COMMENT 'nombre del hospital',
        cerrada tinyint (1) DEFAULT 0 COMMENT 'vivienda cerrada',
        renuente tinyint (4) NOT NULL DEFAULT 0 COMMENT 'vivienda renuente',
        idr int (11) NOT NULL DEFAULT 0 COMMENT 'intradomicilio rociadas',
        idnr int (11) NOT NULL DEFAULT 0 COMMENT 'intradomicilio no rociadas',
        corrales int (11) NOT NULL DEFAULT 0 COMMENT 'corrales rociados',
        gallineros int (11) NOT NULL DEFAULT 0 COMMENT 'galineros rociados',
        conejeras int (11) NOT NULL DEFAULT 0 COMMENT 'conejeras rociados',
        zarzo int (11) NOT NULL DEFAULT 0 COMMENT 'zarzo rociado',
        otros int (11) NOT NULL DEFAULT 0 COMMENT 'otros lugares rociados',
        numeroCargas int (11) NOT NULL DEFAULT 0 COMMENT 'numero de cargas ',
        dosis int (11) DEFAULT NULL COMMENT 'puede ser ml/gramos',
        lote text DEFAULT NULL COMMENT 'lote de insecticida aplicado',
        estado tinyint (1) DEFAULT 0 COMMENT '0:registrado,1:primera validacion, 2:validado nivel municipio',
        fecha date NOT NULL COMMENT 'fecha de rociado',
        usuario int (11) NOT NULL COMMENT 'id usuario rociador',
        usuarioBrigada int (11) DEFAULT NULL COMMENT 'id usuario supervidor municipal',
        user_created int (11) NOT NULL COMMENT 'id usuario creador',
        created_at datetime NOT NULL COMMENT 'fecha creacion',
        user_modified int (11) DEFAULT NULL COMMENT 'id usuario edicion',
        modified datetime DEFAULT NULL COMMENT 'fecha edicion',
        insecticida int DEFAULT NULL COMMENT 'insecticida aplicado',
        ciclo int DEFAULT NULL COMMENT 'ciclo de rociado',
        fecha_remision date NOT NULL COMMENT 'fecha de validacion del lote',
        fecha_remision_jefeBrigada date DEFAULT NULL COMMENT 'fecha de remision desde el municipio, no obligarorio',
        observaciones text DEFAULT NULL COMMENT 'observaciones',
        codigo text DEFAULT NULL COMMENT 'codigo de actividad',
        usuario1 int (11) DEFAULT NULL COMMENT 'id usuario rociador 1',
        usuario2 int (11) DEFAULT NULL COMMENT 'usuario rociador 2',
        usuario3 int (11) DEFAULT NULL COMMENT 'usuario rociador 3',
        usuario4 int (11) DEFAULT NULL COMMENT 'usuario rociador 4',
        selectivo tinyint (4) NOT NULL DEFAULT 1 COMMENT 'rociado selectivo',
        total tinyint (4) NOT NULL DEFAULT 0 COMMENT 'rociado total',
        denuncia tinyint (4) NOT NULL DEFAULT 0 COMMENT 'rociado por denuncia',
        fecha_rociado date NOT NULL COMMENT 'fecha de rociado',
        author text NOT NULL COMMENT 'nombre author',
        PRIMARY KEY (id),
        FOREIGN key (casa) REFERENCES casa (id)
    ) ENGINE = InnoDB;

create table
    semana (
        id int AUTO_INCREMENT PRIMARY key,
        id_gestion int not null,
        num_semana int not null,
        ini datetime not null,
        fin datetime not null,
        FOREIGN key (id_gestion) REFERENCES gestion (id)
    ) ENGINE = InnoDB;

create table
    tratamiento (
        id int AUTO_INCREMENT PRIMARY key,
        id_paciente int not null COMMENT "id paciente ",
        nombre_paciente text not null COMMENT "nombre del paciente",
        id_comunidad int null COMMENT "id de la comunidad del paciente",
        comunidad text null COMMENT "comunidad del paciente",
        id_hospital int not null COMMENT "id hospital tratante ",
        hospital text not null COMMENT 'nombre hospital tratante',
        id_municipio int not null COMMENT "id municipio del hospital tratante",
        municipio text not null comment "nombre de municipio del hospital tratante",
        id_red int not null COMMENT "id de red tratante",
        red text not null comment "red de hospital  tratante",
        id_usuario int COMMENT "id usuario registrador o bien puede ser el medico",
        usuario text COMMENT "nombre completo del usuario registrador o bien puede ser el medico",
        --  // grupo1 formulario
        id_semana int not null COMMENT 'id semana epidemiologica del año',
        semana text not null COMMENT 'semana epidemiologica del año',
        notificacion date not null COMMENT " fecha de notificacion del caso",
        mujerEmbarazada boolean DEFAULT false not null COMMENT "estado de la mujer embarazada 1:mujer embarazada, 0:mujer no embarazada",
        fum date null comment "fecha ultima menstruacion",
        tutorMenorEdad text null comment 'nombre del tutor de menor de edad',
        -- //Antecedentes Patologicos
        transfusionSangre boolean DEFAULT false not null COMMENT " recibio transfusion de sangre",
        madreSerologica boolean DEFAULT false not null COMMENT "si la madre es o era serologica",
        tuboTransplante boolean DEFAULT false not null COMMENT "si la tubo transplante de organos",
        carneMalCocida boolean DEFAULT false not null COMMENT "Consumio carne de animal mal cocida? (Amazonia)",
        otraInformacion text null COMMENT "otra informacion de antecedentes patologicos",
        --   //RESIDENCIA ACTUAL DEL PACIENTE
        departamentoResidencia text not null COMMENT ' Pais / Departamento de residencia',
        municipioResidencia text not null COMMENT 'municipio de residencia',
        comunidadResidencia text not null COMMENT 'comunidad de residencia',
        diasResidencia int not null comment 'dias de residencia',
        mesesResidencia int not null comment 'meses de residencia',
        añosResidencia int not null comment 'años de residencia',
        permanenciaResidencia boolean default false not null comment 'tipo Tiempo y Permanencia',
        -- ANTECEDENTES EPIDEMIOLÓGICOS
        viveZonaEndemica boolean default false not null comment 'Vive o visito zona endémica para Chagas?, 1:si, no:0',
        departamentoEndemica text not null COMMENT ' Pais / Departamento de endémica',
        municipioEndemica text not null COMMENT 'municipio de endémica',
        comunidadEndemica text not null COMMENT 'Distrito/Localidad/comunidad endémica',
        barrioEndemica text null COMMENT 'barrio de endémica',
        --DATOS CLÍNICOS - CLASIFICACIÓN DE CASO
        --FASE AGUDA
        fechaInicioSintomasAgudas date null comment ' Fecha de Inicio de Sintonas agudas',
        asintomaticoAgudo boolean DEFAULT false not null COMMENT "  1:si, no:0",
        fiebreMayor7dias boolean DEFAULT false not null COMMENT "  1:si, no:0",
        chagomaInoculacion boolean DEFAULT false not null COMMENT " 1:si, no:0",
        signoRomaña boolean DEFAULT false not null COMMENT " 1:si, no:0",
        adenopatia boolean DEFAULT false not null COMMENT " 1:si, no:0",
        irritabilidad boolean DEFAULT false not null COMMENT " 1:si, no:0",
        diarreas boolean DEFAULT false not null COMMENT " 1:si, no:0",
        hepatoesplenomegalia boolean DEFAULT false not null COMMENT " 1:si, no:0",
        convulsiones boolean DEFAULT false not null COMMENT " 1:si, no:0",
        otrosSintomasAgudos text null COMMENT 'otros sintomas agudos',
        -- FASE CRÓNICA
        fechaInicioSintomasCronicas date null comment ' Fecha de Inicio de Sintonas cronicas',
        asintomaticoCronico DEFAULT false not null COMMENT " 1:si, no:0",
        alteracionesCardiacas DEFAULT false not null COMMENT " 1:si, no:0",
        alteracionesDigestivas DEFAULT false not null COMMENT " 1:si, no:0",
        alteracionesNerviosas boolean DEFAULT false not null COMMENT " 1:si, no:0",
        alteracionesAnedopatia boolean DEFAULT false not null COMMENT " 1:si, no:0",
        otrosSintomasCronicas text null COMMENT 'otros sintomas cronicas',
        -- FORMA DE TRANSMISIÓN
        oral boolean DEFAULT false not null COMMENT " 1:si, no:0",
        vectorial boolean DEFAULT false not null COMMENT " 1:si, no:0",
        congenito boolean DEFAULT false not null COMMENT " 1:si, no:0",
        transfucional boolean DEFAULT false not null COMMENT " 1:si, no:0",
        transplante boolean DEFAULT false not null COMMENT " 1:si, no:0",
        otrasTransmisiones text null COMMENT 'otros sintomas agudos',
        -- CLASIFICACIÓN DEL CASO
        agudo boolean DEFAULT false not null COMMENT " 1:si, no:0",
        cronico boolean DEFAULT false not null COMMENT " 1:si, no:0",
        --EXÁMENES DE LABORATORIO
        sangreTotal boolean DEFAULT false not null COMMENT " 1:si, no:0",
        sueroPlasma boolean DEFAULT false not null COMMENT " 1:si, no:0",
        idLaboratorio int not null comment 'id de laboratorio de analisis',
        laboratorio text not null comment 'nombre de laboratorio de analisis',
        fechaTomaMuestra date not null comment 'fecha de toma de muestra',
        -- REACCIONES ADVERSAS
        idReaccionDermatologica int null comment ' id reaccion dermatologica',
        reaccionDermatologica text null comment 'reaccion dermatologica',
        idReaccionDigestiva int null comment ' id reaccion digestiva',
        reaccionDigestiva text null comment 'reaccion digestiva',
        idReaccionNeurologica int null comment ' id reaccion neurologica',
        reaccionNeurologica text null comment 'reaccion neurologica',
        idReaccionHematologica int null comment ' id reaccion hematologica',
        reaccionHematologica text null comment 'reaccion hematologica ',
        -- OTRA INFORMACION
        epidemica text not null comment 'situacion epidémica',
        complementarios text not null comment 'examenes complementarios que se practicó',
        idMedicamento int not null comment 'id medicamento',
        medicamento text not null comment 'nombre medicamento',
        dosis text not null comment 'dosis aplicado',
        idMujeresTratamiento int null comment 'id medicamento',
        mujeresTratamiento text null comment 'mujeres en tratamiento',
        idSuspension int null comment 'id suspension',
        suspension text null comment 'suspension tratamiento',
        idAbandono int null comment 'id abandono',
        abandono text null comment 'abandono tratamiento',
        id_hospital_ref int null COMMENT "id hospital de referencia",
        hospital_ref int null COMMENT "nombre hospital de referencia",
        id_pre_quirurgico int null COMMENT "id prequirurgico",
        pre_quirurgico text null comment 'nombre prequirurgico',
        id_post_tratamiento int null COMMENT "id post tratamiento",
        post_tratamiento text null comment 'nombre post tratamiento',
        id_estado_mujeres int null COMMENT "id estado mujeres",
        estado_mujeres text null comment 'estados mujeres',
        observacion text null comment 'estados mujeres',
        createt_at datetime not null comment 'fecha de registro',
        modified_at datetime null comment 'fecha de registro',
        

    ) ENGINE = INNODB