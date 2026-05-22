"use client";

import { useState, useEffect } from "react";
import { Map, AlertTriangle, Camera, Users, Navigation, Layers, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const ZONES = [
  { id: "norte",  label: "Zona Norte",  incidents: 4, cameras: 312, color: "var(--warning)",  x: 25, y: 18 },
  { id: "centro", label: "Centro MTY",  incidents: 8, cameras: 445, color: "var(--critical)", x: 48, y: 42 },
  { id: "sur",    label: "Zona Sur",    incidents: 2, cameras: 198, color: "var(--success)",  x: 55, y: 68 },
  { id: "este",   label: "Apodaca",     incidents: 5, cameras: 224, color: "var(--warning)",  x: 75, y: 32 },
  { id: "oeste",  label: "Santa Cat.",  incidents: 1, cameras: 144, color: "var(--success)",  x: 18, y: 58 },
  { id: "sp",     label: "San Pedro",   incidents: 3, cameras: 188, color: "var(--electric)", x: 35, y: 62 },
];

const INC_DOTS = [
  { id: "INC-08441", type: "Accidente vial",     priority: "critical", x: 30, y: 22 },
  { id: "INC-08439", type: "Persona extraviada", priority: "high",     x: 48, y: 44 },
  { id: "INC-08437", type: "Emergencia médica",  priority: "high",     x: 50, y: 48 },
  { id: "INC-08428", type: "Incendio",           priority: "critical", x: 72, y: 36 },
  { id: "INC-08422", type: "Disturbio",          priority: "medium",   x: 58, y: 70 },
];

const UNITS = [
  { id: "U-047",   x: 32, y: 25, active: true  },
  { id: "U-112",   x: 47, y: 45, active: true  },
  { id: "AMB-03",  x: 52, y: 50, active: true  },
  { id: "BOMB-01", x: 70, y: 38, active: false },
];

const PC: Record<string,string> = {
  critical: "var(--critical)", high: "var(--warning)", medium: "var(--electric-bright)",
};

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="glass-card" style={style}>{children}</div>;
}

