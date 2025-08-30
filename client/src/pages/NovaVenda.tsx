import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { criarVenda, getEquipes, getVendedores, Equipe, Vendedor } from '../services/api';

const NovaVenda: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [vendedoresFiltrados, setVendedoresFiltrados] = useState<Vendedor[]>([]);
  
  const [formData, setFormData] = useState({
    valor: '',
    vendedor_id: '',
    equipe_id: '',
    descricao: ''
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [equipesData, vendedoresData] = await Promise.all([
          getEquipes(),
          getVendedores()
        ]);
        setEquipes(equipesData);
        setVendedores(vendedoresData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    if (formData.equipe_id) {
      const filtrados = vendedores.filter(v => v.equipe_id === formData.equipe_id);
      setVendedoresFiltrados(filtrados);
      setFormData(prev => ({ ...prev, vendedor_id: '' }));
    } else {
      setVendedoresFiltrados([]);
    }
  }, [formData.equipe_id, vendedores]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.valor || !formData.vendedor_id || !formData.equipe_id) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setLoading(true);
      await criarVenda({
        valor: parseFloat(formData.valor),
        vendedor_id: formData.vendedor_id,
        equipe_id: formData.equipe_id,
        descricao: formData.descricao
      });
      
      alert('Venda registrada com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao criar venda:', error);
      alert('Erro ao registrar venda. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
            <h1 className="card-title">Nova Venda</h1>
          </div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Valor da Venda */}
            <div className="form-group">
              <label htmlFor="valor" className="form-label">
                Valor da Venda *
              </label>
              <input
                type="number"
                id="valor"
                name="valor"
                value={formData.valor}
                onChange={handleInputChange}
                className="form-input"
                placeholder="0,00"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Equipe */}
            <div className="form-group">
              <label htmlFor="equipe_id" className="form-label">
                Equipe *
              </label>
              <select
                id="equipe_id"
                name="equipe_id"
                value={formData.equipe_id}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Selecione uma equipe</option>
                {equipes.map((equipe) => (
                  <option key={equipe.id} value={equipe.id}>
                    {equipe.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Vendedor */}
            <div className="form-group">
              <label htmlFor="vendedor_id" className="form-label">
                Vendedor *
              </label>
              <select
                id="vendedor_id"
                name="vendedor_id"
                value={formData.vendedor_id}
                onChange={handleInputChange}
                className="form-select"
                required
                disabled={!formData.equipe_id}
              >
                <option value="">
                  {formData.equipe_id ? 'Selecione um vendedor' : 'Primeiro selecione uma equipe'}
                </option>
                {vendedoresFiltrados.map((vendedor) => (
                  <option key={vendedor.id} value={vendedor.id}>
                    {vendedor.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div className="form-group">
            <label htmlFor="descricao" className="form-label">
              Descrição da Venda
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Descreva os detalhes da venda..."
              rows={4}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? (
                'Salvando...'
              ) : (
                <>
                  <Save size={16} />
                  Registrar Venda
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* Informações Adicionais */}
      <div className="card">
        <h3 className="card-title mb-4">Informações Importantes</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <h4 className="font-semibold mb-2">Equipes Disponíveis</h4>
            <ul className="text-gray">
              {equipes.map((equipe) => (
                <li key={equipe.id}>• {equipe.nome}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Vendedores por Equipe</h4>
            {equipes.map((equipe) => {
              const vendedoresEquipe = vendedores.filter(v => v.equipe_id === equipe.id);
              return (
                <div key={equipe.id} className="mb-2">
                  <strong>{equipe.nome}:</strong>
                  <ul className="text-gray ml-4">
                    {vendedoresEquipe.map((vendedor) => (
                      <li key={vendedor.id}>• {vendedor.nome}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovaVenda;
