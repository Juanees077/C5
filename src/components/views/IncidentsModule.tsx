"use client";

import { useState } from "react";
import { AlertTriangle, Search, Plus, MapPin, Phone, User, Clock, X, ChevronRight } from "lucide-react";

const INCIDENTS = [
  { id: "INC-2026-08441", type: "Accidente vial",            location: "Autopista 40 km 237",        priority: "critical", status: "active",     assigned: "U-047",   time: "04:32", caller: "+33 6 12 34 56 78", lang: "FR Francés",  summary: "Ciudadano francófono reporta accidente con 2 personas heridas. Intérprete IA activo.",           sector: "Norte"  },
  { id: "INC-2026-08439", type: "Persona extraviada",        location: "Centro Histórico MTY",        priority: "high",     status: "attending",  assigned: "U-112",   time: "08:12", caller: "+1 555 847 2930",   lang: "EN Inglés",   summary: "Turista estadounidense extraviado cerca de catedral. Coordinando con intérprete.",               sector: "Centro" },
  { id: "INC-2026-08437", type: "Emergencia médica",         location: "Pino Suárez 112",             priority: "high",     status: "attending",  assigned: "AMB-03",  time: "15:07", caller: "Patrulla",          lang: "ES Español",  summary: "Adulto mayor con dolor torácico. Ambulancia en camino. ETA 3 min.",                              sector: "Centro" },
  { id: "INC-2026-08431", type: "Robo a transeúnte",         location: "Col. Mitras Centro",          priority: "medium",   status: "closed",     assigned: "U-089",   time: "22:44", caller: "811-040-0000",       lang: "ES Español",  summary: "Robo de celular. Sospechoso en motocicleta. Denuncia levantada.",                               sector: "Centro" },
  { id: "INC-2026-08428", type: "Incendio estructural",      location: "P. Industrial Apodaca",       priority: "critical", status: "controlled", assigned: "BOMB-01", time: "06:18", caller: "811-040-0000",       lang: "ES Español",  summary: "Incendio en nave industrial. Controlado al 90%. 2 camiones despachados.",                       sector: "Este"   },
  { id: "INC-2026-08422", type: "Disturbio vía pública",     location: "Av. Garza Sada 2501",         priority: "medium",   status: "closed",     assigned: "U-034",   time: "18:30", caller: "811-040-0000",       lang: "ES Español",  summary: "Pelea entre vecinos. Situación resuelta sin arrestos.",                                          sector: "Sur"    },
  { id: "INC-2026-08415", type: "Vehículo robado recuperado",location: "Blvd. Díaz Ordaz — FEMSA",   priority: "low",      status: "closed",     assigned: "U-021",   time: "11:55", caller: "Patrulla U-021",     lang: "ES Español",  summary: "Toyota Hilux reportado robado localizado. Propietario notificado.",                              sector: "Norte"  },
];

const P: Record<string,{label:string;color:string;bg:string}> = {
  critical: { label: "Crítico", color: "var(--critical)", bg: "var(--critical-dim)" },
  high:     { label: "Alto",    color: "var(--warning)",  bg: "var(--warning-dim)"  },
  medium:   { label: "Medio",   color: "var(--electric)", bg: "var(--electric-dim)" },
  low:      { label: "Bajo",    color: "var(--success)",  bg: "var(--success-dim)"  },
};
const S: Record<string,{label:string;color:string;bg:string}> = {
  active:     { label: "Activo",      color: "var(--critical)", bg: "var(--critical-dim)" },
  attending:  { label: "En atención", color: "var(--warning)",  bg: "var(--warning-dim)"  },
  controlled: { label: "Controlado",  color: "var(--electric)", bg: "var(--electric-dim)" },
  closed:     { label: "Cerrado",     color: "var(--success)",  bg: "var(--success-dim)"  },
};

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="glass-card" style={style}>{children}</div>;
}

