import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import { Link } from 'react-router-dom'; // Додай імпорт Link

function NewPollPage() {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const navigate = useNavigate();

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => setOptions([...options, '']);
  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '' || options.filter((o) => o.trim() !== '').length < 2) {
      alert('Please provide a title and at least two options.');
      return;
    }

    try {
      const response = await api.post('/polls', {
        title,
        options: options.filter((o) => o.trim() !== ''),
      });
      navigate(`/polls/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create poll:', error);
      alert('An error occurred while creating the poll.');
    }
  };

  return (
    
    <div style={{ padding: '2rem' }}>
        <Link to="/">Back to Home</Link> {/* Додай кнопку для повернення на головну сторінку */}
      <h1>Create a New Poll</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ display: 'block', margin: '1rem 0', width: '100%' }}
            />
          </label>
        </div>
        <div>
          <h3>Options:</h3>
          {options.map((option, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
                style={{ flex: 1, marginRight: '0.5rem' }}
              />
              {options.length > 2 && (
                <button type="button" onClick={() => removeOption(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOption}>
            Add Option
          </button>
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>
          Create Poll
        </button>
      </form>
    </div>
  );
}

export default NewPollPage;