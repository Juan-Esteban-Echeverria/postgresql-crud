const {Pool} = require("pg")

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "alwaysMusic",
    password: "************",
    port: 5432,
    max: 20,
    min: 0,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000
})


const argumentos = process.argv.slice(2)
const funcion = argumentos[0]
//-----------------------------------------------------------------------------------------------------------

// REGISTRAR NUEVO ESTUDIANTE
async function ingreso (nombre, rut, curso, nivel) {
    const client = await pool.connect()
    const query = {
        name: "registrar_estudiante",
        text: "INSERT INTO estudiantes (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4) RETURNING*",
        values: [nombre, rut, curso, nivel]
    };

    try {
        const respuesta = await client.query(query)
        console.log("Estudiante " + respuesta.rows[0].nombre + " agregado con exito")
        client.release()
    } catch (error) {
        client.release()
        console.log(error);
    }
} 
// ----------------------------------------------------------------------------------------------------------

// CONSULTAR ESTUDIANTE POR RUT
async function consulta_rut (rut) {
    const client = await pool.connect()
    const query = {
        name: "consulta_rut",
        text: 'SELECT * FROM estudiantes WHERE rut = $1',
        values: [rut]
    };

    try {
        const respuesta = await client.query(query)
        console.log(respuesta.rows);
        client.release()
    } catch (error) {
        client.release()
        console.log(error);
    }
} 
// ----------------------------------------------------------------------------------------------------------

// CONSULTAR TODOS LOS ESTUDIANTES REGISTRADOS
async function consulta_total () {
    const client = await pool.connect()
    const query = {
        name: "consulta_total",
        text: 'SELECT * FROM estudiantes',
        values: [],
        rowMode: "array"
    };

    try {
        const respuesta = await client.query(query)
        console.log('Registro Actual: ');
        console.log(respuesta.rows);
        client.release()
    } catch (error) {
        client.release()
        console.log(error);
    }
} 
// ---------------------------------------------------------------------------------------------------------

// ACTUALIZAR REGISTRO DE UN ESTUDIANTE
async function actualizar (nombre, rut, curso, nivel) {
    const client = await pool.connect()
    const query = {
        name: "actualizar_registro",
        text: "UPDATE estudiantes SET nombre = $1, curso = $3, nivel = $4 WHERE rut = $2 RETURNING*",
        values: [nombre, rut, curso, nivel]
    };

    try {
        const respuesta = await client.query(query)
        console.log("Estudiante " + respuesta.rows[0].nombre + " editado con exito");
        client.release()
    } catch (error) {
        client.release()
        console.log(error);
    }
} 
// ------------------------------------------------------------------------------------------------------

// ELIMINAR REGISTRO DE UN ESTUDIANTE POR RUT
async function eliminar (rut) {
    const client = await pool.connect()
    const query = {
        name: "eliminar",
        text: 'DELETE FROM estudiantes WHERE rut = $1 RETURNING*',
        values: [rut]
    };

    try {
        const respuesta = await client.query(query)
        console.log("Registro de estudiante con rut: " + respuesta.rows[0].rut + " eliminado con exito");
        client.release()
    } catch (error) {
        client.release()
        console.log(error);
    }
} 
// ---------------------------------------------------------------------------------------------------------------------


async function estudio() {

    //NUEVO ESTUDIANTE
    if(funcion == "nuevo"){
        await ingreso(argumentos[1], argumentos[2], argumentos[3], argumentos[4])
    }
    // CONSULTA DE ESTUDIANTE POR RUT
    if(funcion == "rut"){
        await consulta_rut(argumentos[1])
    }
    // CONSULTA DE TODOS LOS ESTUDIANTES REGISTRADOS
    if(funcion == "consulta"){
        await consulta_total()
    }
    // ACTUALIZAR EL REGISTRO DE UN ESTUDIANTE
    if(funcion == "editar"){
        await actualizar(argumentos[1], argumentos[2], argumentos[3], argumentos[4])
    }
    // ELIMINAR EL REGISTRO DE UN ESTUDIANTE POR RUT
    if(funcion == "eliminar"){
        await eliminar(argumentos[1])
    }
    
    pool.end()
}
estudio()