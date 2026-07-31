# 13. Reorganização Arquitetural, Camada Core/Infra e Identidade do Usuário

## 1. Visão Geral

Este documento descreve a reestruturação arquitetural realizada na aplicação de rastreamento logístico, focando no desacoplamento de responsabilidades, padronização da camada `core/infra`, eliminação de pastas redundantes e integração da identidade do usuário (nome e CPF) ao fluxo de autenticação e sessão.

---

## 2. Inventário de Arquivos Modificados e Criados

### 2.1. Arquitetura Core e Infraestrutura (`core/infra`)
- **`core/infra/config/index.ts`** `[NOVO]`
  - Centralização das variáveis de ambiente e runtime env. Movido de `src/config`.
- **`core/infra/store/userStore.ts`** `[NOVO]`
  - Implementação isolada da camada de persistência em `localStorage` (`getStoredCpf`, `setStoredCpf`, `getStoredUserName`, `setStoredUserName`, `removeStoredUser`).
- **`src/utils/tailwind.util.ts`** `[NOVO]`
  - Utilitário central de combinação de classes Tailwind (`cn()`), desacoplado da antiga pasta `src/lib`.

### 2.2. Reorganização da Rota de Rastreamento (`src/app/(left-nav-bar)/rastreamento/`)
- **`src/app/(left-nav-bar)/rastreamento/_components/`**
  - Centralização de todos os componentes visuais de rastreamento: `TrackingResultsList.tsx`, `TrackingFilterBar.tsx`, `TrackingRow.tsx`, `StatusBadge.tsx`, `PackageCard.tsx`, `PackageDetail.tsx`, `TrackingTimeline.tsx`, `HeaderTrackingSearch.tsx`, `TrackingLoadingStates.tsx`.
- **`src/app/(left-nav-bar)/rastreamento/_hooks/`**
  - `useTrackingResults.ts`: Convertido de `.tsx` para `.ts` puro, removendo JSX inline e isolando a lógica de filtragem e busca.
  - `useTrackingDetail.ts`: Custom hook para busca e estado do detalhe da encomenda.
  - `useTrackingData.ts`: Hook de integração com os gateways de consulta.
- **`src/app/(left-nav-bar)/rastreamento/_context/`**
  - `TrackingSearchContext.tsx`: Contexto de busca global de encomendas movido da camada genérica de layout para o escopo do rastreamento.
- **`src/app/(left-nav-bar)/rastreamento/[...detalhes]/page.tsx`** `[NOVO/REFATORADO]`
  - Migração de `detalhes-da-encomenda/[id]` para a rota dinamicamente capturada `[...detalhes]`. Eliminação da subpasta `[id]` e da renderização intermediária `TrackingDetailView.tsx`.

### 2.3. Identidade do Usuário e Login (`src/app/login/`)
- **`src/app/login/_components/LoginForm.tsx`** & **`src/app/login/_hooks/useLoginForm.ts`**
  - Adição do campo **"Seu nome"** com validação de preenchimento e armazenamento integrado no `userStore`.
- **`src/app/login/_hooks/useRequireCpfAuth.ts`**
  - Expansão da sessão para expor `userName` e correção da lógica de redirecionamento, garantindo que usuários autenticados naveguem livremente por todas as rotas sem serem forçados de volta para `/rastreamento`.

### 2.4. Estrutura do Layout Global (`src/components/layout/`)
- **`src/components/layout/sidebar/app-sidebar.tsx`**
  - Atualização do rodapé da barra lateral com card de perfil exibindo as iniciais do usuário, nome completo, CPF mascarado e botão de desconexão.
- **`src/components/layout/header/`** & **`src/components/layout/footer/`**
  - Separação dos componentes de layout global em subpastas com responsabilidades bem definidas.

### 2.5. Eliminação de Redundâncias e Limpeza
- **`src/config`**: Removido e integrado em `core/infra/config`.
- **`src/lib`**: Removido após migrar `utils.ts` para `src/utils/tailwind.util.ts`.
- **`src/hooks`**: Removido após incorporar o hook `useIsMobile` diretamente em `src/components/ui/sidebar.tsx`.
- **`src/utils/index.ts`**: Removido arquivo duplicado do utilitário `cn`.
- **`src/app/(left-nav-bar)/rastreamento/[...data]`**: Removida pasta redundante, subindo os arquivos para a estrutura modular de `rastreamento`.

---

## 3. Benefícios Arquiteturais

1. **Separação Estrita de Responsabilidades (Clean Architecture)**:
   - A camada `core/infra` agora concentra adequadamente os aspectos de infraestrutura (configurações e armazenamento local), deixando a camada de UI limpa.
2. **Eliminação de Dependências Desnecessárias**:
   - Pastas genéricas como `src/lib` e `src/hooks` foram eliminadas em favor de utilitários tipados e escopados.
3. **Consistência de Nomenclatura e Arquivos Puros**:
   - Hooks sem JSX (como `useTrackingResults.ts`) foram padronizados com a extensão `.ts`.
4. **Experiência do Usuário (UX/DX)**:
   - O nome do usuário foi integrado por toda a aplicação (formulário de login, sessão e perfil no menu lateral).
