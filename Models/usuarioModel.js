const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function criarUsuario(usuario) {
  const db = client.db('meuBanco'); // ajuste o nome do banco!
  const hashSenha = await bcrypt.hash(usuario.senha, 10);
  const novoUsuario = { ...usuario, senha: hashSenha };
  const resultado = await db.collection('usuarios').insertOne(novoUsuario);
  return resultado;
}

async function encontrarUsuarioPorEmail(email) {
  const db = client.db('meuBanco');
  const usuario = await db.collection('usuarios').findOne({ email });
  return usuario;
}

module.exports = {
  criarUsuario,
  encontrarUsuarioPorEmail,
};
