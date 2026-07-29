# Relatório técnico de refatoração — rastreamento SSW

**Comparação:** commit `1d66a82` (`HEAD`) × alterações locais não commitadas  
**Branch analisada:** `v2-rastreamento`  
**Data da análise:** 29 de julho de 2026  
**Escopo:** lógica de negócio, arquitetura, API, scraping, tipagem e interface

## 1. Objetivo

Este documento explica a transformação do fluxo de rastreamento a partir do diff dos arquivos modificados. A comparação considera o código do commit atual (`HEAD`) como o estado **anterior** e o conteúdo presente no working tree como o estado **atual**.

O foco é responder quatro perguntas:

1. Como a busca e o detalhe funcionavam antes?
2. Como esses fluxos funcionam agora?
3. Quais arquivos e contratos foram alterados?
4. Quais impactos, ganhos e pontos de atenção surgem com a mudança?

> **Resumo executivo:** a refatoração retira a orquestração do antigo `src/services/tracking.service.ts`, cria casos de uso em `core/domain/tracking`, move utilitários comuns para `core/domain/common`, aproxima scraper e parser da integração SSW e troca as APIs de `POST` com corpo JSON por `GET` com query string. A maior mudança funcional é a busca inicial deixar de consultar o detalhe de todas as encomendas, reduzindo chamadas externas. Em contrapartida, o contrato da listagem, a marcação de tempo, o tratamento de erros e a exposição do CPF mudaram.

## 2. Escopo do diff

No instante da análise, o conjunto funcional continha:

- 16 arquivos modificados;
- 6 arquivos removidos;
- 8 arquivos novos ainda não rastreados pelo Git;
- 22 arquivos já rastreados no diff, com 57 inserções e 817 remoções;
- 627 linhas nos 8 arquivos novos.

No total, são 30 arquivos afetados pela refatoração, sem contar este relatório.

### 2.1. Blocos afetados

- API interna do Next.js;
- orquestração de domínio;
- integração e scraping do SSW;
- parsing do HTML;
- validação e formatação;
- contratos TypeScript;
- formulário de busca e tela de detalhe;
- apresentação do CPF e pequenos comportamentos visuais;
- documentação e aliases de importação.

## 3. Arquitetura anterior

Antes, quase todo o pipeline de aplicação estava dentro de `src/`:

```text
Interface
  → POST /api/tracking
  → route.ts (leitura do body + tradução de erros HTTP)
  → src/services/tracking.service.ts
  → validator
  → scraper SSW
  → parser
  → resposta padronizada
```

O arquivo `src/services/tracking.service.ts` era o orquestrador central. Ele expunha dois casos de uso:

- `getTrackingByCpf(cpf)`;
- `getTrackingDetailById(cpf, trackingId)`.

As rotas HTTP conheciam o service e mantinham localmente a conversão dos erros de domínio para status HTTP e para o contrato `{ success: false, error, code }`.

### 3.1. Busca de encomendas antes

O fluxo da listagem executava:

1. validação e normalização do CPF;
2. carregamento do formulário público do SSW;
3. envio do formulário para obter a listagem;
4. parsing das linhas da listagem;
5. para **cada encomenda**, consulta paralela da página de detalhe;
6. parsing de todos os eventos de cada detalhe;
7. conversão do detalhe em `PackageSummary`;
8. retorno de um `TrackingResponse` com `success`, `data.packages` e `scrapedAt`.

O resumo usava os dados enriquecidos da página de detalhe. Por isso:

- `eventCount` representava `detail.events.length`;
- destinatário, nota fiscal, pedido e status podiam ser confirmados ou enriquecidos pelo detalhe;
- a última ocorrência vinha de `detail.events[0]`, com fallback para a listagem.

O custo externo aproximado de uma busca com **N encomendas** era:

```text
1 carregamento do formulário + 1 consulta da lista + N consultas de detalhe
= N + 2 chamadas externas
```

### 3.2. Detalhe antes

