# Trae TodoList

一个基于React + TypeScript + Express + MySQL的全栈待办事项应用。

## 功能特点

- ✨ 添加新的待办事项
- ✅ 标记待办事项为已完成/未完成
- 🗑️ 删除待办事项
- 💾 数据持久化存储
- 🎯 实时更新UI

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- CSS3

### 后端
- Node.js
- Express
- MySQL
- cors
- dotenv

## 项目结构

```
├── src/                # 前端源代码
│   ├── App.tsx        # 主应用组件
│   ├── App.css        # 应用样式
│   └── main.tsx       # 应用入口
├── server/            # 后端源代码
│   ├── index.js       # 服务器入口
│   └── .env          # 环境变量配置
└── package.json       # 项目依赖
```

## 快速开始

### 前置要求

- Node.js 16+
- MySQL 5.7+

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/suziewong/trae-todoList.git
cd trae-todoList
```

2. 安装前端依赖
```bash
npm install
```

3. 安装后端依赖
```bash
cd server
npm install
```

4. 配置数据库
- 在MySQL中创建一个新的数据库
- 复制`server/.env.example`为`server/.env`
- 修改`.env`文件中的数据库配置

### 运行项目

1. 启动后端服务
```bash
cd server
npm run dev
```

2. 启动前端开发服务器（新终端）
```bash
npm run dev
```

访问 http://localhost:5173 即可看到应用运行。

## 使用说明

1. 在输入框中输入待办事项内容，按回车或点击"添加"按钮添加新的待办事项
2. 点击待办事项前的复选框可以标记完成/未完成状态
3. 点击待办事项右侧的"删除"按钮可以删除该项

## 开发说明

- 前端开发文件位于`src`目录
- 后端API实现位于`server/index.js`
- 数据库表结构在服务器启动时自动创建

## 许可证

MIT
