import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Home from './pages/Home.jsx';
import Scanner from './pages/Scanner.jsx';
import Machine from './pages/Machine.jsx';
import History from './pages/History.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import MachineList from './pages/admin/MachineList.jsx';
import MachineForm from './pages/admin/MachineForm.jsx';
import MachineQR from './pages/admin/MachineQR.jsx';

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scanner />} />
        <Route path="/machine/:id" element={<Machine />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/machines" element={<MachineList />} />
        <Route path="/admin/machines/new" element={<MachineForm />} />
        <Route path="/admin/machines/:id/edit" element={<MachineForm />} />
        <Route path="/admin/machines/:id/qr" element={<MachineQR />} />
      </Routes>
      <NavBar />
    </div>
  );
}
