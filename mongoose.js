const express = require('express');
const mongoose = require('mongoose')
const { MongoClient } = require('mongodb');

const app = express();
mongoose.connect('mongodb+srv://admin:12345678Admin@cluster0.yhpme.mongodb.net/apirest?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err
    console.log("Conectado a la BD")
})



// const client = new MongoClient(url)

// async function run() {
//     try {
//         await client.connect()
//         console.log("Connected correctly to server")
//     } catch (err) {
//         console.log(err.stack)
//     } finally {
//         await client.close()
//     }
// }


// run().catch(console.dir)