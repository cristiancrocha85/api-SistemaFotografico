// routes/agenda.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

//=============================================
// Listar Agenda
//=============================================
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tb_Agenda')
      .select(`
        Id,
        ag_Data,
        ag_Horario,
        ag_Evento,
        ag_Local,
        ag_DiasFaltantes,
        ag_Status,
        ag_Observacao,
        ag_Mes,
        ag_Ano,
        ag_Realizado,
        tb_TipoEventos ( eve_TipoEvento ),
        tb_Plataforma ( plat_Plataforma )
      `)
      .order('ag_Data', { ascending: false })
      .order('Id', { ascending: false });

    if (error) {
      console.error("Erro ao buscar a agenda:", error.message);
      return res.status(500).json({ error: 'Erro ao buscar a agenda', details: error.message });
    }

    // Formata saída
    const response = (data || []).map(agenda => ({
      Id: agenda.Id,
      ag_Data: agenda.ag_Data,
      ag_Horario: agenda.ag_Horario,
      ag_Evento: agenda.ag_Evento,
      ag_Local: agenda.ag_Local,
      ag_DiasFaltantes: agenda.ag_DiasFaltantes,
      ag_Status: agenda.ag_Status,
      ag_Observacao: agenda.ag_Observacao,
      ag_Mes: agenda.ag_Mes,
      ag_Ano: agenda.ag_Ano,
      ag_Realizado: agenda.ag_Realizado,
      TipoEvento:agenda.tb_TipoEventos?.eve_TipoEvento || null,
      Plataforma:agenda.tb_Plataforma?.plat_Plataforma || null,
    }));

    res.json(response);
  } catch (err) {
    console.error("Erro inesperado ao buscar a agenda:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao buscar a agenda', details: err.message });
  }
});
// ===================================
// POST - Inserir Agenda (com horário)
// ===================================
router.post('/', async (req, res) => {
  try {
    const {
      ag_TipoEvento,
      ag_Data,
      ag_Horario,
      ag_Evento,
      ag_Plataforma,
      ag_Local,
      ag_DiasFaltantes,
      ag_Status,
      ag_Observacao,
      ag_Mes,
      ag_Ano,
      ag_Realizado = false
    } = req.body;

    // Valida apenas o que é realmente obrigatório
    if (!ag_TipoEvento || isNaN(Number(ag_TipoEvento)) || Number(ag_TipoEvento) <= 0) {
      return res.status(400).json({ error: 'ag_TipoEvento é obrigatório e deve ser um ID válido.' });
    }

    // Define data padrão se não vier nada
    const dataEvento = ag_Data ? new Date(ag_Data) : new Date();
    const dataStr = dataEvento.toISOString().split('T')[0]; // YYYY-MM-DD

    // Horário — mantém formato simples, se não vier, deixa nulo
    const horarioStr = ag_Horario && ag_Horario.trim() !== '' ? ag_Horario : null;

    // Inserção mínima no Supabase
    const { data, error } = await supabase
      .from('tb_Agenda')
      .insert([{
        ag_TipoEvento: Number(ag_TipoEvento),
        ag_Data: dataStr,
        ag_Horario: horarioStr,
        ag_Evento: ag_Evento,
        ag_Plataforma: ag_Plataforma ? Number(ag_Plataforma) : null,
        ag_Local: ag_Local,
        ag_DiasFaltantes: ag_DiasFaltantes == null ? null : Number(ag_DiasFaltantes),
        ag_Status: ag_Status,
        ag_Observacao: ag_Observacao,
        ag_Mes: ag_Mes,
        ag_Ano: ag_Ano,
        ag_Realizado
      }])
      .select()
      .single(); // retorna apenas um objeto

    if (error) {
      console.error("Erro ao inserir a agenda:", error);
      return res.status(500).json({ error: 'Erro ao inserir a agenda', details: error });
    }

    res.status(201).json(data);

  } catch (err) {
    console.error("Erro inesperado ao inserir a agenda:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao inserir a agenda', details: err.message });
  }
});
// ============================================
// PUT - Atualizar eventos (dias faltantes / status)
// ============================================
router.put('/atualizar_eventos', async (req, res) => {
  try {
    const hojeSP = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const [dia, mes, ano] = hojeSP.split('/');
    const isoHojeSP = `${ano}-${mes}-${dia}`;

    const { data, error } = await supabase.rpc('atualizar_eventos', { hoje_param: isoHojeSP });

    if (error) {
      console.error('Erro Supabase:', error);
      return res.status(500).json({ success: false, error: error.message || error });
    }

    res.json({ success: true, message: 'Eventos atualizados com sucesso!', data });
  } catch (err) {
    console.error('Erro geral:', err);
    res.status(500).json({ success: false, error: 'Erro interno no servidor' });
  }
});
//=============================================
// Editar Agenda
//=============================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ag_TipoEvento,
      ag_Data,
      ag_Horario,
      ag_Evento,
      ag_Plataforma,
      ag_Local,
      ag_DiasFaltantes,
      ag_Status,
      ag_Observacao,
      ag_Mes,
      ag_Ano,
      ag_Realizado
    } = req.body;

    if (!id) return res.status(400).json({ error: 'ID é obrigatório.' });

    const dataEvento = ag_Data ? new Date(ag_Data) : new Date();
    const dataStr = dataEvento.toISOString().split('T')[0];
    const horarioStr = ag_Horario?.trim() || null;

    const { data, error } = await supabase
      .from('tb_Agenda')
      .update({
        ag_TipoEvento: Number(ag_TipoEvento),
        ag_Data: dataStr,
        ag_Horario: horarioStr,
        ag_Evento,
        ag_Plataforma: Number(ag_Plataforma),
        ag_Local,
        ag_DiasFaltantes: Number(ag_DiasFaltantes),
        ag_Status,
        ag_Observacao,
        ag_Mes,
        ag_Ano,
        ag_Realizado
      })
      .eq('Id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar agenda:', error);
      return res.status(500).json({ error: 'Erro ao atualizar agenda', details: error });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Erro geral:', err.message);
    res.status(500).json({ error: 'Erro interno no servidor', details: err.message });
  }
});
//=============================================
// Excluir Agenda
//=============================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    const { error } = await supabase
      .from('tb_Agenda')
      .delete()
      .eq('Id', id);

    if (error) {
      console.error("Erro ao excluir o evento da agenda:", error.message);
      return res.status(500).json({ error: 'Erro ao excluir o evento da agenda', details: error.message });
    }

    res.status(200).json({ message: 'Evento excluído com sucesso!' });
  } catch (err) {
    console.error("Erro inesperado ao excluir evento:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao excluir evento', details: err.message });
  }
});
module.exports = router;