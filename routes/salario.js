// routes/salario.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

//=============================================
// Listar Salario
//=============================================
/*router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tb_Plataforma')
      .select('Id, plat_Plataforma')
      .order('Id', { ascending: true });

    if (error) {
      console.error("Erro ao buscar as plataformas:", error.message);
      return res.status(500).json({
        error:'Erro ao buscar plataformas cadastradas',
        details: error.message
      });
    }

    res.json(data || []);
  } catch (erro) {
    console.error("Erro inesperado:", erro.message);
    res.status(500).json({ 
      error: 'Erro ao buscar as categorias', 
      details: erro.message 
    });
  }
});*/
//=============================================
// Inserir Salario
//=============================================
router.post('/', async (req, res) => {
  const {
    sal_TipoPgto,
    sal_Valor,
    sal_Plataforma,
    sal_Mes,
    sal_Ano
  } = req.body;

  try {
    const { data, error } = await supabase
      .from('tb_Salario')
      .insert([{
        sal_TipoPgto,
        sal_Valor,
        sal_Plataforma,
        sal_Mes,
        sal_Ano
      }])
      .select();

    if (error) {
      console.error("Erro ao inserir salário:", error.message);
      return res.status(500).json({
        error: 'Erro ao inserir salário',
        details: error.message
      });
    }

    res.status(201).json(data[0]);

  } catch (err) {
    console.error("Erro inesperado ao inserir salário:", err.message);
    res.status(500).json({
      error: 'Erro inesperado',
      details: err.message
    });
  }
});

//=============================================
// Editar Plataformas
//=============================================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { plat_Plataforma } = req.body;

  try {
    const { data, error } = await supabase
      .from('tb_Plataforma')
      .update({ plat_Plataforma })
      .eq('Id', id)
      .select();

    if (error) {
      if (error.code === '23505' || error.message.includes("duplicate key value")) {
        return res.status(400).json({ error: "Plataforma já cadastrada" });
      }

      console.error("Erro ao editar a plataforma:", error.message);
      return res.status(500).json({ error: 'Erro ao editar a plataforma', details: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Plataforma não encontrada' });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    console.error("Erro inesperado ao editar a plataforma:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao editar a plataforma', details: err.message });
  }
});
//=============================================
// Excluir Plataforma
//=============================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('tb_Plataforma')
      .delete()
      .eq('Id', id);

    if (error) {
      console.error("Erro ao excluir a plataforma:", error.message);
      return res.status(500).json({ error: 'Erro ao excluir a plataforma', details: error.message });
    }

    // Retorna só o status e uma mensagem genérica
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erro inesperado ao excluir a plataforma:", err.message);
    return res.status(500).json({ error: 'Erro inesperado ao excluir a plataforma', details: err.message });
  }
});

module.exports = router;