Ao abrir uma encomenda, o frontend fazia:

```http
POST /api/tracking/detail
Content-Type: application/json
```

com `cpf` e `trackingId` no corpo. O service:

1. validava o CPF;
2. normalizava o identificador;
3. consultava novamente a listagem do CPF;
4. localizava a encomenda;
5. consultava sua página de detalhe;
6. extraía e ordenava os eventos;
7. retornava `TrackingDetailResponse`.

### 3.3. Contratos e erros antes

A listagem bem-sucedida seguia este formato:

```json
{
  "success": true,
  "data": {
    "packages": []
  },
  "scrapedAt": "2026-03-28T03:30:18.493Z"
}
```

Os erros tinham contrato uniforme:

```json
{
  "success": false,
  "error": "mensagem",
  "code": "ERROR_CODE"
}
```

Mapeamento HTTP anterior:

| Código | HTTP |
|---|---:|
| `INVALID_CPF` | 400 |
| `TRACKING_NOT_FOUND` | 404 |
| `SSW_UNAVAILABLE` | 502 |
| `SCRAPING_FAILED` | 502 |
| erro não reconhecido | 500 |

## 4. Arquitetura atual

O working tree introduz duas áreas principais:

```text
core/
├── domain/common/
│   └── utils/
└── domain/tracking/

src/services/ssw/tracking/
├── getTracking.gateway.ts
└── tracking.parser.ts
```

O fluxo pretendido passa a separar casos de uso de rastreamento em `core/domain/tracking` e detalhes da integração SSW em `src/services/ssw/tracking`.

### 4.1. Fluxo atual da listagem

```text
CpfSearchForm
  → GET /api/tracking?cpf=...
  → src/app/api/tracking/route.ts
  → GET de getTracking.gateway.ts
  → core/domain/tracking/tracking.ts
  → scrapeTrackingByCpf
  → parseTrackingListHtml
  → PackageSummary[]
```

O caso de uso `getTrackingByCpf` agora:

1. valida o CPF;
2. consulta somente a página de listagem;
3. faz o parsing das linhas;
4. converte cada `TrackingListItem` diretamente em `PackageSummary`;
5. retorna um array simples.

Não há mais consulta de detalhe para cada item durante a busca inicial.

O custo externo aproximado passa a ser constante:

```text
1 carregamento do formulário + 1 consulta da lista
= 2 chamadas externas
```

Para N encomendas, a economia da busca inicial é de aproximadamente **N chamadas de detalhe**.

### 4.2. Fluxo atual do detalhe

```text
TrackingDetailView
  → GET /api/tracking/detail?cpf=...&trackingId=...
  → route.ts
  → GET_DETAIL de getTracking.gateway.ts
  → core/domain/tracking/tracking-detail.ts
  → consulta e parsing da lista
  → localização do trackingId
  → consulta e parsing do detalhe
  → TrackingDetailResponse
```

O detalhe continua sendo carregado sob demanda. Depois de uma listagem, abrir uma encomenda adiciona três chamadas externas: formulário, lista e detalhe.

Considerando busca inicial + abertura de um item:

| Cenário | Antes | Agora |
|---|---:|---:|
| Busca inicial com N encomendas | N + 2 | 2 |
| Busca inicial + abertura de um detalhe | N + 5 | 5 |

### 4.3. Contrato atual da listagem

A rota principal retorna diretamente:

```json
[
  {
    "id": "abc123",
    "recipient": "Nome",
    "nfNumber": "123",
    "orderNumber": "456",
    "currentStatus": "em_transito",
    "lastEvent": {},
    "eventCount": 1
  }
]
```

Foram removidos da resposta HTTP da listagem:

- `success`;
- `data`;
- `scrapedAt` gerado no servidor.

O frontend reconstrói localmente `payload: { packages }` para manter o formato do cache e define `scrapedAt` com `new Date().toISOString()` no navegador. Portanto, esse horário passa a representar o momento de recebimento/processamento no cliente, não exatamente o momento da coleta no servidor.

