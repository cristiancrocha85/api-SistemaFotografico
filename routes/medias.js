// routes/media.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.get('/total/:idEvento', async (req, res) => {
  const { idEvento } = req.params;

  try {
    const { data, error } = await supabase
      .from('tb_Entrada')
      .select('ent_QtdFotosVendidas', { count: 'exact' })
      .eq('IdEvento', idEvento);

    if (error) throw error;

    const totalFotos = data.reduce((sum, row) => sum + (row.QtdFotos || 0), 0);
    res.status(200).json({ totalFotos });
  } catch (err) {
    console.error('Erro ao buscar total de fotos:', err.message);
    res.status(500).json({ error: 'Erro ao buscar total de fotos', details: err.message });
  }
});

module.exports = router;