import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Venda {
  id: string;
  valor: number;
  vendedor_id: string;
  equipe_id: string;
  data_venda: string;
  descricao?: string;
  vendedor_nome?: string;
  equipe_nome?: string;
}

export interface Equipe {
  id: string;
  nome: string;
}

export interface Vendedor {
  id: string;
  nome: string;
  equipe_id: string;
  equipe_nome?: string;
}

export interface VendaStats {
  vendas: Venda[];
  total: number;
  quantidade: number;
}

export interface Projecao {
  mediaDiaria: number;
  projecaoQuinzena?: number;
  projecaoMes?: number;
  vendasAtuais: number;
  diasPassados?: number;
  diasNoMes?: number;
}

export interface VendaEquipe {
  id: string;
  equipe_nome: string;
  quantidade_vendas: number;
  total_vendas: number;
  media_venda: number;
}

export interface VendaVendedor {
  id: string;
  vendedor_nome: string;
  equipe_nome: string;
  quantidade_vendas: number;
  total_vendas: number;
  media_venda: number;
}

// Vendas
export const criarVenda = async (venda: Omit<Venda, 'id' | 'data_venda'>) => {
  const response = await api.post('/vendas', venda);
  return response.data;
};

export const getVendasDia = async (): Promise<VendaStats> => {
  const response = await api.get('/vendas/dia');
  return response.data;
};

export const getVendasSemana = async (): Promise<VendaStats> => {
  const response = await api.get('/vendas/semana');
  return response.data;
};

export const getVendasQuinzena = async (): Promise<VendaStats> => {
  const response = await api.get('/vendas/quinzena');
  return response.data;
};

// Projeções
export const getProjecaoQuinzena = async (): Promise<Projecao> => {
  const response = await api.get('/projecao/quinzena');
  return response.data;
};

export const getProjecaoMes = async (): Promise<Projecao> => {
  const response = await api.get('/projecao/mes');
  return response.data;
};

// Relatórios por equipe e vendedor
export const getVendasEquipe = async (periodo?: string): Promise<VendaEquipe[]> => {
  const params = periodo ? { periodo } : {};
  const response = await api.get('/vendas/equipe', { params });
  return response.data;
};

export const getVendasVendedor = async (periodo?: string): Promise<VendaVendedor[]> => {
  const params = periodo ? { periodo } : {};
  const response = await api.get('/vendas/vendedor', { params });
  return response.data;
};

// Equipes e vendedores
export const getEquipes = async (): Promise<Equipe[]> => {
  const response = await api.get('/equipes');
  return response.data;
};

export const getVendedores = async (): Promise<Vendedor[]> => {
  const response = await api.get('/vendedores');
  return response.data;
};

// Dados de exemplo
export const seedData = async () => {
  const response = await api.post('/seed');
  return response.data;
};

export default api;
