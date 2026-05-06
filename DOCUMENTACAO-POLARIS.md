# Documentacao Polaris

## Visao geral
Este documento resume tudo o que foi criado e configurado ate agora para o projeto Polaris.

## Estrutura inicial
Camadas criadas em /src seguindo Clean Architecture e modularizacao:
- src/components/ui
- src/components/modules
- src/core
- src/services/sidra
- src/hooks
- src/styles
- src/types

Arquivos base do App Router:
- src/app/layout.tsx
- src/app/page.tsx

## UI, tema e estilos
- Tailwind v4 configurado com tokens para dark mode, glassmorphism e tipografia com Geist/Inter.
- Glassmorphism inclui tokens: glass, glass.border e glass.highlight.
- Utilitario customizado: transition-soft.
- CSS global usa a entrada do Tailwind v4 via @import "tailwindcss".
- Fundo global com gradiente radial sutil + textura grainy no layout.

Arquivos relevantes:
- tailwind.config.ts
- postcss.config.mjs
- src/styles/globals.css
- src/app/layout.tsx

## Hero Section (Data as Art)
- Hero com titulo e subtitulo animados via framer-motion (fade-in e subida).
- Reacao leve a mouse e scroll com useTransform.
- Grafico dummy via SVG animado como placeholder para dados reais.
- Bloco glass com highlight e ring para contraste.

Arquivo relevante:
- src/app/page.tsx

## Servico SIDRA (IBGE)
- Servico TypeScript com Adapter Pattern para converter resposta do SIDRA em serie simplificada para graficos.
- Endpoint focado em "Proporcao de domicilios com acesso a internet" para MT (codigo 51).
- Tratamento de erros robusto com SidraServiceError.
- Fetch nativo do Next com revalidate semanal.

Arquivos relevantes:
- src/services/sidra/pnadTicInternetAccessService.ts
- src/services/sidra/index.ts
- src/types/ibge.ts

## Deploy e seguranca
- vercel.json com headers de seguranca (CSP, HSTS, X-Content-Type-Options).
- next.config.mjs configurado para falhar build com erros de lint e TypeScript.
- Script audit:fix para mitigar vulnerabilidades.

Arquivos relevantes:
- vercel.json
- next.config.mjs
- package.json

## Variaveis de ambiente
Arquivo base para deploy:
- .env.example

Variaveis atuais:
- SIDRA_BASE_URL
- SIDRA_TABLE_ID
- SIDRA_VARIABLE_ID
- SIDRA_TERRITORY_LEVEL
- SIDRA_TERRITORY_CODE
- SIDRA_PERIOD
- SIDRA_REVALIDATE_SECONDS

## Dependencias principais
- next 16.2.5
- react 19.2.0
- react-dom 19.2.0
- tailwindcss 4.2.0
- framer-motion, lucide-react, clsx, tailwind-merge, tailwind-animate

## Scripts
- dev: next dev
- build: next build
- start: next start
- lint: next lint
- audit:fix: npm audit fix

## Observacoes
- Para o Tailwind v4, o plugin @tailwindcss/postcss ja esta configurado no postcss.config.mjs.
- O projeto ainda nao possui tsconfig.json e next-env.d.ts, que normalmente sao gerados pelo Next ao rodar o dev server.
