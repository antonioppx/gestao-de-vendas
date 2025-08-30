import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  ArrowRight,
  Plus
} from 'lucide-react';
import { 
  getVendasDia, 
  getVendasSemana, 
  getProjecaoQuinzena, 
  getProjecaoMes,
  getVendasEquipe,
  getVendasVendedor,
  seedData,
  VendaStats,
  Projecao,
  VendaEquipe,
  VendaVendedor
} from '../services/api';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    vendasDia: VendaStats;
    vendasSemana: VendaStats;
    projecaoQuinzena: Projecao;
    projecaoMes: Projecao;
    topEquipes: VendaEquipe[];
    topVendedores: VendaVendedor[];
  }>({
    vendasDia: { vendas: [], total: 0, quantidade: 0 },
    vendasSemana: { vendas: [], total: 0, quantidade: 0 },
    projecaoQuinzena: { mediaDiaria: 0, vendasAtuais: 0 },
    projecaoMes: { mediaDiaria: 0, vendasAtuais: 0 },
    topEquipes: [],
    topVendedores: []
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        const [
          vendasDia,
          vendasSemana,
          projecaoQuinzena,
          projecaoMes,
          vendasEquipe,
          vendasVendedor
        ] = await Promise.all([
          getVendasDia(),
          getVendasSemana(),
          getProjecaoQuinzena(),
          getProjecaoMes(),
          getVendasEquipe('semana'),
          getVendasVendedor('semana')
        ]);

        setStats({
          vendasDia,
          vendasSemana,
          projecaoQuinzena,
          projecaoMes,
          topEquipes: vendasEquipe.slice(0, 3),
          topVendedores: vendasVendedor.slice(0, 3)
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const handleSeedData = async () => {
    try {
      await seedData();
      window.location.reload();
    } catch (error) {
      console.error('Erro ao adicionar dados de exemplo:', error);
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="text-center">
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Dashboard de Vendas</h1>
          <div className="flex gap-4">
            <button 
              onClick={handleSeedData}
              className="btn btn-secondary"
            >
              Adicionar Dados de Exemplo
            </button>
            <Link to="/nova-venda" className="btn btn-primary">
              <Plus size={16} />
              Nova Venda
            </Link>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-value text-green">
            {formatarMoeda(stats.vendasDia.total)}
          </div>
          <div className="stat-label">Vendas do Dia</div>
          <div className="text-gray text-sm mt-2">
            {stats.vendasDia.quantidade} vendas realizadas
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="stat-value text-blue">
            {formatarMoeda(stats.vendasSemana.total)}
          </div>
          <div className="stat-label">Vendas da Semana</div>
          <div className="text-gray text-sm mt-2">
            {stats.vendasSemana.quantidade} vendas realizadas
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {formatarMoeda(stats.projecaoQuinzena.projecaoQuinzena || 0)}
          </div>
          <div className="stat-label">Projeção Quinzena</div>
          <div className="text-gray text-sm mt-2">
            Média diária: {formatarMoeda(stats.projecaoQuinzena.mediaDiaria)}
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>
            {formatarMoeda(stats.projecaoMes.projecaoMes || 0)}
          </div>
          <div className="stat-label">Projeção do Mês</div>
          <div className="text-gray text-sm mt-2">
            Média diária: {formatarMoeda(stats.projecaoMes.mediaDiaria)}
          </div>
        </div>
      </div>

      {/* Seções de Relatórios */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Top Equipes */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top Equipes da Semana</h2>
            <Link to="/vendas-equipe" className="btn btn-secondary">
              Ver Todas
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Equipe</th>
                  <th>Vendas</th>
                  <th>Total</th>
                  <th>Média</th>
                </tr>
              </thead>
              <tbody>
                {stats.topEquipes.map((equipe) => (
                  <tr key={equipe.id}>
                    <td className="font-semibold">{equipe.equipe_nome}</td>
                    <td>{equipe.quantidade_vendas}</td>
                    <td className="font-bold text-green">
                      {formatarMoeda(equipe.total_vendas)}
                    </td>
                    <td className="text-gray">
                      {formatarMoeda(equipe.media_venda)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Vendedores */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top Vendedores da Semana</h2>
            <Link to="/vendas-vendedor" className="btn btn-secondary">
              Ver Todos
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Vendedor</th>
                  <th>Equipe</th>
                  <th>Vendas</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.topVendedores.map((vendedor) => (
                  <tr key={vendedor.id}>
                    <td className="font-semibold">{vendedor.vendedor_nome}</td>
                    <td className="text-gray">{vendedor.equipe_nome}</td>
                    <td>{vendedor.quantidade_vendas}</td>
                    <td className="font-bold text-green">
                      {formatarMoeda(vendedor.total_vendas)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Links Rápidos */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Acesso Rápido</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Link to="/vendas-dia" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="flex items-center gap-3">
              <Calendar size={24} className="text-blue" />
              <div>
                <h3 className="font-semibold">Vendas do Dia</h3>
                <p className="text-gray text-sm">Visualizar vendas de hoje</p>
              </div>
            </div>
          </Link>

          <Link to="/vendas-semana" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="flex items-center gap-3">
              <Calendar size={24} className="text-blue" />
              <div>
                <h3 className="font-semibold">Vendas da Semana</h3>
                <p className="text-gray text-sm">Relatório semanal</p>
              </div>
            </div>
          </Link>

          <Link to="/vendas-quinzena" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="flex items-center gap-3">
              <Calendar size={24} className="text-blue" />
              <div>
                <h3 className="font-semibold">Vendas da Quinzena</h3>
                <p className="text-gray text-sm">Últimos 15 dias</p>
              </div>
            </div>
          </Link>

          <Link to="/projecao-quinzena" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="flex items-center gap-3">
              <TrendingUp size={24} className="text-green" />
              <div>
                <h3 className="font-semibold">Projeção Quinzena</h3>
                <p className="text-gray text-sm">Previsões para 15 dias</p>
              </div>
            </div>
          </Link>

          <Link to="/projecao-mes" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="flex items-center gap-3">
              <TrendingUp size={24} className="text-green" />
              <div>
                <h3 className="font-semibold">Projeção Mensal</h3>
                <p className="text-gray text-sm">Previsões do mês</p>
              </div>
            </div>
          </Link>

          <Link to="/vendas-equipe" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="flex items-center gap-3">
              <Users size={24} className="text-purple" />
              <div>
                <h3 className="font-semibold">Vendas por Equipe</h3>
                <p className="text-gray text-sm">Performance das equipes</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
