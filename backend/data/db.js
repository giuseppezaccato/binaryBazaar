import mysql2 from 'mysql2'


const connection = mysql2.createConnection({
    host: process.env.DB_HOST|| "localhost",
    user: process.env.DB_USER||"root",
    password: process.env.DB_PASSWORD||"root",
    database: process.env.DB_NAME||"binary_bazaar"
})

connection.connect( (err) => {
    if( err ) throw err;

    console.log( "Connessione al DB avvenuta con successo")
})

export default connection