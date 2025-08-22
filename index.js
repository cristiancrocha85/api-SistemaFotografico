const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Importar supabase
const supabase = require('./supabase');

// Rotas de exemplo (substitua pelas suas reais)
app.get('/api/status', async (req, res) => {
  res.json({ status: 'API online', modo: process.env.MODO_TESTE });
});

// Porta
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API rodando na porta ${port} | MODO_TESTE: ${process.env.MODO_TESTE}`);
});
