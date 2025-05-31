import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import App from './App';
import NewPollPage from './NewPollPage';
import EditPollPage from './EditPollPage';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/polls/:id" element={<App />} />
      <Route path="/polls/new" element={<NewPollPage />} />
      <Route path="/polls/:id/edit" element={<EditPollPage />} />
      
    </Routes>
  );
}

export default Router;