### 4.4. Contrato atual de erros

O corpo de erro passa a ser simplificado:

```json
{
  "error": "mensagem"
}
```

Não são mais enviados `success: false` nem `code`.

Mapeamento atual:

| Rota | Condição | HTTP atual |
|---|---|---:|
| listagem | `INVALID_CPF` | 400 |
| listagem | qualquer outro erro | 500 |
| detalhe | `INVALID_CPF` | 400 |
| detalhe | `TRACKING_NOT_FOUND` | 404 |
| detalhe | qualquer outro erro | 500 |

Com isso, `SSW_UNAVAILABLE` e `SCRAPING_FAILED`, antes tratados como `502`, passam a chegar como `500`.

## 5. Mudanças por camada

### 5.1. Domínio e orquestração

#### Removido: `src/services/tracking.service.ts`

Antes, concentrava listagem e detalhe no mesmo módulo, montava os envelopes de resposta e enriquecia todos os resumos com o detalhe.

Agora, suas responsabilidades foram divididas:

- `core/domain/tracking/tracking.ts`: listagem;
- `core/domain/tracking/tracking-detail.ts`: detalhe;
- `core/domain/common/utils/error/logger.ts`: criação, log e lançamento de erros.

#### Novo: `core/domain/tracking/tracking.ts`

- cria um helper privado para validar CPF, fazer scraping e parsing da lista;
- retorna `Promise<PackageSummary[]>`;
- elimina o `Promise.all` de detalhes;
- copia os campos existentes na listagem;
- define `eventCount: 1`.

Esse valor não representa necessariamente o total real de eventos. O tipo foi tornado opcional, mas o caso de uso atual ainda fornece `1`.

#### Novo: `core/domain/tracking/tracking-detail.ts`

- separa o caso de uso de detalhe;
- mantém o comportamento de consultar a lista para validar que o `trackingId` pertence ao CPF;
- consulta o detalhe apenas do item selecionado;
- mantém o envelope `TrackingDetailResponse`.

#### Novo: `core/domain/common/utils/error/logger.ts`

O helper `logError`:

1. escreve no `console.error` com código e mensagem;
2. cria um `Error`;
3. anexa a propriedade `code`;
4. lança o erro;
5. usa retorno `never` para informar ao TypeScript que o fluxo é interrompido.

### 5.2. Integração com o SSW

#### Removido: `src/utils/scrapers/tracking.scraper.ts`

Seu conteúdo foi incorporado a `src/services/ssw/tracking/getTracking.gateway.ts`.

O comportamento de scraping permaneceu essencialmente o mesmo:

- execução de `curl` via `execFile`;
- timeout configurável;
- uma repetição para exit code 28;
- carregamento dinâmico do formulário;
- captura de campos ocultos;
- envio `application/x-www-form-urlencoded`;
- validação básica do HTML retornado;
- erros `SSW_UNAVAILABLE` e `SCRAPING_FAILED`.

#### Novo: `src/services/ssw/tracking/getTracking.gateway.ts`

O arquivo passou a acumular três papéis:

1. implementação de scraping do SSW;
2. handlers HTTP `GET` e `GET_DETAIL`;
3. adaptação de erros para status HTTP.

Ele é importado pelas rotas e também pelos casos de uso do `core`.

#### Parser movido

`src/utils/parsers/tracking.parser.ts` foi removido e recriado como:

```text
src/services/ssw/tracking/tracking.parser.ts
```

A lógica permaneceu praticamente igual:

- extração de linhas e células;
- criação do identificador;
- derivação de status por palavras-chave;
- composição da descrição;
- extração de destinatário, NF e pedido;
- ordenação decrescente dos eventos;
- fallback para dados da listagem.

A alteração funcional principal é o parser de detalhe deixar de ser usado pela listagem inicial.

### 5.3. Utilitários compartilhados

Foram movidos de `src/utils` para `core/domain/common/utils`:

- `cpf.formatter.ts`;
- `date.formatter.ts`;
- `cpf.validator.ts`.

