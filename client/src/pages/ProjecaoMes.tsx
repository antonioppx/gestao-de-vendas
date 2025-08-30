import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';
import { getProjecaoMes, Projecao } from '../services/api';

const ProjecaoMes: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projecao, setProjecao] = useState<Projecao>({
    mediaDiaria: 0,
    projecaoMes: 0,
    vendasAtuais: 0,
    diasPassados: 0,
    diasNoMes: 0
  });

  useEffect(() => {
    const carregarProjecao = async () => {
      try {
        setLoading(true);
        const data = await getProjecaoMes();
        setProjecao(data);
      } catch (error) {
        console.error('Erro ao carregar projeção:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarProjecao();
  }, []);

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
          <p>Carregando projeção mensal...</p>
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
            <h1 className="card-title">Projeção Mensal</h1>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-value text-green">
            {formatarMoeda(projecao.projecaoMes || 0)}
          </div>
          <div className="stat-label">Projeção Mensal</div>
          <div className="text-gray text-sm mt-2">
            <Target size={16} className="inline mr-1" />
            Previsão para o mês
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="stat-value text-blue">
            {formatarMoeda(projecao.mediaDiaria)}
          </div>
          <div className="stat-label">Média Diária</div>
          <div className="text-gray text-sm mt-2">
            <TrendingUp size={16} className="inline mr-1" />
            Baseada no mês atual
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {formatarMoeda(projecao.vendasAtuais)}
          </div>
          <div className="stat-label">Vendas Atuais</div>
          <div className="text-gray text-sm mt-2">
            <DollarSign size={16} className="inline mr-1" />
            Mês atual ({projecao.diasPassados || 0} dias)
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>
            {projecao.diasPassados || 0}/{projecao.diasNoMes || 30}
          </div>
          <div className="stat-label">Progresso do Mês</div>
          <div className="text-gray text-sm mt-2">
            <Calendar size={16} className="inline mr-1" />
            {Math.round(((projecao.diasPassados || 0) / (projecao.diasNoMes || 1)) * 100)}% concluído
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title mb-4">Análise da Projeção</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h4 className="font-semibold mb-3">Metodologia de Cálculo</h4>
            <ul className="text-gray space-y-2">
              <li>• Baseado nas vendas do mês atual</li>
              <li>• Média diária: {formatarMoeda(projecao.mediaDiaria)}</li>
              <li>• Projeção mensal: média diária × {projecao.diasNoMes || 30} dias</li>
              <li>• Dias analisados: {projecao.diasPassados || 0} de {projecao.diasNoMes || 30}</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Indicadores</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Vendas Atuais:</span>
                <span className="font-semibold text-green">{formatarMoeda(projecao.vendasAtuais)}</span>
              </div>
              <div className="flex justify-between">
                <span>Média Diária:</span>
                <span className="font-semibold text-blue">{formatarMoeda(projecao.mediaDiaria)}</span>
              </div>
              <div className="flex justify-between">
                <span>Projeção Mensal:</span>
                <span className="font-semibold text-purple">{formatarMoeda(projecao.projecaoMes || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Variação:</span>
                <span className={`font-semibold ${(projecao.projecaoMes || 0) >= projecao.vendasAtuais ? 'text-green' : 'text-red'}`}>
                  {formatarMoeda((projecao.projecaoMes || 0) - projecao.vendasAtuais)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjecaoMes;
