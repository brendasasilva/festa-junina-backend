const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Parser } = require('json2csv');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const pratosPath = path.join(__dirname, 'pratos.json');
const confirmacoesPath = path.join(__dirname, 'confirmacoes.json');

// Função para carregar pratos do JSON
function carregarPratos() {
  try {
    const data = fs.readFileSync(pratosPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Erro ao ler pratos.json:', err);
    return [];
  }
}

// Função para salvar pratos no JSON
function salvarPratos(pratos) {
  fs.writeFileSync(pratosPath, JSON.stringify(pratos, null, 2));
}

// Função para carregar confirmações do JSON
function carregarConfirmacoes() {
  try {
    return JSON.parse(fs.readFileSync(confirmacoesPath, 'utf-8'));
  } catch {
    return [];
  }
}

// Função para salvar confirmações no JSON
function salvarConfirmacoes(confirmacoes) {
  fs.writeFileSync(confirmacoesPath, JSON.stringify(confirmacoes, null, 2));
}

// Rota para obter pratos disponíveis
app.get('/api/pratos', (req, res) => {
  const pratos = carregarPratos();
  res.json(pratos);
});

// Rota para obter confirmações feitas
app.get('/api/confirmacoes', (req, res) => {
  const confirmacoes = carregarConfirmacoes();
  res.json(confirmacoes);
});

// Rota para confirmar prato escolhido
app.post('/api/confirmar', (req, res) => {
  const { nome, prato } = req.body;
  if (!nome || !prato) {
    return res.status(400).json({ erro: 'Nome e prato são obrigatórios' });
  }

  let pratos = carregarPratos();

  if (!pratos.includes(prato)) {
    return res.status(400).json({ erro: 'Prato já foi escolhido' });
  }

  // Remove prato escolhido da lista
  pratos = pratos.filter(p => p !== prato);
  salvarPratos(pratos);

  // Salva confirmação
  const confirmacoes = carregarConfirmacoes();
  confirmacoes.push({ nome, prato });
  salvarConfirmacoes(confirmacoes);

  res.json({ sucesso: true });
});

// Rota para exportar confirmações em CSV
app.get('/api/backup', (req, res) => {
  const confirmacoes = carregarConfirmacoes();

  if (!confirmacoes.length) {
    return res.status(404).send('Nenhuma confirmação encontrada.');
  }

  try {
    const parser = new Parser({ fields: ['nome', 'prato'] });
    const csv = parser.parse(confirmacoes);

    res.header('Content-Type', 'text/csv');
    res.attachment('confirmacoes.csv');
    res.send(csv);
  } catch (err) {
    console.error('Erro ao gerar CSV:', err);
    res.status(500).send('Erro ao gerar backup em CSV.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
