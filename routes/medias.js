// routes/media.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

//=============================================
// Listar Médias
//=============================================
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tb_Medias')
      .select(`
        Id,        
        med_TipoEvento,
        med_Plataforma,
        med_TotalUpload,
        med_FotosVendidas,
        med_ValorTotal,
        med_PercFotosVend,
        med_ValorMedio,
        med_MediaFotosPlat,
        med_ValorMedioPlat,
        med_Evento,
        tb_Agenda (ag_Evento)
      `)
      .order('Id', { ascending: false });

    if (error) {
      console.error("Erro ao buscar as médias:", error.message);
      return res.status(500).json({ error: 'Erro ao buscar as médias', details: error.message });
    }

    const response = (data || []).map(media => ({
      Id: media.Id,      
      med_TipoEvento: media.med_TipoEvento,
      med_Plataforma: media.med_Plataforma ,
      med_TotalUpload: media.med_TotalUpload ,        
      med_FotosVendidas: media.med_FotosVendidas ,
      med_ValorTotal: media.med_ValorTotal ,
      med_PercFotosVend: media.med_PercFotosVend ,
      med_ValorMedio: media.med_ValorMedio ,
      med_MediaFotosPlat: media.med_MediaFotosPlat ,
      med_ValorMedioPlat: media.med_ValorMedioPlat ,
      med_Evento: media.med_Evento,
      Evento: media.tb_Agenda?.ag_Evento || null,
    }));

    res.json(response);
  } catch (err) {
  console.error("Erro inesperado ao buscar as médias:", err);
  res.status(500).json({ error: 'Erro inesperado', details: err.message });
  }
});
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
      med_Evento,
      med_TipoEvento,
      med_Plataforma,
      med_TotalUpload,
      med_FotosVendidas,
      med_ValorTotal,
      med_PercFotosVend,
      med_ValorMedio,
      med_MediaFotosPlat,
      med_ValorMedioPlat
    } = req.body;

    // Inserção completa no Supabase
    const { data, error } = await supabase
      .from('tb_Medias')
      .insert([{
        med_Evento: med_Evento ? Number(med_Evento) : null,
        med_TipoEvento: med_TipoEvento || null,
        med_Plataforma: med_Plataforma || null,
        med_TotalUpload: med_TotalUpload ? Number(med_TotalUpload) : 0,
        med_FotosVendidas: med_FotosVendidas ? Number(med_FotosVendidas) : 0,
        med_ValorTotal: med_ValorTotal ? Number(String(med_ValorTotal).replace(',', '.')) : 0,
        med_PercFotosVend: med_PercFotosVend ? Number(String(med_PercFotosVend).replace(',', '.')) : 0,
        med_ValorMedio: med_ValorMedio ? Number(String(med_ValorMedio).replace(',', '.')) : 0,
        med_MediaFotosPlat: med_MediaFotosPlat ? Number(med_MediaFotosPlat) : 0,
        med_ValorMedioPlat: med_ValorMedioPlat ? Number(String(med_ValorMedioPlat).replace(',', '.')) : 0
      }])
      .select();

    if (error) {
      console.error('Erro ao inserir as médias:', error.message);
      return res.status(500).json({ error: 'Erro ao inserir as médias', details: error });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Erro inesperado ao inserir as médias:', err.message);
    res.status(500).json({ error: 'Erro inesperado ao inserir as médias', details: err.message });
  }
});
// ===================================
// PUT - Atualizar 
// ===================================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { med_MediaFotosPlat, med_ValorMedioPlat, med_TotalUpload } = req.body;

  try {
    // 1️⃣ Buscar o registro atual pra pegar fotos vendidas
    const { data: registro, error: errBusca } = await supabase
      .from('tb_Medias')
      .select('med_FotosVendidas')
      .eq('Id', id)
      .single();

    if (errBusca) throw new Error('Erro ao buscar registro: ' + errBusca.message);

    const fotosVendidas = registro?.med_FotosVendidas || 0;
    const totalUpload = med_TotalUpload ? Number(med_TotalUpload) : 0;
    const percVendidas = totalUpload > 0 ? (fotosVendidas / totalUpload) * 100 : 0;

    // 2️⃣ Atualizar dados + percentual recalculado
    const { error: errAtualiza } = await supabase
      .from('tb_Medias')
      .update({
        med_MediaFotosPlat: med_MediaFotosPlat ? Number(med_MediaFotosPlat) : null,
        med_ValorMedioPlat: med_ValorMedioPlat
          ? Number(String(med_ValorMedioPlat).replace(',', '.'))
          : null,
        med_TotalUpload: totalUpload,
        med_PercFotosVend: percVendidas
      })
      .eq('Id', id);

    if (errAtualiza) throw new Error('Erro ao atualizar médias: ' + errAtualiza.message);

    res.status(200).json({
      sucesso: true,
      mensagem: 'Campos atualizados e percentual recalculado com sucesso.',
      percVendidas
    });
  } catch (err) {
    console.error('Erro ao atualizar tb_Medias:', err.message);
    res.status(500).json({ erro: 'Erro ao atualizar médias.', detalhe: err.message });
  }
});
// =============================================
// Top 3 Meses
// =============================================
router.get("/top3_mes/:mes/:ano", async (req, res) => {
  try {
    const mes = parseInt(req.params.mes);
    const ano = parseInt(req.params.ano);

    const { data, error } = await supabase.rpc("top3_mes", { m: mes, y: ano });

    if (error) throw error;

    res.json({ top3: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// =============================================
// Top 3 Ano
// =============================================
router.get("/top3_ano/:ano", async (req, res) => {
  try {
    const ano = parseInt(req.params.ano);

    const { data, error } = await supabase.rpc("top3_ano", { y: ano });

    if (error) throw error;

    res.json({ top3: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;