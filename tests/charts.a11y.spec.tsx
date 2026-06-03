import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import InternetAccessCard from "../src/components/modules/InternetAccessCard";
import EducationSection from "../src/components/modules/EducationSection";
import type { InternetAccessSeries } from "../src/services/sidra/pnadTicInternetAccessService";
import type { EducationAccessSeries } from "../src/services/sidra/pnadTicEducationAccessService";

interface MockInternetAccessPoint {
  period: string;
  value: number;
}

interface MockInternetAccessTerritory {
  code: string;
  name: string;
}

interface MockInternetAccessSeries {
  indicator: string;
  territory: MockInternetAccessTerritory;
  unit: string | null;
  points: MockInternetAccessPoint[];
}

interface MockEducationAccessPoint {
  period: string;
  value: number;
}

interface MockEducationAccessTerritory {
  code: string;
  name: string;
}

interface MockEducationAccessSeries {
  indicator: string;
  territory: MockEducationAccessTerritory;
  unit: string | null;
  points: MockEducationAccessPoint[];
}

vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_: object, tag: string) => {
        const { createElement } = require("react");
        return ({
          children,
          initial: _initial,
          animate: _animate,
          whileInView: _whileInView,
          whileHover: _whileHover,
          viewport: _viewport,
          transition: _transition,
          variants: _variants,
          style: _style,
          ...rest
        }: Record<string, unknown> & { children?: unknown }) =>
          createElement(tag as string, rest, children);
      },
    },
  ),
  AnimatePresence: ({ children }: { children: unknown }) => children,
  useMotionValue: () => ({ set: vi.fn(), get: vi.fn(() => 0) }),
  useSpring: () => ({ set: vi.fn(), get: vi.fn(() => 0) }),
  useTransform: () => ({ set: vi.fn(), get: vi.fn(() => 0) }),
  useAnimate: () => [null, vi.fn()],
}));

vi.mock("gsap", () => ({
  default: {
    registerPlugin: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
    from: vi.fn(),
    set: vi.fn(),
    to: vi.fn(),
  },
}));

vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const mockInternetSeries: MockInternetAccessSeries = {
  indicator:
    "Percentual de domicilios particulares permanentes com acesso a internet",
  territory: {
    code: "51",
    name: "Mato Grosso",
  },
  unit: "%",
  points: [
    { period: "2017", value: 61.2 },
    { period: "2018", value: 65.8 },
    { period: "2019", value: 70.1 },
    { period: "2020", value: 75.4 },
    { period: "2021", value: 79.3 },
    { period: "2022", value: 82.1 },
    { period: "2023", value: 85.6 },
  ],
};

const mockEducationSeries: MockEducationAccessSeries = {
  indicator:
    "Percentual de estudantes que utilizaram a internet",
  territory: {
    code: "51",
    name: "Mato Grosso",
  },
  unit: "%",
  points: [
    { period: "2017", value: 72.3 },
    { period: "2018", value: 75.1 },
    { period: "2019", value: 78.9 },
    { period: "2020", value: 83.4 },
    { period: "2021", value: 87.6 },
    { period: "2022", value: 90.2 },
    { period: "2023", value: 93.1 },
    { period: "2024", value: 95.4 },
  ],
};

