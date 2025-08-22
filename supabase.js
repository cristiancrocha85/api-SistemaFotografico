// supabase.js
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = process.env.MODO_TESTE === 'true'
  ? createClient(process.env.SUPABASE_URL_TEST, process.env.SUPABASE_KEY_TEST)
  : createClient(process.env.SUPABASE_URL_PROD, process.env.SUPABASE_KEY_PROD);

module.exports = supabase;
