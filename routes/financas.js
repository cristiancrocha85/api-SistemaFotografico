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


/*router.get('/vendas-mes', async (req, res) => {
  try {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1; // 1-12
    const anoAtual = hoje.getFullYear();

    const { data, error } = await supabase
      .from('tb_Entrada')
      .select('ent_ValorTotal')
      .eq('ent_Mes', mesAtual.toString())   // "11", "12"...
      .eq('ent_Ano', anoAtual.toString()); // "2025"

    if (error) {
      console.error("Erro ao buscar vendas:", error.message);
      return res.status(500).json({ error: 'Erro ao buscar vendas', details: error.message });
    }

    const totalMes = (data || []).reduce(
      (acc, item) => acc + (item.ent_ValorTotal || 0),
      0
    );

    res.json({
      mes: mesAtual,
      ano: anoAtual,
      vendasMes: totalMes
    });

  } catch (err) {
    console.error("Erro inesperado:", err);
    res.status(500).json({ error: 'Erro inesperado', details: err.message });
  }
});*/

module.exports = router;