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
        tb_Trabalhos ( trab_Trabalhos ),
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
      Trabalho:agenda.tb_Trabalhos?.trab_Trabalhos || null,
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
      ag_TipoTrabalho,
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
    } = req.body;

    // Valida apenas o que é realmente obrigatório
    if (!ag_TipoTrabalho || isNaN(Number(ag_TipoTrabalho)) || Number(ag_TipoTrabalho) <= 0) {
      return res.status(400).json({ error: 'ag_TipoTrabalho é obrigatório e deve ser um ID válido.' });
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
        ag_TipoTrabalho: Number(ag_TipoTrabalho),
        ag_Data: dataStr,
        ag_Horario: horarioStr,
        ag_Evento: ag_Evento,
        ag_Plataforma: ag_Plataforma ? Number(ag_Plataforma) : null,
        ag_Local: ag_Local,
        ag_DiasFaltantes: ag_DiasFaltantes ? Number(ag_DiasFaltantes) : null,
        ag_Status: ag_Status,
        ag_Observacao: ag_Observacao,
        ag_Mes: ag_Mes,
        ag_Ano: ag_Ano
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
      ag_TipoTrabalho,
      ag_Data,
      ag_Horario,
      ag_Evento,
      ag_Plataforma,
      ag_Local,
      ag_DiasFaltantes,
      ag_Status,
      ag_Observacao,
      ag_Mes,
      ag_Ano
    } = req.body;

    if (!id) return res.status(400).json({ error: 'ID é obrigatório.' });

    const dataEvento = ag_Data ? new Date(ag_Data) : new Date();
    const dataStr = dataEvento.toISOString().split('T')[0];
    const horarioStr = ag_Horario?.trim() || null;

    const { data, error } = await supabase
      .from('tb_Agenda')
      .update({
        ag_TipoTrabalho: Number(ag_TipoTrabalho),
        ag_Data: dataStr,
        ag_Horario: horarioStr,
        ag_Evento,
        ag_Plataforma: Number(ag_Plataforma),
        ag_Local,
        ag_DiasFaltantes: Number(ag_DiasFaltantes),
        ag_Status,
        ag_Observacao,
        ag_Mes,
        ag_Ano
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


module.exports = router;