# 🖨️ Sistema de Gestão de Toners

Um sistema completo de gestão de cartuchos de toner desenvolvido com React, Express e PostgreSQL. Gerencia todo o ciclo de vida dos toners, desde cadastros gerais até garantias e homologações.

## 🚀 Funcionalidades

### 📊 Dashboard
- Visão geral com estatísticas em tempo real
- Gráficos de retornados e garantias
- Alertas e notificações
- Filtros por ano e filial

### 📝 Cadastros Gerais
- **Gestão de Toners**: Modelos, pesos, capacidades e preços
- **Fornecedores**: Cadastro com informações de contato
- **Status**: Controle de status para garantias e homologações
- **Filiais e Setores**: Organização empresarial

### 🔄 Retornados
- Processamento de toners retornados
- Cálculo automático de gramatura
- Avaliação de qualidade baseada em peso
- Recomendações automáticas de destino
- Rastreamento por código do cliente

### 🛡️ Garantias
- Gestão completa de RMA (Return Merchandise Authorization)
- Múltiplos itens por garantia
- Anexo de documentos (NFs, tickets)
- Controle de status e workflow
- Integração com fornecedores

### ✅ Homologações
- Controle de qualidade de toners
- Processo de homologação
- Certificações e padrões
- Relatórios de conformidade

### 📋 Outros Módulos
- **Amostragens**: Controle de amostras
- **Certificados**: Gestão de certificações
- **POP/IT**: Procedimentos operacionais
- **Processos**: Workflows empresariais
- **Auditorias**: Controle de auditorias
- **Dinâmicas**: Questionários e avaliações

## 🛠️ Tecnologias

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Radix UI** + **shadcn/ui** para componentes
- **Tailwind CSS** para estilização
- **TanStack Query** para gerenciamento de estado
- **Wouter** para roteamento
- **React Hook Form** + **Zod** para formulários

### Backend
- **Node.js** com **Express**
- **TypeScript** para type safety
- **Drizzle ORM** para banco de dados
- **PostgreSQL** (Neon serverless)
- **Passport.js** para autenticação

### Banco de Dados
- **PostgreSQL** com UUIDs
- **Drizzle ORM** para queries type-safe
- **Migrations** automáticas
- **Relacionamentos** bem definidos

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL (ou Neon serverless)
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/duduclaza/toner-management-system.git
cd toner-management-system
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="sua_url_do_postgresql"
SESSION_SECRET="sua_chave_secreta"
NODE_ENV="development"
```

### 4. Configure o banco de dados
```bash
npm run db:push
```

### 5. Execute o projeto
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 🏗️ Estrutura do Projeto

```
TonerForm/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── contexts/     # Contextos React
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilitários
│   │   └── types/        # Tipos TypeScript
├── server/                # Backend Express
│   ├── index.ts          # Servidor principal
│   ├── routes.ts         # Rotas da API
│   └── storage.ts        # Configuração de sessão
├── shared/               # Código compartilhado
│   └── schema.ts         # Schema do banco de dados
└── migrations/           # Migrações do banco
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Executa em modo desenvolvimento
npm run build        # Build para produção
npm run start        # Executa em modo produção
npm run check        # Verificação de tipos TypeScript
npm run db:push      # Aplica migrações no banco
```

## 📊 Cálculos Automáticos

### Gramatura
O sistema calcula automaticamente:
- **Gramatura**: Peso do pó de toner
- **Percentual**: Baseado no peso retornado vs. peso cheio
- **Recomendações**: Baseadas no percentual de gramatura

### Recomendações de Qualidade
- **0-5%**: Descartar
- **6-40%**: Testar qualidade, usar internamente se bom
- **41-80%**: Testar qualidade, estocar como semi-novo
- **81-100%**: Testar qualidade, estocar como novo

## 🔐 Autenticação e Autorização

- Sistema de login com sessões
- Controle de acesso baseado em permissões
- Módulos específicos por usuário
- Status ativo/inativo de usuários

## 🎨 Interface

- Design moderno inspirado no Microsoft Fluent
- Componentes acessíveis (Radix UI)
- Responsivo para desktop e mobile
- Tema escuro/claro
- Animações suaves

## 📈 Relatórios e Métricas

- Dashboard com estatísticas em tempo real
- Gráficos de retornados por mês
- Análise de garantias por fornecedor
- Relatórios de valor recuperado
- Métricas de qualidade

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Seu Nome** - *Desenvolvimento inicial* - [SeuGitHub](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- [shadcn/ui](https://ui.shadcn.com/) pelos componentes
- [Radix UI](https://www.radix-ui.com/) pela acessibilidade
- [Drizzle ORM](https://orm.drizzle.team/) pela type safety
- [TanStack Query](https://tanstack.com/query) pelo gerenciamento de estado

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório! 
=======
# toner-management-system
Sistema completo de gestão de cartuchos de toner
>>>>>>> 753fb2eb7f7a04b6a0e6fbd93a81603ee0a8efd1
