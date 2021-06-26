const { request, response } = require("express");
const jwt = require( 'jsonwebtoken' );

const Usuario = require( '../models/usuario' );

const validarJWT = async ( req = request, res = response, next ) => {

    // 1o hay que ser capaz de obtener el jwt desde el lugar que se desee
    // si es un token de acceso se acostumbra que vaya en los headers, dentro de los header se puede poner el nombre que se quiera
    // req.header: leer los headers
    // 'x-token': nombre del token que se desea
    const token = req.header( 'x-token' );

    if( !token ){
        return res.status( 401 ).json( {
            msg: 'No hay token en la petición',
        } );
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        const usuario = await Usuario.findById( uid );

        if( !usuario ){
            return res.status( 401 ).json( {
                msg: 'Token no válido - usuario no existe en la bd',
            } );
        }

        // Verificar si el estado está en true
        if ( !usuario.estado ){
            return res.status( 401 ).json( {
                msg: 'Token no válido - usuario con estado false',
            } );
        }

        // Agregamos el atributo uid al objeto req, de esta forma en el modelo tendremos el atributo uid
        // req.uid = uid;
        req.usuario = usuario;

        next();
    }

    catch ( error ) {

        console.log( error );

        res.status( 401 ).json( {
            msg: 'Token no válido'
        } );
    }
}

module.exports = {
    validarJWT
}