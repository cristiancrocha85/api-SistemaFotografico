const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// ================================
// GET /financas/vendas-mes
// ================================
/*router.get('/vendas-mes', async (req, res) => {
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
});*/
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
// =============================================
// Total Mes Plataforma
// =============================================
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
// =============================================
// Total Ano Plataforma
// =============================================
router.get('/totalano-plataformas', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('total_por_plataforma_ano');

    if (error) throw error;

    return res.json({ plataformas: data });

  } catch (err) {
    console.error('Erro RPC total_por_plataforma_ano:', err);
    return res.status(500).json({
      erro: 'Falha ao buscar total de plataformas no ano.'
    });
  }
});
// =============================================
// Total 5 anos Anteriores
// =============================================
router.get('/total-5anos-anteriores', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('total_por_ano_5anos_anteriores');

    if (error) throw error;

    return res.json({ anos: data });

  } catch (err) {
    console.error('Erro RPC total_por_ano_5anos_anteriores:', err);
    return res.status(500).json({
      erro: 'Falha ao buscar total dos 5 anos anteriores.'
    });
  }
});
// =============================================
// Contagem Eventos Mes e Ano
// =============================================
router.get('/eventos-mes', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('total_eventos_mes');
    if (error) throw error;

    return res.json({ total: data });
  } catch (err) {
    console.error('Erro eventos mês:', err);
    return res.status(500).json({ erro: 'Falha ao buscar total de eventos' });
  }
});
router.get('/eventos-ano', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('total_eventos_ano');
    if (error) throw error;

    return res.json({ total: data });
  } catch (err) {
    console.error('Erro eventos ano:', err);
    return res.status(500).json({ erro: 'Falha ao buscar total de eventos' });
  }
});
// =============================================
// Total Meses
// =============================================
router.get('/total-meses-ano', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('total_por_mes_ano');

    if (error) throw error;

    return res.json({ meses: data });
  } catch (err) {
    console.error('Erro RPC total_por_mes_ano:', err);
    return res.status(500).json({
      erro: 'Falha ao buscar total de meses.'
    });
  }
});
//===================================================
// Total Mes Passado
//===================================================
router.get('/totalmespassado', async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('total_recebido_mes_passado');

    if (error) throw error;

    return res.json({
      totalFaturadoMes: data
    });

  } catch (err) {
    console.error('Erro RPC total_recebido_mes:_passado', err);
    return res.status(500).json({
      erro: 'Falha ao buscar total do mês.'
    });
  }
});
//===================================================
// Total Mes Retrasado
//===================================================
router.get('/totalmesretrasado', async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('total_recebido_mes_retrasado');

    if (error) throw error;

    return res.json({
      totalFaturadoMes: data
    });

  } catch (err) {
    console.error('Erro RPC total_recebido_mes:_passado', err);
    return res.status(500).json({
      erro: 'Falha ao buscar total do mês.'
    });
  }
});
//===================================================
// GET /totais-plataforma-mes/:year/:month
//===================================================
router.get('/totais-plataforma-ano', async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('total_por_plataforma_meses');

    if (error) throw error;

    res.json({ totals: data || [] });
  } catch (err) {
    console.error('Erro RPC totais-plataforma-ano:', err);
    res.status(500).json({ erro: 'Falha ao buscar totais por plataforma do ano.' });
  }
});
//===================================================
// GET Soma Vendas Mês
//===================================================
router.get('/soma-fotos-mes', async (req, res) => {
  try {
    const { mes, ano } = req.query;

    if (!mes || !ano) {
      return res.status(400).json({ erro: 'mes e ano são obrigatórios' });
    }

    const { data, error } = await supabase.rpc('soma_fotos_mes', {
      mes_param: mes,
      ano_param: ano
    });

    if (error) throw error;

    // Normaliza retorno do RPC para um número
    let total = 0;
    if (Array.isArray(data)) {
      if (data.length === 0) total = 0;
      else {
        const first = data[0];
        if (first && typeof first === 'object') {
          const v = Object.values(first)[0];
          total = Number(v ?? 0);
        } else {
          total = Number(first ?? 0);
        }
      }
    } else {
      total = Number(data ?? 0);
    }

    res.json({ total });
  } catch (err) {
    console.error('Erro RPC soma-fotos-mes:', err);
    res.status(500).json({ erro: 'Falha ao buscar soma de fotos do mês.' });
  }
});

router.get('/qtd_total_mes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('qtd_Soma_Vendida_Mes');

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

module.exports = router;