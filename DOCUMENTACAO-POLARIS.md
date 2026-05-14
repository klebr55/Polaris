# Documentação Polaris

## Visão geral
Este documento resume tudo o que foi criado e configurado até agora para o projeto Polaris, uma experiência de data storytelling sobre o crescimento tecnológico de Mato Grosso.

## Estrutura inicial
Camadas organizadas em `/src` seguindo princípios de modularização e separação de preocupações:
- `src/app`: Rotas e layout principal (App Router).
- `src/components/ui`: Componentes de interface genéricos e atômicos.
- `src/components/modules`: Seções e componentes complexos do projeto:
    - `HeroSection.tsx`: Container principal com animações de entrada.
    - `ComparisonSection.tsx`: Gráfico comparativo Urbano vs Rural animado com GSAP.
    - `InternetAccessCard.tsx`: Card principal que renderiza o gráfico de acesso à internet.
    - `InternetAccessSkeleton.tsx`: Estado de carregamento para o card de dados.
- `src/core`: Lógica de negócio e utilitários centrais.
- `src/services/sidra`: Integração com a API SIDRA do IBGE.
- `src/hooks`: Hooks customizados para lógica de UI.
- `src/styles`: Configurações globais de CSS e temas.
- `src/types`: Definições TypeScript para domínio e APIs.

## UI, tema e estilos
- **Tailwind v4**: Configurado via `@import "tailwindcss"` em `globals.css`.
- **Tokens Customizados**: Definidos em `tailwind.config.ts` (cores `polaris-blue`, `glass`, tipografia `Geist/Inter`).
- **Glassmorphism**: Sistema de tokens para transparência e desfoque (`glass`, `glass.border`, `glass.highlight`).
- **Efeitos**: Textura "grainy" aplicada via SVG no `body::before` para profundidade visual.
- **Transições**: Utilitário customizado `transition-soft` para animações fluidas de UI.

## Hero Section (Data as Art)
- Título e subtítulo com gradientes e animações de subida via `framer-motion`.
- Container em estilo "Glass" que abriga o conteúdo dinâmico.
- Foco em narrativa visual (Data Storytelling).

Arquivo relevante:
- `src/components/modules/HeroSection.tsx`

## Comparison Section (Urbano vs Rural)
- Seção que destaca a diferença de acesso entre áreas urbanas e rurais.
- **Animações**: Utiliza `GSAP` e `ScrollTrigger` para animar as barras de progresso conforme o usuário faz o scroll.
- **Design**: Gradientes lineares e sombras neon para destacar os dados.

Arquivo relevante:
- `src/components/modules/ComparisonSection.tsx`

## Serviço SIDRA (IBGE) & Gráficos
- **Integração**: Adapter Pattern para converter a resposta complexa do SIDRA em séries temporais simples.
- **Componente**: `InternetAccessCard` utiliza `Recharts` para renderizar um gráfico de área (AreaChart) com gradientes e "glow effects".
- **Performance**: Fetch nativo do Next.js com `revalidate` configurado para atualização periódica.
- **UX**: `Suspense` com `InternetAccessSkeleton` para transição suave durante o fetch de dados.

Arquivos relevantes:
- `src/services/sidra/pnadTicInternetAccessService.ts`
- `src/components/modules/InternetAccessCard.tsx`
- `src/app/page.tsx`

## Deploy e segurança
- `vercel.json` com headers de segurança (CSP, HSTS, X-Content-Type-Options).
- `next.config.mjs` configurado para validação rigorosa de Lint e TypeScript durante o build.

## Variáveis de ambiente
Variáveis necessárias (ver `.env.example`):
- `SIDRA_BASE_URL`
- `SIDRA_TABLE_ID`
- `SIDRA_VARIABLE_ID`
- `SIDRA_TERRITORY_LEVEL`
- `SIDRA_TERRITORY_CODE`
- `SIDRA_PERIOD`
- `SIDRA_REVALIDATE_SECONDS`

## Dependências principais
- **Framework**: `next 16.2.5`, `react 19.2.0`
- **Estilos**: `tailwindcss 4.2.0`, `tailwindcss-animate`
- **Animações**: `framer-motion`, `gsap`
- **Gráficos**: `recharts`
- **Ícones & Util**: `lucide-react`, `clsx`, `tailwind-merge`

## Scripts
- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera o bundle de produção.
- `npm run lint`: Executa a verificação estática do código.
- `npm run audit:fix`: Corrige vulnerabilidades de dependências.
