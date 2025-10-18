// routes/eventos.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

//=============================================
// Listar eventos
//=============================================
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tb_TipoEventos')
      .select('Id, eve_TipoEvento')
      .order('Id', { ascending: true });

    if (error) {
      console.error("Erro ao buscar os eventos:", error.message);
      return res.status(500).json({
        error:'Erro ao buscar eventos cadastrados',
        details: error.message
      });
    }

    res.json(data || []);
  } catch (erro) {
    console.error("Erro inesperado:", erro.message);
    res.status(500).json({ 
      error: 'Erro ao buscar os eventos', 
      details: erro.message 
    });
  }
});
//=============================================
// Inserir Eventos
//=============================================
router.post('/', async (req, res) => {
  const { eve_TipoEvento } = req.body;

  try {
    const { data, error } = await supabase
      .from('tb_TipoEventos')
      .insert([{ eve_TipoEvento}])
      .select();

      if (error) {
      // erro de constraint UNIQUE
      if (error.code === '23505' || error.message.includes("duplicate key value")) {
        return res.status(400).json({ error: "Tipo evento já cadastrado" });
      }

       console.error("Erro no evento:", error.message);
       return res.status(500).json({ error: 'Erro ao inserir o tipo de evento', details: error.message });
    }

    res.status(201).json(data[0]);
  } catch (err) {
    console.error("Erro inesperado ao inserir o tipo de evento:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao inserir o tipo de evento', details: err.message });
  }
});
//=============================================
// Editar Eventos
//=============================================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { eve_TipoEvento } = req.body;

  try {
    const { data, error } = await supabase
      .from('tb_TipoEventos')
      .update({ eve_TipoEvento })
      .eq('Id', id)
      .select();

    if (error) {
      if (error.code === '23505' || error.message.includes("duplicate key value")) {
        return res.status(400).json({ error: "Tipo de evento já cadastrado" });
      }

      console.error("Erro ao editar o tipo de evento:", error.message);
      return res.status(500).json({ error: 'Erro ao editar o tipo de evento', details: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Tipo de evento não encontrado' });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    console.error("Erro inesperado ao editar o tipo de trabalho:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao editar o tipo de trabalho', details: err.message });
  }
});
//=============================================
// Excluir Eventos
//=============================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('tb_TipoEventos')
      .delete()
      .eq('Id', id);

    if (error) {
      console.error("Erro ao excluir o tipo de evento:", error.message);
      return res.status(500).json({ error: 'Erro ao excluir o tipo de evento', details: error.message });
    }

    // Retorna só o status e uma mensagem genérica
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erro inesperado ao excluir o tipo de evento:", err.message);
    return res.status(500).json({ error: 'Erro inesperado ao excluir o tipo de evento', details: err.message });
  }
});

module.exports = router;