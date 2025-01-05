// lib/db.js
import Database from 'better-sqlite3';
import path from 'path';

// 获取数据库文件的绝对路径
const dbPath = path.resolve('database/database.sqlite');
const db = new Database(dbPath);

// 创建 courses 表（如果不存在）
db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    price INTEGER NOT NULL,
    description TEXT NOT NULL,
    name TEXT NOT NULL
  );
`);

export default db;