// routes/trabalhos.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

//=============================================
// Listar trabalhos
//=============================================
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tb_Trabalhos')
      .select('Id, trab_Trabalhos')
      .order('Id', { ascending: true });

    if (error) {
      console.error("Erro ao buscar os trabalhos:", error.message);
      return res.status(500).json({
        error:'Erro ao buscar trabalhos cadastrados',
        details: error.message
      });
    }

    res.json(data || []);
  } catch (erro) {
    console.error("Erro inesperado:", erro.message);
    res.status(500).json({ 
      error: 'Erro ao buscar os trabalhos', 
      details: erro.message 
    });
  }
});
//=============================================
// Inserir Trabalhos
//=============================================
router.post('/', async (req, res) => {
  const { trab_Trabalhos } = req.body;

  try {
    const { data, error } = await supabase
      .from('tb_Trabalhos')
      .insert([{ trab_Trabalhos}])
      .select();

      if (error) {
      // erro de constraint UNIQUE
      if (error.code === '23505' || error.message.includes("duplicate key value")) {
        return res.status(400).json({ error: "Trabalho já cadastrado" });
      }

       console.error("Erro no trabalho:", error.message);
       return res.status(500).json({ error: 'Erro ao inserir o trabalho', details: error.message });
    }

    res.status(201).json(data[0]);
  } catch (err) {
    console.error("Erro inesperado ao inserir o trabalho:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao inserir o trabalho', details: err.message });
  }
});
//=============================================
// Editar Trabalhos
//=============================================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { trab_Trabalhos } = req.body;

  try {
    const { data, error } = await supabase
      .from('tb_Trabalhos')
      .update({ trab_Trabalhos })
      .eq('Id', id)
      .select();

    if (error) {
      if (error.code === '23505' || error.message.includes("duplicate key value")) {
        return res.status(400).json({ error: "Trabalho já cadastrado" });
      }

      console.error("Erro ao editar o trabalho:", error.message);
      return res.status(500).json({ error: 'Erro ao editar o trabalho', details: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Trabalho não encontrado' });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    console.error("Erro inesperado ao editar o trabalho:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao editar o trabalho', details: err.message });
  }
});
//=============================================
// Excluir Trabalhos
//=============================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('tb_Trabalhos')
      .delete()
      .eq('Id', id);

    if (error) {
      console.error("Erro ao excluir o trabalho:", error.message);
      return res.status(500).json({ error: 'Erro ao excluir o trabalho', details: error.message });
    }

    // Retorna só o status e uma mensagem genérica
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erro inesperado ao excluir o trabalho:", err.message);
    return res.status(500).json({ error: 'Erro inesperado ao excluir o trabalho', details: err.message });
  }
});

module.exports = router;