const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
//database
connection
    .authenticate()
    .then( ()=>{
        console.log("Conexão com banco de dados feita!")
    })
    .catch((msgErro)=>{
        console.log(msgErro);
    })

// informar o express que o EJS vai rendenizar o HTML
app.set('view engine','ejs');
app.use(express.static('public'));// pasta para arquivos estáticos css

//biblioteca do bodyParser - leitura de formulario POST
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//rotas
app.get("/",(req,res)=>{
    Pergunta.findAll({raw:true,order:[
        ['id','desc'] //asc crescente - desc decrescente
    ]})
        .then(perguntas =>{
            res.render("index",{
                perguntas:perguntas
            })
        });
})

app.get("/perguntar",(req,res)=>{
    res.render("perguntar")
})

app.post("/salvarpergunta",(req,res)=>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/");
    });
    //res.send("Formulario Recebido: " + titulo + " Descricao: " + descricao)
})

app.get("/pergunta/:id",(req,res) =>{
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta =>{
        if(pergunta != undefined){

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[
                    ['id','DESC']
                ]
            }).then( respostas => {
                res.render("pergunta",{
                    pergunta:pergunta,
                    respostas:respostas
                })
            })
        }else{
            res.redirect("/");
        }
    });
})

app.post("/responder",(req,res) =>{
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo:corpo,
        perguntaId: perguntaId
    }).then( () =>{
        res.redirect("/pergunta/" +perguntaId)
    });
})

app.listen(8080,()=>{
    console.log("App rodando!");
})