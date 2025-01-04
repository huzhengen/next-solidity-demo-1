// app/api/courses/route.js
import db from '../../../lib/db.js';

export async function POST (req) {
  const { name, description, price } = await req.json();

  if (!name) {
    return new Response(JSON.stringify({ message: 'Course name is required' }), { status: 400 });
  }

  try {
    const stmt = db.prepare('INSERT INTO courses (name, description, price)  VALUES (?, ?, ?)');
    const info = stmt.run(name, description, price);
    return new Response(JSON.stringify({ id: info.lastInsertRowid, name, description, price }), { status: 201 });
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

 