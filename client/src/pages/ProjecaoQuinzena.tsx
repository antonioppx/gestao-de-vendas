import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';
import { getProjecaoQuinzena, Projecao } from '../services/api';

const ProjecaoQuinzena: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projecao, setProjecao] = useState<Projecao>({
    mediaDiaria: 0,
    projecaoQuinzena: 0,
    vendasAtuais: 0
  });

  useEffect(() => {
    const carregarProjecao = async () => {
      try {
        setLoading(true);
        const data = await getProjecaoQuinzena();
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
          <p>Carregando projeção quinzena...</p>
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
            <h1 className="card-title">Projeção Quinzena</h1>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-value text-green">
            {formatarMoeda(projecao.projecaoQuinzena || 0)}
          </div>
          <div className="stat-label">Projeção Quinzena</div>
          <div className="text-gray text-sm mt-2">
            <Target size={16} className="inline mr-1" />
            Previsão para 15 dias
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="stat-value text-blue">
            {formatarMoeda(projecao.mediaDiaria)}
          </div>
          <div className="stat-label">Média Diária</div>
          <div className="text-gray text-sm mt-2">
            <TrendingUp size={16} className="inline mr-1" />
            Baseada nos últimos 15 dias
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {formatarMoeda(projecao.vendasAtuais)}
          </div>
          <div className="stat-label">Vendas Atuais</div>
          <div className="text-gray text-sm mt-2">
            <DollarSign size={16} className="inline mr-1" />
            Últimos 15 dias
          </div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>
            {formatarMoeda((projecao.projecaoQuinzena || 0) - projecao.vendasAtuais)}
          </div>
          <div className="stat-label">Diferença</div>
          <div className="text-gray text-sm mt-2">
            <Calendar size={16} className="inline mr-1" />
            Projeção vs Atual
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title mb-4">Análise da Projeção</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div>
            <h4 className="font-semibold mb-3">Metodologia de Cálculo</h4>
            <ul className="text-gray space-y-2">
              <li>• Baseado nas vendas dos últimos 15 dias</li>
              <li>• Média diária calculada: {formatarMoeda(projecao.mediaDiaria)}</li>
              <li>• Projeção quinzena: média diária × 15 dias</li>
              <li>• Período de análise: últimos 15 dias</li>
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
                <span>Projeção Quinzena:</span>
                <span className="font-semibold text-purple">{formatarMoeda(projecao.projecaoQuinzena || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Variação:</span>
                <span className={`font-semibold ${(projecao.projecaoQuinzena || 0) >= projecao.vendasAtuais ? 'text-green' : 'text-red'}`}>
                  {formatarMoeda((projecao.projecaoQuinzena || 0) - projecao.vendasAtuais)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title mb-4">Recomendações</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h4 className="font-semibold text-blue mb-2">Se a projeção for maior que as vendas atuais:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Aumentar esforços de vendas</li>
              <li>• Reforçar treinamento da equipe</li>
              <li>• Revisar estratégias de marketing</li>
            </ul>
          </div>
          
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <h4 className="font-semibold text-green mb-2">Se a projeção for menor que as vendas atuais:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Manter o ritmo atual</li>
              <li>• Identificar fatores de sucesso</li>
              <li>• Replicar boas práticas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjecaoQuinzena;
