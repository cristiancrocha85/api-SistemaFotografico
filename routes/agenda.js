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
// POST - Inserir Agenda
// ===================================
router.post('/', async (req, res) => {
  try {
    let { ag_TipoTrabalho, ag_Data } = req.body;

    // Garante que ag_TipoTrabalho seja número válido
    ag_TipoTrabalho = Number(ag_TipoTrabalho);
    if (!ag_TipoTrabalho || isNaN(ag_TipoTrabalho) || ag_TipoTrabalho <= 0) {
      return res.status(400).json({ error: "ag_TipoTrabalho é obrigatório e deve ser um ID válido" });
    }

    // Define a data, se não veio usa hoje
    let dataEvento;
    if (ag_Data) {
      dataEvento = new Date(ag_Data);
      if (isNaN(dataEvento.getTime())) { // verifica data inválida
        return res.status(400).json({ error: "ag_Data inválida" });
      }
    } else {
      dataEvento = new Date();
    }

    // Insere no Supabase
    const { data, error } = await supabase
      .from('tb_Agenda')
      .insert([{
        ag_TipoTrabalho: ag_TipoTrabalho,
        ag_Data: dataEvento.toISOString().split('T')[0] // envia só a data em formato 'YYYY-MM-DD'
      }])
      .select()
      .single();

    if (error) {
      console.error("Erro ao inserir a agenda:", error);
      return res.status(500).json({ error: 'Erro ao inserir a agenda', details: error });
    }

    res.status(201).json(data);

  } catch (err) {
    console.error("Erro inesperado ao inserir a agenda:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao inserir a agenda', details: err.message });
  }
});// ===================================
// POST - Inserir Agenda (por partes)
// ===================================
router.post('/', async (req, res) => {
  try {
    const {
      ag_TipoTrabalho,
      ag_Data
    } = req.body;

    // Apenas valida o que é obrigatório por enquanto
    if (!ag_TipoTrabalho || isNaN(Number(ag_TipoTrabalho)) || Number(ag_TipoTrabalho) <= 0) {
      return res.status(400).json({ error: 'ag_TipoTrabalho é obrigatório e deve ser um ID válido.' });
    }

    // Insere no Supabase, aceitando nulos
    const { data, error } = await supabase
      .from('tb_Agenda')
      .insert([{
        ag_TipoTrabalho: Number(ag_TipoTrabalho),
        ag_Data: ag_Data ? new Date(ag_Data) : new Date()
        // os outros campos podem ficar nulos
      }])
      .select()
      .single(); // retorna um objeto

    if (error) {
      console.error("Erro ao inserir a agenda:", error.message || error);
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