"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, Volume2, VolumeX, RefreshCw, Radio, Maximize2, Activity, Wifi } from "lucide-react";

const CAMERAS = [
  { id: "CAM-001", label: "Autopista 40 — km 237",      zone: "Norte",  status: "live",    alert: true  },
  { id: "CAM-047", label: "Centro Histórico MTY",        zone: "Centro", status: "live",    alert: false },
  { id: "CAM-112", label: "Estadio BBVA — Acceso A",    zone: "Sur",    status: "live",    alert: false },
  { id: "CAM-189", label: "Aeropuerto MTY — T1",         zone: "Norte",  status: "live",    alert: false },
  { id: "CAM-204", label: "Col. Mitras — Av. Principal", zone: "Centro", status: "offline", alert: false },
  { id: "CAM-318", label: "P. Industrial Apodaca",       zone: "Este",   status: "live",    alert: true  },
];

const INIT_EVENTS = [
  { time: "10:42:18", type: "alert",   msg: "Movimiento sospechoso detectado — CAM-001 Autopista 40",      zone: "Norte"   },
  { time: "10:41:55", type: "info",    msg: "Unidad U-047 en camino a incidente INC-2026-08441",            zone: "Norte"   },
  { time: "10:41:33", type: "warning", msg: "CAM-204 sin señal — Posible vandalismo en zona",               zone: "Centro"  },
  { time: "10:40:58", type: "success", msg: "Intérprete IA — Llamada INC-08441 (Francés→Español)",         zone: "Sistema" },
  { time: "10:40:21", type: "info",    msg: "Estadio BBVA — 47,340 asistentes (capacidad 89%)",             zone: "Sur"     },
  { time: "10:39:47", type: "alert",   msg: "Temperatura elevada — Sensor T-318 Zona Industrial",           zone: "Este"    },
  { time: "10:38:12", type: "success", msg: "Incidente INC-2026-08430 cerrado — Sin lesionados",            zone: "Centro"  },
  { time: "10:37:04", type: "info",    msg: "Cambio de turno completado — 38 agentes en línea",             zone: "Sistema" },
];

const FAKE_EVS = [
  { type: "info",    msg: "Patrulla U-112 sin novedad en sector Centro",       zone: "Centro"  },
  { type: "alert",   msg: "Velocidad excesiva — Av. Constitución km 12",       zone: "Centro"  },
  { type: "success", msg: "Llamada 911 atendida — Tiempo respuesta: 28s",      zone: "Sistema" },
  { type: "warning", msg: "Lluvia moderada — Visibilidad reducida zona Norte", zone: "Norte"   },
  { type: "info",    msg: "Drone D-03 desplegado — Cobertura zona industrial", zone: "Este"    },
];

const evStyle: Record<string, { color: string; bg: string; label: string }> = {
  alert:   { color: "var(--critical)", bg: "var(--critical-dim)", label: "ALERTA" },
  warning: { color: "var(--warning)",  bg: "var(--warning-dim)",  label: "AVISO"  },
  info:    { color: "var(--electric)", bg: "var(--electric-dim)", label: "INFO"   },
  success: { color: "var(--success)",  bg: "var(--success-dim)",  label: "OK"     },
};

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="glass-card" style={style}>{children}</div>;
}

