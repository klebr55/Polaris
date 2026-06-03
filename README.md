<div align="center">

# ✦ Polaris

**Data Storytelling · IBGE PNAD TIC · Mato Grosso**

*Uma experiência cinematográfica que transforma dados públicos do IBGE em narrativa visual sobre como a pandemia de COVID-19 reconfigurou a relação de Mato Grosso com a internet.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

</div>

---

## Sumário

- [A Narrativa](#a-narrativa)
- [Stack Técnica](#stack-técnica)
- [Arquitetura](#arquitetura)
- [Camada de Dados — IBGE SIDRA](#camada-de-dados--ibge-sidra)
- [Design System](#design-system)
- [Componentes de Seção](#componentes-de-seção)
- [Animação & Motion](#animação--motion)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Rodando Localmente](#rodando-localmente)
- [Deploy](#deploy)
- [Segurança](#segurança)
- [Testes](#testes)

---

## A Narrativa

Polaris não é um dashboard. É um **scrollytelling cinematográfico** estruturado em três atos, onde cada seção de dados conta um capítulo da mesma história: como a pandemia de COVID-19 transformou a internet de luxo em questão de sobrevivência para Mato Grosso.

```
Ato 1 — O Catalisador   →  HeroSection    (Acesso geral à internet)
Ato 2 — O Abismo        →  ComparisonSection (Urbano vs Rural)
Ato 3 — O Resgate       →  EducationSection  (Internet na educação)
```

### Ato 1 · O Catalisador

> *"Quando as portas se fecharam, a tela abriu o mundo."*

Em março de 2020, o lockdown transformou a internet de conveniência em infraestrutura de sobrevivência. Em 60 dias, ela tornou-se escola, escritório e consulta médica. O gráfico de acesso geral à internet em Mato Grosso registra essa inflexão com precisão cirúrgica — uma curva que sobe no exato momento em que o mundo fechou suas portas físicas.

### Ato 2 · O Abismo

> *"A pandemia não criou esse abismo. Ela o tornou impossível de ignorar."*

Enquanto os centros urbanos de Mato Grosso migraram ao home office em dias, o isolamento revelou um apagão de comunicação nas zonas rurais. O coração do agronegócio — que move a economia do maior estado produtor do Brasil — estava desconectado. O Ato 2 quantifica esse gap em pontos percentuais e o exibe em tempo real com animações GSAP.

### Ato 3 · O Resgate

> *"Estudante sem internet em 2020 era estudante sem escola. Sem futuro."*

As escolas físicas esvaziaram da noite para o dia. O ensino migrou ao remoto, mas a migração exigia conectividade. Uma `ReferenceLine` amber marca 2020 no gráfico — o ano em que cada ponto percentual passou a representar uma batalha real de alunos e famílias contra o apagão educacional.

---

## Stack Técnica

| Camada | Tecnologia | Versão | Papel |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.2 | SSR, Streaming, Route Handlers |
| UI Runtime | React | 19.2 | Concurrent rendering, Suspense |
| Linguagem | TypeScript | 5.7 | Type-safety end-to-end |
| Estilos | Tailwind CSS | v4 | Design system + utilitários |
| Animação (mount) | Framer Motion | 12.x | `whileInView`, `useScroll`, `useTransform` |
| Animação (scroll) | GSAP + ScrollTrigger | 3.12 | Contadores, barras, stagger |
| Scroll suave | Lenis | 1.3 | Inércia nativa de scroll |
| Gráficos | Recharts | 2.12 | `BarChart`, `AreaChart`, `ReferenceLine` |
| Ícones | Lucide React | 0.470 | Ícones SVG tipados |
| Utilitários CSS | clsx + tailwind-merge | — | Composição condicional de classes |
| Testes | Vitest + Testing Library | 4.x | Unit + Component tests |
| Deploy | Vercel | — | Edge Network, ISR |

---

## Arquitetura

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (Lenis, metadata global)
│   └── page.tsx                # Orquestrador de seções + data fetching assíncrono
│
├── components/
│   ├── modules/                # Seções e compostos de domínio
│   │   ├── HeroSection.tsx         # Ato 1 — parallax, headline staggered, PandemicStatsBar
│   │   ├── ComparisonSection.tsx   # Ato 2 — hero number, barras GSAP, gap visual
│   │   ├── EducationSection.tsx    # Ato 3 — BarChart, ReferenceLine 2020, StatCards
│   │   ├── InternetAccessCard.tsx  # AreaChart com glow e gradiente
│   │   ├── PandemicStatsBar.tsx    # Faixa de contexto histórico (montagem do herói)
│   │   ├── LegacyFooter.tsx        # Créditos e equipe
│   │   ├── SmoothScroller.tsx      # Provider Lenis (client-only)
│   │   ├── ServiceErrorFallback.tsx
│   │   ├── InternetAccessSkeleton.tsx
│   │   └── EducationSkeleton.tsx
│   └── ui/                     # Átomos reutilizáveis (botões, badges, etc.)
│
├── services/
│   └── sidra/                  # Camada de integração IBGE SIDRA
│       ├── index.ts                    # Barrel exports
│       ├── common.ts                   # SidraServiceError, helpers base
│       ├── pnadTicInternetAccessService.ts   # PNAD TIC — acesso domiciliar
│       ├── pnadTicEducationAccessService.ts  # PNAD TIC — estudantes
│       ├── pnadTicUrbanRuralAccessService.ts # PNAD TIC — urbano vs rural
│       ├── pandemicImpactAdapter.ts          # Adapter multivariável pandemia
│       ├── matoGrossoTechPandemicFacade.ts   # Facade para dados compostos
│       ├── pandemicFallbackData.ts           # Dados de fallback estáticos
│       └── digitalDivideFallback.ts          # Fallback do divide digital
│
├── types/                      # Contratos TypeScript de domínio
│   ├── ibge.ts                 # Tipos brutos da API SIDRA
│   ├── pandemicImpact.ts       # Tipos do impacto pandêmico
│   ├── digitalDivide.ts        # Tipos do divide digital MT
│   └── theme.ts                # GsapAnimationConfig e tokens de tema
│
├── hooks/                      # Hooks customizados
├── core/                       # Lógica de negócio central
└── styles/
    └── globals.css             # Tokens CSS, textura grain, scrollbar
```

### Padrões de Projeto

**Adapter Pattern** — `pandemicImpactAdapter.ts` e `matoGrossoTechPandemicFacade.ts` desacoplam a estrutura aninhada e verbosa da API SIDRA das necessidades simples dos componentes. A resposta bruta (arrays multidimensionais com metadados IBGE) é normalizada em séries temporais tipadas.

**Facade Pattern** — `matoGrossoTechPandemicFacade.ts` agrega múltiplas chamadas SIDRA (acesso domiciliar + educação + divide urbano/rural) em um único contrato de dados para cenários que precisam de visão consolidada.

**Async Server Components** — As funções `InternetAccessCardData`, `ComparisonSectionData` e `EducationSectionData` em `page.tsx` são React Server Components assíncronos que fazem fetch paralelo e retornam JSX diretamente, aproveitando Streaming do App Router com `<Suspense>`.

**Graceful Degradation** — Cada data-fetcher envolve a chamada em `try/catch` e serve dados de fallback estáticos quando a API SIDRA está indisponível, garantindo que a experiência narrativa nunca quebre.

---

## Camada de Dados — IBGE SIDRA

Todos os dados são provenientes da **API SIDRA v3** do IBGE, especificamente da pesquisa **PNAD TIC** (Pesquisa Nacional por Amostra de Domicílios — Tecnologia da Informação e Comunicação), com recorte geográfico para **Mato Grosso (N3/51)**.

### Tabelas Utilizadas

| Agregado | ID | Variável | ID | Descrição |
|---|---|---|---|---|
| PNAD TIC — Domicílios | `1220` | Acesso à internet | `2584` | % domicílios com internet (Ato 1) |
| PNAD TIC — Educação | `7328` | Estudantes com internet | `10648` | % estudantes conectados (Ato 3) |
| PNAD TIC — Urbano/Rural | derivado | Gap de acesso | calculado | Diferença pp urbano–rural (Ato 2) |

### Configuração de Revalidação

Os fetches utilizam a ISR (Incremental Static Regeneration) do Next.js com `revalidate: 604800` (7 dias), alinhado ao ciclo de publicação da PNAD TIC pelo IBGE. Dados nunca são stale por mais de uma semana sem re-fetch.

### Tratamento de Erros

```
API SIDRA responde → Adapter normaliza → Componente renderiza
API SIDRA falha   → SidraServiceError → fallbackData estático → Componente renderiza
```

O `SidraServiceError` (em `common.ts`) é uma classe de erro customizada que preserva o status HTTP original para logging e diferencia falhas de rede de respostas inválidas.

---

## Design System

### Tokens de Cor

Definidos em `tailwind.config.ts` e em CSS custom properties em `globals.css`:

```css
:root {
  --color-polaris-blue: 56 189 248;   /* sky-400 */
  --color-polaris-cyan: 34 211 238;   /* cyan-400 */
  --color-polaris-deep: 2 6 23;       /* slate-950 profundo */
}
```

| Token Tailwind | Valor | Uso |
|---|---|---|
| `polaris-blue` | `rgb(56 189 248)` | Acento principal, destaques, barras de dados |
| `glass` | `rgb(15 23 42 / 0.55)` | Background de cards glassmorphism |
| `glass-border` | `rgb(148 163 184 / 0.2)` | Bordas de cards |
| `glass-highlight` | `rgb(255 255 255 / 0.08)` | Highlight interno de vidro |
| `navy-950` | `#0A192F` | Background alternativo profundo |

### Tipografia

Fonte primária: **Geist Sans** com fallback para **Inter** e `ui-sans-serif`. Configurada via `fontFamily.sans` em `tailwind.config.ts`. `font-feature-settings` em `globals.css` habilita kerning, ligaturas e `calt` para renderização editorial.

### Glassmorphism

O sistema de glass é composto por três camadas:

1. `bg-glass/50` — fundo translúcido com `backdrop-blur-xl`
2. `border-glass-border` — borda com opacidade mínima
3. `shadow-glass` — sombra profunda `0 12px 48px rgb(2 6 23 / 0.45)`

### Efeito Grain

Uma textura de ruído fractal é aplicada via SVG inline no `body::before` com `mix-blend-mode: soft-light` e `opacity: 0.08`, criando profundidade cinematográfica sem custo de performance.

### Utilitário `transition-soft`

Plugin customizado que define uma curva `cubic-bezier(0.2, 0.8, 0.2, 1)` de 300ms para todas as propriedades visuais. Garante consistência de easing em hover states e transições de estado.

---

## Componentes de Seção

### `HeroSection` — Ato 1

**Responsabilidade:** Container do capítulo de abertura. Orquestra o parallax de saída (scroll-driven opacity/scale/y via `useScroll` + `useTransform`) e anima a entrada do headline linha a linha com stagger de 120ms.

**Props:** `children: ReactNode` — recebe o `InternetAccessCard` via Suspense.

**Destaques técnicos:**
- `HEADLINE_LINES` array-driven com gradientes individuais por linha, mapeado em `motion.span` com delay calculado por índice.
- `PandemicStatsBar` — componente satélite que exibe estatísticas contextuais da pandemia (montado com delay de 550ms).
- Glassmorphism card com quatro camadas de overlay para efeito hover.

---

### `ComparisonSection` — Ato 2

**Responsabilidade:** Visualiza o gap de acesso urbano/rural. É o Ato mais denso em animação — cinco sequências GSAP independentes ativadas por `ScrollTrigger`.

**Props:** `urbanPercent?: number`, `ruralPercent?: number` (defaults: 82.4 / 58.1).

**Animações GSAP:**
| Animação | Duração | Descrição |
|---|---|---|
| Stagger de entrada | 1.2s | Filhos do container surgem em cascata |
| Hero number counter | 1.8s | Gap em pp conta de 0 ao valor real |
| Urban counter | 1.4s | `urbanPercent` conta de 0 ao valor |
| Rural counter | 1.4s + delay 150ms | `ruralPercent` conta de 0 ao valor |
| Barras (`scaleX`) | 1.4s | `transformOrigin: left center`, escala para `value/100` |
| Gap bar | 0.8s + delay 900ms | Indicator amber surge após as barras |

**`MICRO_STATS`** — array de três KPIs contextuais renderizado como grid no rodapé do card.

---

### `EducationSection` — Ato 3

**Responsabilidade:** Ápice narrativo. Combina headline staggered, `BarChart` com coloração contextual (antes/depois de 2020) e `ReferenceLine` que marca o ano da pandemia.

**Props:** `series: EducationAccessSeries` — série temporal vinda do SIDRA.

**`HEADLINE_LINES`** — três linhas com `accent: boolean`. Linha com `accent: true` recebe gradiente `from-cyan-300 to-blue-400`.

**Coloração de Barras por Era:**
```ts
fill={Number(entry.period) < 2020 ? "#1e293b" : "url(#edu-bar-gradient)"}
fillOpacity={Number(entry.period) < 2020 ? 0.7 : 1}
```
Barras anteriores a 2020 aparecem em cinza-escuro; barras de 2020 em diante recebem o gradiente cyan, criando contraste visual que reforça a ruptura pandêmica.

**`ReferenceLine`** — linha vertical amber em `x="2020"` com label "Pandemia" no topo. Ancora visualmente o marco temporal que divide a narrativa.

**StatCards** — grid de três métricas animadas com `whileHover={{ y: -4 }}`: último ano, pico histórico e evolução total desde o primeiro dado disponível.

---

## Animação & Motion

### Framer Motion — Mount & Scroll

Todos os elementos narrativos usam `whileInView` com `viewport={{ once: true, margin: "-15%" }}`, garantindo que a animação dispara quando 15% do elemento entra na viewport e nunca repete.

Curva de easing padrão: `[0.22, 1, 0.36, 1]` — equivalente ao `ease-out` editorial do macOS, criando sensação de momentum natural.

### GSAP — Animações de Dados

GSAP é reservado para animações que dependem de valores numéricos dinâmicos (contadores, barras de progresso em `scaleX`) onde a precisão matemática é necessária. O `ScrollTrigger` com `once: true` garante idempotência.

### Lenis — Scroll Suave

O `SmoothScroller` é um Client Component montado no `layout.tsx`. Ele instancia o Lenis e aplica inércia nativa ao scroll, eliminando a sensação de "salto" entre seções.

### Hierarquia de Delays (Hero)

```
0ms    → Eyebrow (label de contexto)
0ms    → Linha 1 do headline
120ms  → Linha 2 do headline
240ms  → Linha 3 do headline
420ms  → Parágrafo descritivo
550ms  → PandemicStatsBar
600ms  → Scroll indicator (bounce)
700ms  → InternetAccessCard figure
```

---

## Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
# Endpoint base da API SIDRA
SIDRA_BASE_URL=https://servicodados.ibge.gov.br/api/v3/agregados

# Recorte geográfico — N3 = Estado, 51 = Mato Grosso
SIDRA_TERRITORY_LEVEL=N3
SIDRA_TERRITORY_CODE=51

# Período — "all" retorna toda a série histórica disponível
SIDRA_PERIOD=all

# Revalidação ISR em segundos (604800 = 7 dias)
SIDRA_REVALIDATE_SECONDS=604800

# PNAD TIC — Acesso à internet (Ato 1)
SIDRA_INTERNET_AGGREGATE_ID=1220
SIDRA_INTERNET_VARIABLE_ID=2584

# PNAD TIC — Educação (Ato 3)
SIDRA_EDUCATION_AGGREGATE_ID=7328
SIDRA_EDUCATION_VARIABLE_ID=10648
```

> **Nota:** O projeto funciona sem `.env.local` em desenvolvimento. Os valores do `vercel.json` são aplicados em produção e servem como referência de configuração.

---

## Rodando Localmente

```bash
# 1. Clone o repositório
git clone <repo-url>
cd Polaris

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local

# 4. Inicie o servidor de desenvolvimento (Turbopack)
npm run dev
```

Acesse `http://localhost:3000`.

### Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com Turbopack |
| `npm run build` | Build de produção com validação TS e Lint |
| `npm run start` | Servidor de produção local |
| `npm run lint` | ESLint com regras Next.js |
| `npm run audit:fix` | Corrige vulnerabilidades de dependências |
| `npm run test:unit` | Executa testes unitários com Vitest |
| `npm run test:unit:watch` | Testes em modo watch |

---

## Deploy

O projeto é otimizado para **Vercel**. O `vercel.json` define:

- **Framework preset:** `nextjs`
- **Variáveis de ambiente:** todas as `SIDRA_*` pré-configuradas para produção
- **Headers HTTP de segurança:** aplicados globalmente em `/(.*)`

### ISR — Incremental Static Regeneration

Cada rota de dados é revalidada a cada 7 dias (`SIDRA_REVALIDATE_SECONDS=604800`), alinhado ao ciclo de publicação da PNAD TIC. O primeiro visitante após a expiração recebe dados stale enquanto o servidor regenera em background.

---

## Segurança

Headers configurados via `vercel.json` para todas as rotas:

| Header | Valor | Proteção |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'; connect-src 'self' https://apisidra.ibge.gov.br` | XSS, injeção de recursos externos |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | HTTPS enforcement (2 anos) |
| `X-Content-Type-Options` | `nosniff` | MIME type sniffing |

A CSP permite `connect-src` exclusivamente para `apisidra.ibge.gov.br`, bloqueando qualquer requisição de dados a origens não autorizadas.

---

## Testes

A suíte de testes utiliza **Vitest** com **@testing-library/react** e **jsdom**.

```bash
# Execução única
npm run test:unit

# Modo watch (TDD)
npm run test:unit:watch
```

Os arquivos de teste residem em `/tests`. A configuração está em `vitest.config.ts`.

---

## Equipe

| Nome | Papel | <br>
| Kleber Vinícius | Tech Lead & Software Engineer | <br>
| Luiz Fernando | Product/Data | <br>
| Thor Ribeiro | UX / Storytelling | <br>
| Thaiane Vitoria | Documentation | <br>
| Kelmy Adriano | QA Analyst |

---

<div align="center">

**Polaris** · Estado Final da Aplicação · 2026  
Dados públicos · IBGE SIDRA · PNAD Contínua TIC

*"Transformar dados públicos em narrativa é um ato político. Cada gráfico é uma voz."*

</div>