As funções foram preservadas. Os consumidores passaram a importar pelo alias `@core/*`.

Observações:

- `maskCpfHidden` continua existindo no novo arquivo, embora a tela de listagem tenha deixado de usá-lo;
- `date.formatter.ts` no `core` ainda importa `STATUS_LABELS` de `src/utils/constants`;
- o validator no `core` ainda importa o tipo `CpfValidationResult` de `src/types`.

### 5.4. API do Next.js

#### `src/app/api/tracking/route.ts`

Antes:

- implementava `POST`;
- lia JSON do corpo;
- chamava o service;
- construía respostas de erro detalhadas.

Agora:

- reexporta `GET` do gateway;
- mantém apenas `runtime = "nodejs"`.

#### `src/app/api/tracking/detail/route.ts`

Antes:

- implementava `POST`;
- lia `cpf` e `trackingId` do corpo;
- possuía todo o mapeamento de erros.

Agora:

- importa `GET_DETAIL`;
- o exporta como `GET`;
- mantém `runtime = "nodejs"`.

As rotas ficaram muito menores, mas a responsabilidade HTTP foi deslocada para o arquivo chamado de gateway.

### 5.5. Frontend

#### `CpfSearchForm.tsx`

Alterações:

- usa `GET /api/tracking?cpf=...`;
- consome `PackageSummary[]` em vez de `TrackingResponse`;
- consulta o corpo de erro somente quando `response.ok` é falso;
- recria `payload: { packages }` para o provider;
- gera `scrapedAt` no cliente;
- usa o objeto completo retornado por `useTracking`;
- adiciona `name="cpf"`;
- adiciona um `datalist` com o CPF da busca anterior;
- passa a importar formatter e validator pelo alias `@core`.

#### `TrackingDetailView.tsx`

- troca `POST` com JSON por `GET` com `URLSearchParams`;
- mantém o consumo do envelope `TrackingDetailResponse`;
- continua aceitando `TrackingError` no tipo, embora o backend atual não retorne mais esse contrato completo.

#### `TrackingListView.tsx`

- troca `maskCpfHidden` por `maskCpf`;
- o CPF deixa de aparecer parcialmente oculto e passa a ser exibido completo, apenas formatado.

#### Imports atualizados

Os arquivos abaixo mudaram somente a origem dos formatters/validator:

- `src/app/tracking/[id]/page.tsx`;
- `src/features/tracking/components/PackageCard.tsx`;
- `src/features/tracking/components/PackageList.tsx`;
- `src/features/tracking/components/StatusBadge.tsx`;
- `src/features/tracking/provider/TrackingProvider.tsx`.

#### Ajustes visuais e de interação

- `Button.tsx`: adiciona `cursor-pointer`;
- `Input.tsx`: oculta o indicador WebKit de lista/calendário;
- `globals.css`: reforça globalmente a ocultação de `::-webkit-calendar-picker-indicator` e `::-webkit-list-button`.

O objetivo aparente é permitir sugestão via `datalist` sem exibir o indicador nativo do navegador.

### 5.6. Tipagem e resolução de módulos

#### `src/types/tracking.types.ts`

`eventCount` mudou de obrigatório para opcional:

```ts
eventCount?: number;
```

Isso acomoda resumos que não carregam todos os detalhes. Entretanto, o caso de uso atual ainda fixa o valor em `1`, em vez de omiti-lo.

#### `tsconfig.json`

Foi adicionado:

```json
"@core/*": ["./core/*"]
```

O alias permite acessar o novo diretório fora de `src/` sem imports relativos longos.

### 5.7. README

O README foi parcialmente atualizado para mencionar `core/` e Clean Architecture.

Ainda existem divergências entre a documentação e o código atual:

