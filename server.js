const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const pratosPath = path.join(__dirname, 'pratos.json');

function carregarPratos() {
  return JSON.parse(fs.readFileSync(pratosPath, 'utf-8'));
}

function salvarPratos(pratos) {
  fs.writeFileSync(pratosPath, JSON.stringify(pratos, null, 2));
}

app.get('/api/pratos', (req, res) => {
  const pratos = carregarPratos();
  res.json(pratos);
});

app.post('/api/confirmar', (req, res) => {
  const { nome, prato } = req.body;
  if (!nome || !prato) {
    return res.status(400).json({ erro: 'Nome e prato são obrigatórios' });
  }

  let pratos = carregarPratos();
  if (!pratos.includes(prato)) {
    return res.status(400).json({ erro: 'Prato já foi escolhido' });
  }

  // Remove prato disponível
  pratos = pratos.filter(p => p !== prato);
  salvarPratos(pratos);

  // Salva confirmação
  const confirmacoes = carregarConfirmacoes();
  confirmacoes.push({ nome, prato });
  salvarConfirmacoes(confirmacoes);

  res.json({ sucesso: true });
});

  let pratos = carregarPratos();
  if (!pratos.includes(prato)) {
    return res.status(400).json({ erro: 'Prato já foi escolhido' });
  }

  pratos = pratos.filter(p => p !== prato);
  salvarPratos(pratos);

  res.json({ sucesso: true });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get('/api/confirmacoes', (req, res) => {
  const confirmacoes = carregarConfirmacoes();
  res.json(confirmacoes);
});