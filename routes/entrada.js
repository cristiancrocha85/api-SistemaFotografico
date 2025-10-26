// routes/agenda.js
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
// POST - Inserir Entrada
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
      /*ent_TipoPgto,
      ent_Status,
      ent_LiberarSaldo,
      ent_DataPrevista,
      ent_Mes,
      ent_Ano*/
    } = req.body;

    // Função utilitária para converter qualquer formato de data em YYYY-MM-DD
    const formatarData = (valor) => {
      if (!valor) return null;
      const data = new Date(valor);
      if (isNaN(data)) return null; // evita erro se vier formato inválido
      return data.toISOString().split('T')[0];
    };

    // Prepara todas as datas formatadas
    const dataEntrada = formatarData(ent_DataEntrada) || formatarData(new Date());
    const dataEvento = formatarData(ent_DataEvento);
    //const dataPrevista = formatarData(ent_DataPrevista);

    // Monta objeto final a ser inserido
    const novaEntrada = {
      ent_DataEntrada: dataEntrada,
      ent_Evento: ent_Evento ? Number(ent_Evento) : null,
      ent_TipoEvento,
      ent_DataEvento: dataEvento,
      ent_Plataforma,
      ent_QtdFotosVendidas: ent_QtdFotosVendidas ? Number(ent_QtdFotosVendidas) : 0,
      ent_ValorTotal: ent_ValorTotal ? Number(String(ent_ValorTotal).replace(',', '.'))
        : 0,
      /*ent_TipoPgto,
      ent_Status,
      ent_LiberarSaldo,
      ent_DataPrevista: dataPrevista,
      ent_Mes,
      ent_Ano*/
    };

    // Insere no Supabase
    const { data, error } = await supabase
      .from('tb_Entrada')
      .insert([novaEntrada])
      .select()
      .single();

    if (error) {
      console.error("Erro ao inserir a entrada:", error.message);
      return res.status(500).json({
        error: 'Erro ao inserir a entrada',
        details: error.message
      });
    }

    res.status(201).json(data);

  } catch (err) {
    console.error("Erro inesperado ao inserir a entrada:", err.message);
    res.status(500).json({
      error: 'Erro inesperado ao inserir a entrada',
      details: err.message
    });
  }
});

/*router.post('/', async (req, res) => {
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

    // Define data padrão se não vier nada
    const dataEntrada = ent_DataEntrada? new Date(ent_DataEntrada) : new Date();
    const dataStr = dataEntrada.toISOString().split('T')[0]; // YYYY-MM-DD

    // Inserção mínima no Supabase
    const { data, error } = await supabase
      .from('tb_Entrada')
      .insert([{
        ent_DataEntrada: dataStr,
        ent_Evento: Number(ent_Evento),
        ent_TipoEvento: ent_TipoEvento,
        ent_DataEvento: ent_DataEvento,
        ent_Plataforma: ent_Plataforma,
        ent_QtdFotosVendidas: ent_QtdFotosVendidas,
        ent_ValorTotal,
        ent_TipoPgto: ent_TipoPgto,
        ent_Status: ent_Status,
        ent_LiberarSaldo:ent_LiberarSaldo,
        ent_DataPrevista: ent_DataPrevista,
        ent_Mes: ent_Mes,
        ent_Ano:ent_Ano
      }])
      .select()
      .single(); // retorna apenas um objeto

    if (error) {
      console.error("Erro ao inserir a entrada:", error);
      return res.status(500).json({ error: 'Erro ao inserir a entrada', details: error });
    }

    res.status(201).json(data);

  } catch (err) {
    console.error("Erro inesperado ao inserir a entrada:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao inserir a entrada', details: err.message });
  }
});*/
// ============================================
// PUT - Atualizar entrada
// ============================================

//=============================================
// Editar Entrada
//=============================================

//=============================================
// Excluir Entrada
//=============================================

module.exports = router;