- documenta `POST /api/tracking`, mas a rota atual é `GET`;
- documenta `POST /api/tracking/detail`, mas a rota atual é `GET`;
- mostra CPF no corpo JSON, mas agora os dados ficam na query string;
- mostra a listagem com envelope `success/data/scrapedAt`, mas a rota retorna array;
- mostra erro com `success` e `code`, mas o backend atual retorna somente `error`;
- descreve `core/services`, mas os arquivos estão em `core/domain`;
- a árvore ainda posiciona parser e scraper em `src/utils`, embora tenham sido movidos;
- afirma que o service devolve `TrackingResponse`, mas a listagem retorna `PackageSummary[]`;
- afirma que a API route apenas adapta HTTP/JSON, porém a adaptação está no mesmo arquivo que implementa o scraping.

## 6. Comparativo consolidado

| Aspecto | Antes | Agora |
|---|---|---|
| Método da listagem | `POST` | `GET` |
| Entrada da listagem | JSON no corpo | `cpf` na query string |
| Método do detalhe | `POST` | `GET` |
| Entrada do detalhe | JSON no corpo | `cpf` e `trackingId` na query string |
| Retorno da listagem | `TrackingResponse` | `PackageSummary[]` |
| Horário da listagem | servidor | navegador |
| Enriquecimento inicial | detalhe de todos os itens | somente dados da lista |
| Custo da listagem | N + 2 chamadas SSW | 2 chamadas SSW |
| `eventCount` | contagem real | valor fixo `1` |
| Erro HTTP | `{ success, error, code }` | `{ error }` |
| Falhas do SSW | HTTP 502 | HTTP 500 |
| Orquestração | um service em `src` | dois casos de uso em `core` |
| Parser/scraper | `src/utils` | `src/services/ssw` |
| CPF na tela | parcialmente oculto | completo e formatado |
| Reuso do CPF | sem sugestão | `datalist` da sessão |

## 7. Ganhos obtidos

### 7.1. Menor custo e menor latência na listagem

Este é o ganho funcional mais relevante. A busca inicial deixa de depender do detalhe de cada pacote, reduzindo chamadas, tempo total e probabilidade de uma falha individual comprometer toda a listagem.

### 7.2. Casos de uso separados

Listagem e detalhe deixam de compartilhar um service grande e passam a ter módulos próprios. Isso facilita leitura, evolução e testes direcionados.

### 7.3. Organização por contexto externo

Parser e scraping do SSW passam a ficar juntos sob `src/services/ssw/tracking`, deixando explícito que são dependentes do formato do fornecedor.

### 7.4. Rotas físicas menores

Os `route.ts` do App Router se tornam apenas pontos de exportação e configuração de runtime.

### 7.5. Alias explícito para o core

O alias `@core` torna a nova fronteira visível nos imports e reduz caminhos relativos.

### 7.6. Logging centralizado para erros de domínio

CPF inválido e encomenda não encontrada passam por um helper comum que registra e lança o erro com código.

## 8. Pontos de atenção e riscos

### 8.1. Dependência circular entre core e gateway — alta relevância

Atualmente:

```text
getTracking.gateway.ts
  → importa getTrackingByCpf/getTrackingDetailById do core

core/domain/tracking/*
  → importa scrapeTrackingByCpf/scrapeTrackingDetail do gateway
```

Isso cria a direção:

```text
gateway → core → gateway
```

Além do risco de ciclo de módulos, essa dependência contraria a separação esperada de Clean Architecture: o domínio conhece diretamente a implementação de infraestrutura.

Uma fronteira mais estável seria:

```text
route/controller → caso de uso → interface de gateway
                                  ↑
                       implementação SSW
```

### 8.2. Gateway com responsabilidades acumuladas — alta relevância

`getTracking.gateway.ts` contém transporte HTTP, scraping e tradução de erros. Isso reduz a coesão e torna testes e manutenção mais difíceis.

Uma divisão possível:

- `sswTracking.gateway.ts`: chamadas ao SSW;
- `tracking.controller.ts` ou os próprios `route.ts`: HTTP;
- `core/domain/tracking/*`: casos de uso;
- uma interface/porta para inverter a dependência.

