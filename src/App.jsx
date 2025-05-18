import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import History from './pages/History';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/modules/:langKey" element={<Modules />} />
      <Route path="/modules/:langKey/:moduleId" element={<ModuleDetail />} />
      <Route path="/history/:langKey" element={<History />} />
    </Routes>
  );
}

export default App;
