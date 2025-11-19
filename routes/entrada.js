// routes/Entrada.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

//=============================================
// Listar Entrada
//=============================================
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tb_Entrada')
      .select(`
        Id,
        ent_DataEntrada,
        ent_TipoEvento,
        ent_DataEvento,
        ent_Plataforma,
        ent_QtdFotosVendidas,
        ent_ValorTotal,
        ent_TipoPgto,
        ent_Status,
        ent_LiberarSaldo,
        ent_DataPrevista,
        ent_Mes,
        ent_Ano,
        ent_Evento,
        tb_Agenda (ag_Evento)
      `)
      .order('ent_DataEntrada', { ascending: false })
      .order('Id', { ascending: false });

    if (error) {
      console.error("Erro ao buscar a entrada:", error.message);
      return res.status(500).json({ error: 'Erro ao buscar a entrada', details: error.message });
    }

    const response = (data || []).map(entrada => ({
      Id: entrada.Id,
      ent_DataEntrada: entrada.ent_DataEntrada,
      ent_TipoEvento: entrada.ent_TipoEvento,
      ent_DataEvento: entrada.ent_DataEvento,
      ent_Plataforma: entrada.ent_Plataforma,
      ent_QtdFotosVendidas: entrada.ent_QtdFotosVendidas,
      ent_ValorTotal: entrada.ent_ValorTotal,
      ent_TipoPgto: entrada.ent_TipoPgto,
      ent_Status: entrada.ent_Status,
      ent_LiberarSaldo: entrada.ent_LiberarSaldo,
      ent_DataPrevista: entrada.ent_DataPrevista,
      ent_Mes: entrada.ent_Mes,
      ent_Ano: entrada.ent_Ano,
      ent_Evento: entrada.ent_Evento, // ID bruto da FK
      Evento: entrada.tb_Agenda?.ag_Evento || null, // Nome do evento relacionado
    }));

    res.json(response);
  } catch (err) {
    console.error("Erro inesperado ao buscar a entrada:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao buscar a entrada', details: err.message });
  }
});
// ===================================
// POST - Inserir Entrada e Atualizar Médias
// ===================================
router.post('/', async (req, res) => {
  try {
    const {
      ent_DataEntrada,
      ent_Evento,
      ent_TipoEvento,
      ent_DataEvento,
      ent_Plataforma,
      ent_QtdFotosVendidas,
      ent_ValorTotal,
      ent_TipoPgto,
      ent_Status,
      ent_LiberarSaldo,
      ent_DataPrevista,
      ent_Mes,
      ent_Ano
    } = req.body;

    const formatarData = (valor) => {
      if (!valor) return null;
      const data = new Date(valor);
      if (isNaN(data)) return null;
      return data.toISOString().split('T')[0];
    };

    const novaEntrada = {
      ent_DataEntrada: formatarData(ent_DataEntrada) || formatarData(new Date()),
      ent_Evento: ent_Evento ? Number(ent_Evento) : null,
      ent_TipoEvento,
      ent_DataEvento: formatarData(ent_DataEvento),
      ent_Plataforma,
      ent_QtdFotosVendidas: ent_QtdFotosVendidas ? Number(ent_QtdFotosVendidas) : 0,
      ent_ValorTotal: ent_ValorTotal ? Number(String(ent_ValorTotal).replace(',', '.')) : 0,
      ent_TipoPgto,
      ent_Status,
      ent_LiberarSaldo,
      ent_DataPrevista: formatarData(ent_DataPrevista),
      ent_Mes,
      ent_Ano
    };

    // 1️⃣ Inserir entrada
    const { error: errEntrada } = await supabase
      .from('tb_Entrada')
      .insert([novaEntrada]);

    if (errEntrada) throw new Error('Erro ao inserir entrada: ' + errEntrada.message);

    // 2️⃣ Buscar total de fotos disponíveis do evento
    const { data: dadosMedias, error: errTotal } = await supabase
      .from('tb_Medias')
      .select('med_TotalUpload')
      .eq('med_Evento', ent_Evento)
      .maybeSingle();

    if (errTotal) throw new Error('Erro ao buscar total de fotos: ' + errTotal.message);

    const totalDisponivel = dadosMedias?.med_TotalUpload || 0;

    // 3️⃣ Buscar totais do evento (vendas)
    const { data: vendas, error: errBusca } = await supabase
      .from('tb_Entrada')
      .select('ent_QtdFotosVendidas, ent_ValorTotal')
      .eq('ent_Evento', ent_Evento);

    if (errBusca) throw new Error('Erro ao buscar totais: ' + errBusca.message);

    const totalFotos = vendas.reduce((acc, v) => acc + (v.ent_QtdFotosVendidas || 0), 0);
    const totalValor = vendas.reduce((acc, v) => acc + (v.ent_ValorTotal || 0), 0);
    const valorMedio = totalFotos > 0 ? totalValor / totalFotos : 0;
    const percVendidas = totalDisponivel > 0 ? (totalFotos / totalDisponivel) * 100 : 0;

    // 4️⃣ Atualizar tb_Medias
    const { error: errUpsert } = await supabase
      .from('tb_Medias')
      .upsert(
        {
          med_Evento: ent_Evento,
          med_TipoEvento: ent_TipoEvento,
          med_Plataforma: ent_Plataforma,
          med_FotosVendidas: totalFotos,
          med_ValorTotal: totalValor,
          med_ValorMedio: valorMedio,
          med_PercFotosVend: percVendidas
        },
        { onConflict: 'med_Evento' }
      );

    if (errUpsert) throw new Error('Erro ao atualizar tb_Medias: ' + errUpsert.message);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Entrada inserida e médias atualizadas com sucesso',
      totalFotos,
      totalValor,
      valorMedio,
      percVendidas
    });

  } catch (err) {
    console.error('ERRO DETALHADO AO INSERIR/ATUALIZAR:', err);
    res.status(500).json({ error: err.message });
  }
});
// ============================================
// PUT - Atualizar entrada
// ============================================
router.put('/atualizar_recebimentos', async (req, res) => {
  try {
    const hojeSP = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const [dia, mes, ano] = hojeSP.split('/');
    const isoHojeSP = `${ano}-${mes}-${dia}`;

    const { data, error } = await supabase.rpc('atualizar_recebimentos', { hoje_param: isoHojeSP });

    if (error) {
      console.error('Erro Supabase:', error);
      return res.status(500).json({ success: false, error: error.message || error });
    }

    res.json({ success: true, message: 'Recebimentos atualizados com sucesso!', data });
  } catch (err) {
    console.error('Erro geral:', err);
    res.status(500).json({ success: false, error: 'Erro interno no servidor' });
  }
});
//=============================================
// Editar Entrada e Atualizar Médias
//=============================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ent_QtdFotosVendidas, ent_ValorTotal, ent_Evento } = req.body;

    if (!id || !ent_Evento)
      return res.status(400).json({ error: 'ID e evento são obrigatórios.' });

    // 1️⃣ Atualiza a entrada
    const { error: errUpdate } = await supabase
      .from('tb_Entrada')
      .update({
        ent_QtdFotosVendidas: Number(ent_QtdFotosVendidas),
        ent_ValorTotal: Number(ent_ValorTotal)
      })
      .eq('Id', Number(id));

    if (errUpdate) throw errUpdate;

    // 2️⃣ Recalcula totais do evento
    const { data: vendas, error: errBusca } = await supabase
      .from('tb_Entrada')
      .select('ent_QtdFotosVendidas, ent_ValorTotal')
      .eq('ent_Evento', ent_Evento);

    if (errBusca) throw errBusca;

    const totalFotos = vendas.reduce((acc, v) => acc + (v.ent_QtdFotosVendidas || 0), 0);
    const totalValor = vendas.reduce((acc, v) => acc + (v.ent_ValorTotal || 0), 0);
    const valorMedio = totalFotos > 0 ? totalValor / totalFotos : 0;

    // 3️⃣ Busca total de uploads no tb_Medias (pra calcular % real)
    const { data: mediaAtual, error: errMedia } = await supabase
      .from('tb_Medias')
      .select('med_TotalUpload')
      .eq('med_Evento', ent_Evento)
      .single();

    if (errMedia) throw errMedia;

    const totalUpload = mediaAtual?.med_TotalUpload || 0;
    const percVendidas = totalUpload > 0 ? (totalFotos / totalUpload) * 100 : 0;

    // 4️⃣ Atualiza tb_Medias com novos valores
    const { error: errUpMedias } = await supabase
      .from('tb_Medias')
      .update({
        med_FotosVendidas: totalFotos,
        med_ValorTotal: totalValor,
        med_ValorMedio: valorMedio,
        med_PercFotosVend: percVendidas
      })
      .eq('med_Evento', ent_Evento);

    if (errUpMedias) throw errUpMedias;

    res.status(200).json({
      success: true,
      message: 'Entrada e médias atualizadas com sucesso',
      totalFotos,
      totalValor,
      valorMedio,
      percVendidas
    });
  } catch (err) {
    console.error('Erro ao atualizar entrada e médias:', err.message);
    res.status(500).json({ error: err.message });
  }
});
//=============================================
// Excluir Entrada
//=============================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    const { error } = await supabase
      .from('tb_Entrada')
      .delete()
      .eq('Id', id);

    if (error) {
      console.error("Erro ao excluir a entrada:", error.message);
      return res.status(500).json({ error: 'Erro ao excluir a entrada', details: error.message });
    }

    res.status(200).json({ message: 'Entrada excluída com sucesso!' });
  } catch (err) {
    console.error("Erro inesperado ao excluir a entrada:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao excluir a entrada', details: err.message });
  }
});
// ===================================
// Total Ano
// ===================================
router.get('/vendas-ano', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('vendas_total_ano');

    if (error) {
      console.error("Erro no RPC:", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json({ vendasAno: parseFloat(data) || 0 });

  } catch (err) {
    console.error("Falha interna:", err.message);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;