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
//=============================================
// Inserir Agenda
//=============================================
router.post('/', async (req, res) => {
  try {
    const {
      ag_TipoTrabalho
    } = req.body;

    // Insere no Supabase, aceitando nulos
    const { data, error } = await supabase
      .from('tb_Agenda')
      .insert([{
        ag_TipoTrabalho
      }])
      .select()
      .single(); // retorna um objeto

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
//=============================================
// Editar Agenda
//=============================================

//=============================================
// Excluir Agenda
//=============================================

module.exports = router;