
const { validationResult } = require("express-validator")
const validaciones = (req, res, next) => {

    try {
        const error = validationResult(req)

        if (!error.isEmpty()) {
            console.log(error.errors[0].param,)
            console.log(req.body, 'DATOS RECIBIDOS EN EL SERVIDOR')

            return res.json({ msg: 'Campo "' + error.errors[0].param.toUpperCase() + '" inválido !,  verifique que este dato.', campo: error.errors[0].param, ok: false })
        }
        return next()
    }
    catch (error) {
        return res.json({ msg: "Error intentelo mas tarde !", ok: false })
    }
}
module.exports = { validaciones }