const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // carrega env correto automaticamente

const app = express();
app.use(cors());
app.use(express.json());

const supabase = require('./supabase');
const plataformaRouter = require('./routes/plataforma');

// Usar Rotas
app.use('/api/plataforma', plataformaRouter);

// Status da API
app.get('/api/status', (req, res) => {
  const ambiente = process.env.SUPABASE_URL.includes('sdqkqzpeoubwesgepveu') ? 'Teste' : 'Produção';
  res.json({ status: 'API online', ambiente });
});

// Porta
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API rodando na porta ${port} | Ambiente: ${process.env.SUPABASE_URL.includes('sdqkqzpeoubwesgepveu') ? 'Teste' : 'Produção'}`);
});
