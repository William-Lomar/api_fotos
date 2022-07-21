//.env configs
import configEnv from 'dotenv';
configEnv.config();

//Manipulação de arquivos
import fs from 'fs';

//Gerando zip 
import JSZip from 'jszip';
import download from 'js-file-download';
const zip = JSZip();

import buffer from 'buffer';
globalThis.Blob = buffer.Blob;
JSZip.support.blob = true;


//Config express
import express from 'express';
const app = express();
import cors from 'cors';
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
  }

import multipart from 'connect-multiparty';
import bodyParser from "body-parser"; 
const { json } = bodyParser;

app.use(cors(corsOptions));
app.use(json());
app.use(bodyParser.urlencoded({ extended:true }));

//Criação de erros personalizados
import createError from 'http-errors';
import asyncHandler from 'express-async-handler';



const multipartMiddleware = multipart({uploadDir:'./uploads'});

app.get('/',(req,res)=>{
    res.json("Server ok!");
})

app.post('/upload',multipartMiddleware,(req,res)=>{
    const files = req.files;
    console.log(files);
    res.json({message:'Tudo ok'});
})

app.get('/getImgs',(req,res)=>{
    fs.readdir('./uploads',(erro,files)=>{
        res.json(files); 
    });
})

app.delete('/deletarImg/:img',(req,res)=>{
    let imgDelete = req.params.img; 
    fs.unlink('./uploads/'+imgDelete,(erro)=>{
        if(erro){
            res.json("Ocorreu algum erro!");
        }else{
            res.json(imgDelete+' excluído com sucesso!');
        }
    });  
})

app.get('/download/:img',(req,res)=>{
    let img = req.params.img;
    res.download('./uploads/'+img);
})

// Fazendo o log do erro / Capturando erros do servidor
app.use((error, req, res, next) => {
    console.log('Error status: ', error.status)
    console.log('Message: ', error.message)

    // Seta o HTTP Status Code
    res.status(500)
    // Envia a resposta
    res.json({ error: error.message })
})

app.use(express.static('uploads')); // Torna uma pasta em arquivos staticos de visualização publica





// Escuta a porta especificada, caso contrário 3080 
const server = app.listen(3080, () => { 
    console.log(`Server Running: http://localhost:3080`); 
  });




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

  