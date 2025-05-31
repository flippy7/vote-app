// src/pages/EditPollPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from './api';   

export default function EditPollPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  api.get(`/polls/${id}`).then((res) => {
    setTitle(res.data.title || '');

    // Витягуємо лише унікальні варіанти відповіді з голосів
    const uniqueOptions = Array.from(
      new Set(res.data.votes.map((v: any) => v.option))
    );

    setOptions(uniqueOptions);
    setLoading(false);
  });
}, [id]);

  const updateOption = (index: number, value: string) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions[index] = value;
      return newOptions;
    });
  };

  const addOption = () => setOptions([...options, '']);
  const removeOption = (index: number) =>
    setOptions(options.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (title.trim() === '' || options.filter((o) => o.trim()).length < 2) return;

  api.patch(`/polls/${id}`, {
    title,
    options: options.filter((o) => o.trim() !== ''), // Передаємо всі варіанти
  }).then(() => navigate(`/polls/${id}`));
};
  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Редагувати голосування</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Заголовок:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ display: 'block', marginBottom: '1rem' }}
          />
        </div>

        <div>
          <label>Опції:</label>
          {options.map((option, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
              />
              <button type="button" onClick={() => removeOption(index)}>🗑</button>
            </div>
          ))}
          <button type="button" onClick={addOption}>+ Додати опцію</button>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button type="submit">Зберегти</button>
        </div>
      </form>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => navigate(-1)}>← Назад</button>
      </div>
    </div>
  );
}
