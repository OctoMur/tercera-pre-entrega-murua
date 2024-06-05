const mongoose = require("mongoose");
const configObject = require("./config/config");
const {mongo_url} = configObject;

//Estableciendo la conexion a la base de datos
/*mongoose.connect("mongodb+srv://OctavioMRU:KCf5CDDJXf8UNCcu@cluster0.mnkh0d2.mongodb.net/7_Components?retryWrites=true&w=majority")
    .then(()=> console.log("Conexion establecida"))
    .catch(()=> console.log("Conexion no establecida"))*/

//PATRON SINGLETON
class DataBase{

    static #instance;

    constructor(){
        mongoose.connect(mongo_url);
    }

    static getInstance(){
        if(this.#instance){
            console.log("Conexion ya existente");
            return this.#instance;
        }
        
        this.#instance = new DataBase();
        console.log("Conexion creada exitosamente");
        return this.#instance;
    }
}

module.exports = DataBase.getInstance();