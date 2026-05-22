"use client";

import { useState, useCallback, useRef } from "react";
import Map, {
  Marker,
  Source,
  Layer,
  NavigationControl,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  AlertTriangle,
  Ambulance,
  ShieldCheck,
  Flame,
  MapPin,
  Navigation,
  Clock,
  Route,
  Zap,
  ChevronRight,
  X,
  Radio,
  Activity,
  Layers,
  Filter,
} from "lucide-react";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type Priority = "Critica" | "Alta" | "Media" | "Baja";
type UnitType = "Ambulancia" | "Policia" | "Bomberos";

type Incident = {
  id: string;
  phone: string;
  emergencyType: string;
  priority: Priority;
  state: string;
  location: string;
  coords: [number, number];
  incidentCount: number;
  agent: string;
  channel: string;
};

type Unit = {
  id: string;
  type: UnitType;
  label: string;
  coords: [number, number];
  status: "Disponible" | "En ruta" | "Ocupado";
  eta: number;
  distance: number;
};

type RouteOption = {
  id: string;
  label: string;
  eta: number;
  distance: number;
  via: string;
  recommended: boolean;
  color: string;
  coords: [number, number][];
};

/* ─────────────────────────────────────────
   MOCK DATA  (replace with API calls)
───────────────────────────────────────── */
const INCIDENTS: Incident[] = [
  {
    id: "INC-0842",
    phone: "8112047720",
    emergencyType: "Accidente vial con lesionados",
    priority: "Critica",
    state: "Activa",
    location: "Av. Constitucion",
    coords: [-100.3069, 25.6714],
    incidentCount: 3,
    agent: "A. Torres",
    channel: "911",
  },
  {
    id: "INC-0843",
    phone: "8188804491",
    emergencyType: "Persona extraviada",
    priority: "Media",
    state: "Seguimiento",
    location: "Estadio BBVA - Acceso A",
    coords: [-100.4067, 25.6694],
    incidentCount: 1,
    agent: "L. Morales",
    channel: "FIFA Hotline",
  },
  {
    id: "INC-0840",
    phone: "3122191354",
    emergencyType: "Seguimiento operativo",
    priority: "Alta",
    state: "En despacho",
    location: "Rionegro",
    coords: [-100.2861, 25.6982],
    incidentCount: 1,
    agent: "Essity IA",
    channel: "Voz IA",
  },
  {
    id: "INC-0839",
    phone: "8110027744",
    emergencyType: "Reporte sin novedad",
    priority: "Baja",
    state: "Resuelta",
    location: "Apodaca Industrial",
    coords: [-100.1889, 25.7796],
    incidentCount: 0,
    agent: "R. Vega",
    channel: "Operacion",
  },
];

const UNITS: Unit[] = [
  { id: "AMB-12", type: "Ambulancia", label: "AMB-12", coords: [-100.3150, 25.6780], status: "Disponible", eta: 4, distance: 1.2 },
  { id: "AMB-07", type: "Ambulancia", label: "AMB-07", coords: [-100.2940, 25.6650], status: "En ruta",    eta: 7, distance: 2.4 },
  { id: "POL-03", type: "Policia",    label: "POL-03", coords: [-100.3020, 25.6750], status: "Disponible", eta: 3, distance: 0.9 },
  { id: "POL-11", type: "Policia",    label: "POL-11", coords: [-100.3180, 25.6830], status: "Disponible", eta: 5, distance: 1.7 },
  { id: "BOM-02", type: "Bomberos",   label: "BOM-02", coords: [-100.3100, 25.6680], status: "Disponible", eta: 6, distance: 2.0 },
];