### 8.3. CPF na query string — alta relevância de privacidade

Com `GET`, o CPF passa a integrar a URL. URLs podem aparecer em:

- histórico do navegador;
- logs do servidor, proxy e CDN;
- ferramentas de analytics e observabilidade;
- traces e mensagens de erro;
- cabeçalho `Referer`, dependendo da navegação e da política aplicada.

Antes, o CPF era enviado no corpo do `POST`, reduzindo essa exposição incidental.

### 8.4. Exibição do CPF completo — alta relevância de privacidade

A listagem trocou `maskCpfHidden` por `maskCpf`. O valor exibido mudou de algo como:

```text
•••.•••.789-00
```

para:

```text
123.456.789-00
```

Isso aumenta a exposição visual de dado pessoal e deve ser uma decisão consciente de produto e segurança.

### 8.5. Regressão do contrato de erro — média/alta relevância

Consumidores deixam de receber códigos estáveis e não distinguem falha do fornecedor de falha interna. A perda dos status `502` também dificulta monitoramento e políticas de retry.

### 8.6. `eventCount` não representa a contagem real — média relevância

O valor atual é sempre `1`. Se a intenção é declarar “há pelo menos um evento”, o nome pode induzir ao erro. Alternativas:

- omitir `eventCount` na listagem;
- renomear para um indicador compatível;
- obter a contagem apenas no detalhe;
- manter um campo retornado diretamente pela listagem, se o SSW o disponibilizar.

### 8.7. Horário gerado no cliente — média relevância

O `scrapedAt` da listagem depende do relógio do dispositivo e representa o recebimento, não a coleta. Isso pode produzir diferenças de fuso, relógio incorreto e semântica inconsistente com o detalhe.

### 8.8. Contratos antigos permanecem exportados — média relevância

`TrackingResponse` e `TrackingError` continuam em `src/types`, mas a listagem não os usa mais. A tela de detalhe ainda tipa o erro como `TrackingError`, apesar do novo corpo parcial. Isso cria diferença entre contrato declarado e contrato real.

### 8.9. Política de cache não está explícita — média relevância

As rotas passaram a usar `GET` para dados dinâmicos e pessoais. O diff não adiciona uma política explícita de `no-store`/cache no frontend ou nos headers. Mesmo que o runtime atual não faça cache por padrão nesse caso, a intenção deveria ser documentada e protegida nas camadas de proxy/CDN.

### 8.10. README inconsistente — média relevância

O README mistura a arquitetura antiga com a atual. Isso pode induzir consumidores a usar método, payload e contrato incorretos.

### 8.11. Pequena duplicação entre casos de uso — baixa relevância

`fetchTrackingListByCpf` aparece com a mesma implementação em `tracking.ts` e `tracking-detail.ts`. Pode ser extraído se a duplicação crescer.

## 9. Inventário completo de arquivos

### 9.1. Novos

| Arquivo | Papel atual |
|---|---|
| `core/domain/common/utils/error/logger.ts` | registra e lança erros codificados |
| `core/domain/common/utils/formatters/cpf.formatter.ts` | formatação e limpeza de CPF movidas para o core |
| `core/domain/common/utils/formatters/date.formatter.ts` | normalização, datas e labels movidas para o core |
| `core/domain/common/utils/validators/cpf.validator.ts` | validação de CPF movida para o core |
| `core/domain/tracking/tracking.ts` | caso de uso de listagem |
| `core/domain/tracking/tracking-detail.ts` | caso de uso de detalhe |
| `src/services/ssw/tracking/getTracking.gateway.ts` | scraping, handlers HTTP e tradução de erros |
| `src/services/ssw/tracking/tracking.parser.ts` | parser HTML específico do SSW |

### 9.2. Removidos

