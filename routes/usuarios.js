const router = require( 'express' ).Router();
// express-validator: librería que nos permite validar correos electrónicos
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole, getRole } = require( '../middlewares' );

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
        usuariosPost,
        usuariosPut,
        usuariosDelete,
        usuariosPatch } = require( '../controllers/usuarios' );

router.get( '/', usuariosGet );

// check() va generando los errores que se vayan generando en la validación
// se especifica que campo del body hay que checar
router.post( '/', [
    check( 'nombre', 'El nombre es obligatorio' ).trim().not().isEmpty(),
    check( 'password', 'El password debe tener al menos 6 caracteres' ).isLength( { min: 6 } ),
    check( 'correo', 'El correo no es válido' ).isEmail(),
    check( 'correo').custom( emailExiste ),
    // check( 'rol', 'No es un rol permitido' ).isIn( [ 'ADMIN_ROLE', 'USER_ROLE' ] ),
    check( 'rol' ).custom( esRoleValido ),
    validarCampos
], usuariosPost );

router.put( '/:id', [
    check( 'id', 'No es un id válido' ).isMongoId(),
    check( 'id' ).custom( existeUsuarioPorId ),
    check( 'rol' ).custom( esRoleValido ),
    validarCampos
],usuariosPut );

// :id: segmento del url
router.delete( '/:id', [
    validarJWT,
    //esAdminRole,
    getRole( 'ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROL' ),
    check( 'id', 'No es un id válido' ).isMongoId(),
    check( 'id' ).custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete );

router.patch( '/', usuariosPatch );

module.exports = router;
