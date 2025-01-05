// resetDb.js
const Database = require('better-sqlite3');
const path = require('path');

// 获取数据库文件的绝对路径
const dbPath = path.resolve('database/database.sqlite');
const db = new Database(dbPath);

console.log('删除 courses 表（如果存在）');

// 删除 courses 表（如果存在）
db.exec('DROP TABLE IF EXISTS courses');

// 创建 courses 表
db.exec(`
   CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL UNIQUE,
    price INTEGER NOT NULL,
    description TEXT NOT NULL,
    name TEXT NOT NULL
  );
`);
