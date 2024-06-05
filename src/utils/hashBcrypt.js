//Bcrypt es una libreria de hashing de contraseñas

const bcrypt = require("bcrypt");

/*Se debe crear 2 funciones:
1) createHash: aplicar el hash al password
2) isValidPassword: compara el password ingresado por el usuario al conectar
junto con el password que se encuentra almacenado y hasheado en el servidor.*/

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

/* HashSync: toma el password que le pasamos y aplica el proceso de hasheo
a partir de un salt.

Un "salt" es un string random que hace que el proceso de hasheo se realice de fomra impredecible.

getSaltSync(10): generara un salt de 10 caratecteres. */

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

/*este metodo generara una comparacion entre el password ingresado y el almacenado (y hasheado) en el servidor, y devolvera 
true o false segun correponda. */


module.exports = {
    createHash,
    isValidPassword
}
