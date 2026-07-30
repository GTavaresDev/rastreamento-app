# Índice da documentação técnica de tracking

Este arquivo deixou de concentrar toda a explicação da refatoração em um relatório único. O conteúdo histórico foi revisado e distribuído em documentos independentes, organizados por alteração técnica.

Não existe separação por “primeira” ou “segunda alteração”. Todos os arquivos ficam diretamente em `documents/docs/`, e os PDFs correspondentes ficam diretamente em `documents/pdf/`.

## Documentos disponíveis

| Arquivo | Assunto |
|---|---|
| `01_ROTAS_PUBLICAS_E_URLS` | migração das páginas públicas de `/tracking` para `/rastreamento` |
| `02_REORGANIZACAO_DOS_COMPONENTES_TRACKING` | movimentação de `features/tracking` para `components/tracking` |
| `03_CACHE_DE_DETALHES_NO_FRONTEND` | persistência de detalhes no provider e no `sessionStorage` |
| `04_CACHE_NO_CORE_E_CASOS_DE_USO` | caches em memória, TTL e reuso da listagem no core |
| `05_GATEWAY_SSW_CURL_PARA_FETCH` | evolução da integração SSW e troca de `curl` por `fetch` |
| `06_NAVEGACAO_LAYOUT_E_INTEGRACAO` | atualização dos links, páginas e provider global |
| `07_CONTRATOS_TIPOS_E_FLUXO_TECNICO` | evolução histórica da API e extensão do `TrackingCache` |
| `08_RISCOS_PRIVACIDADE_E_COMPATIBILIDADE` | riscos atuais e herdados da refatoração |
| `09_INVENTARIO_VALIDACAO_E_RECOMENDACOES` | inventário do diff atual, validações e checklist |
| `10_ARQUITETURA_CORE_E_INTEGRACAO_SSW` | separação do service central em casos de uso e integração específica |
| `11_OTIMIZACAO_LISTAGEM_E_DETALHE_SOB_DEMANDA` | remoção das consultas antecipadas de todos os detalhes |
| `12_REESTRUTURACAO_VISUAL_NAVEGACAO_E_EXPERIENCIA_DE_RASTREAMENTO` | novo shell de navegação, busca no header, tabela filtrável e detalhe progressivo da encomenda |
| `13_REORGANIZACAO_ARQUITETURAL_E_IDENTIDADE_DO_USUARIO` | reestruturação da camada core/infra, eliminação de redundâncias e integração do nome do usuário |

Cada item possui um arquivo `.docx` em `documents/docs/` e um arquivo `.pdf` com o mesmo nome em `documents/pdf/`.

## Como o conteúdo deste relatório foi reaproveitado

O relatório original registrava a comparação do commit `1d66a82` com o working tree daquela etapa. A revisão identificou dois assuntos que não estavam suficientemente representados nos documentos posteriores:

1. a criação do `core`, a divisão do antigo `tracking.service.ts` e a reorganização do parser e scraper;
2. a otimização que deixou de abrir o detalhe de todas as encomendas durante a busca inicial.

Esses assuntos originaram os documentos `10_ARQUITETURA_CORE_E_INTEGRACAO_SSW` e `11_OTIMIZACAO_LISTAGEM_E_DETALHE_SOB_DEMANDA`.

As demais informações foram incorporadas sem criar duplicatas:

- a movimentação do scraper/parser e a evolução do gateway foram adicionadas ao documento 05;
- a migração de `POST` para `GET`, os envelopes de resposta e o tratamento de erros foram adicionados ao documento 07;
- os riscos históricos de CPF, códigos HTTP, `scrapedAt` e contratos de erro foram adicionados ao documento 08;
- o documento 09 registra o reaproveitamento e continua representando o inventário do diff atual.

## Referências de comparação

Os documentos 10 e 11 preservam explicitamente a origem histórica registrada no relatório original. Os documentos 01 a 09 analisam o diff atual contra `f7d49ae`. O documento 12 registra o working tree da branch `v2-rastreamento` comparado ao commit `9f27ca51b152077f6736a247a0be9cb726aa2799`. Essa informação aparece como metadado técnico dentro de cada arquivo, sem organizar os artefatos em pastas ou grupos de “primeira” e “segunda” alteração.
