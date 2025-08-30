# Sistema de Gestão de Vendas

Um sistema completo e profissional para gestão de vendas, desenvolvido com React, TypeScript, Node.js e SQLite.

## 🚀 Funcionalidades

### 📊 Dashboard Principal
- Visão geral das vendas do dia, semana e quinzena
- Projeções quinzenais e mensais
- Top equipes e vendedores
- Acesso rápido a todas as funcionalidades

### 💰 Gestão de Vendas
- **Nova Venda**: Registro completo de vendas com valor, vendedor, equipe e descrição
- **Vendas do Dia**: Relatório detalhado das vendas do dia atual
- **Vendas da Semana**: Análise semanal com estatísticas
- **Vendas da Quinzena**: Relatório dos últimos 15 dias

### 📈 Projeções e Análises
- **Projeção Quinzena**: Previsões baseadas nos últimos 15 dias
- **Projeção Mensal**: Análise e projeções do mês atual
- Metodologia de cálculo transparente
- Recomendações baseadas nos dados

### 👥 Relatórios por Equipe e Vendedor
- **Vendas por Equipe**: Performance comparativa das equipes
- **Vendas por Vendedor**: Ranking e análise individual
- Filtros por período (dia, semana, mês)
- Estatísticas detalhadas e percentuais

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **React Router** para navegação
- **Lucide React** para ícones
- **CSS Grid e Flexbox** para layout responsivo

### Backend
- **Node.js** com Express
- **SQLite** como banco de dados
- **Moment.js** para manipulação de datas
- **UUID** para identificadores únicos

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd sistema-gestao-vendas
```

2. **Instale as dependências**
```bash
npm run install-all
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### Equipes
- `id`: Identificador único
- `nome`: Nome da equipe
- `created_at`: Data de criação

#### Vendedores
- `id`: Identificador único
- `nome`: Nome do vendedor
- `equipe_id`: Referência à equipe
- `created_at`: Data de criação

#### Vendas
- `id`: Identificador único
- `valor`: Valor da venda
- `vendedor_id`: Referência ao vendedor
- `equipe_id`: Referência à equipe
- `data_venda`: Data e hora da venda
- `descricao`: Descrição opcional
- `created_at`: Data de criação

## 📋 Como Usar

### 1. Primeiro Acesso
1. Acesse o sistema
2. Clique em "Adicionar Dados de Exemplo" para popular o banco
3. Explore as diferentes funcionalidades

### 2. Registrar Nova Venda
1. Navegue para "Nova Venda"
2. Preencha:
   - Valor da venda
   - Selecione a equipe
   - Selecione o vendedor
   - Adicione descrição (opcional)
3. Clique em "Registrar Venda"

### 3. Visualizar Relatórios
- **Dashboard**: Visão geral de todos os indicadores
- **Vendas do Dia/Semana/Quinzena**: Relatórios temporais
- **Projeções**: Análises preditivas
- **Vendas por Equipe/Vendedor**: Relatórios comparativos

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
PORT=5000
NODE_ENV=development
```

### Personalização
- **Equipes**: Edite o arquivo `server/index.js` para adicionar/modificar equipes
- **Vendedores**: Adicione novos vendedores no mesmo arquivo
- **Estilos**: Modifique `client/src/index.css` para personalizar a aparência

## 📊 API Endpoints

### Vendas
- `POST /api/vendas` - Criar nova venda
- `GET /api/vendas/dia` - Vendas do dia
- `GET /api/vendas/semana` - Vendas da semana
- `GET /api/vendas/quinzena` - Vendas da quinzena

### Projeções
- `GET /api/projecao/quinzena` - Projeção quinzena
- `GET /api/projecao/mes` - Projeção mensal

### Relatórios
- `GET /api/vendas/equipe?periodo=dia|semana|mes` - Vendas por equipe
- `GET /api/vendas/vendedor?periodo=dia|semana|mes` - Vendas por vendedor

### Dados
- `GET /api/equipes` - Listar equipes
- `GET /api/vendedores` - Listar vendedores
- `POST /api/seed` - Adicionar dados de exemplo

## 🚀 Deploy

### Produção
1. **Build do Frontend**
```bash
cd client
npm run build
```

2. **Configurar Servidor**
```bash
cd server
npm install --production
```

3. **Configurar Variáveis de Ambiente**
```env
PORT=5000
NODE_ENV=production
```

4. **Iniciar Servidor**
```bash
npm start
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte ou dúvidas:
- Abra uma issue no repositório
- Entre em contato através do email: suporte@sistema.com

## 🔄 Atualizações Futuras

- [ ] Gráficos interativos com Chart.js
- [ ] Exportação de relatórios em PDF/Excel
- [ ] Sistema de notificações
- [ ] Dashboard em tempo real
- [ ] Múltiplos usuários e permissões
- [ ] Integração com sistemas externos

---

**Desenvolvido com ❤️ para otimizar a gestão de vendas**
