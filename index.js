require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

const JWT_SECRET = process.env.JWT_SECRET || 'segredo';

// Middlewares
app.use(cors());
app.use(express.json()); // para aceitar JSON no body das requisições

// Configurar MongoDB
const uri = process.env.MONGODB_URI || 'mongodb+srv://triagem:triagemsmartcare@cluster0.267ulub.mongodb.net/smartcare?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

let collection; // coleção triagens
let usuariosCollection; // coleção usuários

// Middleware de autenticação JWT
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

async function start() {
  try {
    // Conectar no banco
    await client.connect();
    const db = client.db('smartcare'); // nome do banco

    collection = db.collection('triagens');
    usuariosCollection = db.collection('usuarios');

    // Iniciar servidor
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao conectar no banco:', error);
  }
}

start();

// ===== ROTAS DE AUTENTICAÇÃO =====

// Cadastro de usuário
app.post('/auth/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const usuarioExistente = await usuariosCollection.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashSenha = await bcrypt.hash(senha, 10);
    await usuariosCollection.insertOne({ nome, email, senha: hashSenha });

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no cadastro' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await usuariosCollection.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const token = jwt.sign({ id: usuario._id, email: usuario.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no login' });
  }
});

// ===== ROTAS DE TRIAGENS (PROTEGIDAS POR AUTENTICAÇÃO) =====

app.get('/triagens', autenticar, async (req, res) => {
  try {
    const triagens = await collection.find({}).toArray();
    res.json(triagens);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar triagens' });
  }
});

app.post('/triagens', autenticar, async (req, res) => {
  try {
    const novaTriagem = req.body;
    const resultado = await collection.insertOne(novaTriagem);
    res.status(201).json({ id: resultado.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar triagem' });
  }
});

app.get('/triagens/:id', autenticar, async (req, res) => {
  try {
    const id = req.params.id;
    const triagem = await collection.findOne({ _id: new ObjectId(id) });
    if (!triagem) {
      return res.status(404).json({ error: 'Triagem não encontrada' });
    }
    res.json(triagem);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar triagem' });
  }
});

app.put('/triagens/:id', autenticar, async (req, res) => {
  try {
    const id = req.params.id;
    const atualizacao = req.body;
    const resultado = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: atualizacao }
    );
    if (resultado.matchedCount === 0) {
      return res.status(404).json({ error: 'Triagem não encontrada' });
    }
    res.json({ mensagem: 'Triagem atualizada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar triagem' });
  }
});

app.delete('/triagens/:id', autenticar, async (req, res) => {
  try {
    const id = req.params.id;
    const resultado = await collection.deleteOne({ _id: new ObjectId(id) });
    if (resultado.deletedCount === 0) {
      return res.status(404).json({ error: 'Triagem não encontrada' });
    }
    res.json({ mensagem: 'Triagem deletada' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar triagem' });
  }
});