describe("InternetAccessCard — Acessibilidade (a11y)", () => {
  it("deve renderizar o wrapper do gráfico com role img", () => {
    render(
      <InternetAccessCard series={mockInternetSeries as InternetAccessSeries} />,
    );

    const chartRegion = screen.getByRole("img");
    expect(chartRegion).toBeInTheDocument();
  });

  it("deve ter aria-label descritivo contendo o nome do indicador no wrapper do gráfico", () => {
    render(
      <InternetAccessCard series={mockInternetSeries as InternetAccessSeries} />,
    );

    const chartRegion = screen.getByRole("img");
    const label = chartRegion.getAttribute("aria-label");

    expect(label).not.toBeNull();
    expect(label).toContain(mockInternetSeries.indicator);
  });

  it("deve exibir o nome do território acessível no DOM", () => {
    render(
      <InternetAccessCard series={mockInternetSeries as InternetAccessSeries} />,
    );

    expect(
      screen.getByText(
        (content) =>
          content.includes(mockInternetSeries.territory.name) &&
          content.includes(mockInternetSeries.territory.code),
      ),
    ).toBeInTheDocument();
  });

  it("deve exibir o label do indicador no DOM", () => {
    render(
      <InternetAccessCard series={mockInternetSeries as InternetAccessSeries} />,
    );

    expect(
      screen.getByText(mockInternetSeries.indicator),
    ).toBeInTheDocument();
  });

  it("deve renderizar os stat cards com tabIndex para navegação por teclado", () => {
    render(
      <InternetAccessCard series={mockInternetSeries as InternetAccessSeries} />,
    );

    const focusableCards = document.querySelectorAll("[tabindex='0']");
    expect(focusableCards.length).toBeGreaterThanOrEqual(3);
  });

  it("deve exibir o stat card do ultimo ano com o período correto", () => {
    render(
      <InternetAccessCard series={mockInternetSeries as InternetAccessSeries} />,
    );

    const latestPeriod =
      mockInternetSeries.points[mockInternetSeries.points.length - 1].period;
    expect(screen.getByText(latestPeriod)).toBeInTheDocument();
  });

  it("deve exibir o label Ultimo ano no stat card", () => {
    render(
      <InternetAccessCard series={mockInternetSeries as InternetAccessSeries} />,
    );

    expect(screen.getByText(/Último ano/i)).toBeInTheDocument();
  });

  it("deve exibir o label Pico no stat card", () => {
    render(
      <InternetAccessCard series={mockInternetSeries as InternetAccessSeries} />,
    );

    expect(screen.getByText(/Pico/i)).toBeInTheDocument();
  });

  it("deve exibir o label Evolucao no stat card", () => {
    render(
      <InternetAccessCard series={mockInternetSeries as InternetAccessSeries} />,
    );

    expect(screen.getByText(/Evolu/i)).toBeInTheDocument();
  });

  it("deve ter exatamente um elemento com role img para o gráfico", () => {
    render(
      <InternetAccessCard series={mockInternetSeries as InternetAccessSeries} />,
    );

    const imgRoles = screen.getAllByRole("img");
    expect(imgRoles).toHaveLength(1);
  });
});

describe("EducationSection — Acessibilidade (a11y)", () => {
  it("deve renderizar o wrapper do gráfico com role img", () => {
    render(
      <EducationSection series={mockEducationSeries as EducationAccessSeries} />,
    );

    const chartRegion = screen.getByRole("img");
    expect(chartRegion).toBeInTheDocument();
  });

  it("deve ter aria-label descritivo contendo o nome do indicador no wrapper do gráfico", () => {
    render(
      <EducationSection series={mockEducationSeries as EducationAccessSeries} />,
    );

    const chartRegion = screen.getByRole("img");
    const label = chartRegion.getAttribute("aria-label");

    expect(label).not.toBeNull();
    expect(label).toContain(mockEducationSeries.indicator);
  });

  it("deve ter o aria-label do gráfico iniciando com o prefixo correto", () => {
    render(
      <EducationSection series={mockEducationSeries as EducationAccessSeries} />,
    );

    const chartRegion = screen.getByRole("img");
    const label = chartRegion.getAttribute("aria-label") ?? "";

    expect(label.startsWith("Gráfico de barras:")).toBe(true);
  });

  it("deve renderizar o heading h2 com o título da seção", () => {
    render(
      <EducationSection series={mockEducationSeries as EducationAccessSeries} />,
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Estudante sem internet/i);
  });

  it("deve renderizar os stat cards com tabIndex para navegação por teclado", () => {
    render(
      <EducationSection series={mockEducationSeries as EducationAccessSeries} />,
    );

    const focusableCards = document.querySelectorAll("[tabindex='0']");
    expect(focusableCards.length).toBeGreaterThanOrEqual(3);
  });

  it("deve exibir o stat card do ultimo ano com o período correto", () => {
    render(
      <EducationSection series={mockEducationSeries as EducationAccessSeries} />,
    );

    const latestPeriod =
      mockEducationSeries.points[mockEducationSeries.points.length - 1].period;
    expect(screen.getByText(latestPeriod)).toBeInTheDocument();
  });

  it("deve exibir o label Pico no stat card", () => {
    render(
      <EducationSection series={mockEducationSeries as EducationAccessSeries} />,
    );

    expect(screen.getByText(/Pico/i)).toBeInTheDocument();
  });

  it("deve exibir o label Evolucao no stat card", () => {
    render(
      <EducationSection series={mockEducationSeries as EducationAccessSeries} />,
    );

    expect(screen.getByText(/Evolu/i)).toBeInTheDocument();
  });

  it("o aria-label do gráfico deve ser único e não vazio", () => {
    render(
      <EducationSection series={mockEducationSeries as EducationAccessSeries} />,
    );

    const chartRegion = screen.getByRole("img");
    const label = chartRegion.getAttribute("aria-label") ?? "";

    expect(label.trim().length).toBeGreaterThan(0);
  });

  it("deve exibir o eyebrow Ato 3 textualmente", () => {
    render(
      <EducationSection series={mockEducationSeries as EducationAccessSeries} />,
    );

    expect(screen.getByText(/Ato 3/i)).toBeInTheDocument();
  });
});