export default function MonitoringCenter() {
  const [selected, setSelected] = useState("CAM-001");
  const [muted, setMuted]       = useState(false);
  const [events, setEvents]     = useState(INIT_EVENTS);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const ev = FAKE_EVS[Math.floor(Math.random() * FAKE_EVS.length)];
      const t  = new Date().toLocaleTimeString("es-MX", { hour12: false });
      setEvents((prev) => [{ time: t, ...ev }, ...prev.slice(0, 24)]);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const selectedCam = CAMERAS.find((c) => c.id === selected)!;

  const btnStyle: React.CSSProperties = {
    background: "var(--s2)", border: "1px solid var(--glass-border)",
    borderRadius: 7, padding: "6px 8px", cursor: "pointer", color: "var(--text-02)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "Cámaras activas",   value: "1,204", color: "var(--success)",         Icon: Camera   },
          { label: "Alertas en curso",  value: "3",     color: "var(--critical)",        Icon: Radio    },
          { label: "Operadores online", value: "38",    color: "var(--electric-bright)", Icon: Activity },
          { label: "Latencia promedio", value: "142ms", color: "var(--neon)",             Icon: Wifi     },
        ].map(({ label, value, color, Icon }) => (
          <Card key={label} style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}18`, border: `1px solid ${color}30` }}>
              <Icon size={17} style={{ color }} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 10, color: "var(--text-02)", marginTop: 3 }}>{label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* CCTV + Log */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>

        <Card style={{ padding: 20 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Camera size={15} style={{ color: "var(--electric-bright)" }} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-00)" }}>
                Centro de Monitoreo CCTV
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "var(--critical-dim)", border: "1px solid rgba(244,63,94,0.22)", borderRadius: 6, padding: "3px 8px" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--critical)", animation: "ping 2s infinite" }} />
                <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--critical)", fontWeight: 700, letterSpacing: "0.08em" }}>EN VIVO</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <button onClick={() => setMuted(!muted)} style={btnStyle}>
                {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              </button>
              <button style={btnStyle}><RefreshCw size={13} /></button>
            </div>
          </div>

          {/* Camera grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {CAMERAS.map((cam) => {
              const isSel = cam.id === selected;
              return (
                <button
                  key={cam.id}
                  onClick={() => setSelected(cam.id)}
                  style={{
                    position: "relative", borderRadius: 10, overflow: "hidden",
                    aspectRatio: "16/9", cursor: "pointer",
                    background: cam.status === "offline"
                      ? "repeating-linear-gradient(45deg,var(--s2) 0px,var(--s2) 6px,var(--s3) 6px,var(--s3) 12px)"
                      : `linear-gradient(${145 + CAMERAS.indexOf(cam) * 25}deg,var(--map-bg),rgba(20,40,90,0.8))`,
                    border: isSel
                      ? "1px solid rgba(59,130,246,0.55)"
                      : cam.alert ? "1px solid rgba(244,63,94,0.35)" : "1px solid var(--glass-border)",
                    boxShadow: isSel ? "0 0 16px rgba(59,130,246,0.20)" : cam.alert ? "0 0 12px rgba(244,63,94,0.10)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {/* Scan grid */}
                  {cam.status === "live" && (
                    <div style={{
                      position: "absolute", inset: 0,
                      backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(59,130,246,0.05) 18px,rgba(59,130,246,0.05) 19px),repeating-linear-gradient(90deg,transparent,transparent 18px,rgba(59,130,246,0.05) 18px,rgba(59,130,246,0.05) 19px)",
                    }} />
                  )}

                  {cam.status === "offline" && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-02)", letterSpacing: "0.12em" }}>SIN SEÑAL</span>
                    </div>
                  )}

                  {cam.status === "live" && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Camera size={16} style={{ color: "rgba(255,255,255,0.08)" }} />
                    </div>
                  )}

                  {/* HUD corners */}
                  {cam.status === "live" && (() => {
                    const c = "rgba(59,130,246,0.55)";
                    return (<>
                      <div style={{ position: "absolute", top: 5, left: 5, width: 8, height: 8, borderTop: `1px solid ${c}`, borderLeft: `1px solid ${c}` }} />
                      <div style={{ position: "absolute", top: 5, right: 5, width: 8, height: 8, borderTop: `1px solid ${c}`, borderRight: `1px solid ${c}` }} />
                      <div style={{ position: "absolute", bottom: 5, left: 5, width: 8, height: 8, borderBottom: `1px solid ${c}`, borderLeft: `1px solid ${c}` }} />
                      <div style={{ position: "absolute", bottom: 5, right: 5, width: 8, height: 8, borderBottom: `1px solid ${c}`, borderRight: `1px solid ${c}` }} />
                    </>);
                  })()}

                  {cam.alert && (
                    <div style={{ position: "absolute", top: 6, right: 6, background: "var(--critical)", color: "#fff", fontSize: 7, fontWeight: 700, letterSpacing: "0.08em", padding: "2px 5px", borderRadius: 4 }}>
                      ALERTA
                    </div>
                  )}

                  {cam.status === "live" && (
                    <div style={{ position: "absolute", top: 6, left: 6, display: "flex", alignItems: "center", gap: 3 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--critical)", animation: "ping 2s infinite" }} />
                      <span style={{ fontSize: 7, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.55)" }}>LIVE</span>
                    </div>
                  )}

                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "10px 8px 5px",
                    background: "linear-gradient(to top, rgba(0,0,0,0.80), transparent)",
                  }}>
                    <div style={{ fontSize: 8, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.65)" }}>
                      {cam.id} · {cam.zone}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected info */}
          <div style={{
            marginTop: 14, padding: "12px 16px", borderRadius: 10,
            background: "var(--electric-dim)", border: "1px solid rgba(59,130,246,0.18)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <Maximize2 size={13} style={{ color: "var(--electric-bright)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-00)" }}>{selectedCam?.label}</div>
              <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-02)", marginTop: 2 }}>
                {selectedCam?.id} · 1080p · 30fps · H.264 · AES-256
              </div>
            </div>
            <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: selectedCam?.status === "live" ? "var(--success)" : "var(--critical)" }}>
              {selectedCam?.status === "live" ? "● ACTIVA" : "○ OFFLINE"}
            </div>
          </div>
        </Card>

        {/* Live event log */}
        <Card style={{ display: "flex", flexDirection: "column" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 18px", borderBottom: "1px solid var(--glass-border)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Radio size={13} style={{ color: "var(--critical)" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-00)", fontFamily: "var(--font-display)" }}>Log de eventos</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--critical)", animation: "ping 2s infinite" }} />
              <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--critical)" }}>LIVE</span>
            </div>
          </div>

          <div ref={logRef} style={{ flex: 1, overflowY: "auto", padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            {events.map((ev, i) => {
              const s = evStyle[ev.type] || evStyle.info;
              return (
                <div key={i} style={{
                  padding: "10px 12px", borderRadius: 8,
                  background: i === 0 ? `${s.color}0A` : "var(--s1)",
                  border: `1px solid ${i === 0 ? s.color + "28" : "var(--glass-border)"}`,
                  transition: "all 0.3s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-02)" }}>{ev.time}</span>
                    <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: s.bg, color: s.color, letterSpacing: "0.06em" }}>
                      {s.label}
                    </span>
                    <span style={{ fontSize: 9, color: "var(--text-02)", marginLeft: "auto" }}>{ev.zone}</span>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text-01)", lineHeight: 1.45 }}>{ev.msg}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
