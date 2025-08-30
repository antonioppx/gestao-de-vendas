import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import NovaVenda from './pages/NovaVenda';
import VendasDia from './pages/VendasDia';
import VendasSemana from './pages/VendasSemana';
import VendasQuinzena from './pages/VendasQuinzena';
import ProjecaoQuinzena from './pages/ProjecaoQuinzena';
import ProjecaoMes from './pages/ProjecaoMes';
import VendasEquipe from './pages/VendasEquipe';
import VendasVendedor from './pages/VendasVendedor';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/nova-venda" element={<NovaVenda />} />
            <Route path="/vendas-dia" element={<VendasDia />} />
            <Route path="/vendas-semana" element={<VendasSemana />} />
            <Route path="/vendas-quinzena" element={<VendasQuinzena />} />
            <Route path="/projecao-quinzena" element={<ProjecaoQuinzena />} />
            <Route path="/projecao-mes" element={<ProjecaoMes />} />
            <Route path="/vendas-equipe" element={<VendasEquipe />} />
            <Route path="/vendas-vendedor" element={<VendasVendedor />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
