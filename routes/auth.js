const router = require( 'express' ).Router();
const { check } = require( 'express-validator' );

const { validarCampos, validarJWT } = require('../middlewares');

const { login, googleSignIn, renovarToken } = require('../controllers/auth');

router.post( '/login', [
    check( 'correo', 'El correo es obligatorio' ).isEmail(),
    check( 'password', 'La contraseña es obligatoria' ).trim().not().isEmpty(),
    validarCampos
],login );

router.post( '/google', [
    check( 'id_token', 'El id token es necesario' ).not().isEmpty(),
    validarCampos
], googleSignIn );

router.get( '/', validarJWT, renovarToken );

module.exports = router;