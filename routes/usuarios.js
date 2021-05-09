const Router = require( 'express' );
// express-validator: libreria que nos permite validar correos electrónicos
const { check } = require('express-validator');

const { validarCampos } = require( '../middlewares/validar-campos' );
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
        usuariosPost,
        usuariosPut,
        usuariosDelete,
        usuariosPatch } = require( '../controllers/usuarios' );

const router = Router();

router.get( '/', usuariosGet );

// check() va generando los erroers que se vayan generando en la validación
router.post( '/', [ 
    check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
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
    check( 'id', 'No es un id válido' ).isMongoId(),
    check( 'id' ).custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete );

router.patch( '/', usuariosPatch );

module.exports = router;