// routes/plataforma.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Rota GET principal
router.get('/', async (req, res) => {
  const tabela = 'tb_PlataformaVenda';

  try {
    const { data, error } = await supabase
      .from(tabela)
      .select('Id, plataforma_NomePlataforma')
      .order('Id', { ascending: true });

    if (error) {
      console.error("Erro ao buscar os dados:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (erro) {
    console.error("Erro inesperado:", erro);
    res.status(500).json({ error: 'Erro ao buscar os dados', details: erro.message });
  }
});


module.exports = router;
