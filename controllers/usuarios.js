const { request, response } = require( 'express' );

// Crear instancias de nuestro modelo
const Usuario = require( '../models/usuario' );

// bcryptjs: librería que nos permite encriptar contraseñas
const bcryptjs = require( 'bcryptjs' );

const usuariosGet = async ( req = request, res = response ) => {

    // query: objeto que trae todos los parámetros que fueron pasados a través de la url
    // const { q, nombre, apikey } = req.query;
    const { desde = 0, limite = 5 } = req.query;

    const query = { estado: true };

    // const usuarios = await Usuario.find( query )
    //     .skip( Number( desde ) )
    //     .limit( Number( limite ) );
    //
    // const total = await Usuario.countDocuments( query );

    const [ total, usuarios ] = await Promise.all( [
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ] );

    res.json( {
        // total,
        // usuarios
        total,
        usuarios
    } );
};

const usuariosPost = async ( req, res = response ) => {    

    // Se desestructura el objeto para obtener los datos que son obligatorios
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    // Encriptar la contraseña
    // .genSaltSync() recibe como argumento el numero de vueltas que encriptara la contraseña, valor por defcto 10
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en la bd
    await usuario.save();

    res.json( {
        usuario
    } );
};

const usuariosPut = async ( req, res = response ) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if( password ){

        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json( usuario );
}

const usuariosDelete = async ( req, res = response ) => {

    // como en el router se pasa el segmento :id a través de la url, la función params del objeto req es quien tiene el valor
    const { id } = req.params;

    // Físicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    res.json( usuario );
}

const usuariosPatch = ( req, res = response ) => {
    res.json( {
        msg: 'patch API - controlador',
    } );
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch,
}