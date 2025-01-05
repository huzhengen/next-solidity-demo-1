// app/api/courses/route.js
import db from '../../../lib/db.js';
import { v4 as uuidv4 } from 'uuid'; // 导入 UUID 生成函数

export async function POST (req) {
  const { name, description, price } = await req.json();

  if (!name) {
    return new Response(JSON.stringify({ message: 'Course name is required' }), { status: 400 });
  }

  try {
    // 生成 UUID
    const uuid = uuidv4();
    const stmt = db.prepare('INSERT INTO courses (uuid, name, description, price)  VALUES (?, ?, ?, ?)');
    const info = stmt.run(uuid, name, description, price);
    return new Response(JSON.stringify({ id: info.lastInsertRowid, uuid, name, description, price }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Database error' }), { status: 500 });
  }
}

export async function GET () {
  try {
    const stmt = db.prepare('SELECT * FROM courses');
    const courses = stmt.all();
    return new Response(JSON.stringify(courses), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Database error' }), { status: 500 });
  }
}

