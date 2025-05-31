import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from './api';
import { Poll } from './types';

function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    api.get<Poll[]>('/polls').then((res) => setPolls(res.data));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/polls/new">+ Створити нове голосування</Link>
      <h1>Список опитувань</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Назва</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Кількість голосів</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Перейти</th>
          </tr>
        </thead>
        <tbody>
          {polls.map((poll) => (
            <tr key={poll.id}>
              <td>{poll.title}</td>
              <td>{poll.votes.length}</td>
              <td>
                <Link to={`/polls/${poll.id}`}>Переглянути</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
