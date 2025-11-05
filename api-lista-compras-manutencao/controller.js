import { Router } from 'express';
import db from './db.js';

const router = Router();

// ROTAS (ENDPOINTS)

//Rota 1: [GET] /itens
router.get('/itens', async (req, res) => {
  try {
    // A consulta retorna um objeto 'result'
    // Os dados (linhas) estão em 'result.rows'
    const result = await db.query('SELECT * FROM itens ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

//Rota 2: [GET] /itens/:id
router.get('/itens/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Usamos $1 como placeholder para o primeiro parâmetro
    const result = await db.query('SELECT * FROM itens WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar item:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

//Rota 3: [POST] /itens
router.post('/itens', async (req, res) => {
  try {
    const { nome_produto, quantidade, descricao } = req.body;

    if (!nome_produto) {
      return res.status(400).json({ message: 'O campo "_nome_produto" é obrigatório' });
    }

    // Placeholders $1, $2, $3
    // Usamos 'RETURNING *' para o Postgres nos devolver o item que acabou de ser criado
    const sql = 'INSERT INTO itens (nome_produto, quantidade, descricao) VALUES ($1, $2, $3) RETURNING *';
    const result = await db.query(sql, [nome_produto, quantidade, descricao]);

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Erro ao cadastrar item:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

 //Rota 4: [PUT] /itens/:id
router.put('/itens/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_produto, quantidade, descricao } = req.body;

    if (!nome_produto) {
      return res.status(400).json({ message: 'O campo "nome_produto" é obrigatório' });
    }

    const sql = 'UPDATE itens SET nome_produto = $1, quantidade = $2, descricao = $3 WHERE id = $4 RETURNING *';
    const result = await db.query(sql, [nome_produto, quantidade, descricao || null, id]);

    // O 'pg' nos dá 'rowCount' para saber quantas linhas foram afetadas
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }
    
    // Retorna o item atualizado (por conta do RETURNING *)
    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});


//Rota 5: [DELETE] /itens/:id
router.delete('/itens/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sql = 'DELETE FROM itens WHERE id = $1';
    const result = await db.query(sql, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }
    
    res.status(204).send();

  } catch (error) {
    console.error('Erro ao deletar item:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

//Rota 1: [POST] /cliente
router.post('/cliente', async (req, res) => {
  try {
    const { nome_cliente, email, telefone, data_nascimento } = req.body;

    if (!nome_cliente) {
      return res.status(400).json({ message: 'O campo "nome_cliente" é obrigatório' });
    }

    const sql = 'INSERT INTO cliente (nome_cliente, email, telefone, data_nascimento) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await db.query(sql, [nome_cliente, email, telefone, data_nascimento]);

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Rota 2: [GET] /cliente
router.get('/cliente', async (req, res) => {
  try {
    const sql = 'SELECT * FROM cliente ORDER BY id_cliente ASC';
    const result = await db.query(sql);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Rota 3: [GET] /cliente/:id
router.get('/cliente/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sql = 'SELECT * FROM cliente WHERE id_cliente = $1';
    const result = await db.query(sql, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Rota 4: [PUT] /cliente/:id
router.put('/cliente/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome_cliente, email, telefone, data_nascimento } = req.body;

    if (!nome_cliente) {
      return res.status(400).json({ message: 'O campo "nome_cliente" é obrigatório' });
    }

    const sql = `
      UPDATE cliente 
      SET nome_cliente = $1, email = $2, telefone = $3, data_nascimento = $4
      WHERE id_cliente = $5
      RETURNING *;
    `;
    const result = await db.query(sql, [nome_cliente, email, telefone, data_nascimento, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Rota 5: [DELETE] /cliente/:id
router.delete('/cliente/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sql = 'DELETE FROM cliente WHERE id_cliente = $1';
    const result = await db.query(sql, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});



export default router;