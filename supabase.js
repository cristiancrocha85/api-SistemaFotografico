const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config(); // carrega o .env correto via env-cmd ou variáveis do Render

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('SUPABASE_URL e SUPABASE_KEY devem estar definidos no .env ou nas variáveis de ambiente');
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
module.exports = supabase;