| Arquivo | Destino da responsabilidade |
|---|---|
| `src/services/tracking.service.ts` | dividido entre os dois casos de uso do core |
| `src/utils/formatters/cpf.formatter.ts` | movido para `core/domain/common` |
| `src/utils/formatters/date.formatter.ts` | movido para `core/domain/common` |
| `src/utils/validators/cpf.validator.ts` | movido para `core/domain/common` |
| `src/utils/parsers/tracking.parser.ts` | movido para `src/services/ssw/tracking` |
| `src/utils/scrapers/tracking.scraper.ts` | incorporado ao gateway SSW |

### 9.3. Modificados

| Arquivo | Mudança |
|---|---|
| `README.md` | atualização parcial da descrição arquitetural |
| `src/app/api/tracking/route.ts` | `POST` local substituído por reexport de `GET` |
| `src/app/api/tracking/detail/route.ts` | `POST` local substituído por reexport de `GET_DETAIL` como `GET` |
| `src/app/globals.css` | oculta indicadores WebKit do input |
| `src/app/tracking/[id]/page.tsx` | import do validator pelo `@core` |
| `src/components/ui/Button.tsx` | adiciona cursor de clique |
| `src/components/ui/Input.tsx` | oculta indicador WebKit via classes |
| `src/features/tracking/components/CpfSearchForm.tsx` | novo método/contrato da API e sugestão de CPF recente |
| `src/features/tracking/components/PackageCard.tsx` | import do formatter pelo `@core` |
| `src/features/tracking/components/PackageList.tsx` | import do formatter pelo `@core` |
| `src/features/tracking/components/StatusBadge.tsx` | import do label pelo `@core` |
| `src/features/tracking/components/TrackingDetailView.tsx` | detalhe via `GET` e query string |
| `src/features/tracking/components/TrackingListView.tsx` | exibição do CPF completo formatado |
| `src/features/tracking/provider/TrackingProvider.tsx` | import do sanitizador pelo `@core` |
| `src/types/tracking.types.ts` | `eventCount` opcional |
| `tsconfig.json` | alias `@core/*` |

## 10. Validação realizada

Foram executadas verificações locais sem alterar o código funcional:

| Verificação | Resultado |
|---|---|
| `npm run lint` | aprovado |
| `tsc --noEmit` | aprovado |
| `npm run build` | não concluído por indisponibilidade de rede ao baixar a fonte Inter do Google Fonts |
| `git diff --check` | apontou whitespace final em uma linha modificada do README |

O erro de build observado não indica erro TypeScript ou falha da refatoração; ocorreu na etapa de obtenção da fonte externa.

## 11. Recomendações de consolidação

1. Separar handlers HTTP da implementação do gateway SSW.
2. Inverter a dependência entre `core` e infraestrutura para eliminar o ciclo.
3. Decidir conscientemente entre `POST` e `GET` considerando o CPF como dado pessoal.
4. Restaurar um contrato de erro estável e o mapeamento `502` para falhas externas.
5. Omitir ou corrigir `eventCount`.
6. Definir uma única semântica de `scrapedAt`, preferencialmente no servidor.
7. Revisar a exibição do CPF completo e a sugestão persistida em `sessionStorage`.
8. Declarar política de cache para as rotas.
9. Atualizar integralmente o README e exemplos de API.
10. Adicionar testes unitários para validator/parser e testes de contrato para as duas rotas.

## 12. Conclusão

A refatoração melhora significativamente a eficiência da listagem e torna explícita a intenção de separar casos de uso e integração externa. O principal ganho é deixar de consultar todos os detalhes antes de apresentar a lista.

O estado atual, porém, ainda é uma etapa intermediária da arquitetura proposta. A dependência circular, o acúmulo de responsabilidades no gateway, a mudança de contrato sem atualização completa da documentação e a maior exposição do CPF merecem tratamento antes de considerar a migração consolidada.

Em termos funcionais, a nova lógica pode ser resumida assim:

```text
ANTES
buscar CPF → carregar lista → carregar todos os detalhes → montar resumos completos

AGORA
buscar CPF → carregar somente a lista → montar resumos rápidos
                                  ↓
                      carregar detalhe ao selecionar
```
