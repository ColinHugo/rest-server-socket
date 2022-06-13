const dbValidators = require( './db-validators' );
const generarJwt = require( './generar-jwt' );
const googleVerify = require( './google-verify' );
const validarArchivo = require( './subir-archivo' );

module.exports = {
    // ... esparcir contenido, de esta manera se tiene todas las propiedad, si uno tiene una función, se va a
    // obtener en el module.exports
    ...dbValidators,
    ...generarJwt,
    ...googleVerify,
    ...validarArchivo
}
