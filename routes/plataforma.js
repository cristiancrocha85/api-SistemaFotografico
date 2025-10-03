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
//=============================================
// Inserir Plataformas
//=============================================
router.post('/', async (req, res) => {
  const { plat_Plataforma } = req.body;

  /*if (!Inst_Financeira || Inst_Financeira.trim() === '') {
    return res.status(400).json({ error: 'O nome da instituição financeira é obrigatório.' });
  }*/

  try {
    const { data, error } = await supabase
      .from('tb_Plataforma')
      .insert([{ plat_Plataforma}])
      .select();

    if (error) {
      console.error("Erro a plataforma:", error.message);
      return res.status(500).json({ error: 'Erro ao inserir plataforma', details: error.message });
    }

    res.status(201).json(data[0]);
  } catch (err) {
    console.error("Erro inesperado ao inserir a plataforma:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao inserir a plataforma', details: err.message });
  }
});

module.exports = router;