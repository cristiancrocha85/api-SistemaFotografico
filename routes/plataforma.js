// routes/plataforma.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

//=============================================
// Listar Plataformas
//=============================================
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tb_Plataforma')
      .select('Id, plat_Plataforma')
      .order('Id', { ascending: true });

    if (error) {
      console.error("Erro ao buscar as plataformas:", error.message);
      return res.status(500).json({
        error:'Erro ao buscar plataformas cadastradas',
        details: error.message
      });
    }

    res.json(data || []);
  } catch (erro) {
    console.error("Erro inesperado:", erro.message);
    res.status(500).json({ 
      error: 'Erro ao buscar as categorias', 
      details: erro.message 
    });
  }
});

module.exports = router;