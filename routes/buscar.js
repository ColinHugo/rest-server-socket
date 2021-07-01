const router = require( 'express' ).Router();

const { buscar } = require( '../controllers/buscar' );

router.use( '/:coleccion/:termino', buscar );

module.exports = router