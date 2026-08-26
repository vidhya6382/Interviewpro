import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getQuestions } from '../api/api';

export default function CodingSection() {
  const [qs, setQs] = useState([]);

  useEffect(() => {
    getQuestions().then(r => {
      const data = Array.isArray(r.data) ? r.data : r.data.results || [];
      setQs(data.slice(0, 100));
    }).catch(e => console.log(e));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      {qs.map((q, i) => (
        <div key={q.slug} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}>
          <div>
            <b>{String(i + 1).padStart(2, '0')}</b> {q.title} - {q.difficulty}
          </div>
          <Link to={`/solve/${q.slug}`} style={{ background: 'black', color: 'white', padding: '6px 16px', borderRadius: 20, textDecoration: 'none' }}>
            Solve →
          </Link>
        </div>
      ))}
    </div>
  );
}