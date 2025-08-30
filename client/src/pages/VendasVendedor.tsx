import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, DollarSign, Package, Users } from 'lucide-react';
import { getVendasVendedor, VendaVendedor } from '../services/api';

const VendasVendedor: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendas, setVendas] = useState<VendaVendedor[]>([]);
  const [periodo, setPeriodo] = useState('semana');

  useEffect(() => {
    const carregarVendas = async () => {
      try {
        setLoading(true);
        const data = await getVendasVendedor(periodo);
        setVendas(data);
      } catch (error) {
        console.error('Erro ao carregar vendas por vendedor:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarVendas();
  }, [periodo]);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getTotalGeral = () => {
    return vendas.reduce((total, vendedor) => total + vendedor.total_vendas, 0);
  };

  const getQuantidadeGeral = () => {
    return vendas.reduce((total, vendedor) => total + vendedor.quantidade_vendas, 0);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="text-center">
          <p>Carregando vendas por vendedor...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
            <h1 className="card-title">Vendas por Vendedor</h1>
          </div>
          <div className="flex gap-2">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="dia">Hoje</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
            </select>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-value text-green">
            {formatarMoeda(getTotalGeral())}
          </div>
          <div className="stat-label">Total Geral</div>
          <div className="text-gray text-sm mt-2">
            <DollarSign size={16} className="inline mr-1" />
            Soma de todos os vendedores
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="stat-value text-blue">
            {getQuantidadeGeral()}
          </div>
          <div className="stat-label">Total de Vendas</div>
          <div className="text-gray text-sm mt-2">
            <Package size={16} className="inline mr-1" />
            Quantidade total
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {vendas.length}
          </div>
          <div className="stat-label">Vendedores Ativos</div>
          <div className="text-gray text-sm mt-2">
            <User size={16} className="inline mr-1" />
            Vendedores com vendas
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>
            {getTotalGeral() > 0 ? formatarMoeda(getTotalGeral() / vendas.length) : 'R$ 0,00'}
          </div>
          <div className="stat-label">Média por Vendedor</div>
          <div className="text-gray text-sm mt-2">
            Valor médio por vendedor
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Performance dos Vendedores</h2>
          <div className="text-gray">
            {vendas.length} vendedor{vendas.length !== 1 ? 'es' : ''} encontrado{vendas.length !== 1 ? 's' : ''}
          </div>
        </div>

        {vendas.length === 0 ? (
          <div className="text-center p-8">
            <User size={48} className="text-gray mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma venda registrada</h3>
            <p className="text-gray">
              Não há vendas registradas para o período selecionado.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Vendedor</th>
                  <th>Equipe</th>
                  <th>Quantidade de Vendas</th>
                  <th>Total de Vendas</th>
                  <th>Ticket Médio</th>
                  <th>% do Total</th>
                </tr>
              </thead>
              <tbody>
                {vendas.map((vendedor) => {
                  const percentual = getTotalGeral() > 0 ? (vendedor.total_vendas / getTotalGeral()) * 100 : 0;
                  return (
                    <tr key={vendedor.id}>
                      <td className="font-semibold">{vendedor.vendedor_nome}</td>
                      <td className="text-gray">{vendedor.equipe_nome}</td>
                      <td>{vendedor.quantidade_vendas}</td>
                      <td className="font-bold text-green">
                        {formatarMoeda(vendedor.total_vendas)}
                      </td>
                      <td className="text-gray">
                        {formatarMoeda(vendedor.media_venda)}
                      </td>
                      <td className="text-blue font-semibold">
                        {percentual.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td colSpan={2}>Total</td>
                  <td>{getQuantidadeGeral()}</td>
                  <td className="text-green">{formatarMoeda(getTotalGeral())}</td>
                  <td className="text-gray">
                    {getQuantidadeGeral() > 0 ? formatarMoeda(getTotalGeral() / getQuantidadeGeral()) : 'R$ 0,00'}
                  </td>
                  <td>100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Top Vendedores */}
      {vendas.length > 0 && (
        <div className="card">
          <h3 className="card-title mb-4">Top Vendedores</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {vendas.slice(0, 5).map((vendedor, index) => {
              const percentual = getTotalGeral() > 0 ? (vendedor.total_vendas / getTotalGeral()) * 100 : 0;
              const colors = ['#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f87171'];
              return (
                <div key={vendedor.id} className="stat-card" style={{ borderLeftColor: colors[index] }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-500">#{index + 1}</div>
                    <div className="text-sm text-gray-500">{vendedor.equipe_nome}</div>
                  </div>
                  <div className="stat-value" style={{ color: colors[index], fontSize: '1.5rem' }}>
                    {formatarMoeda(vendedor.total_vendas)}
                  </div>
                  <div className="stat-label">{vendedor.vendedor_nome}</div>
                  <div className="text-gray text-sm mt-2">
                    {percentual.toFixed(1)}% do total
                  </div>
                  <div className="text-gray text-sm">
                    {vendedor.quantidade_vendas} venda{vendedor.quantidade_vendas !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendasVendedor;
