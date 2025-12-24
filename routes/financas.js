const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// =============================================
// Total recebido do mês
// =============================================
router.get('/totalmes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('total_mes');

    if (error) throw error;

    return res.json({
      totalFaturadoMes: data
    });

  } catch (err) {
    console.error('Erro RPC total_mes:', err);
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
    const { data, error } = await supabase.rpc('total_ano');

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
router.get('/totalMes_Plataformas', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('total_mes_plataforma');

    if (error) throw error;

    return res.json({ plataformas: data });

  } catch (err) {
    console.error('Erro RPC total_mes_plataforma:', err);
    return res.status(500).json({
      erro: 'Falha ao buscar total de plataformas no mês.'
    });
  }
});
// =============================================
// Total Ano Plataforma
// =============================================
router.get('/totalAno-Plataformas', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('total_ano_plataforma');

    if (error) throw error;

    return res.json({ plataformas: data });

  } catch (err) {
    console.error('Erro RPC total_ano_plataforma:', err);
    return res.status(500).json({
      erro: 'Falha ao buscar total de plataformas no ano.'
    });
  }
});
// =============================================
// Total 5 anos Anteriores
// =============================================
router.get('/5anos_Anteriores', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('anteriores_5anos');

    if (error) throw error;

    return res.json({ anos: data });

  } catch (err) {
    console.error('Erro RPC anteriores_5anos:', err);
    return res.status(500).json({
      erro: 'Falha ao buscar total dos 5 anos anteriores.'
    });
  }
});
// =============================================
// Contagem Eventos Mes e Ano
// =============================================
router.get('/eventos_mes', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('mes_eventos');
    if (error) throw error;

    return res.json({ total: data });
  } catch (err) {
    console.error('Erro eventos mês:', err);
    return res.status(500).json({ erro: 'Falha ao buscar total de eventos' });
  }
});
router.get('/eventos-ano', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('ano_eventos');
    if (error) throw error;

    return res.json({ total: data });
  } catch (err) {
    console.error('Erro eventos ano:', err);
    return res.status(500).json({ erro: 'Falha ao buscar total de eventos' });
  }
});
//===================================================
// GET Soma Vendas Qtd Fotos Mês
//===================================================
router.get('/qtd_fotos_mes_atual', async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('fotos_mes_atual');

    if (error) throw error;

    res.json({ totalFaturadoMes: data ?? 0 });
  } catch (err) {
    console.error('Erro RPC qtd_fotos_mes_atual:', err);
    res.status(500).json({ erro: 'Falha ao buscar total do mês atual.' });
  }
});
//===================================================
// GET Soma Vendas Qtd Fotos Ano
//===================================================
router.get('/qtd_fotos_ano_atual', async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('fotos_ano_atual');

    if (error) throw error;

    res.json({ totalAno: data ?? 0 });
  } catch (err) {
    console.error('Erro RPC qtd_fotos_ano_atual:', err);
    res.status(500).json({ erro: 'Falha ao buscar total do ano atual.' });
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
// Saldo Liberado
//===================================================
router.get('/saldo', async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('saldo');

    if (error) throw error;

    res.json({ saldoDisponivel: data ?? 0 });
  } catch (err) {
    console.error('Erro RPC saldo:', err);
    res.status(500).json({ erro: 'Falha ao buscar o saldo.' });
  }
});
//===================================================
// Saldo Bloqueado
//===================================================
router.get('/saldo-bloqueado', async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('saldo_bloqueado');

    if (error) throw error;

    res.json({ saldoBloqueado: data ?? 0 });
  } catch (err) {
    console.error('Erro RPC saldo-bloqueado:', err);
    res.status(500).json({ erro: 'Falha ao buscar saldo bloqueado.' });
  }
});
//===================================================
// Previsão Salarial
//===================================================
router.get('/previsao-salarial', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('previsao_salarial');

    if (error) {
      console.error('Erro RPC previsao-salarial:', error);
      return res.json({ previsaoSalarial: 0 }); // fallback
    }

    // Se vier null (porque não tem vendas), padroniza
    const valor = data ?? 0;

    res.json({ previsaoSalarial: valor });

  } catch (err) {
    console.error('Erro RPC previsao-salarial (catch):', err);
    res.json({ previsaoSalarial: 0 }); // fallback geral
  }
});
//====================================================================
//Salario Mês
//====================================================================
router.get('/salario-do-mes', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('salario_mensal'); // <— sem parâmetros

    if (error) throw error;

    res.json({
      totalSalario: data ?? 0
    });
  } catch (err) {
    console.error('Erro RPC salario-mes:', err);
    res.status(500).json({
      erro: 'Falha ao buscar total de salário.'
    });
  }
});
//====================================================================
//Ajuste
//====================================================================
router.get('/_ajuste', async (req, res) => {
  const { mes, ano } = req.query;

  try {
    const { data, error } = await supabase
      .rpc('ajuste', {
        p_mes: mes,
        p_ano: ano
      });

    if (error) {
      throw error;
    }

    res.json({
      ajuste: data ?? 0
    });
  } catch (err) {
    console.error('Erro RPC ajuste:', err);
    res.status(500).json({
      erro: 'Falha ao buscar o ajuste.'
    });
  }
});
//====================================================================
//Adiantamento Mês
//====================================================================
router.get('/adiantamento-mes', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('adiantamento_mes');

    if (error) throw error;

    const total = Array.isArray(data)
      ? data[0]?.adiantamento_mes ?? 0
      : data ?? 0;

    res.json({ totalAdiantamento: total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar adiantamento' });
  }
});
//====================================================================
// Saldos por Plataformas de Venda
//====================================================================
router.get('/saldo-plataformas', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('saldo_por_plataforma_venda');

    if (error) throw error;

    res.json({
      plataformas: data
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});
// =============================================
// Salários por Mês (Ano Atual)
// =============================================
router.get('/salarios-meses-ano', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('lista_salario_mensal');

    if (error) throw error;

    return res.json({ meses: data });
  } catch (err) {
    console.error('Erro RPC lista_salario_mensal:', err);
    return res.status(500).json({
      erro: 'Falha ao buscar salários por mês.'
    });
  }
});

module.exports = router;