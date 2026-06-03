"use client";

import { memo, useCallback, useRef, useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import { MapPin, Plus, Minus, Maximize2 } from "lucide-react";
import mtGeoData from "../../assets/geo/mt-municipios.json";
import { fetchMatoGrossoMunicipalityAccess, MunicipalityData } from "../../services/sidra/matoGrossoMunicipalityAccessService";

import { fetchPandemicImpact } from "../../services/sidra/pandemicImpactAdapter";

const COLOR_HOVER = "#A5F3FC";

const getFillColor = (rate?: number) => {
  if (rate === undefined) return "#020617";
  // Escala de Quebras Naturais (Natural Breaks) para escancarar o contraste em MT
  // Como a maioria dos municípios tem taxa urbana alta, limites rígidos revelam o apagão rural.
  if (rate <= 65) return "#0F172A"; // Crítico
  if (rate <= 75) return "#164E63"; // Alerta
  if (rate <= 85) return "#0891B2"; // Moderado
  if (rate <= 92) return "#22D3EE"; // Bom
  return "#A5F3FC"; // Avançado
};



export default memo(function MatoGrossoMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tooltipX = useSpring(mouseX, { stiffness: 600, damping: 40 });
  const tooltipY = useSpring(mouseY, { stiffness: 600, damping: 40 });
  
  const [tooltipContent, setTooltipContent] = useState<{ name: string; value: number | undefined; visible: boolean }>({ name: "", value: undefined, visible: false });
  const [accessData, setAccessData] = useState<Map<string, MunicipalityData>>(new Map());
  const [ruralHistory, setRuralHistory] = useState<{ year: string; value: number }[]>([]);

  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [-55.9, -12.7],
    zoom: 1,
  });

  useEffect(() => {
    fetchMatoGrossoMunicipalityAccess().then(setAccessData);
    fetchPandemicImpact().then(impact => {
      const rural = impact.domicilio.find(s => s.situacao === "Rural");
      if (rural) {
        setRuralHistory(rural.pontos.map(p => ({ year: p.periodo, value: p.percentual })));
      }
    });
  }, []);

  const zoomIn = useCallback(() => setPosition(p => ({ ...p, zoom: Math.min(p.zoom * 1.5, 8) })), []);
  const zoomOut = useCallback(() => setPosition(p => ({ ...p, zoom: Math.max(p.zoom / 1.5, 1) })), []);
  const resetZoom = useCallback(() => setPosition({ coordinates: [-55.9, -12.7], zoom: 1 }), []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="relative w-full flex flex-col gap-6" onMouseMove={handleMouseMove} onMouseLeave={() => setTooltipContent(prev => ({ ...prev, visible: false }))}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="polaris-card relative flex w-full items-center justify-center overflow-hidden"
        style={{ height: "55vh", minHeight: 400 }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-55.9, -12.7], scale: 1800 }}
          width={900}
          height={700}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={(pos) => setPosition({ coordinates: pos.coordinates as [number, number], zoom: pos.zoom })}
            minZoom={1}
            maxZoom={8}
          >
            <Geographies geography={mtGeoData}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const rawId = geo.properties.codarea || geo.id || geo.properties.CD_MUN || geo.properties.CD_GEOCMU || "";
                  const safeId = String(rawId).substring(0, 6);
                  const muniData = accessData.get(safeId);
                  const nome = muniData?.name || geo.properties.NM_MUN || geo.properties.NOME || geo.properties.NM_MUNICIP || geo.properties.name || "Desconhecido";
                  const conectividade = muniData ? 100 - muniData.ruralRate : undefined;
                  
                  const fill = getFillColor(conectividade);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="rgba(34,211,238,0.4)"
                      strokeWidth={0.5 / position.zoom}
                      onMouseEnter={() => {
                        setTooltipContent({ name: nome, value: conectividade, visible: true });
                      }}
                      style={{
                        default: { outline: "none", transition: "fill 0.3s ease" },
                        hover: { fill: COLOR_HOVER, outline: "none", stroke: "rgba(34,211,238,0.8)", strokeWidth: 1.5 / position.zoom },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        <div className="absolute right-4 top-4 flex flex-col gap-1.5 rounded-xl border border-white/10 bg-[#020617]/60 p-1.5 shadow-lg backdrop-blur-md">
          <button onClick={zoomIn} aria-label="Aumentar zoom" className="grid size-8 place-items-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
            <Plus className="size-4" />
          </button>
          <button onClick={zoomOut} aria-label="Diminuir zoom" className="grid size-8 place-items-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
            <Minus className="size-4" />
          </button>
          <div className="my-0.5 h-px bg-white/10" />
          <button onClick={resetZoom} aria-label="Resetar zoom" className="grid size-8 place-items-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
            <Maximize2 className="size-3.5" />
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-3 rounded-xl border border-white/10 bg-[#020617]/80 p-4 backdrop-blur-md shadow-lg min-w-[240px]">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
            <MapPin className="size-3.5" />
            Isolamento Digital
          </div>
          
          <div className="flex flex-col gap-2.5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-[#164E63] border border-cyan-400/20" />
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-[10px] font-bold text-slate-200">CRÍTICO</span>
                <span className="text-[9px] leading-tight text-slate-500">{'<'} 75% domicílios conectados</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-[#0891B2] border border-cyan-400/30" />
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-[10px] font-bold text-slate-200">MODERADO</span>
                <span className="text-[9px] leading-tight text-slate-500">75–85% conectados</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-[#A5F3FC] border border-cyan-400/50 shadow-[0_0_8px_rgba(165,243,252,0.4)]" />
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-[10px] font-bold text-slate-200">AVANÇADO</span>
                <span className="text-[9px] leading-tight text-slate-500">{'>'} 85% conectados</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] min-w-[160px] -translate-x-1/2 -translate-y-[calc(100%+24px)] rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 shadow-[0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-md"
        style={{
          x: tooltipX,
          y: tooltipY,
          opacity: tooltipContent.visible ? 1 : 0,
          scale: tooltipContent.visible ? 1 : 0.95,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
          Município
        </p>
        <p className="font-display mt-0.5 text-sm font-bold tracking-tight text-white">
          {tooltipContent.name}
        </p>
        <div className="mt-3 border-t border-white/10 pt-3">
          <p className="font-display text-[11px] font-bold tracking-wider text-cyan-400 text-glow-cyan uppercase">
            {tooltipContent.value !== undefined ? `CONECTIVIDADE: ${tooltipContent.value.toFixed(1)}%` : "Dados Indisponíveis"}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="grid w-full gap-3"
        style={{ gridTemplateColumns: `repeat(${Math.max(ruralHistory.length, 1)}, minmax(0, 1fr))` }}
      >
        {ruralHistory.map((point, i) => (
          <div key={point.year} className="flex flex-col items-center gap-1">
            <div className="relative h-12 w-full overflow-hidden rounded-sm border border-white/[0.06] bg-white/[0.03]">
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/50 to-cyan-400/20"
                initial={{ height: "0%" }}
                animate={inView ? { height: `${point.value}%` } : {}}
                transition={{ delay: 0.6 + i * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-[0.6rem] font-bold text-cyan-400/90 drop-shadow-md">
                  {point.value}%
                </span>
              </div>
            </div>
            <span className="text-[0.55rem] uppercase tracking-[0.2em] text-slate-500">
              {point.year}
            </span>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-2 border-t border-white/5 pt-4 text-center"
      >
        <p className="text-xs leading-relaxed text-slate-500">
          <strong className="font-semibold text-slate-300">Evolução do Acesso Rural:</strong> O gráfico ilustra o crescimento do percentual de domicílios rurais conectados à internet em Mato Grosso. Apesar da forte aceleração impulsionada pela necessidade da pandemia (2019-2023), cerca de um terço da zona rural ainda permanece em completo isolamento digital.
        </p>
      </motion.div>
    </div>
  );
});
