const { Schema, model } = require( 'mongoose' );

const UsuarioSchema = Schema( {
    nombre: {
        type: String,
        required: [ true, 'El nombre es obligatorioa' ],
    },

    correo: {
        type: String,
        required: [ true, 'El correo es obligatorio' ],
        unique: true
    },

    password: {
        type: String,
        required: [ true, 'La contraseña es obligatoria' ],
    },

    img: {
        type: String,
    },

    rol: {
        type: String,
        required: true,
        enum: [ 'ADMIN_ROLE', 'USER_ROLE' ]
    },

    estado: {
        type: Boolean,
        default: true
    },

    google: {
        type: Boolean,
        default: false
    }
} );

// Se sobreescribe el método toJSON que es el que imprime
// El método toObject genera la instancia con sus valores respectivos, como si fuera un objeto literal de js
UsuarioSchema.methods.toJSON = function () {

    // Se desestructura para ignorar los valores que se deseen y unificar los valores que nos interesa
    const { __v, password, ...usuario } = this.toObject();
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema );