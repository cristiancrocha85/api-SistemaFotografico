// routes/media.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.get('/totais/:idEvento', async (req, res) => {
  const { idEvento } = req.params;

  try {
    const { data, error } = await supabase
      .from('tb_Entrada') // sem "s" no final
      .select('ent_QtdFotosVendidas, ent_ValorTotal')
      .eq('ent_Evento', idEvento);

    if (error) throw error;

    const totalFotos = data.reduce((sum, row) => sum + (row.ent_QtdFotosVendidas || 0), 0);
    const totalValor = data.reduce((sum, row) => sum + (row.ent_ValorTotal || 0), 0);

    res.status(200).json({ totalFotos, totalValor });
  } catch (err) {
    console.error('Erro ao buscar totais:', err.message);
    res.status(500).json({ error: 'Erro ao buscar totais', details: err.message });
  }
});


module.exports = router;