const buildRoutes = (dest: [number, number]): RouteOption[] => [
  {
    id: "r1",
    label: "Ruta Principal",
    eta: 4,
    distance: 1.2,
    via: "Av. Constitucion / Zaragoza",
    recommended: true,
    color: "#06b6d4",
    coords: [
      [-100.3150, 25.6780],
      [-100.3120, 25.6755],
      [-100.3095, 25.6735],
      dest,
    ],
  },
  {
    id: "r2",
    label: "Ruta Alterna A",
    eta: 6,
    distance: 1.8,
    via: "Gonzalitos / Colon",
    recommended: false,
    color: "#8b5cf6",
    coords: [
      [-100.3150, 25.6780],
      [-100.3180, 25.6740],
      [-100.3130, 25.6710],
      dest,
    ],
  },
  {
    id: "r3",
    label: "Ruta Alterna B",
    eta: 8,
    distance: 2.3,
    via: "Av. Universidad",
    recommended: false,
    color: "#64748b",
    coords: [
      [-100.3150, 25.6780],
      [-100.3200, 25.6800],
      [-100.3100, 25.6750],
      dest,
    ],
  },
];

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const PRIORITY_COLOR: Record<Priority, string> = {
  Critica: "var(--critical)",
  Alta:    "var(--warning)",
  Media:   "var(--electric-bright)",
  Baja:    "var(--success)",
};

const PRIORITY_HEX: Record<Priority, string> = {
  Critica: "#ef4444",
  Alta:    "#f59e0b",
  Media:   "#3b82f6",
  Baja:    "#10b981",
};

const UNIT_COLOR: Record<UnitType, string> = {
  Ambulancia: "#ef4444",
  Policia:    "#3b82f6",
  Bomberos:   "#f97316",
};

const UNIT_ICON: Record<UnitType, React.ElementType> = {
  Ambulancia: Ambulance,
  Policia:    ShieldCheck,
  Bomberos:   Flame,
};

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const INITIAL_VIEW = { longitude: -100.3069, latitude: 25.6866, zoom: 12 };


/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function toGeoJSON(coords: [number, number][]) {
  return {
    type: "Feature" as const,
    geometry: { type: "LineString" as const, coordinates: coords },
    properties: {},
  };
}

/* ─────────────────────────────────────────
   INCIDENT MARKER
───────────────────────────────────────── */
function IncidentMarker({
  incident,
  selected,
  onClick,
}: {
  incident: Incident;
  selected: boolean;
  onClick: () => void;
}) {
  const hex = PRIORITY_HEX[incident.priority];
  return (
    <Marker longitude={incident.coords[0]} latitude={incident.coords[1]} anchor="center">
      <button
        onClick={onClick}
        style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 0 }}
        aria-label={`Incidente ${incident.id}`}
      >
        {selected && (
          <span style={{
            position: "absolute", inset: -8, borderRadius: "50%",
            border: `2px solid ${hex}`,
            animation: "ping 1.4s ease-in-out infinite",
            opacity: 0.5,
          }} />
        )}
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: `${hex}22`,
          border: `2.5px solid ${hex}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 ${selected ? 20 : 10}px ${hex}66`,
          transition: "all 0.2s",
          transform: selected ? "scale(1.2)" : "scale(1)",
        }}>
          <AlertTriangle size={16} style={{ color: hex }} />
        </div>
        <div style={{
          position: "absolute", top: -24, left: "50%", transform: "translateX(-50%)",
          background: "rgba(2,6,23,0.88)", border: `1px solid ${hex}44`,
          borderRadius: 6, padding: "2px 7px",
          fontSize: 9, fontWeight: 800, color: hex,
          whiteSpace: "nowrap", backdropFilter: "blur(8px)",
        }}>
          {incident.id}
        </div>
      </button>
    </Marker>
  );
}