export default function IncidentsModule() {
  const [search, setSearch]   = useState("");
  const [filterP, setFilterP] = useState<string|null>(null);
  const [filterS, setFilterS] = useState<string|null>(null);
  const [selected, setSelected] = useState<string|null>("INC-2026-08441");

  const filtered = INCIDENTS.filter((inc) => {
    const q = search.toLowerCase();
    return (
      (!q || inc.type.toLowerCase().includes(q) || inc.location.toLowerCase().includes(q) || inc.id.toLowerCase().includes(q)) &&
      (!filterP || inc.priority === filterP) &&
      (!filterS || inc.status === filterS)
    );
  });

  const detail = INCIDENTS.find((i) => i.id === selected);

  const chipBtn = (active: boolean, color: string): React.CSSProperties => ({
    padding: "5px 10px", borderRadius: 7, fontSize: 10, fontWeight: 700,
    cursor: "pointer", transition: "all 0.2s",
    background: active ? `${color}18` : "var(--s1)",
    border: `1px solid ${active ? color + "38" : "var(--glass-border)"}`,
    color: active ? color : "var(--text-02)",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Summary chips */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "Activos",       count: INCIDENTS.filter(i=>i.status==="active").length,     f: "active",     color: "var(--critical)" },
          { label: "En atención",   count: INCIDENTS.filter(i=>i.status==="attending").length,  f: "attending",  color: "var(--warning)"  },
          { label: "Controlados",   count: INCIDENTS.filter(i=>i.status==="controlled").length, f: "controlled", color: "var(--electric)" },
          { label: "Cerrados hoy",  count: INCIDENTS.filter(i=>i.status==="closed").length,     f: "closed",     color: "var(--success)"  },
        ].map(({ label, count, f, color }) => (
          <Card key={label}>
            <button
              onClick={() => setFilterS(filterS === f ? null : f)}
              style={{
                width: "100%", padding: "16px 20px", textAlign: "left",
                background: "none", border: "none", cursor: "pointer",
                outline: filterS === f ? `2px solid ${color}40` : "none",
                borderRadius: "var(--r-lg)",
              }}
            >
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 38, color, lineHeight: 1, marginBottom: 6 }}>{count}</div>
              <div style={{ fontSize: 11, color: "var(--text-02)" }}>{label}</div>
            </button>
          </Card>
        ))}
      </div>

      {/* Table + Detail */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 16 }}>

        <Card>
          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid var(--glass-border)", flexWrap: "wrap" }}>
            <AlertTriangle size={14} style={{ color: "var(--critical)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-00)" }}>
              Módulo de Incidentes
            </span>
            <div style={{ flex: 1 }} />
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-02)" }} />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar incidente…"
                className="input-glass"
                style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7, fontSize: 12, width: 200 }}
              />
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {(["critical","high","medium","low"] as const).map((p) => (
                <button key={p} onClick={() => setFilterP(filterP===p?null:p)} style={chipBtn(filterP===p, P[p].color)}>
                  {P[p].label}
                </button>
              ))}
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
              background: "var(--electric-dim)", border: "1px solid rgba(59,130,246,0.22)",
              borderRadius: 8, color: "var(--electric-bright)", fontSize: 12, fontWeight: 600,
              cursor: "pointer",
            }}>
              <Plus size={13} /> Nuevo
            </button>
          </div>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.2fr 90px 100px 80px 36px", gap: 8, padding: "8px 20px", borderBottom: "1px solid var(--glass-border)" }}>
            {["Incidente / Ubicación","Asignado / Sector","Prioridad","Estado","Tiempo",""].map((h) => (
              <span key={h} style={{ fontSize: 9, fontWeight: 700, color: "var(--text-02)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>

          <div style={{ maxHeight: 440, overflowY: "auto" }}>
            {filtered.map((inc) => {
              const p = P[inc.priority];
              const s = S[inc.status];
              const isSel = selected === inc.id;
              return (
                <button
                  key={inc.id}
                  onClick={() => setSelected(isSel ? null : inc.id)}
                  style={{
                    width: "100%", display: "grid",
                    gridTemplateColumns: "1.6fr 1.2fr 90px 100px 80px 36px",
                    gap: 8, padding: "13px 20px", textAlign: "left",
                    background: isSel ? "var(--electric-dim)" : "transparent",
                    borderBottom: "1px solid var(--glass-border)",
                    borderLeft: isSel ? "2px solid var(--electric)" : "2px solid transparent",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-00)", marginBottom: 2 }}>{inc.type}</div>
                    <div style={{ fontSize: 10, color: "var(--text-02)", display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin size={9} /> {inc.location}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-01)" }}>{inc.assigned}</div>
                    <div style={{ fontSize: 10, color: "var(--text-02)" }}>{inc.sector} · {inc.lang}</div>
                  </div>
                  <div><span style={{ display: "inline-block", padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: p.bg, color: p.color }}>{p.label}</span></div>
                  <div><span style={{ display: "inline-block", padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: s.bg, color: s.color }}>{s.label}</span></div>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-02)" }}>hace {inc.time}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ChevronRight size={13} style={{ color: isSel ? "var(--electric-bright)" : "var(--text-02)" }} />
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Detail */}
        {detail && (
          <Card style={{ padding: 24, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 8 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-02)", marginBottom: 4 }}>{detail.id}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-00)" }}>{detail.type}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "var(--s2)", border: "1px solid var(--glass-border)", borderRadius: 7, width: 28, height: 28, cursor: "pointer", color: "var(--text-02)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                <X size={13} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: MapPin, label: "Ubicación", value: detail.location },
                { icon: User,   label: "Asignado",  value: detail.assigned  },
                { icon: Phone,  label: "Llamante",  value: detail.caller    },
                { icon: Clock,  label: "Hace",      value: detail.time + " min" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--electric-dim)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={12} style={{ color: "var(--electric-bright)" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-02)", textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-00)" }}>{value}</div>
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 600, background: "var(--electric-dim)", color: "var(--electric-bright)", border: "1px solid rgba(59,130,246,0.20)" }}>{detail.lang}</span>
                <span style={{ padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 600, background: P[detail.priority].bg, color: P[detail.priority].color }}>{P[detail.priority].label}</span>
                <span style={{ padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 600, background: S[detail.status].bg, color: S[detail.status].color }}>{S[detail.status].label}</span>
              </div>

              <div style={{ background: "var(--s1)", border: "1px solid var(--glass-border)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "var(--text-02)", textTransform: "uppercase", marginBottom: 8 }}>Resumen</div>
                <p style={{ fontSize: 12, color: "var(--text-01)", lineHeight: 1.6 }}>{detail.summary}</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                <button className="btn-primary" style={{ padding: "10px 16px", borderRadius: 10, fontSize: 12 }}>
                  Abrir intérprete IA
                </button>
                <button className="btn-glass" style={{ padding: "10px 16px", borderRadius: 10, fontSize: 12 }}>
                  Ver en mapa
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
