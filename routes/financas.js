const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// ================================
// GET /financas/vendas-mes
// ================================
router.get('/vendas-mes', async (req, res) => {
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
});

module.exports = router;