// routes/salario.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

//=============================================
// Listar salário
//=============================================
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tb_Salario')
      .select(`
        Id,
        sal_TipoPgto,
        sal_Valor,        
        sal_Plataforma,
        sal_Mes,
        sal_Ano
      `)
      .order('Id', { ascending: false });

    if (error) {
      console.error("Erro ao buscar salário:", error.message);
      return res.status(500).json({ error: 'Erro ao buscar o salário', details: error.message });
    }

    // Formata saída
    const response = (data || []).map(salario => ({
      Id: salario.Id,
      sal_TipoPgto: salario.sal_TipoPgto,
      sal_Valor: salario.sal_Valor,
      sal_Plataforma: salario.sal_Plataforma,
      sal_Mes: salario.sal_Mes,
      sal_Ano: salario.sal_Ano
    }));

    res.json(response);
  } catch (err) {
    console.error("Erro inesperado ao buscar o salário:", err.message);
    res.status(500).json({ error: 'Erro inesperado ao buscar o salário', details: err.message });
  }
});
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
// Editar Salário / Plataforma
//=============================================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    sal_TipoPgto,
    sal_Valor,
    sal_Plataforma,
    sal_Mes,
    sal_Ano
  } = req.body;

  // Guard clause – sem payload, sem jogo
  if (
    !sal_TipoPgto ||
    sal_Valor === undefined ||
    !sal_Plataforma ||
    !sal_Mes ||
    !sal_Ano
  ) {
    return res.status(400).json({ error: 'Dados obrigatórios não informados' });
  }

  try {
    const { data, error } = await supabase
      .from('tb_Salario')
      .update({
        sal_TipoPgto,
        sal_Valor,
        sal_Plataforma,
        sal_Mes,
        sal_Ano
      })
      .eq('Id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao editar salário:', error.message);
      return res.status(500).json({
        error: 'Erro ao editar salário',
        details: error.message
      });
    }

    if (!data) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error('Erro inesperado:', err.message);
    res.status(500).json({
      error: 'Erro inesperado',
      details: err.message
    });
  }
});

//=============================================
// Excluir Plataforma
//=============================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('tb_Salario')
      .delete()
      .eq('Id', id);

    if (error) {
      console.error("Erro ao excluir o dado:", error.message);
      return res.status(500).json({ error: 'Erro ao excluir o dado', details: error.message });
    }

    // Retorna só o status e uma mensagem genérica
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erro inesperado ao excluir o dado:", err.message);
    return res.status(500).json({ error: 'Erro inesperado ao excluir o dado', details: err.message });
  }
});

module.exports = router;