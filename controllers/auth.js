const { response } = require( 'express' );
const bcryptjs = require( 'bcryptjs' );

const Usuario = require( '../models/usuario' );
const { generarJWT }  = require( '../helpers/generar-jwt' );
const { googleVerify } = require( '../helpers/google-verify' );

const login = async ( req, res = response ) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne( { correo } );

        if ( !usuario ) {
            return res.status( 400 ).json( {
                msg: 'Usuario / Password no son correctos - correo'
            } );
        }

        // Si el usuario está activo
        if ( !usuario.estado ) {
            return res.status( 400 ).json( {
                msg: 'Usuario / Password no son correctos - estado: false'
            } );
        }

        // Verificar contraseña
        // compareSync compara la contraseña que recibimos con la contraseña del usuario guardado en la bd
        const validPassword = bcryptjs.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status( 400 ).json( {
                msg: 'Usuario / Password no son correctos - password'
            } );
        }

        // Generar el JWT
        // no tiene una promesa para generar el jwt, por lo cual es un call back, por lo tanto debemos convertirlo a una promesa
        const token = await generarJWT( usuario.id );

        res.json( {
            usuario,
            token,
        } );
    } 
    
    catch ( error ) {

        console.log( error );

        return res.status( 500 ).json( {
            msg: 'Algo salió mal, hable con el administrador',
        } );
    }
}

const googleSignIn = async ( req, res ) => {

    const { id_token } = req.body;
    
    try {

        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo } );

        if( !usuario ){

            // Si el usuario no existe, hay que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en BD
        if( !usuario.estado ){
            return res.status( 401 ).json( {
                msg: 'Hable con el administrador, usuario bloqueado',
            } );
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json( {
            usuario,
            token
        } );
    }
    
    catch (e) {
        res.status( 400 ).json({
            msg: 'Token de Google no es válido'
        })
    }
}

module.exports = {
    login,
    googleSignIn,
}