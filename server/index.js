import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 创建初始连接池（不指定数据库）
let pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// 初始化数据库函数
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // 创建数据库
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`);
    connection.release();

    // 重新配置连接池以包含数据库
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    // 获取新的连接并创建表
    const newConnection = await pool.getConnection();
    await newConnection.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id BIGINT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 检查是否有数据
    const [rows] = await newConnection.query('SELECT COUNT(*) as count FROM todos');
    
    // 如果没有数据，插入示例数据
    if (rows[0].count === 0) {
      await newConnection.query(`
        INSERT INTO todos (id, title, completed) VALUES 
        (1, '完成项目初始化', true),
        (2, '实现前端界面', false),
        (3, '编写API文档', false),
        (4, '部署应用', false)
      `);
      console.log('示例数据初始化成功');
    }

    newConnection.release();
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