export default function InteractiveMap() {
  const [layer, setLayer]   = useState<"incidents"|"cameras"|"units">("incidents");
  const [selZoneId, setSelZoneId] = useState<string|null>(null);
  const [zoom, setZoom]     = useState(1);
  const [pulse, setPulse]   = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => p + 1), 1500);
    return () => clearInterval(id);
  }, []);

  const selZone = ZONES.find((z) => z.id === selZoneId);

  const toolBtn = (active: boolean): React.CSSProperties => ({
    padding: "5px 10px", borderRadius: 7, fontSize: 10, fontWeight: 700,
    cursor: "pointer", transition: "all 0.2s",
    background: active ? "var(--electric-dim)" : "var(--s1)",
    border: `1px solid ${active ? "rgba(59,130,246,0.30)" : "var(--glass-border)"}`,
    color: active ? "var(--electric-bright)" : "var(--text-02)",
  });

  const iconBtn: React.CSSProperties = {
    background: "var(--s2)", border: "1px solid var(--glass-border)",
    borderRadius: 7, padding: "6px 8px", cursor: "pointer", color: "var(--text-02)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "Incidentes activos", value: "12",    color: "var(--critical)",        Icon: AlertTriangle },
          { label: "Cámaras en red",     value: "1,204", color: "var(--electric-bright)", Icon: Camera },
          { label: "Unidades en campo",  value: "38",    color: "var(--success)",         Icon: Users },
          { label: "Sectores críticos",  value: "2",     color: "var(--warning)",         Icon: Map },
        ].map(({ label, value, color, Icon }) => (
          <Card key={label} style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <Icon size={16} style={{ color }} />
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 10, color: "var(--text-02)", marginTop: 3 }}>{label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Map */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>

        <Card style={{ minHeight: 500, padding: 0 }}>
          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--glass-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Navigation size={14} style={{ color: "var(--electric-bright)" }} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-00)" }}>
                Área Metropolitana de Monterrey
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "var(--success-dim)", border: "1px solid rgba(16,185,129,0.20)", borderRadius: 6, padding: "3px 8px" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--success)", animation: "ping 2s infinite" }} />
                <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--success)", fontWeight: 700 }}>GPS ACTIVO</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["incidents","cameras","units"] as const).map((l) => (
                <button key={l} onClick={() => setLayer(l)} style={toolBtn(layer === l)}>
                  {l === "incidents" ? "Incidentes" : l === "cameras" ? "Cámaras" : "Unidades"}
                </button>
              ))}
              <button onClick={() => setZoom((z) => Math.min(z + 0.1, 1.5))} style={iconBtn}><ZoomIn  size={13} /></button>
              <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.7))} style={iconBtn}><ZoomOut size={13} /></button>
              <button onClick={() => setZoom(1)}                              style={iconBtn}><RotateCcw size={13} /></button>
            </div>
          </div>

          {/* Canvas */}
          <div style={{ position: "relative", height: 440, overflow: "hidden", background: "var(--map-bg)" }}>
            {/* Grid */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(59,130,246,0.06) 40px,rgba(59,130,246,0.06) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(59,130,246,0.06) 40px,rgba(59,130,246,0.06) 41px)",
              transform: `scale(${zoom})`, transformOrigin: "center",
            }} />

            {/* SVG roads */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35 }}>
              <line x1="0" y1="42%" x2="100%" y2="42%" stroke="var(--map-road)" strokeWidth="2" />
              <line x1="0" y1="65%" x2="100%" y2="65%" stroke="var(--map-road)" strokeWidth="1" />
              <line x1="0" y1="25%" x2="100%" y2="28%" stroke="var(--map-road)" strokeWidth="1" />
              <line x1="48%" y1="0" x2="48%" y2="100%" stroke="var(--map-road)" strokeWidth="2" />
              <line x1="28%" y1="0" x2="30%" y2="100%" stroke="var(--map-road)" strokeWidth="1" />
              <line x1="70%" y1="0" x2="72%" y2="100%" stroke="var(--map-road)" strokeWidth="1" />
              <polyline points="0,30 10,22 20,18 35,15 50,12 65,16 80,20 90,15 100,18" fill="none" stroke="rgba(100,130,200,0.25)" strokeWidth="1.5" />
            </svg>

            {/* Zone circles */}
            {ZONES.map((z, zi) => (
              <button key={z.id} onClick={() => setSelZoneId(selZoneId === z.id ? null : z.id)} style={{
                position: "absolute", left: `${z.x}%`, top: `${z.y}%`,
                transform: "translate(-50%,-50%)", background: "none", border: "none",
                cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center",
              }}>
                <div style={{ position: "absolute", width: 48, height: 48, borderRadius: "50%", border: `1px solid ${z.color}`, opacity: 0.18 + Math.sin(pulse * 0.5 + zi) * 0.10 }} />
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${z.color}18`, border: `1px solid ${z.color}50`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 14px ${z.color}28` }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, color: z.color }}>{z.incidents}</span>
                </div>
                <div style={{ marginTop: 4, background: "var(--chrome-deep)", border: "1px solid var(--glass-border)", borderRadius: 5, padding: "2px 7px", fontSize: 9, color: "var(--text-01)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", backdropFilter: "blur(8px)" }}>
                  {z.label}
                </div>
              </button>
            ))}

            {/* Incident dots */}
            {layer === "incidents" && INC_DOTS.map((inc) => (
              <div key={inc.id} style={{ position: "absolute", left: `${inc.x}%`, top: `${inc.y}%`, transform: "translate(-50%,-50%)", width: 12, height: 12, borderRadius: "50%", background: PC[inc.priority], boxShadow: `0 0 10px ${PC[inc.priority]}` }} />
            ))}

            {/* Unit dots */}
            {layer === "units" && UNITS.map((u) => (
              <div key={u.id} title={u.id} style={{ position: "absolute", left: `${u.x}%`, top: `${u.y}%`, transform: "translate(-50%,-50%)", width: 10, height: 10, borderRadius: "50%", background: u.active ? "var(--success)" : "var(--text-02)", boxShadow: u.active ? "0 0 8px var(--mx-emerald-glow)" : "none", border: "1px solid rgba(255,255,255,0.25)" }} />
            ))}

            {/* Zone tooltip */}
            {selZone && (
              <div style={{ position: "absolute", top: 12, right: 12, background: "var(--chrome-deep)", backdropFilter: "blur(20px)", border: `1px solid ${selZone.color}38`, borderRadius: 12, padding: "14px 16px", minWidth: 178 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-00)", marginBottom: 10 }}>{selZone.label}</div>
                {[["Incidentes", selZone.incidents, selZone.color],["Cámaras", selZone.cameras, "var(--electric-bright)"]].map(([lbl, val, col]) => (
                  <div key={String(lbl)} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "var(--text-02)" }}>{lbl}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: String(col) }}>{String(val)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Coords */}
            <div style={{ position: "absolute", bottom: 10, left: 12, fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(59,130,246,0.4)" }}>
              25.6866° N, 100.3161° W · AMM · {Math.round(zoom * 100)}%
            </div>
          </div>
        </Card>

        {/* Legend + list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
              <Layers size={13} style={{ color: "var(--electric-bright)" }} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-00)" }}>Leyenda</span>
            </div>
            {[
              { color: "var(--critical)", label: "Incidente crítico"  },
              { color: "var(--warning)",  label: "Incidente alto"    },
              { color: "var(--electric)", label: "Incidente medio"   },
              { color: "var(--success)",  label: "Unidad activa"     },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 5px ${color}80`, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "var(--text-02)" }}>{label}</span>
              </div>
            ))}
          </Card>

          <Card style={{ flex: 1, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
              <AlertTriangle size={13} style={{ color: "var(--critical)" }} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-00)" }}>Activos en mapa</span>
            </div>
            {INC_DOTS.map((inc) => (
              <div key={inc.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "9px 12px", borderRadius: 8, background: "var(--s1)", border: "1px solid var(--glass-border)", marginBottom: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: PC[inc.priority], marginTop: 3, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-00)", marginBottom: 1 }}>{inc.type}</div>
                  <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-02)" }}>{inc.id}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
