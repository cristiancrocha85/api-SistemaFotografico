const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.get('/', async (req, res) => {
  const MODO_TESTE = process.env.MODO_TESTE === 'true';
  const tabela = 'tb_PlataformaVenda';

  console.log("===== DEBUG =====");
  console.log("MODO_TESTE:", MODO_TESTE);
  console.log("SUPABASE_URL:", process.env.SUPABASE_URL_TEST);
  console.log("SUPABASE_KEY (início):", process.env.SUPABASE_KEY_TEST?.substring(0,10) + "...");

  try {
    const { data, error } = await supabase
      .from(tabela)
      .select('Id, plataforma_NomePlataforma')
      .order('Id', { ascending: true });

    console.log("Dados retornados:", data);
    if (error) {
      console.error("Erro ao buscar os dados:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (erro) {
    console.error("Erro inesperado:", erro);
    res.status(500).json({ error: 'Erro ao buscar os dados', details: erro.message });
  }
});
