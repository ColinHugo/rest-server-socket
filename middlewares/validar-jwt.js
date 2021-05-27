const jwt = require( 'jsonwebtoken' );
const { request, response } = require("express");

const validarJWT = ( req = request, res = response, next ) => {

    // req.header: leer los headers
    const token = req.header( 'x-token' );

    if( !token ){
        return res.status( 401 ).json( {
            msg: 'No hay token en la petición'
        } );
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        req.uid = uid;

        next();

    }catch ( error ) {
        console.log( error );
        res.status( 401 ).json( {
            msg: 'Token no válido'
        } )
    }

    console.log( '***************************', token );

    next();

}

module.exports = {
    validarJWT
}