import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from './api';
import { cable } from './cable';
import { Poll, Vote } from './types';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewPollPage from './NewPollPage';
import { Link } from 'react-router-dom';

function App() {
  const { id } = useParams(); 
  const [poll, setPoll] = useState<Poll | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get<Poll>(`/polls/${id}`).then((res) => setPoll(res.data));
  }, [id]);

  useEffect(() => {
    if (!poll) return;

    const subscription = cable.subscriptions.create(
      { channel: 'PollChannel', poll_id: poll.id },
      {
        received: (data: Vote) => {
          setPoll((prev) => {
            if (!prev) return prev;
            return { ...prev, votes: [...prev.votes, data] };
          });
        },
      }
    );

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, [poll?.id]);

  const handleVote = (option: string) => {
    if (!poll) return;
    api.post('/votes', {
      vote: { poll_id: poll.id, option },
    });
  };

  const getCount = (option: string) =>
    poll?.votes.filter((v) => v.option === option).length ?? 0;

  if (!poll) return <p>Завантаження...</p>;

  const uniqueOptions = Array.from(new Set(poll.votes.map((v) => v.option)));

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/">Назад до списку опитувань</Link> {/* Додай кнопку для повернення на головну сторінку */}
      <Link to={`/polls/${poll.id}/edit`}>Редагувати</Link>
      <h1>{poll.title}</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {uniqueOptions.map((option) => (
          <button key={option} onClick={() => handleVote(option)}>
            {option} ({getCount(option)})
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <Router>
      <Routes>
        <Route path="/polls/new" element={<NewPollPage />} />
      </Routes>
    </Router>
  );
}

export default App;
