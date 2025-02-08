import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// 创建todos表
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id BIGINT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false
      )
    `);
    connection.release();
    console.log('数据库初始化成功');
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

// 获取所有待办事项
app.get('/api/todos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM todos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: '获取待办事项失败' });
  }
});

// 添加待办事项
app.post('/api/todos', async (req, res) => {
  //debugger; // 在这里设置断点
  const { id, title } = req.body;
  try {
    await pool.query('INSERT INTO todos (id, title) VALUES (?, ?)', [id, title]);
    res.status(201).json({ message: '添加成功' });
  } catch (error) {
    res.status(500).json({ error: '添加待办事项失败' });
  }
});

// 更新待办事项状态
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    await pool.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id]);
    res.json({ message: '更新成功' });
  } catch (error) {
    res.status(500).json({ error: '更新待办事项失败' });
  }
});

// 删除待办事项
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除待办事项失败' });
  }
});

// 初始化数据库并启动服务器
initDatabase().then(() => {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
  });
});