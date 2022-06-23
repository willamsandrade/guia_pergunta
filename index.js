/*
EJS exibir html para o site
https://ejs.co/ informações
comando: npm install ejs --save

Express
npm install express --save
*/

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

//Data base
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso!!');
    })
    .catch((msgErro) =>{
        console.log('Erro');
    });

app.set('view engine', 'ejs'); //Iniciando o ejs template html
app.use(express.static('public')); //Arquivos estáticos css/ javascript...

//Body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); //trabalhar com api

app.get("/", (req, res) =>{
    Pergunta.findAll({raw: true, order:[
        ['id','DESC']
    ]}).then(perguntas =>{
        res.render('index', {
            perguntas: perguntas
        }); //desenha a view do index /views/index.ejs
    });
    
});
app.get("/perguntar", (req, res) =>{
    res.render('perguntar'); //desenha a view do index /views/index.ejs
});

app.post("/salvarpergunta", (req, res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao 
    }).then(() =>{
        res.redirect("/") //redirecionar após inserir
    }) //Inserir
});

app.get("/pergunta/:id", (req, res) =>{
    var id = req.params.id;
    Pergunta.findOne({
        where: {
            id: id
        }
    }).then(pergunta => {
        if(pergunta != undefined){

            Resposta.findAll({
                where:{
                    perguntaId: pergunta.id
                },
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render( 'pergunta', { 
                    pergunta: pergunta,
                    respostas: respostas  
                } );
            });
        }else{ //Não encontrada
            res.redirect('/');
        }
    });
    
});

app.post("/responder", (req, res) =>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.perguntaId;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() =>{
        res.redirect('/pergunta/' + perguntaId);
    });
});


app.listen(8080, ()=>{
    console.log('app rodando!');
});