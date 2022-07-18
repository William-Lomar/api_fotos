//.env configs
import configEnv from 'dotenv';
configEnv.config();

//Config express
import express from 'express';
const app = express();
import cors from 'cors';
var corsOptions = {
    orgim: '/',
    optionsSuccessStatus: 200
  }

import bodyParser from "body-parser"; 
const { json } = bodyParser;

app.use(cors(corsOptions));
app.use(json());

//Criação de erros personalizados
import createError from 'http-errors';
import asyncHandler from 'express-async-handler';


app.get('/',(req,res)=>{
    res.json("Server ok!");
})










// Escuta a porta especificada, caso contrário 3080 
const server = app.listen(3080, () => { 
    console.log(`Server Running: http://localhost:3080`); 
  });


// Fazendo o log do erro / Capturando erros do servidor
app.use((error, req, res, next) => {
    console.log('Error status: ', error.status)
    console.log('Message: ', error.message)

    // Seta o HTTP Status Code
    res.status(500)
    // Envia a resposta
    res.json({ message: error.message })
})

/** 
* O sinal SIGTERM é um sinal genérico usado para causar o 
término do programa *. Ao contrário do SIGKILL , este sinal pode ser bloqueado, 
* manipulado e ignorado. É a maneira normal de pedir educadamente que um 
programa * termine. O comando shell kill gera 
* SIGTERM por padrão. 
*/ 
process.on('SIGTERM', () => { 
    server.close(() => { 
        console.log('Servidor Fechado: Processo Finalizado!'); 
    }); 
});

  