import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Package } from 'lucide-react';
import { getVendasDia, Venda } from '../services/api';

const VendasDia: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [total, setTotal] = useState(0);
  const [quantidade, setQuantidade] = useState(0);

  useEffect(() => {
    const carregarVendas = async () => {
      try {
        setLoading(true);
        const data = await getVendasDia();
        setVendas(data.vendas);
        setTotal(data.total);
        setQuantidade(data.quantidade);
      } catch (error) {
        console.error('Erro ao carregar vendas do dia:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarVendas();
  }, []);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="card">
        <div className="text-center">
          <p>Carregando vendas do dia...</p>
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
            <h1 className="card-title">Vendas do Dia</h1>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-value text-green">
            {formatarMoeda(total)}
          </div>
          <div className="stat-label">Total de Vendas</div>
          <div className="text-gray text-sm mt-2">
            <DollarSign size={16} className="inline mr-1" />
            Valor total vendido hoje
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="stat-value text-blue">
            {quantidade}
          </div>
          <div className="stat-label">Quantidade de Vendas</div>
          <div className="text-gray text-sm mt-2">
            <Package size={16} className="inline mr-1" />
            Vendas realizadas hoje
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {quantidade > 0 ? formatarMoeda(total / quantidade) : 'R$ 0,00'}
          </div>
          <div className="stat-label">Ticket Médio</div>
          <div className="text-gray text-sm mt-2">
            Valor médio por venda
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>
            {new Date().toLocaleDateString('pt-BR')}
          </div>
          <div className="stat-label">Data</div>
          <div className="text-gray text-sm mt-2">
            <Calendar size={16} className="inline mr-1" />
            Hoje
          </div>
        </div>
      </div>

      {/* Lista de Vendas */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Detalhes das Vendas</h2>
          <div className="text-gray">
            {quantidade} venda{quantidade !== 1 ? 's' : ''} encontrada{quantidade !== 1 ? 's' : ''}
          </div>
        </div>

        {vendas.length === 0 ? (
          <div className="text-center p-8">
            <Calendar size={48} className="text-gray mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma venda registrada hoje</h3>
            <p className="text-gray">
              Não há vendas registradas para o dia de hoje.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Vendedor</th>
                  <th>Equipe</th>
                  <th>Valor</th>
                  <th>Data/Hora</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {vendas.map((venda) => (
                  <tr key={venda.id}>
                    <td className="font-semibold">{venda.vendedor_nome}</td>
                    <td className="text-gray">{venda.equipe_nome}</td>
                    <td className="font-bold text-green">
                      {formatarMoeda(venda.valor)}
                    </td>
                    <td className="text-gray">
                      {formatarData(venda.data_venda)}
                    </td>
                    <td className="text-gray">
                      {venda.descricao || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td colSpan={2}>Total</td>
                  <td className="text-green">{formatarMoeda(total)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Gráfico de Distribuição por Equipe */}
      {vendas.length > 0 && (
        <div className="card">
          <h3 className="card-title mb-4">Distribuição por Equipe</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {(() => {
              const vendasPorEquipe = vendas.reduce((acc, venda) => {
                const equipe = venda.equipe_nome || 'Sem equipe';
                if (!acc[equipe]) {
                  acc[equipe] = { total: 0, quantidade: 0 };
                }
                acc[equipe].total += venda.valor;
                acc[equipe].quantidade += 1;
                return acc;
              }, {} as Record<string, { total: number; quantidade: number }>);

              return Object.entries(vendasPorEquipe).map(([equipe, dados]) => (
                <div key={equipe} className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
                  <div className="stat-value text-blue">
                    {formatarMoeda(dados.total)}
                  </div>
                  <div className="stat-label">{equipe}</div>
                  <div className="text-gray text-sm mt-2">
                    {dados.quantidade} venda{dados.quantidade !== 1 ? 's' : ''}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendasDia;