/* ─────────────────────────────────────────
   UNIT MARKER
───────────────────────────────────────── */
function UnitMarker({ unit }: { unit: Unit }) {
  const Icon = UNIT_ICON[unit.type];
  const color = UNIT_COLOR[unit.type];
  return (
    <Marker longitude={unit.coords[0]} latitude={unit.coords[1]} anchor="center">
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: `${color}22`,
        border: `1.5px solid ${color}66`,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: unit.status === "Ocupado" ? 0.4 : 1,
        boxShadow: unit.status === "Disponible" ? `0 0 8px ${color}44` : "none",
      }}>
        <Icon size={13} style={{ color }} />
      </div>
    </Marker>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function MapView() {
  const mapRef = useRef<MapRef>(null);
  const [selectedId, setSelectedId]   = useState<string | null>(INCIDENTS[0].id);
  const [activeRoute, setActiveRoute] = useState<string>("r1");
  const [showUnits, setShowUnits]     = useState(true);
  const [filterPriority, setFilterPriority] = useState<Priority | "Todas">("Todas");

  const selected = INCIDENTS.find((i) => i.id === selectedId) ?? null;
  const routes   = selected ? buildRoutes(selected.coords) : [];
  const activeRouteData = routes.find((r) => r.id === activeRoute);

  const filteredIncidents = filterPriority === "Todas"
    ? INCIDENTS
    : INCIDENTS.filter((i) => i.priority === filterPriority);

  const flyTo = useCallback((coords: [number, number]) => {
    mapRef.current?.flyTo({ center: coords, zoom: 14.5, duration: 900, essential: true });
  }, []);

  const handleSelectIncident = (incident: Incident) => {
    setSelectedId(incident.id);
    setActiveRoute("r1");
    flyTo(incident.coords);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0, position: "relative" }}>

      {/* ── HEADER BAR ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 20px",
        background: "var(--glass-01)",
        borderBottom: "1px solid var(--glass-border)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--electric-dim)", border: "1px solid rgba(59,130,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MapPin size={16} style={{ color: "var(--electric-bright)" }} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "var(--text-00)" }}>
              Mapa Operativo
            </div>
            <div style={{ fontSize: 10, color: "var(--text-02)", marginTop: 1 }}>
              Geolocalización de incidentes · Despacho de unidades
            </div>
          </div>
        </div>

        {/* Filtros de prioridad */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Filter size={12} style={{ color: "var(--text-02)" }} />
          {(["Todas", "Critica", "Alta", "Media", "Baja"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              style={{
                padding: "4px 11px", borderRadius: 999, fontSize: 10, fontWeight: 700, cursor: "pointer",
                border: "1px solid",
                borderColor: filterPriority === p
                  ? (p === "Todas" ? "var(--electric-bright)" : PRIORITY_HEX[p as Priority])
                  : "var(--glass-border)",
                background: filterPriority === p
                  ? (p === "Todas" ? "rgba(59,130,246,0.15)" : `${PRIORITY_HEX[p as Priority]}18`)
                  : "transparent",
                color: filterPriority === p
                  ? (p === "Todas" ? "var(--electric-bright)" : PRIORITY_HEX[p as Priority])
                  : "var(--text-02)",
                transition: "all 0.18s",
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Toggle unidades */}
        <button
          onClick={() => setShowUnits((v) => !v)}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "6px 12px", borderRadius: 9, fontSize: 11, fontWeight: 700, cursor: "pointer",
            border: "1px solid",
            borderColor: showUnits ? "rgba(6,182,212,0.35)" : "var(--glass-border)",
            background: showUnits ? "rgba(6,182,212,0.10)" : "transparent",
            color: showUnits ? "var(--neon)" : "var(--text-02)",
            transition: "all 0.18s",
          }}
        >
          <Layers size={13} />
          Unidades
        </button>

        {/* Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 9, background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success)", animation: "pulse-dot 1.8s ease-in-out infinite" }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: "var(--success)" }}>EN VIVO</span>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "300px 1fr", overflow: "hidden" }}>

        {/* ── LEFT PANEL: INCIDENTS LIST ── */}
        <div style={{
          display: "flex", flexDirection: "column",
          borderRight: "1px solid var(--glass-border)",
          background: "var(--glass-01)",
          overflow: "hidden",
        }}>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderBottom: "1px solid var(--glass-border)" }}>
            {[
              { label: "Activos", value: INCIDENTS.filter(i => i.state !== "Resuelta").length, color: "var(--critical)" },
              { label: "Unidades", value: UNITS.filter(u => u.status === "Disponible").length, color: "var(--success)" },
              { label: "Resp. prom", value: "3m", color: "var(--electric-bright)" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding: "12px 14px", textAlign: "center", borderRight: "1px solid var(--glass-border)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 9, color: "var(--text-02)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: "10px 12px 6px", fontSize: 9, fontWeight: 900, color: "var(--text-02)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Incidentes activos
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredIncidents.map((incident) => {
              const isSelected = incident.id === selectedId;
              const hex = PRIORITY_HEX[incident.priority];
              return (
                <button
                  key={incident.id}
                  onClick={() => handleSelectIncident(incident)}
                  style={{
                    width: "100%", textAlign: "left", border: "none", cursor: "pointer",
                    padding: "13px 14px",
                    borderBottom: "1px solid var(--glass-border)",
                    background: isSelected
                      ? `linear-gradient(90deg, ${hex}10 0%, transparent 100%)`
                      : "transparent",
                    borderLeft: isSelected ? `3px solid ${hex}` : "3px solid transparent",
                    transition: "all 0.18s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                      background: `${hex}18`, border: `1px solid ${hex}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <AlertTriangle size={14} style={{ color: hex }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 800, color: "var(--text-00)" }}>{incident.id}</span>
                        <span style={{
                          fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 999,
                          background: `${hex}14`, border: `1px solid ${hex}30`, color: hex,
                        }}>{incident.priority}</span>
                        {incident.state !== "Resuelta" && (
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: hex, boxShadow: `0 0 6px ${hex}`, marginLeft: "auto", flexShrink: 0 }} />
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-00)", fontWeight: 600, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {incident.emergencyType}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={9} style={{ color: "var(--text-02)", flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: "var(--text-02)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{incident.location}</span>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                      <div style={{ flex: 1, padding: "6px 8px", borderRadius: 8, background: "var(--s2)", border: "1px solid var(--glass-border)", textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: "var(--text-02)" }}>Canal</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-00)", marginTop: 2 }}>{incident.channel}</div>
                      </div>
                      <div style={{ flex: 1, padding: "6px 8px", borderRadius: 8, background: "var(--s2)", border: "1px solid var(--glass-border)", textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: "var(--text-02)" }}>Agente</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-00)", marginTop: 2 }}>{incident.agent}</div>
                      </div>
                      <div style={{ flex: 1, padding: "6px 8px", borderRadius: 8, background: "var(--s2)", border: "1px solid var(--glass-border)", textAlign: "center" }}>
                        <div style={{ fontSize: 9, color: "var(--text-02)" }}>Incidentes</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: hex, marginTop: 2 }}>{incident.incidentCount}</div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom: units legend */}
          <div style={{ padding: "10px 14px", borderTop: "1px solid var(--glass-border)", display: "flex", gap: 10 }}>
            {(["Ambulancia", "Policia", "Bomberos"] as UnitType[]).map((type) => {
              const Icon = UNIT_ICON[type];
              return (
                <div key={type} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon size={10} style={{ color: UNIT_COLOR[type] }} />
                  <span style={{ fontSize: 9, color: "var(--text-02)" }}>{type}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MAP + ROUTE PANEL ── */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          {/* MAP */}
          <div style={{ flex: 1, position: "relative" }}>
            <Map
              ref={mapRef}
              initialViewState={INITIAL_VIEW}
              mapStyle={MAP_STYLE}
              style={{ width: "100%", height: "100%" }}
              attributionControl={false}
            >
              <NavigationControl position="top-right" />

              {/* Route lines */}
              {routes.map((route) => {
                const isActive = route.id === activeRoute;
                return (
                  <Source key={route.id} id={`route-${route.id}`} type="geojson" data={toGeoJSON(route.coords)}>
                    <Layer
                      id={`route-line-${route.id}`}
                      type="line"
                      layout={{ "line-join": "round", "line-cap": "round" }}
                      paint={{
                        "line-color": route.color,
                        "line-width": isActive ? 5 : 2.5,
                        "line-opacity": isActive ? 0.92 : 0.25,
                      }}
                    />
                  </Source>
                );
              })}

              {/* Incident markers */}
              {filteredIncidents.map((incident) => (
                <IncidentMarker
                  key={incident.id}
                  incident={incident}
                  selected={incident.id === selectedId}
                  onClick={() => handleSelectIncident(incident)}
                />
              ))}

              {/* Unit markers */}
              {showUnits && UNITS.map((unit) => (
                <UnitMarker key={unit.id} unit={unit} />
              ))}
            </Map>

            {/* Map overlay: selected incident info */}
            {selected && (
              <div style={{
                position: "absolute", top: 14, left: 14,
                background: "rgba(2,6,23,0.88)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${PRIORITY_HEX[selected.priority]}44`,
                borderTop: `3px solid ${PRIORITY_HEX[selected.priority]}`,
                borderRadius: 12,
                padding: "12px 16px",
                minWidth: 220,
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${PRIORITY_HEX[selected.priority]}15`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: PRIORITY_HEX[selected.priority], boxShadow: `0 0 8px ${PRIORITY_HEX[selected.priority]}` }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 800, color: "#ffffff" }}>{selected.id}</span>
                  <span style={{
                    marginLeft: "auto", fontSize: 8, fontWeight: 900, padding: "2px 7px", borderRadius: 999,
                    background: `${PRIORITY_HEX[selected.priority]}30`,
                    border: `1px solid ${PRIORITY_HEX[selected.priority]}70`,
                    color: PRIORITY_HEX[selected.priority],
                  }}>{selected.priority}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#ffffff", marginBottom: 4 }}>{selected.emergencyType}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <MapPin size={10} style={{ color: "#94a3b8" }} />
                  <span style={{ fontSize: 10, color: "#cbd5e1" }}>{selected.location}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── ROUTE OPTIONS PANEL ── */}
          {selected && routes.length > 0 && (
            <div style={{
              flexShrink: 0,
              background: "var(--glass-01)",
              borderTop: "1px solid var(--glass-border)",
              padding: "14px 20px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Route size={14} style={{ color: "var(--electric-bright)" }} />
                <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 800, color: "var(--text-00)" }}>
                  Opciones de ruta para {selected.id}
                </span>
                <span style={{ fontSize: 10, color: "var(--text-02)", marginLeft: 4 }}>{selected.location}</span>
                {activeRouteData && (
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 8, background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)" }}>
                      <Clock size={11} style={{ color: "var(--neon)" }} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: "var(--neon)" }}>{activeRouteData.eta} min</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 8, background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.22)" }}>
                      <Navigation size={11} style={{ color: "var(--electric-bright)" }} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: "var(--electric-bright)" }}>{activeRouteData.distance} km</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {routes.map((route) => {
                  const isActive = route.id === activeRoute;
                  return (
                    <button
                      key={route.id}
                      onClick={() => setActiveRoute(route.id)}
                      style={{
                        textAlign: "left", cursor: "pointer",
                        padding: "12px 14px", borderRadius: 12,
                        border: `1.5px solid ${isActive ? route.color : "var(--glass-border)"}`,
                        background: isActive ? `${route.color}12` : "var(--s1)",
                        transition: "all 0.18s",
                        position: "relative",
                      }}
                    >
                      {route.recommended && (
                        <div style={{
                          position: "absolute", top: -8, right: 10,
                          fontSize: 8, fontWeight: 900, padding: "2px 8px",
                          borderRadius: 999, background: "var(--neon)", color: "#020617",
                        }}>
                          RECOMENDADA
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: route.color, flexShrink: 0, boxShadow: isActive ? `0 0 8px ${route.color}` : "none" }} />
                        <span style={{ fontSize: 11, fontWeight: 800, color: isActive ? "var(--text-00)" : "var(--text-01)" }}>{route.label}</span>
                      </div>
                      <div style={{ display: "flex", gap: 10, marginBottom: 5 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={10} style={{ color: "var(--text-02)" }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? route.color : "var(--text-01)" }}>{route.eta} min</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Navigation size={10} style={{ color: "var(--text-02)" }} />
                          <span style={{ fontSize: 11, color: "var(--text-02)" }}>{route.distance} km</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 9, color: "var(--text-02)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        via {route.via}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Available units for dispatch */}
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: "var(--text-02)", textTransform: "uppercase", letterSpacing: "0.1em", flexShrink: 0 }}>
                  Unidades cercanas:
                </span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {UNITS.filter(u => u.status === "Disponible").map((unit) => {
                    const Icon = UNIT_ICON[unit.type];
                    const color = UNIT_COLOR[unit.type];
                    return (
                      <div key={unit.id} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "4px 10px", borderRadius: 8,
                        background: `${color}10`, border: `1px solid ${color}30`,
                      }}>
                        <Icon size={11} style={{ color }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-00)" }}>{unit.label}</span>
                        <span style={{ fontSize: 9, color: "var(--text-02)" }}>{unit.eta}m · {unit.distance}km</span>
                      </div>
                    );
                  })}
                </div>
                <button style={{
                  marginLeft: "auto", display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 18px", borderRadius: 10, cursor: "pointer",
                  background: "linear-gradient(135deg, var(--electric-bright) 0%, var(--neon) 100%)",
                  border: "none", color: "#020617", fontSize: 12, fontWeight: 900,
                  boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                }}>
                  <Zap size={13} />
                  Despachar unidad
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
