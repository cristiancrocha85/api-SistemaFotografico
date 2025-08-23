const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // carrega env correto automaticamente

const app = express();
app.use(cors());
app.use(express.json());

// Importa supabase e rotas
const supabase = require('./supabase');
const plataformaRouter = require('./routes/plataforma');

// Rotas
app.use('/api/plataforma', plataformaRouter);

// Status da API
app.get('/api/status', (req, res) => {
  const ambiente = process.env.MODO_TESTE === 'true' ? 'Teste' : 'Produção';
  res.json({ status: 'API online', ambiente });
});

// Porta
const port = process.env.PORT || 4000;
const ambiente = process.env.MODO_TESTE === 'true' ? 'Teste' : 'Produção';

app.listen(port, () => {
  console.log(`API rodando na porta ${port} | Ambiente: ${ambiente}`);
});
