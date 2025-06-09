const express = require('express');
const { engine } = require('express-handlebars');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();




app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/css', express.static('./css'));
app.use('/uploads', express.static('uploads')); // para exibir imagens

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//conexao com o banco

const conexao = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

conexao.connect((erro) => {
  console.log(erro ? 'Conexão recusada' : 'Conexão feita com sucesso');
});




// Rota principal com filtro opcional
app.get('/', function (req, res) {
  const busca = req.query.busca;
  let sql = 'SELECT * FROM produtos';
  let valores = [];

  if (busca) {
    sql = 'SELECT * FROM produtos WHERE nome LIKE ?';
    valores = [`%${busca}%`];
  }

  conexao.query(sql, valores, (erro, retorno) => {
    if (erro) return res.send('Erro ao consultar banco.');
    res.render('formulario', { produtos: retorno });
  });
});




// Rota de cadastro
app.post('/cadastrar', upload.single('arquivoProduto'), function (req, res) {
  const nome = req.body.nomeProduto;
  const valor = req.body.valorProduto;
  const arquivo = req.file;

  if (!arquivo) {
    return res.send('Erro: Nenhum arquivo foi enviado!');
  }

  const caminhoArquivo = path.join('uploads', arquivo.filename);
  const query = 'INSERT INTO produtos (nome, valor, image) VALUES (?, ?, ?)';
  const valores = [nome, valor, caminhoArquivo];

  conexao.query(query, valores, (erro) => {
    if (erro) return res.send('Erro ao cadastrar produto!');
    res.redirect('/');
  });
});




// Rota de remoção
app.get('/remover/:codigo', function (req, res) {
  const codigo = req.params.codigo;

  // Primeiro, buscar o produto para obter o caminho da imagem
  const querySelect = 'SELECT image FROM produtos WHERE codigo = ?';

  conexao.query(querySelect, [codigo], (erro, resultados) => {
    if (erro) {
      console.error('Erro ao buscar produto:', erro);
      return res.status(500).send('Erro ao buscar produto para remoção.');
    }

    if (resultados.length === 0) {
      return res.status(404).send('Produto não encontrado.');
    }

    const caminhoImagem = resultados[0].image;




    // Apagar o arquivo da imagem no disco
    fs.unlink(caminhoImagem, (err) => {
      if (err) {
        // Caso o arquivo não exista ou dê erro, só logamos, não interrompemos
        console.warn(`Não foi possível apagar a imagem: ${caminhoImagem}`, err);
      }



      // Depois apagar o registro no banco
      const queryDelete = 'DELETE FROM produtos WHERE codigo = ?';

      conexao.query(queryDelete, [codigo], (erro2, resultado) => {
        if (erro2) {
          console.error('Erro ao remover produto:', erro2);
          return res.status(500).send('Erro ao remover produto.');
        }

        if (resultado.affectedRows === 0) {
          return res.status(404).send('Produto não encontrado para remoção.');
        }

        console.log(`Produto com código ${codigo} removido com sucesso.`);
        res.redirect('/');
      });
    });
  });
});



//saida da url na porta 8081

app.listen(8081, () => {
  console.log('Servidor rodando em http://localhost:8081');
});
