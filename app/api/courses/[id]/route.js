// app/api/courses/[id]/route.js
import db from '../../../../lib/db.js';

export async function GET (req, { params }) {
  const { id } = await params

  try {
    // 查询数据库以获取课程详情
    const stmt = db.prepare('SELECT * FROM courses WHERE id = ?');
    const course = stmt.get(id);

    if (!course) {
      return new Response(JSON.stringify({ message: 'Course not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(course), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Database error' }), { status: 500 });
  }
}