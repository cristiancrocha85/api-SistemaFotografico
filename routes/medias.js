// routes/media.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

//=========================================================================================
// Medias
//=========================================================================================
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

//=========================================================================================
// Inserir
//=========================================================================================
router.post('/', async (req, res) => {
  try {
    const {
      med_FotosVendidas,
      med_ValorTotal,
    } = req.body;

    // Inserção mínima no Supabase
    const { data, error } = await supabase
      .from('tb_Medias')
      .insert([{
        med_FotosVendidas: med_FotosVendidas ? Number(med_FotosVendidas) : 0,
        med_ValorTotal: med_ValorTotal ? Number(String(med_ValorTotal).replace(',','.')):0,
      }])
      .select()
      .single(); // retorna apenas um objeto

    if (error) {
      console.error("Erro ao inserir as médias:", error.message);
      return res.status(500).json({ error: 'Erro ao inserir as médias', details: error });
    
      
    
    }

    res.status(201).json(data);

  } catch (err) {
    console.error("Erro inesperado ao inserir as médias:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao inserir as médias', details: err.message });
  }
});

module.exports = router;