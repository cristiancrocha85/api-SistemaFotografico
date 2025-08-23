// supabase.js
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Só carrega o .env local se existir (não afeta o Render)
dotenv.config({ path: './.env' });

// Pega as variáveis de ambiente, local ou Render
const MODO_TESTE = process.env.MODO_TESTE === 'true';

const SUPABASE_URL = MODO_TESTE
  ? process.env.SUPABASE_URL_TEST
  : process.env.SUPABASE_URL_PROD;

const SUPABASE_KEY = MODO_TESTE
  ? process.env.SUPABASE_KEY_TEST
  : process.env.SUPABASE_KEY_PROD;

// Se faltar alguma variável, apenas loga, mas não trava
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn(
    'Atenção: SUPABASE_URL ou SUPABASE_KEY não definido. Verifique suas Environment Variables.'
  );
}

// Cria o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
