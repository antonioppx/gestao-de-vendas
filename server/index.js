const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar banco de dados
const db = new sqlite3.Database('./vendas.db');

// Criar tabelas
db.serialize(() => {
  // Tabela de equipes
  db.run(`CREATE TABLE IF NOT EXISTS equipes (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabela de vendedores
  db.run(`CREATE TABLE IF NOT EXISTS vendedores (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    equipe_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipe_id) REFERENCES equipes (id)
  )`);

  // Tabela de vendas
  db.run(`CREATE TABLE IF NOT EXISTS vendas (
    id TEXT PRIMARY KEY,
    valor REAL NOT NULL,
    vendedor_id TEXT NOT NULL,
    equipe_id TEXT NOT NULL,
    data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
    descricao TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendedor_id) REFERENCES vendedores (id),
    FOREIGN KEY (equipe_id) REFERENCES equipes (id)
  )`);

  // Inserir dados de exemplo
  const equipes = [
    { id: 'eq1', nome: 'Equipe Norte' },
    { id: 'eq2', nome: 'Equipe Sul' },
    { id: 'eq3', nome: 'Equipe Leste' }
  ];

  const vendedores = [
    { id: 'v1', nome: 'João Silva', equipe_id: 'eq1' },
    { id: 'v2', nome: 'Maria Santos', equipe_id: 'eq1' },
    { id: 'v3', nome: 'Pedro Costa', equipe_id: 'eq2' },
    { id: 'v4', nome: 'Ana Oliveira', equipe_id: 'eq2' },
    { id: 'v5', nome: 'Carlos Lima', equipe_id: 'eq3' }
  ];

  equipes.forEach(equipe => {
    db.run('INSERT OR IGNORE INTO equipes (id, nome) VALUES (?, ?)', [equipe.id, equipe.nome]);
  });

  vendedores.forEach(vendedor => {
    db.run('INSERT OR IGNORE INTO vendedores (id, nome, equipe_id) VALUES (?, ?, ?)', 
      [vendedor.id, vendedor.nome, vendedor.equipe_id]);
  });
});

// Rotas da API

// 1. Adicionar nova venda
app.post('/api/vendas', (req, res) => {
  const { valor, vendedor_id, equipe_id, descricao } = req.body;
  const id = uuidv4();
  
  if (!valor || !vendedor_id || !equipe_id) {
    return res.status(400).json({ error: 'Valor, vendedor e equipe são obrigatórios' });
  }

  db.run(
    'INSERT INTO vendas (id, valor, vendedor_id, equipe_id, descricao) VALUES (?, ?, ?, ?, ?)',
    [id, valor, vendedor_id, equipe_id, descricao],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id, message: 'Venda registrada com sucesso' });
    }
  );
});

// 2. Vendas do dia
app.get('/api/vendas/dia', (req, res) => {
  const hoje = moment().format('YYYY-MM-DD');
  
  db.all(`
    SELECT v.*, vd.nome as vendedor_nome, e.nome as equipe_nome
    FROM vendas v
    JOIN vendedores vd ON v.vendedor_id = vd.id
    JOIN equipes e ON v.equipe_id = e.id
    WHERE DATE(v.data_venda) = ?
    ORDER BY v.data_venda DESC
  `, [hoje], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const total = rows.reduce((sum, row) => sum + row.valor, 0);
    res.json({ vendas: rows, total, quantidade: rows.length });
  });
});

// 3. Vendas da semana
app.get('/api/vendas/semana', (req, res) => {
  const inicioSemana = moment().startOf('week').format('YYYY-MM-DD');
  const fimSemana = moment().endOf('week').format('YYYY-MM-DD');
  
  db.all(`
    SELECT v.*, vd.nome as vendedor_nome, e.nome as equipe_nome
    FROM vendas v
    JOIN vendedores vd ON v.vendedor_id = vd.id
    JOIN equipes e ON v.equipe_id = e.id
    WHERE DATE(v.data_venda) BETWEEN ? AND ?
    ORDER BY v.data_venda DESC
  `, [inicioSemana, fimSemana], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const total = rows.reduce((sum, row) => sum + row.valor, 0);
    res.json({ vendas: rows, total, quantidade: rows.length });
  });
});

// 4. Vendas da quinzena
app.get('/api/vendas/quinzena', (req, res) => {
  const hoje = moment();
  const inicioQuinzena = hoje.clone().subtract(15, 'days').format('YYYY-MM-DD');
  const fimQuinzena = hoje.format('YYYY-MM-DD');
  
  db.all(`
    SELECT v.*, vd.nome as vendedor_nome, e.nome as equipe_nome
    FROM vendas v
    JOIN vendedores vd ON v.vendedor_id = vd.id
    JOIN equipes e ON v.equipe_id = e.id
    WHERE DATE(v.data_venda) BETWEEN ? AND ?
    ORDER BY v.data_venda DESC
  `, [inicioQuinzena, fimQuinzena], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const total = rows.reduce((sum, row) => sum + row.valor, 0);
    res.json({ vendas: rows, total, quantidade: rows.length });
  });
});

// 5. Projeção quinzena
app.get('/api/projecao/quinzena', (req, res) => {
  const hoje = moment();
  const inicioQuinzena = hoje.clone().subtract(15, 'days').format('YYYY-MM-DD');
  const fimQuinzena = hoje.format('YYYY-MM-DD');
  
  db.get(`
    SELECT SUM(valor) as total
    FROM vendas
    WHERE DATE(data_venda) BETWEEN ? AND ?
  `, [inicioQuinzena, fimQuinzena], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const mediaDiaria = (row.total || 0) / 15;
    const projecaoQuinzena = mediaDiaria * 15;
    
    res.json({ 
      mediaDiaria, 
      projecaoQuinzena,
      vendasAtuais: row.total || 0
    });
  });
});

// 6. Projeção mês
app.get('/api/projecao/mes', (req, res) => {
  const hoje = moment();
  const inicioMes = hoje.clone().startOf('month').format('YYYY-MM-DD');
  const fimMes = hoje.format('YYYY-MM-DD');
  
  db.get(`
    SELECT SUM(valor) as total
    FROM vendas
    WHERE DATE(data_venda) BETWEEN ? AND ?
  `, [inicioMes, fimMes], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const diasPassados = hoje.diff(moment().startOf('month'), 'days') + 1;
    const mediaDiaria = (row.total || 0) / diasPassados;
    const projecaoMes = mediaDiaria * moment().daysInMonth();
    
    res.json({ 
      mediaDiaria, 
      projecaoMes,
      vendasAtuais: row.total || 0,
      diasPassados,
      diasNoMes: moment().daysInMonth()
    });
  });
});

// 7. Vendas por equipe
app.get('/api/vendas/equipe', (req, res) => {
  const { periodo } = req.query;
  let whereClause = '';
  let params = [];
  
  if (periodo === 'dia') {
    const hoje = moment().format('YYYY-MM-DD');
    whereClause = 'WHERE DATE(v.data_venda) = ?';
    params = [hoje];
  } else if (periodo === 'semana') {
    const inicioSemana = moment().startOf('week').format('YYYY-MM-DD');
    const fimSemana = moment().endOf('week').format('YYYY-MM-DD');
    whereClause = 'WHERE DATE(v.data_venda) BETWEEN ? AND ?';
    params = [inicioSemana, fimSemana];
  } else if (periodo === 'mes') {
    const inicioMes = moment().startOf('month').format('YYYY-MM-DD');
    const fimMes = moment().endOf('month').format('YYYY-MM-DD');
    whereClause = 'WHERE DATE(v.data_venda) BETWEEN ? AND ?';
    params = [inicioMes, fimMes];
  }
  
  db.all(`
    SELECT 
      e.id,
      e.nome as equipe_nome,
      COUNT(v.id) as quantidade_vendas,
      SUM(v.valor) as total_vendas,
      AVG(v.valor) as media_venda
    FROM equipes e
    LEFT JOIN vendas v ON e.id = v.equipe_id
    ${whereClause}
    GROUP BY e.id, e.nome
    ORDER BY total_vendas DESC
  `, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json(rows);
  });
});

// 8. Vendas por vendedor
app.get('/api/vendas/vendedor', (req, res) => {
  const { periodo } = req.query;
  let whereClause = '';
  let params = [];
  
  if (periodo === 'dia') {
    const hoje = moment().format('YYYY-MM-DD');
    whereClause = 'WHERE DATE(v.data_venda) = ?';
    params = [hoje];
  } else if (periodo === 'semana') {
    const inicioSemana = moment().startOf('week').format('YYYY-MM-DD');
    const fimSemana = moment().endOf('week').format('YYYY-MM-DD');
    whereClause = 'WHERE DATE(v.data_venda) BETWEEN ? AND ?';
    params = [inicioSemana, fimSemana];
  } else if (periodo === 'mes') {
    const inicioMes = moment().startOf('month').format('YYYY-MM-DD');
    const fimMes = moment().endOf('month').format('YYYY-MM-DD');
    whereClause = 'WHERE DATE(v.data_venda) BETWEEN ? AND ?';
    params = [inicioMes, fimMes];
  }
  
  db.all(`
    SELECT 
      vd.id,
      vd.nome as vendedor_nome,
      e.nome as equipe_nome,
      COUNT(v.id) as quantidade_vendas,
      SUM(v.valor) as total_vendas,
      AVG(v.valor) as media_venda
    FROM vendedores vd
    LEFT JOIN equipes e ON vd.equipe_id = e.id
    LEFT JOIN vendas v ON vd.id = v.vendedor_id
    ${whereClause}
    GROUP BY vd.id, vd.nome, e.nome
    ORDER BY total_vendas DESC
  `, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json(rows);
  });
});

// 9. Listar equipes
app.get('/api/equipes', (req, res) => {
  db.all('SELECT * FROM equipes ORDER BY nome', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 10. Listar vendedores
app.get('/api/vendedores', (req, res) => {
  db.all(`
    SELECT v.*, e.nome as equipe_nome
    FROM vendedores v
    LEFT JOIN equipes e ON v.equipe_id = e.id
    ORDER BY v.nome
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 11. Adicionar dados de exemplo
app.post('/api/seed', (req, res) => {
  const vendas = [
    { valor: 1500, vendedor_id: 'v1', equipe_id: 'eq1', descricao: 'Venda de produto A' },
    { valor: 2300, vendedor_id: 'v2', equipe_id: 'eq1', descricao: 'Venda de produto B' },
    { valor: 1800, vendedor_id: 'v3', equipe_id: 'eq2', descricao: 'Venda de produto C' },
    { valor: 3200, vendedor_id: 'v4', equipe_id: 'eq2', descricao: 'Venda de produto D' },
    { valor: 2100, vendedor_id: 'v5', equipe_id: 'eq3', descricao: 'Venda de produto E' },
    { valor: 2800, vendedor_id: 'v1', equipe_id: 'eq1', descricao: 'Venda de produto F' },
    { valor: 1900, vendedor_id: 'v2', equipe_id: 'eq1', descricao: 'Venda de produto G' },
    { valor: 2500, vendedor_id: 'v3', equipe_id: 'eq2', descricao: 'Venda de produto H' }
  ];

  const stmt = db.prepare('INSERT INTO vendas (id, valor, vendedor_id, equipe_id, descricao) VALUES (?, ?, ?, ?, ?)');
  
  vendas.forEach(venda => {
    const id = uuidv4();
    const dataVenda = moment().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD HH:mm:ss');
    
    db.run('INSERT INTO vendas (id, valor, vendedor_id, equipe_id, descricao, data_venda) VALUES (?, ?, ?, ?, ?, ?)',
      [id, venda.valor, venda.vendedor_id, venda.equipe_id, venda.descricao, dataVenda]);
  });

  res.json({ message: 'Dados de exemplo adicionados com sucesso' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
