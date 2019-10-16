const express = require('express');

const server = express();

server.use(express.json());

//Query params = ?nome=Nivaldo
server.get('/testequery', (req, res) => {
  const nome = req.query.nome;
  return res.json({ message: `Hello ${nome}`});
})

//Route params = /testeroute/Niva
server.get('/testeroute/:id', (req, res) => {
  const { id } = req.params;
  return res.json({ message: `Hello ${id}`});
})

//Request body = { nome: "NivaJunior" }
const users = ['Diego', 'Cláudio', 'Victor'];

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd('Request');
})

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User not found on request body'});
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: 'Users does not exists'});
  }

  req.user = user;

  return next();
}

server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
})

// CRUD - Create, Read, Update, Delete

server.get('/users', (req, res) => {
  return res.json(users);
})

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
})

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
})

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.slice(index, 1);

  return res.send();
})

server.listen(3000);