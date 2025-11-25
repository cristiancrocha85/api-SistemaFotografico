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
// =============================================
// Total recebido do mês
// =============================================
router.get('/totalmes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('total_recebido_mes');

    if (error) throw error;

    return res.json({
      totalFaturadoMes: data
    });

  } catch (err) {
    console.error('Erro RPC total_recebido_mes:', err);
    return res.status(500).json({
      erro: 'Falha ao buscar total do mês.'
    });
  }
});
// =============================================
// Total recebido do ano
// =============================================
router.get('/totalano', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('total_recebido_ano');

    if (error) throw error;

    return res.json({
      totalFaturadoAno: data ?? 0
    });

  } catch (err) {
    console.error('Erro RPC total_recebido_ano:', err);
    return res.status(500).json({
      erro: 'Falha ao buscar total do ano.'
    });
  }
});
router.get('/totalmes-plataformas', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('total_por_plataforma_mes');

    if (error) throw error;

    return res.json({ plataformas: data });

  } catch (err) {
    console.error('Erro RPC total_por_plataforma_mes:', err);
    return res.status(500).json({
      erro: 'Falha ao buscar total de plataformas no mês.'
    });
  }
});

module.exports = router;