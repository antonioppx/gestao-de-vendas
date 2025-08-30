import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Plus, Calendar, TrendingUp, Users, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/nova-venda', label: 'Nova Venda', icon: Plus },
    { path: '/vendas-dia', label: 'Vendas do Dia', icon: Calendar },
    { path: '/vendas-semana', label: 'Vendas da Semana', icon: Calendar },
    { path: '/vendas-quinzena', label: 'Vendas da Quinzena', icon: Calendar },
    { path: '/projecao-quinzena', label: 'Projeção Quinzena', icon: TrendingUp },
    { path: '/projecao-mes', label: 'Projeção Mês', icon: TrendingUp },
    { path: '/vendas-equipe', label: 'Vendas por Equipe', icon: Users },
    { path: '/vendas-vendedor', label: 'Vendas por Vendedor', icon: User },
  ];

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem 0',
      marginBottom: '2rem',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
    }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ 
              color: 'white', 
              fontSize: '1.5rem', 
              fontWeight: '700',
              margin: 0
            }}>
              Sistema de Gestão de Vendas
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'white',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    transition: 'all 0.2s',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon size={16} />
                  <span className="hidden md:inline">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
