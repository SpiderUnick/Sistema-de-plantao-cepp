# Sistema de Gestão de Escalas e Plantões

Um sistema completo para gestão hospitalar de escalas, plantões e funcionários com autenticação real via Supabase.

## 🚀 Funcionalidades

### ✅ **Implementadas:**
- **🔐 Autenticação Real**: Login/logout via Supabase Auth
- **👥 Gestão de Usuários**: Cadastro, edição, permissões por cargo
- **📅 Calendário Visual**: Estilo Google Calendar com eventos multi-dia
- **🏢 Departamentos**: Cores personalizadas e hierarquia
- **🔒 Row Level Security**: Permissões granulares no banco
- **⚡ Real-time**: Atualizações em tempo real
- **📱 Responsivo**: Interface mobile-first

### 🚧 **Em Desenvolvimento:**
- Criação de escalas e plantões
- Sistema de mentoria
- Solicitações de troca
- Controle de ausências
- Relatórios e métricas
- Templates de escala

## 🏗️ **Arquitetura Técnica**

### **Frontend:**
- ⚛️ **React 19** + TypeScript
- 🎨 **Tailwind CSS** para styling
- 🚀 **Vite** para desenvolvimento
- 📍 **React Router** para navegação
- 📊 **Hooks customizados** para Supabase

### **Backend:**
- 🗄️ **Supabase PostgreSQL** como banco
- 🔐 **Supabase Auth** para autenticação
- 🛡️ **Row Level Security (RLS)** para segurança
- ⚡ **Real-time subscriptions**
- 📝 **Logs de auditoria** automáticos

## 🛠️ **Configuração**

### **1. Clone e Instale Dependências:**
```bash
git clone <repository>
cd shift-management
yarn install
```

### **2. Configure o Supabase:**

1. **Crie um projeto** no [Supabase](https://supabase.com)
2. **Copie as credenciais** do projeto
3. **Atualize o arquivo `.env`:**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### **3. Configure o Banco de Dados:**

Execute os scripts SQL na seguinte ordem no Supabase SQL Editor:

1. **`src/database/schema.sql`** - Cria as tabelas e estrutura
2. **`src/database/rls.sql`** - Configura as políticas de segurança  
3. **`src/database/seed.sql`** - Insere dados iniciais

### **4. Execute o Projeto:**
```bash
yarn dev
```

## 🔐 **Sistema de Permissões**

### **Cargos e Níveis:**
1. **Diretor** (Nível 1) - Acesso total
2. **Coordenador** (Nível 2) - Gestão departamental
3. **Gerente** (Nível 3) - Equipe do departamento
4. **Analista** (Nível 4) - Visualização de relatórios
5. **Funcionário** (Nível 5) - Dados próprios

### **Row Level Security (RLS):**
- **Usuários** veem apenas dados próprios ou do departamento
- **Gerentes** controlam sua equipe
- **Coordenadores** gerenciam departamentos
- **Diretores** têm acesso completo

## 📊 **Estrutura do Banco**

### **Tabelas Principais:**
- `profiles` - Usuários/funcionários
- `roles` - Cargos e hierarquias
- `departments` - Departamentos organizacionais
- `schedules` - Escalas de trabalho
- `shifts` - Plantões individuais
- `mentorships` - Sistema de mentoria
- `shift_exchanges` - Trocas de plantão
- `absences` - Ausências e licenças
- `audit_logs` - Logs de auditoria

### **Relacionamentos:**
- Usuários pertencem a departamentos e têm cargos
- Escalas são criadas por departamento
- Plantões estão vinculados a escalas e usuários
- Permissões são baseadas em cargos

## 🎨 **Interface**

### **Calendário Google-Style:**
- Visualização mensal com grid de semanas
- Eventos multi-dia com barras coloridas
- Filtros por departamento
- Tooltips informativos
- Navegação mensal

### **Componentes Reutilizáveis:**
- `Button`, `Card`, `Badge` - UI consistente
- `Layout` - Sidebar + Header responsivos
- Hooks customizados para Supabase
- Contextos para autenticação

## 🔧 **Desenvolvimento**

### **Hooks Úteis:**
```typescript
// CRUD genérico
const { data, loading, create, update, remove } = useSupabaseTable('shifts');

// Perfis com joins
const { profiles, loading } = useProfiles();

// Plantões com filtros
const { shifts, loading } = useShifts({ departmentId: 'xxx' });

// Real-time
useRealtimeSubscription('shifts', (payload) => {
  console.log('Mudança em plantão:', payload);
});
```

### **Autenticação:**
```typescript
const { user, profile, signIn, signOut, hasPermission } = useSupabaseAuth();

// Verificar permissão
if (hasPermission('users', 'create')) {
  // Usuário pode criar usuários
}
```

## 📁 **Estrutura de Arquivos**
```
src/
├── components/        # Componentes UI reutilizáveis
├── contexts/         # Contextos React (Auth)
├── database/         # Scripts SQL (schema, RLS, seed)
├── hooks/           # Hooks customizados para Supabase
├── lib/             # Utilitários (Supabase client, utils)
├── pages/           # Páginas da aplicação
└── types/           # Tipos TypeScript
```

## 🚀 **Próximos Passos**

1. **Implementar criação de escalas**
2. **Sistema completo de plantões**
3. **Mentoria e acompanhamentos**
4. **Solicitações e aprovações**
5. **Relatórios e métricas**
6. **Notificações push**
7. **Exportação de dados**

---

**Desenvolvido com ❤️ para gestão hospitalar eficiente**
