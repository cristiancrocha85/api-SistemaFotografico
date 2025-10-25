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
        ent_Evento,
        ent_TipoEvento,
        ent_DataEvento,
        ent_Plataforma,
        ent_QtdFotosVendidas,
        ent_ValorTotal,
        ent_TipoPgto,
        ent_Status,
        ent_LiberarSaldo
      `)
      .order('ent_DataEntrada', { ascending: false })
      .order('Id', { ascending: false });

    if (error) {
      console.error("Erro ao buscar a entrada:", error.message);
      return res.status(500).json({ error: 'Erro ao buscar a entrada', details: error.message });
    }

    // Formata saída
    const response = (data || []).map(entrada => ({
      Id: entrada.Id,
      ent_DataEntrada: entrada.ent_DataEntrada,
      ent_Evento: entrada.ent_Evento,
      ent_TipoEvento: entrada.ent_TipoEvento,
      ent_DataEvento: entrada.ent_DataEvento,
      ent_Plataforma: entrada.ent_Plataforma,
      ent_QtdFotosVendidas: entrada.ent_QtdFotosVendidas,
      ent_ValorTotal: entrada.ent_ValorTotal,
      ent_TipoPgto: entrada.ent_TipoPgto,
      ent_Status: entrada.ent_Status,
      ent_LiberarSaldo: entrada.ent_LiberarSaldo

      //TipoEvento:agenda.tb_TipoEventos?.eve_TipoEvento || null,
      //Plataforma:agenda.tb_Plataforma?.plat_Plataforma || null,
    }));

    res.json(response);
  } catch (err) {
    console.error("Erro inesperado ao buscar a agenda:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao buscar a agenda', details: err.message });
  }
});

//tb_TipoEventos ( eve_TipoEvento ),
//tb_Plataforma ( plat_Plataforma )
// ===================================
// POST - Inserir Entrada
// ===================================

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