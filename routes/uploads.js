const router = require( 'express' ).Router();
const { check } = require( 'express-validator' );

const { validarCampos, validarArchivoSubir } = require( '../middlewares' );
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require( '../controllers/uploads' )
const { coleccionesPermitidas } = require( '../helpers' );

router.post( '/', validarArchivoSubir, cargarArchivo );

router.put( '/:coleccion/:id', [
    validarArchivoSubir,
    check( 'id', 'El id debe ser de mongo' ).isMongoId(),
    check( 'coleccion' ).custom( c => coleccionesPermitidas( c, [ 'usuarios', 'productos' ] ) ),
    validarCampos
// ], actualizarImagenCloudinary );
], actualizarImagen );

router.get( '/:coleccion/:id', [
    check( 'id', 'El id debe ser de mongo' ).isMongoId(),
    check( 'coleccion' ).custom( c => coleccionesPermitidas( c, [ 'usuarios', 'productos' ] ) ),
    validarCampos
], mostrarImagen );

module.exports = router;