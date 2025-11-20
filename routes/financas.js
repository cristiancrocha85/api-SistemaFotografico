const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// ================================
// GET /financas/vendas-mes
// ================================
router.get('/vendas-mes', async (req, res) => {
  try {
    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const { data, error } = await supabase
      .from('tb_Entrada')
      .select('ent_ValorTotal')
      .gte('ent_DataEntrada', inicio.toISOString())
      .lte('ent_DataEntrada', fim.toISOString());

    if (error) return res.status(500).json({ error: error.message });

    const total = (data || []).reduce(
      (acc, item) => acc + (item.ent_ValorTotal || 0), 0
    );

    res.json({ vendasMes: total });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================================
// GET /financas/vendas-ano
// ================================
router.get('/vendas-ano', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('vendas_total_ano');

    if (error) {
      console.error("Erro ao calcular vendas do ano:", error.message);
      return res.status(500).json({ error: 'Erro ao calcular vendas do ano', details: error.message });
    }

    res.json({
      vendasAno: parseFloat(data[0].vendas)
    });

  } catch (err) {
    console.error("Erro inesperado:", err.message);
    res.status(500).json({ error: 'Erro inesperado', details: err.message });
  }
});

module.exports = router;