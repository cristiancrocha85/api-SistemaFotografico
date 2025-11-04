process.env.TZ = 'America/Sao_Paulo';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Importar Rotas
const plataformaRouter = require('./routes/plataforma');
const eventosRouter = require('./routes/eventos');
const agendaRouter = require('./routes/agenda');
const entradaRouter = require('./routes/entrada');
const mediaRouter = require('./routes/media');

// Usar Rotas
app.use('/api/plataforma', plataformaRouter);
app.use('/api/eventos',eventosRouter);
app.use('/api/agenda',agendaRouter);
app.use('/api/entrada',entradaRouter);
app.use('/api/media',mediaRouter);


// Status da API
app.get('/api/status', (req, res) => {
  const ambiente = process.env.MODO_TESTE === 'true' ? 'Ambiente de Testes' : 'Ambiente Oficial';
  res.json({ status: 'API online', ambiente });
});

// Porta
const port = process.env.PORT || 4000;
const ambiente = process.env.MODO_TESTE === 'true' ? 'Ambiente de Testes' : 'Ambiente Oficial';

app.listen(port, () => {
  console.log(`API rodando na porta ${port} | Qual ambiente esta rodando: ${ambiente}`);
});
